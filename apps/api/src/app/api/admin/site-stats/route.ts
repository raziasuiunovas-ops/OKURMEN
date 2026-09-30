import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import {
  successResponse,
  forbiddenResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// GET /api/admin/site-stats - получить текущую статистику
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const stats = await prisma.siteStats.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!stats) {
      // Вернуть значения по умолчанию
      return successResponse({
        totalStudents: 6000,
        employmentRate: 90,
      });
    }

    return successResponse(stats);
  } catch (error: any) {
    console.error('Get site stats error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}

// POST /api/admin/site-stats - обновить статистику
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const { totalStudents, employmentRate } = body;

    if (typeof totalStudents !== 'number' || typeof employmentRate !== 'number') {
      return serverErrorResponse();
    }

    if (employmentRate < 0 || employmentRate > 100) {
      return serverErrorResponse();
    }

    // Удаляем все старые записи и создаём новую
    await prisma.siteStats.deleteMany();
    
    const stats = await prisma.siteStats.create({
      data: {
        totalStudents,
        employmentRate,
      },
    });

    return successResponse(stats, 201);
  } catch (error: any) {
    console.error('Update site stats error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}
