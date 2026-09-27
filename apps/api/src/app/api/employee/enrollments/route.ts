import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { requireManager } from '@/lib/auth/employee-utils';

export async function GET(request: NextRequest) {
  try {
    await requireManager(request);

    // Fetch all enrollments
    const enrollments = await prisma.enrollment.findMany({
      orderBy: { enrolledAt: 'desc' },
      include: {
        student: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        group: {
          include: {
            course: {
              include: {
                translations: {
                  select: { title: true, language: true },
                  orderBy: { language: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    // Fetch all applications
    const applications = await prisma.application.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
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
    const stats = {
      totalEnrollments: enrollments.length,
      activeEnrollments: enrollments.filter((e) => e.status === 'ACTIVE').length,
      completedEnrollments: enrollments.filter((e) => e.status === 'COMPLETED').length,
      totalApplications: applications.length,
      pendingApplications: applications.filter((a) => a.status === 'PENDING').length,
      approvedApplications: applications.filter((a) => a.status === 'APPROVED').length,
      rejectedApplications: applications.filter((a) => a.status === 'REJECTED').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        enrollments,
        applications,
        stats,
      },
    });
  } catch (error: any) {
    console.error('Get enrollments error:', error);

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
