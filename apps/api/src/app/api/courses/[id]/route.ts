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
      },
    });

    if (!course) {
      return notFoundResponse('Course');
    }

    return successResponse(course);
  } catch (error) {
    console.error('Get course error:', error);
    return serverErrorResponse();
  }
}

// PATCH /api/courses/[id] - Protected (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();
    const validation = updateCourseSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const { price, duration, format, isActive, translations, teacherIds } = validation.data;

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
    await requireAdmin();

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
