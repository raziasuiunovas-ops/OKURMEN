import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireEmployee, getEmployeeProfile, checkStudentAccess } from '@/lib/auth/employee-utils';
import { successResponse, errorResponse, serverErrorResponse, forbiddenResponse } from '@/lib/api-response';

// GET /api/employee/student/:id - Get detailed student information
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await requireEmployee(request);
    const employee = await getEmployeeProfile(session.user!.id);

    if (!employee) {
      return errorResponse('Employee profile not found', 404);
    }

    // Check if employee has access to this student
    const hasAccess = await checkStudentAccess(employee.id, id);
    
    if (!hasAccess && (session.user as any)?.role !== 'ADMIN') {
      return forbiddenResponse();
    }

    // Get detailed student information
    const student = await prisma.studentProfile.findUnique({
      where: { id },
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
        group: {
          include: {
            course: {
              select: {
                id: true,
                slug: true,
                translations: {
                  where: { languageCode: 'RU' },
                  select: { title: true },
                },
                lessons: {
                  where: { isPublished: true },
                  orderBy: { sortOrder: 'asc' },
                  select: {
                    id: true,
                    title: true,
                    sortOrder: true,
                  },
                },
              },
            },
            mentor: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                  },
                },
              },
            },
          },
        },
        enrollments: {
          include: {
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
          orderBy: { createdAt: 'desc' },
        },
        lessonProgress: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                sortOrder: true,
                courseId: true,
              },
            },
          },
          orderBy: { completedAt: 'desc' },
        },
        courseReviews: {
          include: {
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
          orderBy: { createdAt: 'desc' },
        },
        bookings: {
          where: {
            mentorId: employee.id,
          },
          include: {
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
          orderBy: { date: 'desc' },
          take: 10,
        },
        quizAttempts: {
          include: {
            quiz: {
              select: {
                id: true,
                title: true,
                passingScore: true,
                lesson: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
          orderBy: { completedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!student) {
      return errorResponse('Student not found', 404);
    }

    // Calculate statistics
    const totalLessons = student.group?.course?.lessons.length || 0;
    const completedLessons = student.lessonProgress.filter(lp => lp.isCompleted).length;
    const progress = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;

    // Recent activity
    const recentActivity = student.lessonProgress
      .filter(lp => lp.completedAt || lp.watchedAt)
      .slice(0, 10)
      .map(lp => ({
        type: 'lesson',
        lessonId: lp.lessonId,
        lessonTitle: lp.lesson.title,
        isCompleted: lp.isCompleted,
        date: lp.completedAt || lp.watchedAt,
      }));

    // Add quiz attempts to activity
    student.quizAttempts.forEach(attempt => {
      recentActivity.push({
        type: 'quiz',
        quizId: attempt.quizId,
        quizTitle: attempt.quiz.title,
        score: attempt.score,
        isPassed: attempt.isPassed,
        date: attempt.completedAt,
      } as any);
    });

    // Sort by date
    recentActivity.sort((a, b) => 
      new Date(b.date as Date).getTime() - new Date(a.date as Date).getTime()
    );

    // Learning streak
    const lastActivityDate = recentActivity[0]?.date;
    const daysSinceActivity = lastActivityDate
      ? Math.floor((Date.now() - new Date(lastActivityDate as Date).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Upcoming bookings
    const upcomingBookings = student.bookings.filter(
      b => b.date >= new Date() && (b.status === 'PENDING' || b.status === 'CONFIRMED')
    );

    // Average quiz score
    const averageQuizScore = student.quizAttempts.length > 0
      ? Math.round(
          student.quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / 
          student.quizAttempts.length
        )
      : 0;

    return successResponse({
      ...student,
      stats: {
        totalLessons,
        completedLessons,
        progress,
        totalQuizzes: student.quizAttempts.length,
        passedQuizzes: student.quizAttempts.filter(a => a.isPassed).length,
        averageQuizScore,
        totalBookings: student.bookings.length,
        upcomingBookingsCount: upcomingBookings.length,
        daysSinceActivity,
      },
      recentActivity: recentActivity.slice(0, 20),
      upcomingBookings,
    });
  } catch (error: any) {
    console.error('Get student details error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    
    return serverErrorResponse();
  }
}
