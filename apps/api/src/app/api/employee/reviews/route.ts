import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { requireEmployee } from '@/lib/auth/employee-utils';

export async function GET(request: NextRequest) {
  try {
    const employee = await requireEmployee(request);

    // Get courses based on employee position
    let courseIds: string[] = [];

    if (employee.position === 'TEACHER') {
      // Teacher sees reviews for their courses
      const courses = await prisma.course.findMany({
        where: { teacherId: employee.id },
        select: { id: true },
      });
      courseIds = courses.map(c => c.id);
    } else if (employee.position === 'MENTOR') {
      // Mentor sees reviews for their group's course
      const group = await prisma.group.findUnique({
        where: { mentorId: employee.id },
        select: { courseId: true },
      });
      if (group?.courseId) {
        courseIds = [group.courseId];
      }
    } else {
      // Manager sees all reviews
      const courses = await prisma.course.findMany({
        select: { id: true },
      });
      courseIds = courses.map(c => c.id);
    }

    if (courseIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          reviews: [],
          stats: {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
            recentReviews: 0,
          },
        },
      });
    }

    // Fetch reviews
    const reviews = await prisma.courseReview.findMany({
      where: {
        courseId: { in: courseIds },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
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

    // Calculate stats
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const ratingDistribution = {
      '5': reviews.filter(r => r.rating === 5).length,
      '4': reviews.filter(r => r.rating === 4).length,
      '3': reviews.filter(r => r.rating === 3).length,
      '2': reviews.filter(r => r.rating === 2).length,
      '1': reviews.filter(r => r.rating === 1).length,
    };

    // Recent reviews (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReviews = reviews.filter(
      r => new Date(r.createdAt) >= thirtyDaysAgo
    ).length;

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        stats: {
          totalReviews,
          averageRating,
          ratingDistribution,
          recentReviews,
        },
      },
    });
  } catch (error: any) {
    console.error('Get reviews error:', error);

    if (error.message === 'Unauthorized') {
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
