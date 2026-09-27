import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireEmployee, getEmployeeProfile } from '@/lib/auth/employee-utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';

// GET /api/employee/my-courses - Get courses taught by teacher
export async function GET(request: NextRequest) {
  try {
    const session = await requireEmployee(request);
    const employee = await getEmployeeProfile(session.user.id);

    if (!employee) {
      return errorResponse('Employee profile not found', 404);
    }

    // Get courses taught by this employee
    const courseTeachers = await prisma.courseTeacher.findMany({
      where: { employeeId: employee.id },
      include: {
        course: {
          include: {
            translations: {
              where: { languageCode: 'RU' },
            },
            lessons: {
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                title: true,
                description: true,
                duration: true,
                sortOrder: true,
                isPublished: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                  select: {
                    lessonProgress: {
                      where: { isCompleted: true },
                    },
                  },
                },
              },
            },
            enrollments: {
              where: { status: 'ACTIVE' },
              include: {
                student: {
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
            groups: {
              where: { isActive: true },
              select: {
                id: true,
                name: true,
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
        },
      },
    });

    // Enrich courses with stats
    const enrichedCourses = courseTeachers.map(ct => {
      const course = ct.course;
      
      const totalLessons = course.lessons.length;
      const publishedLessons = course.lessons.filter(l => l.isPublished).length;
      const unpublishedLessons = totalLessons - publishedLessons;
      
      const activeEnrollments = course.enrollments.length;
      
      // Calculate total lesson completions
      const totalCompletions = course.lessons.reduce(
        (sum, lesson) => sum + (lesson._count?.lessonProgress || 0),
        0
      );

      return {
        id: course.id,
        slug: course.slug,
        price: course.price,
        duration: course.duration,
        totalHours: course.totalHours,
        format: course.format,
        coverImage: course.coverImage,
        rating: course.rating,
        isActive: course.isActive,
        title: course.translations[0]?.title || 'Без названия',
        description: course.translations[0]?.description,
        level: course.translations[0]?.level,
        lessons: course.lessons,
        groups: course.groups,
        stats: {
          totalLessons,
          publishedLessons,
          unpublishedLessons,
          activeEnrollments,
          totalCompletions,
          activeGroups: course.groups.length,
        },
      };
    });

    // Calculate summary
    const summary = {
      totalCourses: enrichedCourses.length,
      totalLessons: enrichedCourses.reduce((sum, c) => sum + c.stats.totalLessons, 0),
      publishedLessons: enrichedCourses.reduce((sum, c) => sum + c.stats.publishedLessons, 0),
      totalStudents: enrichedCourses.reduce((sum, c) => sum + c.stats.activeEnrollments, 0),
    };

    return successResponse({
      courses: enrichedCourses,
      summary,
    });
  } catch (error: any) {
    console.error('Get my courses error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    
    return serverErrorResponse();
  }
}
