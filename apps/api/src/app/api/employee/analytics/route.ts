import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireEmployee, getEmployeeProfile } from '@/lib/auth/employee-utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';

// GET /api/employee/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // progress, activity, performance
    const period = searchParams.get('period') || '30'; // days
    
    const session = await requireEmployee(request);
    
    if (!session.user?.id) {
      return errorResponse('User ID not found', 401);
    }
    
    const employee = await getEmployeeProfile(session.user.id);

    if (!employee) {
      return errorResponse('Employee profile not found', 404);
    }

    // Find mentor's group
    const group = await prisma.group.findFirst({
      where: { mentorId: employee.id },
      include: {
        course: {
          include: {
            lessons: {
              where: { isPublished: true },
              select: { id: true },
            },
          },
        },
        students: {
          where: { status: 'ACTIVE' },
          include: {
            lessonProgress: {
              where: {
                createdAt: {
                  gte: new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000),
                },
              },
            },
          },
        },
      },
    });

    if (!group) {
      return successResponse({ data: null, message: 'No group found' });
    }

    let analyticsData = {};

    switch (type) {
      case 'progress':
        analyticsData = await getProgressAnalytics(group, parseInt(period));
        break;
      
      case 'activity':
        analyticsData = await getActivityAnalytics(group, parseInt(period));
        break;
      
      case 'performance':
        analyticsData = await getPerformanceAnalytics(group);
        break;
      
      default:
        analyticsData = await getOverviewAnalytics(group, parseInt(period));
    }

    return successResponse(analyticsData);
  } catch (error: any) {
    console.error('Get analytics error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    
    return serverErrorResponse();
  }
}

async function getProgressAnalytics(group: any, days: number) {
  const totalLessons = group.course?.lessons.length || 0;
  
  if (totalLessons === 0) {
    return { labels: [], datasets: [] };
  }

  // Get progress over time
  const dateLabels: string[] = [];
  const progressData: number[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    // Count completed lessons up to this date
    const completedCount = await prisma.lessonProgress.count({
      where: {
        studentId: { in: group.students.map((s: any) => s.id) },
        isCompleted: true,
        completedAt: { lte: nextDate },
      },
    });

    const totalPossible = totalLessons * group.students.length;
    const progress = totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0;

    dateLabels.push(date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }));
    progressData.push(progress);
  }

  return {
    labels: dateLabels,
    datasets: [
      {
        label: 'Средний прогресс группы (%)',
        data: progressData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
    ],
  };
}

async function getActivityAnalytics(group: any, days: number) {
  // Get daily activity
  const dateLabels: string[] = [];
  const activityData: number[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    // Count lesson completions on this day
    const completions = await prisma.lessonProgress.count({
      where: {
        studentId: { in: group.students.map((s: any) => s.id) },
        completedAt: {
          gte: date,
          lt: nextDate,
        },
      },
    });

    dateLabels.push(date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }));
    activityData.push(completions);
  }

  return {
    labels: dateLabels,
    datasets: [
      {
        label: 'Завершённые уроки',
        data: activityData,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  };
}

async function getPerformanceAnalytics(group: any) {
  const totalLessons = group.course?.lessons.length || 0;
  
  if (totalLessons === 0 || group.students.length === 0) {
    return { labels: [], datasets: [] };
  }

  // Calculate progress for each student
  const studentLabels: string[] = [];
  const studentProgress: number[] = [];

  for (const student of group.students) {
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        studentId: student.id,
        isCompleted: true,
      },
    });

    const progress = Math.round((completedLessons / totalLessons) * 100);
    
    studentLabels.push(student.user.fullName.split(' ')[0]); // First name only
    studentProgress.push(progress);
  }

  return {
    labels: studentLabels,
    datasets: [
      {
        label: 'Прогресс студентов (%)',
        data: studentProgress,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };
}

async function getOverviewAnalytics(group: any, days: number) {
  const totalLessons = group.course?.lessons.length || 0;
  const totalStudents = group.students.length;

  // Progress distribution
  const progressRanges = [
    { label: '0-25%', min: 0, max: 25, count: 0 },
    { label: '26-50%', min: 26, max: 50, count: 0 },
    { label: '51-75%', min: 51, max: 75, count: 0 },
    { label: '76-100%', min: 76, max: 100, count: 0 },
  ];

  for (const student of group.students) {
    const completedLessons = student.lessonProgress.filter((lp: any) => lp.isCompleted).length;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    for (const range of progressRanges) {
      if (progress >= range.min && progress <= range.max) {
        range.count++;
        break;
      }
    }
  }

  return {
    progressDistribution: {
      labels: progressRanges.map(r => r.label),
      datasets: [
        {
          label: 'Студенты',
          data: progressRanges.map(r => r.count),
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(34, 197, 94, 0.8)',
          ],
        },
      ],
    },
    summary: {
      totalStudents,
      totalLessons,
      averageProgress: totalStudents > 0 && totalLessons > 0
        ? Math.round(
            group.students.reduce((sum: number, s: any) => {
              const completed = s.lessonProgress.filter((lp: any) => lp.isCompleted).length;
              return sum + (completed / totalLessons) * 100;
            }, 0) / totalStudents
          )
        : 0,
    },
  };
}
