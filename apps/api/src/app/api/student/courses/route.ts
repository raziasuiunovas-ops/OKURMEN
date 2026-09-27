import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAuth } from '@/lib/auth/utils';
import {
  successResponse,
  serverErrorResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/student/courses - Protected (student only)
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'RU';

    // Получаем профиль студента
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return forbiddenResponse('Student profile not found');
    }

    // Получаем курсы студента через Enrollment
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: studentProfile.id,
        status: { in: ['ACTIVE', 'COMPLETED', 'PAUSED'] },
      },
      include: {
        course: {
          include: {
            translations: {
              where: { languageCode: language as any },
            },
            _count: {
              select: {
                lessons: { where: { isPublished: true } },
                courseReviews: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Рассчитываем прогресс и дополнительную статистику
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = enrollment.course;

        // Подсчет завершенных уроков
        const completedLessons = await prisma.lessonProgress.count({
          where: {
            studentId: studentProfile.id,
            courseId: course.id,
            isCompleted: true,
          },
        });

        const totalLessons = course._count.lessons;
        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        // Рейтинг курса
        const reviews = await prisma.courseReview.findMany({
          where: { courseId: course.id },
          select: { rating: true },
        });

        const averageRating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

        // Общая длительность из уроков
        const lessons = await prisma.lesson.findMany({
          where: {
            courseId: course.id,
            isPublished: true,
          },
          select: { duration: true },
        });

        const totalDuration = lessons.reduce((sum, l) => sum + (l.duration || 0), 0);

        return {
          id: course.id,
          slug: course.slug,
          title: course.translations[0]?.title || 'Untitled',
          description: course.translations[0]?.description || '',
          level: course.translations[0]?.level || 'BEGINNER',
          coverImage: course.coverImage,
          coverGradient: course.coverGradient ? JSON.parse(course.coverGradient) : null,
          format: course.format,
          price: Number(course.price),
          rating: Math.round(averageRating * 10) / 10,
          totalReviews: reviews.length,
          progress,
          completedLessons,
          totalLessons,
          totalDuration,
          enrollmentStatus: enrollment.status,
          startedAt: enrollment.startedAt,
          completedAt: enrollment.completedAt,
        };
      })
    );

    return successResponse(coursesWithProgress);
  } catch (error: any) {
    console.error('Student courses error:', error);

    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }

    return serverErrorResponse();
  }
}
