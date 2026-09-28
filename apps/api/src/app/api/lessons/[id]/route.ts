import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse, forbiddenResponse, serverErrorResponse } from '@/lib/api-response';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import { z } from 'zod';

const updateLessonSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.number().positive().optional(),
  sortOrder: z.number().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            translations: {
              where: { languageCode: 'RU' },
              select: { title: true },
            },
          },
        },
      },
    });

    if (!lesson) {
      return notFoundResponse('Lesson');
    }

    return successResponse(lesson);
  } catch (error) {
    console.error('Get lesson error:', error);
    return serverErrorResponse();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const body = await request.json();
    const validation = updateLessonSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return notFoundResponse('Lesson');
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: validation.data,
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            translations: {
              where: { languageCode: 'RU' },
              select: { title: true },
            },
          },
        },
      },
    });

    return successResponse(lesson);
  } catch (error: any) {
    console.error('Update lesson error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return notFoundResponse('Lesson');
    }

    await prisma.lesson.delete({
      where: { id },
    });

    return successResponse({ message: 'Lesson deleted successfully' });
  } catch (error: any) {
    console.error('Delete lesson error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}
