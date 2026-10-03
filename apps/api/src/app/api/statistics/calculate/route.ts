import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';

// GET /api/statistics/calculate - Calculate statistics based on period and metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodType = searchParams.get('periodType') || 'ALL_TIME';
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : null;
    const metricsParam = searchParams.get('metrics');

    // Parse metrics
    const requestedMetrics = metricsParam ? metricsParam.split(',') : [];

    // Validate period parameters
    if (periodType === 'MONTH' && (!month || !year)) {
      return errorResponse('Month and year are required for MONTH period type', 400);
    }
    if (periodType === 'YEAR' && !year) {
      return errorResponse('Year is required for YEAR period type', 400);
    }

    // Calculate date range based on period
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (periodType === 'MONTH' && month && year) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59, 999);
    } else if (periodType === 'YEAR' && year) {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    }
    // For ALL_TIME, startDate and endDate remain undefined (no filter)

    // Calculate statistics
    const stats: Record<string, number> = {};

    for (const metric of requestedMetrics) {
      try {
        stats[metric] = await calculateMetric(metric, startDate, endDate);
      } catch (error) {
        console.error(`Error calculating metric ${metric}:`, error);
        stats[metric] = 0;
      }
    }

    return successResponse({
      periodType,
      month,
      year,
      stats,
    });
  } catch (error) {
    console.error('Calculate statistics error:', error);
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
