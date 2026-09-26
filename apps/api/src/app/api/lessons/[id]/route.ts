import { NextRequest, NextResponse } from 'next/server';
import { apiResponse } from '@/lib/api-response';
import { prisma } from '@okurmen/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!lesson) {
      return apiResponse.error('Урок не найден', 404);
    }

    return apiResponse.success(lesson);
  } catch (error) {
    console.error('Get lesson error:', error);
    return apiResponse.error('Не удалось загрузить урок', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, duration, videoUrl, content, order, courseId } = body;

    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(duration && { duration }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(content !== undefined && { content }),
        ...(order && { order }),
        ...(courseId && { courseId }),
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return apiResponse.success(lesson);
  } catch (error) {
    console.error('Update lesson error:', error);
    return apiResponse.error('Не удалось обновить урок', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.lesson.delete({
      where: { id: params.id },
    });

    return apiResponse.success({ message: 'Урок удалён' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    return apiResponse.error('Не удалось удалить урок', 500);
  }
}
