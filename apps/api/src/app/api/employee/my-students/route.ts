import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireEmployee, getEmployeeProfile } from '@/lib/auth/employee-utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';

// GET /api/employee/my-students - Get all students of mentor's group
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // ACTIVE, INACTIVE, GRADUATED, DROPPED
    const sortBy = searchParams.get('sortBy') || 'name'; // name, progress, activity
    
    const session = await requireEmployee(request);
    const employee = await getEmployeeProfile(session.user.id);

    if (!employee) {
      return errorResponse('Employee profile not found', 404);
    }

    // Find mentor's group
    const group = await prisma.group.findFirst({
      where: { mentorId: employee.id },
      select: { id: true, courseId: true },
    });

    if (!group) {
      return successResponse([]);
    }

    // Build where clause
    const whereClause: any = {
      groupId: group.id,
    };

    if (status) {
      whereClause.status = status;
    }

    // Get students with detailed info
    const students = await prisma.studentProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            preferredLanguage: true,
            createdAt: true,
          },
        },
        enrollments: {
          where: group.courseId ? { courseId: group.courseId } : {},
          select: {
            id: true,
            courseId: true,
            status: true,
            startedAt: true,
            completedAt: true,
            course: {
              select: {
                id: true,
                slug: true,
                translations: {
                  where: { languageCode: 'RU' },
                  select: { title: true },
                },
              },
            },
          },
        },
        lessonProgress: {
          where: group.courseId ? { courseId: group.courseId } : {},
          select: {
            id: true,
            lessonId: true,
            isCompleted: true,
            completedAt: true,
            watchedAt: true,
          },
        },
        courseReviews: {
          where: group.courseId ? { courseId: group.courseId } : {},
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
        bookings: {
          where: {
            mentorId: employee.id,
            date: { gte: new Date() },
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
          orderBy: { date: 'asc' },
          take: 1,
          select: {
            id: true,
            date: true,
            duration: true,
            status: true,
          },
        },
      },
    });

    // Get total lessons for progress calculation
    const totalLessons = group.courseId
      ? await prisma.lesson.count({
          where: { courseId: group.courseId, isPublished: true },
        })
      : 0;

    // Calculate progress and enrichенrich data
    const enrichedStudents = students.map(student => {
      const completedLessons = student.lessonProgress.filter(lp => lp.isCompleted).length;
      const progress = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100) 
        : 0;

      // Find last activity
      const lastActivity = student.lessonProgress
        .filter(lp => lp.completedAt || lp.watchedAt)
        .sort((a, b) => {
          const dateA = a.completedAt || a.watchedAt || new Date(0);
          const dateB = b.completedAt || b.watchedAt || new Date(0);
          return dateB.getTime() - dateA.getTime();
        })[0];

      const lastActivityDate = lastActivity?.completedAt || lastActivity?.watchedAt || null;

      // Calculate days since last activity
      const daysSinceActivity = lastActivityDate
        ? Math.floor((Date.now() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      // Needs attention criteria
      const needsAttention = 
        student.status === 'ACTIVE' && (
          progress < 10 || // Very low progress
          (daysSinceActivity !== null && daysSinceActivity > 7) || // No activity for 7 days
          completedLessons === 0 // No completed lessons
        );

      return {
        ...student,
        progress,
        completedLessonsCount: completedLessons,
        totalLessons,
        lastActivityDate,
        daysSinceActivity,
        needsAttention,
        upcomingBooking: student.bookings[0] || null,
      };
    });

    // Sort students
    let sortedStudents = [...enrichedStudents];
    
    switch (sortBy) {
      case 'progress':
        sortedStudents.sort((a, b) => b.progress - a.progress);
        break;
      case 'activity':
        sortedStudents.sort((a, b) => {
          if (!a.lastActivityDate) return 1;
          if (!b.lastActivityDate) return -1;
          return new Date(b.lastActivityDate).getTime() - new Date(a.lastActivityDate).getTime();
        });
        break;
      case 'name':
      default:
        sortedStudents.sort((a, b) => 
          a.user.fullName.localeCompare(b.user.fullName, 'ru')
        );
    }

    // Calculate summary stats
    const stats = {
      total: sortedStudents.length,
      active: sortedStudents.filter(s => s.status === 'ACTIVE').length,
      needsAttention: sortedStudents.filter(s => s.needsAttention).length,
      averageProgress: sortedStudents.length > 0
        ? Math.round(sortedStudents.reduce((sum, s) => sum + s.progress, 0) / sortedStudents.length)
        : 0,
    };

    return successResponse({
      students: sortedStudents,
      stats,
    });
  } catch (error: any) {
    console.error('Get my students error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    
    return serverErrorResponse();
  }
}
