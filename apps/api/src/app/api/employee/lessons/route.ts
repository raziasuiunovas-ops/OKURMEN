import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireTeacher } from '@/lib/auth/employee-utils';

export async function GET(request: NextRequest) {
  try {
    const employee = await requireTeacher(request);

    // Get all courses taught by this teacher
    const courses = await prisma.course.findMany({
      where: { teacherId: employee.id },
      select: { id: true },
    });

    const courseIds = courses.map(c => c.id);

    if (courseIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          lessons: [],
          summary: {
            totalLessons: 0,
            publishedLessons: 0,
            draftLessons: 0,
            totalCompletions: 0,
          },
        },
      });
    }

    // Fetch all lessons from teacher's courses
    const lessons = await prisma.lesson.findMany({
      where: {
        courseId: { in: courseIds },
      },
      include: {
        translations: {
          orderBy: { language: 'asc' },
        },
        course: {
          select: {
            id: true,
            translations: {
              select: { title: true, language: true },
              orderBy: { language: 'asc' },
            },
          },
        },
        _count: {
          select: {
            completedBy: true,
          },
        },
      },
      orderBy: [
        { courseId: 'asc' },
        { order: 'asc' },
      ],
    });

    // Calculate stats for each lesson
    const lessonsWithStats = await Promise.all(
      lessons.map(async (lesson) => {
        // Get average progress for this lesson
        const progressData = await prisma.lessonProgress.aggregate({
          where: { lessonId: lesson.id },
          _avg: { progress: true },
        });

        return {
          ...lesson,
          stats: {
            completedCount: lesson._count.completedBy,
            averageProgress: Math.round(progressData._avg.progress || 0),
          },
        };
      })
    );

    // Calculate summary
    const publishedLessons = lessons.filter(l => l.isPublished).length;
    const draftLessons = lessons.filter(l => !l.isPublished).length;
    const totalCompletions = lessons.reduce((sum, l) => sum + l._count.completedBy, 0);

    return NextResponse.json({
      success: true,
      data: {
        lessons: lessonsWithStats,
        summary: {
          totalLessons: lessons.length,
          publishedLessons,
          draftLessons,
          totalCompletions,
        },
      },
    });
  } catch (error: any) {
    console.error('Get lessons error:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Требуется роль преподавателя') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
