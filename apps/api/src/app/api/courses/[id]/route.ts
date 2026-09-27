import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import { updateCourseSchema } from '@/lib/validators';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
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
    lessonsCount: lessons.length,
  };
}

// GET /api/courses/[id] - Public
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        translations: true,
        teachers: {
          include: {
            employee: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            courseReviews: true,
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return notFoundResponse('Course');
    }

    // Рассчитываем реальную статистику
    const stats = await calculateCourseStats(course.id);

    // Возвращаем курс с вычисленными значениями
    const courseWithStats = {
      ...course,
      rating: stats.rating,
      totalReviews: stats.totalReviews,
      enrolledStudents: stats.enrolledStudents,
      totalHours: stats.totalHours,
      _count: {
        ...course._count,
        lessons: stats.lessonsCount,
      },
    };

    return successResponse(courseWithStats);
  } catch (error) {
    console.error('Get course error:', error);
    return serverErrorResponse();
  }
}

// PUT /api/courses/[id] - Protected (admin only) - Простой формат для админки
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();
    
    const { title, description, duration, price, level } = body;

    // Проверка что курс существует
    const existingCourse = await prisma.course.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!existingCourse) {
      return notFoundResponse('Course');
    }

    // Преобразуем level
    let courseLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' = 'BEGINNER';
    if (level === 'INTERMEDIATE' || level === 'Средний') {
      courseLevel = 'INTERMEDIATE';
    } else if (level === 'ADVANCED' || level === 'Продвинутый') {
      courseLevel = 'ADVANCED';
    }

    // Обновляем курс
    const course = await prisma.course.update({
      where: { id },
      data: {
        price: price !== undefined ? price : existingCourse.price,
        duration: duration || existingCourse.duration,
        translations: {
          deleteMany: { languageCode: 'RU' },
          create: {
            languageCode: 'RU',
            title: title || existingCourse.translations.find(t => t.languageCode === 'RU')?.title || '',
            description: description || existingCourse.translations.find(t => t.languageCode === 'RU')?.description || '',
            level: courseLevel,
          },
        },
      },
      include: {
        translations: true,
      },
    });

    return successResponse(course);
  } catch (error: any) {
    console.error('Update course error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}

// PATCH /api/courses/[id] - Protected (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const body = await request.json();
    const validation = updateCourseSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const {
      price,
      duration,
      format,
      coverImage,
      coverGradient,
      icon,
      isActive,
      translations,
      teacherIds,
    } = validation.data;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return notFoundResponse('Course');
    }

    // Update course
    const course = await prisma.course.update({
      where: { id },
      data: {
        ...(price !== undefined && { price }),
        ...(duration !== undefined && { duration }),
        ...(format !== undefined && { format }),
        ...(coverImage !== undefined && { coverImage }),
        ...(coverGradient !== undefined && { coverGradient }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive }),
        ...(translations && {
          translations: {
            deleteMany: {},
            create: translations,
          },
        }),
        ...(teacherIds && {
          teachers: {
            deleteMany: {},
            create: teacherIds.map((employeeId) => ({
              employeeId,
            })),
          },
        }),
      },
      include: {
        translations: true,
        teachers: {
          include: {
            employee: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            courseReviews: true,
          },
        },
      },
    });

    return successResponse(course);
  } catch (error: any) {
    console.error('Update course error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}

// DELETE /api/courses/[id] - Protected (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return notFoundResponse('Course');
    }

    // Delete course (cascade will handle translations and teachers)
    await prisma.course.delete({
      where: { id },
    });

    return successResponse({ message: 'Course deleted successfully' });
  } catch (error: any) {
    console.error('Delete course error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}
