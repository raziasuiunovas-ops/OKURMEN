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

    return successResponse(courses);
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
    const validation = createCourseSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const { slug, price, duration, format, isActive, translations, teacherIds } = validation.data;

    // Check if slug already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug },
    });

    if (existingCourse) {
      return errorResponse('Course with this slug already exists', 409);
    }

    // Create course with translations
    const course = await prisma.course.create({
      data: {
        slug,
        price,
        duration,
        format,
        isActive,
        translations: {
          create: translations,
        },
        ...(teacherIds && teacherIds.length > 0
          ? {
              teachers: {
                create: teacherIds.map((employeeId) => ({
                  employeeId,
                })),
              },
            }
          : {}),
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
