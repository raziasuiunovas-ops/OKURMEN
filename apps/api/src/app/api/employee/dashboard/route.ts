import { NextRequest } from 'next/server';
import { prisma, EmployeePosition } from '@okurmen/database';
import { requireEmployee, getEmployeeProfile } from '@/lib/auth/employee-utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';

// GET /api/employee/dashboard - Get dashboard stats based on role
export async function GET(request: NextRequest) {
  try {
    const session = await requireEmployee(request);
    const employee = await getEmployeeProfile(session.user.id);

    if (!employee) {
      return errorResponse('Employee profile not found', 404);
    }

    let stats = {};

    // Role-based statistics
    switch (employee.position) {
      case EmployeePosition.MENTOR:
        stats = await getMentorStats(employee.id);
        break;
      
      case EmployeePosition.TEACHER:
        stats = await getTeacherStats(employee.id);
        break;
      
      case EmployeePosition.MANAGER:
        stats = await getManagerStats();
        break;
      
      case EmployeePosition.SALES:
        stats = await getSalesStats();
        break;
      
      case EmployeePosition.MARKETING:
        stats = await getMarketingStats();
        break;
      
      default:
        stats = await getGeneralStats();
    }

    return successResponse({
      position: employee.position,
      stats,
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    
    return serverErrorResponse();
  }
}

async function getMentorStats(employeeId: string) {
  // Get mentor's group
  const group = await prisma.group.findFirst({
    where: { mentorId: employeeId },
    include: {
      students: {
        include: {
          lessonProgress: true,
          enrollments: {
            where: { status: 'ACTIVE' },
          },
        },
      },
      course: {
        include: {
          lessons: true,
          translations: true,
        },
      },
    },
  });

  if (!group) {
    return {
      totalStudents: 0,
      activeStudents: 0,
      averageProgress: 0,
      completedLessons: 0,
      upcomingBookings: 0,
      groupName: null,
    };
  }

  const totalStudents = group.students.length;
  const activeStudents = group.students.filter(s => s.status === 'ACTIVE').length;
  
  // Calculate average progress
  const totalLessons = group.course?.lessons.length || 0;
  let totalProgress = 0;
  
  group.students.forEach(student => {
    const completedLessons = student.lessonProgress.filter(lp => lp.isCompleted).length;
    if (totalLessons > 0) {
      totalProgress += (completedLessons / totalLessons) * 100;
    }
  });
  
  const averageProgress = totalStudents > 0 ? Math.round(totalProgress / totalStudents) : 0;

  // Get upcoming bookings
  const upcomingBookings = await prisma.booking.count({
    where: {
      mentorId: employeeId,
      date: { gte: new Date() },
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
  });

  // Total completed lessons across all students
  const completedLessonsCount = group.students.reduce(
    (sum, student) => sum + student.lessonProgress.filter(lp => lp.isCompleted).length,
    0
  );

  return {
    totalStudents,
    activeStudents,
    averageProgress,
    completedLessons: completedLessonsCount,
    upcomingBookings,
    groupName: group.name,
    courseName: group.course?.translations?.[0]?.title || null,
  };
}

async function getTeacherStats(employeeId: string) {
  // Get courses taught by teacher
  const courseTeachers = await prisma.courseTeacher.findMany({
    where: { employeeId },
    include: {
      course: {
        include: {
          lessons: true,
          enrollments: {
            where: { status: 'ACTIVE' },
          },
          translations: {
            where: { languageCode: 'RU' },
          },
        },
      },
    },
  });

  const totalCourses = courseTeachers.length;
  const totalLessons = courseTeachers.reduce(
    (sum, ct) => sum + (ct.course.lessons?.length || 0),
    0
  );
  const totalStudents = courseTeachers.reduce(
    (sum, ct) => sum + (ct.course.enrollments?.length || 0),
    0
  );

  // Published vs unpublished lessons
  const publishedLessons = courseTeachers.reduce(
    (sum, ct) => sum + (ct.course.lessons?.filter(l => l.isPublished).length || 0),
    0
  );

  return {
    totalCourses,
    totalLessons,
    publishedLessons,
    unpublishedLessons: totalLessons - publishedLessons,
    totalStudents,
  };
}

async function getManagerStats() {
  const [
    totalStudents,
    activeStudents,
    totalGroups,
    activeGroups,
    totalEnrollments,
    activeEnrollments,
    todayBookings,
  ] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.studentProfile.count({ where: { status: 'ACTIVE' } }),
    prisma.group.count(),
    prisma.group.count({ where: { isActive: true } }),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
    prisma.booking.count({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
  ]);

  return {
    totalStudents,
    activeStudents,
    totalGroups,
    activeGroups,
    totalEnrollments,
    activeEnrollments,
    todayBookings,
  };
}

async function getSalesStats() {
  const today = new Date();
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [
    totalApplications,
    pendingApplications,
    thisMonthApplications,
    totalPayments,
    thisMonthPayments,
    totalRevenue,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: 'PENDING' } }),
    prisma.application.count({
      where: { createdAt: { gte: thisMonthStart } },
    }),
    prisma.payment.count({ where: { status: 'PAID' } }),
    prisma.payment.count({
      where: {
        status: 'PAID',
        paidAt: { gte: thisMonthStart },
      },
    }),
    prisma.payment.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalApplications,
    pendingApplications,
    thisMonthApplications,
    totalPayments,
    thisMonthPayments,
    totalRevenue: totalRevenue._sum.amount?.toString() || '0',
  };
}

async function getMarketingStats() {
  const today = new Date();
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [
    totalReviews,
    publishedReviews,
    thisMonthApplications,
    totalAlumni,
  ] = await Promise.all([
    prisma.review.count(),
    prisma.review.count({ where: { status: 'PUBLISHED' } }),
    prisma.application.count({
      where: { createdAt: { gte: thisMonthStart } },
    }),
    prisma.alumni.count(),
  ]);

  return {
    totalReviews,
    publishedReviews,
    pendingReviews: totalReviews - publishedReviews,
    thisMonthApplications,
    totalAlumni,
  };
}

async function getGeneralStats() {
  const [totalStudents, totalCourses, totalGroups] = await Promise.all([
    prisma.studentProfile.count({ where: { status: 'ACTIVE' } }),
    prisma.course.count({ where: { isActive: true } }),
    prisma.group.count({ where: { isActive: true } }),
  ]);

  return {
    totalStudents,
    totalCourses,
    totalGroups,
  };
}
