import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';
import { requireAdmin } from '@/lib/auth/utils';

// GET /api/statistics/settings - Get current statistics settings
export async function GET(request: NextRequest) {
  try {
    // Get the latest settings
    const settings = await prisma.siteStatistics.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!settings) {
      // Return default settings if none exist
      return successResponse({
        periodType: 'ALL_TIME',
        month: null,
        year: null,
        enabledMetrics: [],
        displayOrder: [],
        isPublished: true,
      });
    }

    return successResponse(settings);
  } catch (error) {
    console.error('Get statistics settings error:', error);
    return serverErrorResponse();
  }
}

// PATCH /api/statistics/settings - Update statistics settings (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authorization
    await requireAdmin(request);

    const body = await request.json();
    const { periodType, month, year, enabledMetrics, displayOrder, isPublished } = body;

    // Validate period type
    if (!['MONTH', 'YEAR', 'ALL_TIME'].includes(periodType)) {
      return errorResponse('Invalid period type', 400);
    }

    // Validate month and year for MONTH period
    if (periodType === 'MONTH') {
      if (!month || !year || month < 1 || month > 12) {
        return errorResponse('Valid month (1-12) and year are required for MONTH period', 400);
      }
    }

    // Validate year for YEAR period
    if (periodType === 'YEAR' && !year) {
      return errorResponse('Year is required for YEAR period', 400);
    }

    // Validate enabled metrics
    if (!Array.isArray(enabledMetrics)) {
      return errorResponse('enabledMetrics must be an array', 400);
    }

    // Get existing settings or create new
    const existingSettings = await prisma.siteStatistics.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    let settings;
    if (existingSettings) {
      // Update existing
      settings = await prisma.siteStatistics.update({
        where: { id: existingSettings.id },
        data: {
          periodType,
          month: periodType === 'MONTH' ? month : null,
          year: periodType === 'MONTH' || periodType === 'YEAR' ? year : null,
          enabledMetrics,
          displayOrder: displayOrder || [],
          isPublished: isPublished ?? true,
        },
      });
    } else {
      // Create new
      settings = await prisma.siteStatistics.create({
        data: {
          periodType,
          month: periodType === 'MONTH' ? month : null,
          year: periodType === 'MONTH' || periodType === 'YEAR' ? year : null,
          enabledMetrics,
          displayOrder: displayOrder || [],
          isPublished: isPublished ?? true,
        },
      });
    }

    return successResponse(settings);
  } catch (error) {
    console.error('Update statistics settings error:', error);
    return serverErrorResponse();
  }
}
