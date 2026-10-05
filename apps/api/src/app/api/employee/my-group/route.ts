import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireEmployee, getEmployeeProfile } from '@/lib/auth/employee-utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';

// GET /api/employee/my-group - Get mentor's group with students
export async function GET(request: NextRequest) {
  try {
    const session = await requireEmployee(request);
    const employee = await getEmployeeProfile(session.user!.id);

    if (!employee) {
      return errorResponse('Employee profile not found', 404);
    }

    // Find group where this employee is mentor
    const group = await prisma.group.findFirst({
      where: { mentorId: employee.id },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            price: true,
            duration: true,
            totalHours: true,
            format: true,
            coverImage: true,
            translations: {
              where: { languageCode: 'RU' },
              select: {
                title: true,
                description: true,
                level: true,
              },
            },
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
        students: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                preferredLanguage: true,
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
            },
            lessonProgress: {
              where: {
                isCompleted: true,
              },
              select: {
                id: true,
                lessonId: true,
                completedAt: true,
              },
            },
            courseReviews: {
              select: {
                id: true,
                courseId: true,
                rating: true,
                comment: true,
                createdAt: true,
              },
            },
            bookings: {
              where: {
                date: { gte: new Date() },
                status: { in: ['PENDING', 'CONFIRMED'] },
              },
              orderBy: { date: 'asc' },
              take: 3,
              select: {
                id: true,
                date: true,
                duration: true,
                status: true,
              },
            },
          },
        },
        _count: {
          select: { students: true },
        },
      },
    });

    if (!group) {
      return successResponse(null);
    }

    // Calculate additional stats
    const totalLessons = group.course?._count?.lessons || 0;
    
    const studentsWithProgress = group.students.map(student => {
      const completedLessons = student.lessonProgress.length;
      const progress = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100) 
        : 0;

      return {
        ...student,
        progress,
        completedLessonsCount: completedLessons,
      };
    });

    const activeStudents = studentsWithProgress.filter(s => s.status === 'ACTIVE').length;
    const totalProgress = studentsWithProgress.reduce((sum, s) => sum + s.progress, 0);
    const averageProgress = studentsWithProgress.length > 0 
      ? Math.round(totalProgress / studentsWithProgress.length) 
      : 0;

    return successResponse({
      ...group,
      students: studentsWithProgress,
      stats: {
        totalStudents: studentsWithProgress.length,
        activeStudents,
        averageProgress,
        totalLessons,
      },
    });
  } catch (error: any) {
    console.error('Get my group error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    
    return serverErrorResponse();
  }
}
