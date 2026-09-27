import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import {
  successResponse,
  forbiddenResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// Helper: Рассчитать реальную статистику курса
async function calculateCourseStats(courseId: string) {
  // 1. Рейтинг и количество отзывов из CourseReview
  const reviews = await prisma.courseReview.findMany({
    where: { courseId },
    select: { rating: true },
  });

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  // 2. Количество студентов из Enrollment (только активные и завершенные)
  const enrollmentsCount = await prisma.enrollment.count({
    where: {
      courseId,
      status: { in: ['ACTIVE', 'COMPLETED'] },
    },
  });

  // 3. Общая длительность из опубликованных уроков
  const lessons = await prisma.lesson.findMany({
    where: {
      courseId,
      isPublished: true,
    },
    select: { duration: true },
  });

  const totalDurationMinutes = lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
  const totalHours = Math.round(totalDurationMinutes / 60);

  return {
    rating: Math.round(averageRating * 10) / 10, // Округляем до 1 знака
    totalReviews: reviews.length,
    enrolledStudents: enrollmentsCount,
    totalHours,
  };
}

// POST /api/courses/recalculate - Protected (admin only)
// Пересчитывает и обновляет статистику всех курсов в БД
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    // Получаем все курсы
    const courses = await prisma.course.findMany({
      select: { id: true, slug: true },
    });

    const results = [];

    // Пересчитываем статистику для каждого курса
    for (const course of courses) {
      const stats = await calculateCourseStats(course.id);

      // Обновляем курс в БД
      await prisma.course.update({
        where: { id: course.id },
        data: {
          rating: stats.rating,
          totalReviews: stats.totalReviews,
          enrolledStudents: stats.enrolledStudents,
          totalHours: stats.totalHours,
        },
      });

      results.push({
        courseId: course.id,
        slug: course.slug,
        stats,
      });
    }

    return successResponse({
      message: `Successfully recalculated statistics for ${courses.length} courses`,
      courses: results,
    });
  } catch (error: any) {
    console.error('Recalculate courses error:', error);

    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }

    return serverErrorResponse();
  }
}
