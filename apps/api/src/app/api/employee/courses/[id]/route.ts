import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { requireTeacher, checkCourseTeaching } from '@/lib/auth/employee-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await requireTeacher(request);
    const courseId = params.id;

    // Check if teacher is teaching this course
    await checkCourseTeaching(employee.id, courseId);

    // Fetch course with lessons and enrollment data
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        translations: {
          orderBy: { language: 'asc' },
        },
        lessons: {
          include: {
            translations: {
              orderBy: { language: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        groups: {
          include: {
            _count: {
              select: { students: true },
            },
          },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Курс не найден' },
        { status: 404 }
      );
    }

    // Calculate stats
    const publishedLessons = course.lessons.filter(l => l.isPublished).length;
    const draftLessons = course.lessons.filter(l => !l.isPublished).length;

    // Get active students count
    const activeStudentsCount = await prisma.studentProfile.count({
      where: {
        groupId: { in: course.groups.map(g => g.id) },
        status: 'ACTIVE',
      },
    });

    const responseData = {
      ...course,
      stats: {
        totalLessons: course._count.lessons,
        publishedLessons,
        draftLessons,
        totalStudents: course._count.enrollments,
        activeStudents: activeStudentsCount,
      },
      enrolledGroups: course.groups,
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error: any) {
    console.error('Get course details error:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Требуется роль преподавателя') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 403 }
      );
    }

    if (error.message === 'У вас нет доступа к этому курсу') {
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
