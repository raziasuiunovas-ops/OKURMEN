import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireManager } from '@/lib/auth/employee-utils';

export async function GET(request: NextRequest) {
  try {
    await requireManager(request);

    // Fetch all enrollments
    const enrollments = await prisma.enrollment.findMany({
      orderBy: { createdAt: 'desc' },
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
        course: {
          include: {
            translations: {
              select: { title: true },
            },
          },
        },
      },
    });

    // Fetch all applications
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
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
              select: { title: true, languageCode: true },
              orderBy: { languageCode: 'asc' },
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
      approvedApplications: applications.filter((a) => a.status === 'CONFIRMED').length,
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
