import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireManager } from '@/lib/auth/employee-utils';

export async function GET(request: NextRequest) {
  try {
    await requireManager(request);

    // Overview stats
    const [
      totalStudents,
      activeStudents,
      totalGroups,
      activeGroups,
      totalCourses,
      publishedCourses,
      todayBookings,
      pendingApplications,
    ] = await Promise.all([
      prisma.studentProfile.count(),
      prisma.studentProfile.count({ where: { status: 'ACTIVE' } }),
      prisma.group.count(),
      prisma.group.count({ where: { isActive: true } }),
      prisma.course.count(),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.booking.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.application.count({ where: { status: 'PENDING' } }),
    ]);

    // Recent enrollments (last 10)
    const recentEnrollments = await prisma.enrollment.findMany({
      take: 10,
      orderBy: { enrolledAt: 'desc' },
      include: {
        student: {
          include: {
            user: {
              select: { fullName: true },
            },
          },
        },
        group: {
          select: { name: true },
        },
      },
    });

    // Recent applications (last 10)
    const recentApplications = await prisma.application.findMany({
      take: 10,
      orderBy: { submittedAt: 'desc' },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
        course: {
          include: {
            translations: {
              select: { title: true, language: true },
              orderBy: { language: 'asc' },
            },
          },
        },
      },
    });

    // Groups activity
    const groups = await prisma.group.findMany({
      where: { isActive: true },
      include: {
        students: {
          where: { status: 'ACTIVE' },
        },
        _count: {
          select: { students: true },
        },
      },
      take: 10,
      orderBy: { name: 'asc' },
    });

    const groupsActivity = groups.map((group) => ({
      groupName: group.name,
      activeStudents: group.students.length,
      totalStudents: group._count.students,
      averageProgress: 0, // Can be calculated if needed
    }));

    // Enrollment trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const enrollmentsByDay = await prisma.enrollment.groupBy({
      by: ['enrolledAt'],
      where: {
        enrolledAt: { gte: thirtyDaysAgo },
      },
      _count: true,
    });

    const applicationsByDay = await prisma.application.groupBy({
      by: ['submittedAt'],
      where: {
        submittedAt: { gte: thirtyDaysAgo },
      },
      _count: true,
    });

    // Create trend data for last 30 days
    const enrollmentTrend: Array<{ date: string; enrollments: number; applications: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const enrollmentsCount = enrollmentsByDay.filter((e) => {
        const eDate = new Date(e.enrolledAt).toISOString().split('T')[0];
        return eDate === dateStr;
      }).reduce((sum, e) => sum + e._count, 0);

      const applicationsCount = applicationsByDay.filter((a) => {
        const aDate = new Date(a.submittedAt).toISOString().split('T')[0];
        return aDate === dateStr;
      }).reduce((sum, a) => sum + a._count, 0);

      enrollmentTrend.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        enrollments: enrollmentsCount,
        applications: applicationsCount,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalStudents,
          activeStudents,
          totalGroups,
          activeGroups,
          totalCourses,
          publishedCourses,
          todayBookings,
          pendingApplications,
        },
        recentEnrollments,
        recentApplications,
        groupsActivity,
        enrollmentTrend,
      },
    });
  } catch (error: any) {
    console.error('Get operations data error:', error);

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
