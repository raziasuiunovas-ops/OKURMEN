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

// Local type for courseReview query result
type CourseReviewRating = { rating: number };

// Helper: Рассчитать реальную статистику курса
async function calculateCourseStats(courseId: string) {
  // 1. Рейтинг и количество отзывов из CourseReview
  const reviews = await prisma.courseReview.findMany({
    where: { courseId },
    select: { rating: true },
  });

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: CourseReviewRating) => sum + r.rating, 0) / reviews.length
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
    await requireAdmin(request);

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
    console.log('\n=== PATCH /api/courses/[id] START ===');
    
    await requireAdmin(request);
    console.log('✅ Admin check passed');

    const { id } = await params;
    console.log('Course ID:', id);
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const validation = updateCourseSchema.safeParse(body);

    if (!validation.success) {
      console.error('❌ Validation failed:');
      console.error('Field errors:', JSON.stringify(validation.error.flatten().fieldErrors, null, 2));
      console.error('Issues:', JSON.stringify(validation.error.issues, null, 2));
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }
    
    console.log('✅ Validation passed');
    console.log('Validated data:', JSON.stringify(validation.data, null, 2));

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
    console.log('Checking if course exists...');
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      console.error('❌ Course not found:', id);
      return notFoundResponse('Course');
    }
    
    console.log('✅ Course found:', existingCourse.slug);

    // Prepare update data
    const updateData: any = {};
    
    if (price !== undefined) {
      console.log('Setting price:', price, 'type:', typeof price);
      updateData.price = price;
    }
    if (duration !== undefined) updateData.duration = duration;
    if (format !== undefined) updateData.format = format;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (coverGradient !== undefined) updateData.coverGradient = coverGradient;
    if (icon !== undefined) updateData.icon = icon;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    if (translations) {
      console.log('Translations to update:', JSON.stringify(translations, null, 2));
      updateData.translations = {
        deleteMany: {},
        create: translations,
      };
    }
    
    if (teacherIds) {
      updateData.teachers = {
        deleteMany: {},
        create: teacherIds.map((employeeId) => ({
          employeeId,
        })),
      };
    }
    
    console.log('Final update data:', JSON.stringify(updateData, null, 2));

    // Update course
    console.log('Updating course in database...');
    const course = await prisma.course.update({
      where: { id },
      data: updateData,
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

    console.log('✅ Course updated successfully');
    console.log('=== PATCH /api/courses/[id] END ===\n');
    
    return successResponse(course);
  } catch (error: any) {
    console.error('\n❌❌❌ PATCH ERROR ❌❌❌');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== PATCH /api/courses/[id] END WITH ERROR ===\n');
    
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    
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
