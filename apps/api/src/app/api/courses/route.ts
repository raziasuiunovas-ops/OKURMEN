import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import { createCourseSchema } from '@/lib/validators';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
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

// GET /api/courses - Public (returns only active courses unless admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const language = searchParams.get('language') || 'RU';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const courses = await prisma.course.findMany({
      where: includeInactive ? undefined : { isActive: true },
      include: {
        translations: true, // Получаем ВСЕ переводы для fallback логики
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
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Рассчитываем реальную статистику для каждого курса
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const stats = await calculateCourseStats(course.id);
        
        // Parse coverGradient если это JSON string
        let parsedGradient = null;
        if (course.coverGradient) {
          try {
            parsedGradient = typeof course.coverGradient === 'string' 
              ? JSON.parse(course.coverGradient) 
              : course.coverGradient;
          } catch (e) {
            console.error('Failed to parse coverGradient for course:', course.id, e);
          }
        }
        
        // Находим перевод для запрошенного языка или fallback
        let translation = course.translations.find(t => t.languageCode === language);
        
        // Если перевода нет, ищем fallback (RU -> EN -> KY)
        if (!translation && course.translations.length > 0) {
          const fallbackOrder = language === 'RU' ? ['EN', 'KY'] : language === 'EN' ? ['RU', 'KY'] : ['RU', 'EN'];
          for (const fallbackLang of fallbackOrder) {
            translation = course.translations.find(t => t.languageCode === fallbackLang);
            if (translation) break;
          }
          // Если все еще нет, берем первый доступный
          if (!translation && course.translations.length > 0) {
            translation = course.translations[0];
          }
        }
        
        // Создаём fallback translation если translations пустой
        const finalTranslation = translation || {
          languageCode: language as 'RU' | 'EN' | 'KY',
          title: course.slug,
          description: null,
          program: null,
          level: 'BEGINNER' as const,
        };
        
        return {
          ...course,
          // Переопределяем значения из БД реальными расчетными
          rating: stats.rating,
          totalReviews: stats.totalReviews,
          enrolledStudents: stats.enrolledStudents,
          totalHours: stats.totalHours,
          coverGradient: parsedGradient,
          // Для frontend удобнее один объект translation
          translation: finalTranslation,
          _count: {
            ...course._count,
            lessons: stats.lessonsCount,
          },
        };
      })
    );

    return successResponse(coursesWithStats);
  } catch (error) {
  console.error('COURSES_API_ERROR:', error);
  console.error(
    'COURSES_API_STACK:',
    error instanceof Error ? error.stack : String(error)
  );
  return serverErrorResponse();
}
// POST /api/courses - Protected (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const validation = createCourseSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const {
      slug,
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

    // Проверка на дубликат slug
    const existingCourse = await prisma.course.findUnique({
      where: { slug },
    });

    if (existingCourse) {
      return errorResponse('Course with this slug already exists', 409);
    }

    // Создаём курс
    const course = await prisma.course.create({
      data: {
        slug,
        price,
        duration,
        format,
        coverImage,
        coverGradient,
        icon,
        isActive,
        translations: {
          create: translations,
        },
        ...(teacherIds && teacherIds.length > 0 && {
          teachers: {
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
      },
    });

    return successResponse(course, 201);
  } catch (error: any) {
    console.error('Create course error:', error);

    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }

    return serverErrorResponse();
  }
}
