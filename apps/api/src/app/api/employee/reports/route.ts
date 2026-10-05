import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireManager } from '@/lib/auth/employee-utils';

export async function GET(request: NextRequest) {
  try {
    await requireManager(request);

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    // Calculate date filter
    let dateFilter: Date | undefined;
    if (period === '30d') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 30);
    } else if (period === '90d') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 90);
    }

    // Summary stats
    const enrollments = await prisma.enrollment.findMany({
      where: dateFilter ? { createdAt: { gte: dateFilter } } : {},
    });

    const totalRevenue = 0; // Payment not directly linked to Enrollment

    const completedEnrollments = enrollments.filter((e) => e.status === 'COMPLETED').length;
    const averageCompletionRate = enrollments.length > 0
      ? Math.round((completedEnrollments / enrollments.length) * 100)
      : 0;

    // Student retention rate (students still active vs total)
    const activeStudents = await prisma.studentProfile.count({
      where: { status: 'ACTIVE' },
    });
    const totalStudents = await prisma.studentProfile.count();
    const studentRetentionRate = totalStudents > 0
      ? Math.round((activeStudents / totalStudents) * 100)
      : 0;

    // Course performance
    const courses = await prisma.course.findMany({
      include: {
        translations: {
          select: { title: true, languageCode: true },
          orderBy: { languageCode: 'asc' },
        },
        enrollments: {
          where: dateFilter ? { createdAt: { gte: dateFilter } } : {},
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    const coursePerformance = courses.map((course) => {
      const enrollmentsCount = course.enrollments.length;
      const completions = course.enrollments.filter((e) => e.status === 'COMPLETED').length;
      const revenue = 0; // Payment not directly linked to Enrollment
      const averageRating = course.reviews.length > 0
        ? course.reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / course.reviews.length
        : 0;

      return {
        courseTitle: course.translations[0]?.title || 'Без названия',
        enrollments: enrollmentsCount,
        completions,
        revenue,
        averageRating,
      };
    }).filter(c => c.enrollments > 0);

    // Group performance
    const groups = await prisma.group.findMany({
      include: {
        students: true,
        _count: {
          select: { students: true },
        },
      },
    });

    const groupPerformance = await Promise.all(
      groups.map(async (group) => {
        const activeStudents = group.students.filter((s) => s.status === 'ACTIVE').length;
        
        // Calculate average progress (% of completed lessons per student)
        const progressData = await prisma.lessonProgress.groupBy({
          by: ['studentId'],
          where: {
            studentId: { in: group.students.map((s) => s.id) },
            isCompleted: true,
          },
          _count: { id: true },
        });

        const averageProgress = progressData.length > 0
          ? Math.round(
              progressData.reduce((sum, p) => sum + (p._count.id || 0), 0) / progressData.length
            )
          : 0;

        const completedStudents = 0; // Simplified - no enrollments in group.students include
        const completionRate = 0;

        return {
          groupName: group.name,
          totalStudents: group._count.students,
          activeStudents,
          averageProgress,
          completionRate,
        };
      })
    );

    // Teacher performance
    const teachers = await prisma.employeeProfile.findMany({
      where: { positions: { has: 'TEACHER' } },
      include: {
        user: {
          select: { fullName: true },
        },
        courseTeachers: {
          include: {
            course: {
              include: {
                enrollments: true,
                reviews: {
                  select: { rating: true },
                },
              },
            },
          },
        },
      },
    });

    const teacherPerformance = teachers.map((teacher) => {
      const courses = teacher.courseTeachers.map(ct => ct.course);
      const coursesCount = courses.length;
      const studentsCount = courses.reduce(
        (sum, c) => sum + c.enrollments.length,
        0
      );
      const allReviews = courses.flatMap((c) => c.reviews);
      const averageRating = allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / allReviews.length
        : 0;

      return {
        teacherName: teacher.user.fullName,
        coursesCount,
        studentsCount,
        averageRating,
      };
    }).filter(t => t.coursesCount > 0);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalEnrollments: enrollments.length,
          averageCompletionRate,
          studentRetentionRate,
        },
        coursePerformance,
        groupPerformance,
        teacherPerformance,
      },
    });
  } catch (error: any) {
    console.error('Get reports error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Требуется роль менеджера') {
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
