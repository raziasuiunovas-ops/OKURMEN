import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAuth } from '@/lib/auth/utils';
import {
  successResponse,
  serverErrorResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/student/dashboard - Protected (student only)
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    
    // Получаем профиль студента
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!studentProfile) {
      return forbiddenResponse('Student profile not found');
    }

    // Получаем активные enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: studentProfile.id,
        status: { in: ['ACTIVE', 'COMPLETED'] },
      },
      include: {
        course: {
          include: {
            translations: {
              where: { languageCode: 'RU' },
            },
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    // Рассчитываем прогресс по каждому курсу
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const totalLessons = await prisma.lesson.count({
          where: {
            courseId: enrollment.courseId,
            isPublished: true,
          },
        });

        const completedLessons = await prisma.lessonProgress.count({
          where: {
            studentId: studentProfile.id,
            courseId: enrollment.courseId,
            isCompleted: true,
          },
        });

        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
          id: enrollment.course.id,
          title: enrollment.course.translations[0]?.title || 'Untitled',
          description: enrollment.course.translations[0]?.description || '',
          coverGradient: enrollment.course.coverGradient,
          progress,
          totalLessons,
          completedLessons,
          startedAt: enrollment.startedAt,
        };
      })
    );

    // Получаем общую статистику по токенам
    const tokenStats = await prisma.tokenTransaction.aggregate({
      where: { studentId: studentProfile.id },
      _sum: { amount: true },
    });

    const totalTokens = tokenStats._sum.amount || 0;

    // Токены за сегодня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tokensToday = await prisma.tokenTransaction.aggregate({
      where: {
        studentId: studentProfile.id,
        createdAt: { gte: today },
      },
      _sum: { amount: true },
    });

    // Streak - дни подряд с активностью
    const streak = await calculateStreak(studentProfile.id);

    // Место в рейтинге
    const leaderboardPosition = await calculateLeaderboardPosition(studentProfile.id, totalTokens);

    // Ближайшее бронирование
    const upcomingBooking = await prisma.booking.findFirst({
      where: {
        studentId: studentProfile.id,
        date: { gte: new Date() },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    return successResponse({
      student: {
        id: studentProfile.id,
        fullName: studentProfile.user.fullName,
        email: studentProfile.user.email,
      },
      courses: coursesWithProgress,
      stats: {
        totalTokens,
        tokensToday: tokensToday._sum.amount || 0,
        streak,
        leaderboardPosition,
        activeCourses: enrollments.filter(e => e.status === 'ACTIVE').length,
        completedCourses: enrollments.filter(e => e.status === 'COMPLETED').length,
      },
      upcomingBooking: upcomingBooking ? {
        id: upcomingBooking.id,
        date: upcomingBooking.date,
        mentorName: upcomingBooking.mentor.user.fullName,
        duration: upcomingBooking.duration,
      } : null,
    });
  } catch (error: any) {
    console.error('Student dashboard error:', error);

    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }

    return serverErrorResponse();
  }
}

// Helper: Рассчитать streak
async function calculateStreak(studentId: string): Promise<number> {
  const activities = await prisma.lessonProgress.findMany({
    where: {
      studentId,
      isCompleted: true,
    },
    orderBy: { completedAt: 'desc' },
    select: { completedAt: true },
  });

  if (activities.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const activityDates = new Set(
    activities
      .filter(a => a.completedAt)
      .map(a => {
        const date = new Date(a.completedAt!);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
  );

  // Проверяем была ли активность сегодня или вчера
  const today = currentDate.getTime();
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);

  if (!activityDates.has(today) && !activityDates.has(yesterday.getTime())) {
    return 0;
  }

  // Считаем streak
  let checkDate = activityDates.has(today) ? currentDate : yesterday;
  
  while (activityDates.has(checkDate.getTime())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

// Helper: Рассчитать позицию в рейтинге
async function calculateLeaderboardPosition(studentId: string, userTokens: number): Promise<number> {
  const higherScores = await prisma.tokenTransaction.groupBy({
    by: ['studentId'],
    _sum: { amount: true },
    having: {
      amount: {
        _sum: {
          gt: userTokens,
        },
      },
    },
  });

  return higherScores.length + 1;
}
