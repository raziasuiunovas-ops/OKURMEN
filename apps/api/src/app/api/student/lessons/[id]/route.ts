import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAuth } from '@/lib/auth/utils';
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/student/lessons/[id] - Protected
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request);
    const { id } = await params;

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return forbiddenResponse('Student profile not found');
    }

    // Получаем урок
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            translations: {
              where: { languageCode: 'RU' },
            },
          },
        },
      },
    });

    if (!lesson) {
      return notFoundResponse('Lesson');
    }

    // Проверяем доступ к курсу
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: studentProfile.id,
        courseId: lesson.courseId,
        status: { in: ['ACTIVE', 'COMPLETED', 'PAUSED'] },
      },
    });

    if (!enrollment) {
      return forbiddenResponse('You do not have access to this lesson');
    }

    // Получаем прогресс
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        studentId_lessonId: {
          studentId: studentProfile.id,
          lessonId: id,
        },
      },
    });

    // Получаем quiz если есть
    const quiz = await prisma.quiz.findFirst({
      where: {
        lessonId: id,
        isActive: true,
      },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    // Получаем следующий урок
    const nextLesson = await prisma.lesson.findFirst({
      where: {
        courseId: lesson.courseId,
        isPublished: true,
        sortOrder: { gt: lesson.sortOrder },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return successResponse({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      sortOrder: lesson.sortOrder,
      course: {
        id: lesson.course.id,
        title: lesson.course.translations[0]?.title || 'Untitled',
      },
      progress: {
        isCompleted: progress?.isCompleted || false,
        watchedAt: progress?.watchedAt,
        completedAt: progress?.completedAt,
      },
      quiz: quiz ? {
        id: quiz.id,
        title: quiz.title,
        questionsCount: quiz._count.questions,
      } : null,
      nextLesson: nextLesson ? {
        id: nextLesson.id,
        title: nextLesson.title,
      } : null,
    });
  } catch (error: any) {
    console.error('Get lesson error:', error);
    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }
    return serverErrorResponse();
  }
}

// POST /api/student/lessons/[id]/complete - Protected
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request);
    const { id: lessonId } = await params;

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return forbiddenResponse('Student profile not found');
    }

    // Получаем урок
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return notFoundResponse('Lesson');
    }

    // Проверяем enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: studentProfile.id,
        courseId: lesson.courseId,
        status: { in: ['ACTIVE', 'COMPLETED', 'PAUSED'] },
      },
    });

    if (!enrollment) {
      return forbiddenResponse('You do not have access to this lesson');
    }

    // Создаем или обновляем прогресс (idempotent)
    const progress = await prisma.lessonProgress.upsert({
      where: {
        studentId_lessonId: {
          studentId: studentProfile.id,
          lessonId,
        },
      },
      create: {
        studentId: studentProfile.id,
        lessonId,
        courseId: lesson.courseId,
        isCompleted: true,
        watchedAt: new Date(),
        completedAt: new Date(),
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Начисляем токен только если это первое завершение
    const existingToken = await prisma.tokenTransaction.findFirst({
      where: {
        studentId: studentProfile.id,
        lessonId,
        type: 'LESSON_COMPLETED',
      },
    });

    if (!existingToken) {
      await prisma.tokenTransaction.create({
        data: {
          studentId: studentProfile.id,
          amount: 1,
          type: 'LESSON_COMPLETED',
          lessonId,
          description: `Урок завершен: ${lesson.title}`,
        },
      });
    }

    return successResponse({
      progress,
      tokenEarned: !existingToken,
    });
  } catch (error: any) {
    console.error('Complete lesson error:', error);
    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }
    return serverErrorResponse();
  }
}
