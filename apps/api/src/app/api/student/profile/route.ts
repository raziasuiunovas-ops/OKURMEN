import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAuth } from '@/lib/auth/utils';
import {
  errorResponse,
  successResponse,
  serverErrorResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/student/profile - Protected
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: session.user!.id },
      include: {
        studentProfile: {
          include: {
            group: true,
            _count: {
              select: {
                enrollments: true,
                lessonProgress: { where: { isCompleted: true } },
                tokenTransactions: true,
                courseReviews: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.studentProfile) {
      return errorResponse('Student profile not found', 403);
    }

    // Получаем статистику токенов
    const tokenStats = await prisma.tokenTransaction.aggregate({
      where: { studentId: user.studentProfile.id },
      _sum: { amount: true },
    });

    // Streak
    const streak = await calculateStreak(user.studentProfile.id);

    return successResponse({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      preferredLanguage: user.preferredLanguage,
      createdAt: user.createdAt,
      studentProfile: {
        id: user.studentProfile.id,
        status: user.studentProfile.status,
        group: user.studentProfile.group ? {
          id: user.studentProfile.group.id,
          name: user.studentProfile.group.name,
        } : null,
        stats: {
          activeCourses: user.studentProfile._count.enrollments,
          completedLessons: user.studentProfile._count.lessonProgress,
          totalTokens: tokenStats._sum.amount || 0,
          reviews: user.studentProfile._count.courseReviews,
          streak,
        },
      },
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }
    return serverErrorResponse();
  }
}

// PATCH /api/student/profile - Protected
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const body = await request.json();
    const { fullName, phone, preferredLanguage } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.user!.id },
      data: {
        ...(fullName && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(preferredLanguage && { preferredLanguage }),
      },
    });

    return successResponse({
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      preferredLanguage: updatedUser.preferredLanguage,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }
    return serverErrorResponse();
  }
}

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

  const today = currentDate.getTime();
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);

  if (!activityDates.has(today) && !activityDates.has(yesterday.getTime())) {
    return 0;
  }

  let checkDate = activityDates.has(today) ? currentDate : yesterday;
  
  while (activityDates.has(checkDate.getTime())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}
