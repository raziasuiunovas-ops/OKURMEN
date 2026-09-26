import { NextRequest, NextResponse } from 'next/server';
import { apiResponse } from '@/lib/api-response';
import { prisma } from '@okurmen/database';

export async function GET(request: NextRequest) {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [
        { courseId: 'asc' },
        { order: 'asc' },
      ],
    });

    return apiResponse.success(lessons);
  } catch (error) {
    console.error('Get lessons error:', error);
    return apiResponse.error('Не удалось загрузить уроки', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, duration, videoUrl, content, order, courseId } = body;

    if (!title || !description || !duration || !courseId) {
      return apiResponse.error('Обязательные поля: title, description, duration, courseId', 400);
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        duration,
        videoUrl: videoUrl || null,
        content: content || '',
        order: order || 1,
        courseId,
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
    console.error('Create lesson error:', error);
    return apiResponse.error('Не удалось создать урок', 500);
  }
}
