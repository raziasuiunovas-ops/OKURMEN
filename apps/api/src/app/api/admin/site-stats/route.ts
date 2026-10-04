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
    // Проверяем авторизацию
    await requireAdmin(request);

    console.log('Admin auth passed, fetching site stats...');

    const stats = await prisma.siteStats.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    console.log('Site stats found:', stats);

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
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    if (error.message === 'Unauthorized') {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return serverErrorResponse();
  }
}

// POST /api/admin/site-stats - обновить статистику
export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию
    await requireAdmin(request);

    console.log('Admin auth passed, updating site stats...');

    const body = await request.json();
    console.log('Request body:', body);

    const { totalStudents, employmentRate } = body;

    if (typeof totalStudents !== 'number' || typeof employmentRate !== 'number') {
      console.error('Invalid data types:', { totalStudents: typeof totalStudents, employmentRate: typeof employmentRate });
      return new Response(JSON.stringify({ success: false, error: 'Invalid data types' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (employmentRate < 0 || employmentRate > 100) {
      console.error('Invalid employment rate:', employmentRate);
      return new Response(JSON.stringify({ success: false, error: 'Employment rate must be between 0 and 100' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Deleting old stats and creating new...');

    // Удаляем все старые записи и создаём новую
    await prisma.siteStats.deleteMany();
    
    const stats = await prisma.siteStats.create({
      data: {
        totalStudents,
        employmentRate,
      },
    });

    console.log('Site stats created:', stats);

    return successResponse(stats, 201);
  } catch (error: any) {
    console.error('Update site stats error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    if (error.message === 'Unauthorized') {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return serverErrorResponse();
  }
}
