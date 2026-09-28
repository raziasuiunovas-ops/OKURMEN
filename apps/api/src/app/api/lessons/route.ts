import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse, validationErrorResponse, forbiddenResponse, serverErrorResponse } from '@/lib/api-response';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import { z } from 'zod';

const createLessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.number().positive().optional(),
  sortOrder: z.number().default(0),
  isPublished: z.boolean().default(false),
  courseId: z.string().min(1),
});

const updateLessonSchema = createLessonSchema.partial().omit({ courseId: true });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    const lessons = await prisma.lesson.findMany({
      where: {
        ...(courseId && { courseId }),
        ...(includeUnpublished ? {} : { isPublished: true }),
      },
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
      orderBy: [
        { courseId: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    return successResponse(lessons);
  } catch (error) {
    console.error('Get lessons error:', error);
    return serverErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const validation = createLessonSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const { title, description, duration, videoUrl, content, sortOrder, courseId, isPublished } = validation.data;

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return errorResponse('Course not found', 404);
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content,
        duration,
        videoUrl,
        sortOrder: sortOrder ?? 0,
        isPublished: isPublished ?? false,
        courseId,
      },
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

    return successResponse(lesson, 201);
  } catch (error: any) {
    console.error('Create lesson error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}
