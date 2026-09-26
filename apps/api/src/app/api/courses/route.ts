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

// GET /api/courses - Public (returns only active courses)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const courses = await prisma.course.findMany({
      where: includeInactive ? undefined : { isActive: true },
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
      orderBy: { createdAt: 'desc' },
    });

    // Преобразуем в простой формат для админки
    const simplifiedCourses = courses.map(course => {
      const ruTranslation = course.translations.find(t => t.languageCode === 'RU') || course.translations[0];
      return {
        id: course.id,
        title: ruTranslation?.title || '',
        description: ruTranslation?.description || '',
        duration: course.duration,
        price: course.price,
        level: (ruTranslation as any)?.level || 'BEGINNER',
        image: null,
        createdAt: course.createdAt.toISOString(),
      };
    });

    return successResponse(simplifiedCourses);
  } catch (error) {
    console.error('Get courses error:', error);
    return serverErrorResponse();
  }
}

// POST /api/courses - Protected (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    
    // Простой формат для админки
    const { title, description, duration, price, level, image } = body;

    if (!title || !description) {
      return errorResponse('Title and description are required', 400);
    }

    // Создаём slug из title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Проверка на дубликат slug
    const existingCourse = await prisma.course.findUnique({
      where: { slug },
    });

    if (existingCourse) {
      return errorResponse('Course with similar title already exists', 409);
    }

    // Преобразуем level из формы в enum
    let courseLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' = 'BEGINNER';
    if (level === 'INTERMEDIATE' || level === 'Средний') {
      courseLevel = 'INTERMEDIATE';
    } else if (level === 'ADVANCED' || level === 'Продвинутый') {
      courseLevel = 'ADVANCED';
    }

    // Создаём курс с переводом
    const course = await prisma.course.create({
      data: {
        slug,
        price: price || 0,
        duration: duration || '0 weeks',
        format: 'HYBRID',
        isActive: true,
        translations: {
          create: {
            languageCode: 'RU',
            title,
            description,
            level: courseLevel,
          },
        },
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
