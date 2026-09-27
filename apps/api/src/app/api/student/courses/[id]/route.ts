import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAuth } from '@/lib/auth/utils';
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/student/courses/[id] - Protected (student only, with access check)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request);
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'RU';

    // Получаем профиль студента
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return forbiddenResponse('Student profile not found');
    }

    // Проверяем доступ - есть ли у студента enrollment на этот курс
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: studentProfile.id,
        courseId: id,
        status: { in: ['ACTIVE', 'COMPLETED', 'PAUSED'] },
      },
    });

    if (!enrollment) {
      return forbiddenResponse('You do not have access to this course');
    }

    // Получаем курс со всеми данными
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        translations: {
          where: { languageCode: language as any },
        },
        teachers: {
          include: {
            employee: {
              include: {
                user: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
        },
        lessons: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!course) {
      return notFoundResponse('Course');
    }

    // Получаем прогресс студента по урокам
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        studentId: studentProfile.id,
        courseId: id,
      },
    });

    const progressMap = new Map(
      lessonProgress.map(p => [p.lessonId, p])
    );

    // Формируем уроки с прогрессом
    const lessonsWithProgress = course.lessons.map((lesson, index) => {
      const progress = progressMap.get(lesson.id);
      const isLocked = index > 0 && !progressMap.get(course.lessons[index - 1].id)?.isCompleted;

      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        sortOrder: lesson.sortOrder,
        videoUrl: lesson.videoUrl,
        isCompleted: progress?.isCompleted || false,
        isLocked,
        watchedAt: progress?.watchedAt,
        completedAt: progress?.completedAt,
      };
    });

    const completedCount = lessonsWithProgress.filter(l => l.isCompleted).length;
    const progressPercentage = course.lessons.length > 0
      ? Math.round((completedCount / course.lessons.length) * 100)
      : 0;

    return successResponse({
      id: course.id,
      slug: course.slug,
      title: course.translations[0]?.title || 'Untitled',
      description: course.translations[0]?.description || '',
      program: course.translations[0]?.program || '',
      level: course.translations[0]?.level || 'BEGINNER',
      format: course.format,
      coverImage: course.coverImage,
      coverGradient: course.coverGradient ? JSON.parse(course.coverGradient) : null,
      price: Number(course.price),
      duration: course.duration,
      teachers: course.teachers.map(t => ({
        id: t.employee.id,
        name: t.employee.user.fullName,
        photoUrl: t.employee.photoUrl,
        position: t.employee.position,
      })),
      lessons: lessonsWithProgress,
      progress: {
        percentage: progressPercentage,
        completed: completedCount,
        total: course.lessons.length,
      },
      enrollment: {
        status: enrollment.status,
        startedAt: enrollment.startedAt,
        completedAt: enrollment.completedAt,
      },
    });
  } catch (error: any) {
    console.error('Student course detail error:', error);

    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }

    return serverErrorResponse();
  }
}
