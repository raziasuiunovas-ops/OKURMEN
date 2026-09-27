import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAuth } from '@/lib/auth/utils';
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  forbiddenResponse,
  errorResponse,
} from '@/lib/api-response';

// GET /api/student/quiz/[lessonId] - Protected
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await requireAuth(request);
    const { lessonId } = await params;

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

    // Проверяем доступ
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: studentProfile.id,
        courseId: lesson.courseId,
        status: { in: ['ACTIVE', 'COMPLETED', 'PAUSED'] },
      },
    });

    if (!enrollment) {
      return forbiddenResponse('You do not have access to this quiz');
    }

    // Получаем quiz
    const quiz = await prisma.quiz.findFirst({
      where: {
        lessonId,
        isActive: true,
      },
      include: {
        questions: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            question: true,
            type: true,
            options: true,
            explanation: true,
            sortOrder: true,
            // correctAnswer НЕ отправляем!
          },
        },
      },
    });

    if (!quiz) {
      return notFoundResponse('Quiz');
    }

    // Получаем предыдущие попытки
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        quizId: quiz.id,
        studentId: studentProfile.id,
      },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    return successResponse({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      passingScore: quiz.passingScore,
      questions: quiz.questions,
      attempts: attempts.map(a => ({
        id: a.id,
        score: a.score,
        isPassed: a.isPassed,
        completedAt: a.completedAt,
      })),
    });
  } catch (error: any) {
    console.error('Get quiz error:', error);
    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }
    return serverErrorResponse();
  }
}

// POST /api/student/quiz/[lessonId]/attempt - Protected
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await requireAuth(request);
    const { lessonId } = await params;
    const body = await request.json();
    const { answers } = body; // { questionId: selectedAnswer(s) }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return forbiddenResponse('Student profile not found');
    }

    // Получаем quiz
    const quiz = await prisma.quiz.findFirst({
      where: {
        lessonId,
        isActive: true,
      },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return notFoundResponse('Quiz');
    }

    // Проверяем ответы
    let correctCount = 0;

    for (const question of quiz.questions) {
      const userAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer as any;

      if (question.type === 'MULTIPLE_CHOICE') {
        const userSet = new Set(Array.isArray(userAnswer) ? userAnswer : [userAnswer]);
        const correctSet = new Set(Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer]);
        
        if (userSet.size === correctSet.size && 
            [...userSet].every(a => correctSet.has(a))) {
          correctCount++;
        }
      } else {
        if (userAnswer === correctAnswer) {
          correctCount++;
        }
      }
    }

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const isPassed = score >= quiz.passingScore;

    // Сохраняем попытку
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        studentId: studentProfile.id,
        answers,
        score,
        isPassed,
      },
    });

    // Если тест пройден - начисляем токен (только за первое прохождение)
    if (isPassed) {
      const existingToken = await prisma.tokenTransaction.findFirst({
        where: {
          studentId: studentProfile.id,
          lessonId,
          type: 'QUIZ_PASSED',
        },
      });

      if (!existingToken) {
        await prisma.tokenTransaction.create({
          data: {
            studentId: studentProfile.id,
            amount: 1,
            type: 'QUIZ_PASSED',
            lessonId,
            description: `Тест пройден: ${quiz.title}`,
          },
        });
      }
    }

    return successResponse({
      attemptId: attempt.id,
      score,
      isPassed,
      correctCount,
      totalCount: quiz.questions.length,
      passingScore: quiz.passingScore,
    });
  } catch (error: any) {
    console.error('Submit quiz error:', error);
    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }
    return serverErrorResponse();
  }
}
