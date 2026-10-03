import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { successResponse, serverErrorResponse } from '@/lib/api-response';

// GET /api/statistics/public - Get published statistics for landing page
export async function GET(request: NextRequest) {
  try {
    // Get the latest published settings
    const settings = await prisma.siteStatistics.findFirst({
      where: { isPublished: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (!settings || settings.enabledMetrics.length === 0) {
      // No published stats
      return successResponse({
        hasStats: false,
        stats: [],
      });
    }

    // Calculate date range based on period
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (settings.periodType === 'MONTH' && settings.month && settings.year) {
      startDate = new Date(settings.year, settings.month - 1, 1);
      endDate = new Date(settings.year, settings.month, 0, 23, 59, 59, 999);
    } else if (settings.periodType === 'YEAR' && settings.year) {
      startDate = new Date(settings.year, 0, 1);
      endDate = new Date(settings.year, 11, 31, 23, 59, 59, 999);
    }

    // Calculate statistics for enabled metrics
    const statsArray: Array<{ metric: string; value: number; order: number }> = [];

    for (const metric of settings.enabledMetrics) {
      try {
        const value = await calculateMetric(metric, startDate, endDate);
        
        // Find order from displayOrder
        const displayOrderArray = Array.isArray(settings.displayOrder) 
          ? settings.displayOrder as any[]
          : [];
        const orderItem = displayOrderArray.find((item: any) => item.metric === metric);
        const order = orderItem?.order ?? 999;

        statsArray.push({ metric, value, order });
      } catch (error) {
        console.error(`Error calculating metric ${metric}:`, error);
      }
    }

    // Sort by display order
    statsArray.sort((a, b) => a.order - b.order);

    return successResponse({
      hasStats: true,
      periodType: settings.periodType,
      month: settings.month,
      year: settings.year,
      stats: statsArray,
    });
  } catch (error) {
    console.error('Get public statistics error:', error);
    return serverErrorResponse();
  }
}

async function calculateMetric(
  metric: string,
  startDate?: Date,
  endDate?: Date
): Promise<number> {
  const dateFilter = startDate && endDate
    ? {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      }
    : {};

  switch (metric) {
    // Period-based metrics
    case 'NEW_STUDENTS':
      return await prisma.studentProfile.count({
        where: dateFilter,
      });

    case 'NEW_APPLICATIONS':
      return await prisma.application.count({
        where: dateFilter,
      });

    case 'COMPLETED_APPLICATIONS':
      return await prisma.application.count({
        where: {
          ...dateFilter,
          status: 'CONFIRMED',
        },
      });

    case 'NEW_PAYMENTS':
      return await prisma.payment.count({
        where: dateFilter,
      });

    case 'TOTAL_PAYMENT_AMOUNT':
      const payments = await prisma.payment.aggregate({
        where: {
          ...dateFilter,
          status: 'PAID',
        },
        _sum: {
          amount: true,
        },
      });
      return Number(payments._sum.amount || 0);

    case 'NEW_REVIEWS':
      return await prisma.review.count({
        where: dateFilter,
      });

    case 'NEW_BOOKINGS':
      return await prisma.booking.count({
        where: dateFilter,
      });

    // Current state metrics (ignore date filter)
    case 'TOTAL_STUDENTS':
      return await prisma.studentProfile.count();

    case 'ACTIVE_STUDENTS':
      return await prisma.studentProfile.count({
        where: { status: 'ACTIVE' },
      });

    case 'TOTAL_COURSES':
      return await prisma.course.count();

    case 'ACTIVE_COURSES':
      return await prisma.course.count({
        where: { isActive: true },
      });

    case 'TOTAL_EMPLOYEES':
      return await prisma.employeeProfile.count();

    case 'ACTIVE_EMPLOYEES':
      return await prisma.employeeProfile.count({
        where: { isActive: true },
      });

    case 'TOTAL_GROUPS':
      return await prisma.group.count();

    case 'TOTAL_LESSONS':
      return await prisma.lesson.count();

    case 'TOTAL_ALUMNI':
      return await prisma.alumni.count();

    default:
      return 0;
  }
}
