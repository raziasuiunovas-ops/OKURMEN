import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAuth } from '@/lib/auth/utils';
import {
  errorResponse,
  successResponse,
  serverErrorResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/student/tokens - Protected
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user!.id },
    });

    if (!studentProfile) {
      return errorResponse('Student profile not found', 403);
    }

    let dateFilter = {};

    if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { gte: today } };
    } else if (period === 'month') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { gte: startOfMonth } };
    }

    // Получаем токены
    const tokens = await prisma.tokenTransaction.findMany({
      where: {
        studentId: studentProfile.id,
        ...dateFilter,
      },
      orderBy: { createdAt: 'desc' },
      take: period === 'all' ? 100 : undefined,
    });

    // Статистика
    const stats = await prisma.tokenTransaction.aggregate({
      where: {
        studentId: studentProfile.id,
        ...dateFilter,
      },
      _sum: { amount: true },
      _count: true,
    });

    // Всего токенов за все время
    const totalAll = await prisma.tokenTransaction.aggregate({
      where: { studentId: studentProfile.id },
      _sum: { amount: true },
    });

    return successResponse({
      tokens,
      stats: {
        total: stats._sum.amount || 0,
        totalAllTime: totalAll._sum.amount || 0,
        count: stats._count,
        period,
      },
    });
  } catch (error: any) {
    console.error('Get tokens error:', error);
    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }
    return serverErrorResponse();
  }
}
