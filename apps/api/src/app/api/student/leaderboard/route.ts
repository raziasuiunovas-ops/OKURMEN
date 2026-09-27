import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAuth } from '@/lib/auth/utils';
import {
  successResponse,
  serverErrorResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/student/leaderboard - Protected
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return forbiddenResponse('Student profile not found');
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

    // Получаем топ студентов
    const tokensByStudent = await prisma.tokenTransaction.groupBy({
      by: ['studentId'],
      where: dateFilter,
      _sum: { amount: true },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: 100,
    });

    // Получаем информацию о студентах
    const studentIds = tokensByStudent.map(t => t.studentId);
    const students = await prisma.studentProfile.findMany({
      where: { id: { in: studentIds } },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    const studentMap = new Map(students.map(s => [s.id, s]));

    // Формируем leaderboard
    const leaderboard = tokensByStudent
      .map((item, index) => {
        const student = studentMap.get(item.studentId);
        return {
          position: index + 1,
          studentId: item.studentId,
          name: student?.user.fullName || 'Anonymous',
          tokens: item._sum.amount || 0,
          isCurrentUser: item.studentId === studentProfile.id,
        };
      })
      .filter(item => item.tokens > 0);

    // Позиция текущего пользователя
    const currentUserPosition = leaderboard.findIndex(
      item => item.studentId === studentProfile.id
    );

    return successResponse({
      leaderboard,
      currentUser: {
        position: currentUserPosition >= 0 ? currentUserPosition + 1 : null,
        tokens: leaderboard[currentUserPosition]?.tokens || 0,
      },
      period,
    });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }
    return serverErrorResponse();
  }
}
