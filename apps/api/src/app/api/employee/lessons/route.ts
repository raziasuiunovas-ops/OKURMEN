import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireTeacher } from '@/lib/auth/employee-utils';

export async function GET(request: NextRequest) {
  try {
    const { employee } = await requireTeacher(request);

    // Get all courses taught by this teacher via CourseTeacher relation
    const courseTeachers = await prisma.courseTeacher.findMany({
      where: { employeeId: employee.id },
      select: { courseId: true },
    });
    const courseIds = courseTeachers.map(ct => ct.courseId);

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
        course: {
          select: {
            id: true,
            translations: {
              select: { title: true, languageCode: true },
              orderBy: { languageCode: 'asc' },
            },
          },
        },
        _count: {
          select: {
            lessonProgress: true,
          },
        },
      },
      orderBy: [
        { courseId: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    // Calculate stats for each lesson
    const lessonsWithStats = await Promise.all(
      lessons.map(async (lesson) => {
        // Count completed progress records for this lesson
        const completedCount = await prisma.lessonProgress.count({
          where: { lessonId: lesson.id, isCompleted: true },
        });

        return {
          ...lesson,
          stats: {
            completedCount,
            averageProgress: 0,
          },
        };
      })
    );

    // Calculate summary
    const publishedLessons = lessons.filter(l => l.isPublished).length;
    const draftLessons = lessons.filter(l => !l.isPublished).length;
    const totalCompletions = lessons.reduce((sum, l) => sum + l._count.lessonProgress, 0);

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
    
    if (error.message === 'Unauthorized' || error.message === 'РўСЂРµР±СѓРµС‚СЃСЏ СЂРѕР»СЊ РїСЂРµРїРѕРґР°РІР°С‚РµР»СЏ') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'РћС€РёР±РєР° СЃРµСЂРІРµСЂР°' },
      { status: 500 }
    );
  }
}
