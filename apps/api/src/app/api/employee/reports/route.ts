import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
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
      where: dateFilter ? { enrolledAt: { gte: dateFilter } } : {},
      include: {
        payment: true,
      },
    });

    const totalRevenue = enrollments.reduce((sum, e) => {
      return sum + (e.payment?.amount || 0);
    }, 0);

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
          select: { title: true, language: true },
          orderBy: { language: 'asc' },
        },
        enrollments: {
          where: dateFilter ? { enrolledAt: { gte: dateFilter } } : {},
          include: {
            payment: true,
          },
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    const coursePerformance = courses.map((course) => {
      const enrollmentsCount = course.enrollments.length;
      const completions = course.enrollments.filter((e) => e.status === 'COMPLETED').length;
      const revenue = course.enrollments.reduce((sum, e) => sum + (e.payment?.amount || 0), 0);
      const averageRating = course.reviews.length > 0
        ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
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
        
        // Calculate average progress
        const progressData = await prisma.lessonProgress.groupBy({
          by: ['studentId'],
          where: {
            studentId: { in: group.students.map((s) => s.id) },
          },
          _avg: { progress: true },
        });

        const averageProgress = progressData.length > 0
          ? Math.round(
              progressData.reduce((sum, p) => sum + (p._avg.progress || 0), 0) / progressData.length
            )
          : 0;

        // Calculate completion rate
        const completedStudents = group.students.filter(
          (s) => s.enrollments.some((e: any) => e.status === 'COMPLETED')
        ).length;
        const completionRate = group._count.students > 0
          ? Math.round((completedStudents / group._count.students) * 100)
          : 0;

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
      where: { position: 'TEACHER' },
      include: {
        user: {
          select: { fullName: true },
        },
        courses: {
          include: {
            enrollments: true,
            reviews: {
              select: { rating: true },
            },
          },
        },
      },
    });

    const teacherPerformance = teachers.map((teacher) => {
      const coursesCount = teacher.courses.length;
      const studentsCount = teacher.courses.reduce(
        (sum, c) => sum + c.enrollments.length,
        0
      );
      const allReviews = teacher.courses.flatMap((c) => c.reviews);
      const averageRating = allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
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
