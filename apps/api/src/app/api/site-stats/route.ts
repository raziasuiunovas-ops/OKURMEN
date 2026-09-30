import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { successResponse, serverErrorResponse } from '@/lib/api-response';

// GET /api/site-stats - Public endpoint для статистики главной страницы
export async function GET(request: NextRequest) {
  try {
    // Сначала пытаемся получить из таблицы site_stats
    const siteStats = await prisma.siteStats.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (siteStats) {
      // Если статистика есть в БД - используем её
      return successResponse({
        totalStudents: siteStats.totalStudents,
        employedCount: Math.round((siteStats.totalStudents * siteStats.employmentRate) / 100),
        employmentRate: siteStats.employmentRate,
      });
    }

    // Fallback: считаем динамически из реальных данных
    const totalStudents = await prisma.studentProfile.count();
    const employedCount = await prisma.alumni.count();
    const employmentRate = totalStudents > 0 
      ? Math.round((employedCount / totalStudents) * 100)
      : 0;

    return successResponse({
      totalStudents,
      employedCount,
      employmentRate,
    });
  } catch (error) {
    console.error('Get site stats error:', error);
    return serverErrorResponse();
  }
}
