import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAuth } from '@/lib/auth/utils';
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// GET /api/student/streak - Get student's streak data
export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);

    // Get student profile
    const student = await prisma.studentProfile.findUnique({
      where: { userId: authUser.user!.id },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
        lessonProgress: {
          include: {
            lesson: {
              select: {
                title: true,
              },
            },
          },
          orderBy: {
            watchedAt: 'desc',
          },
        },
        tokenTransactions: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!student) {
      return errorResponse('Студент не найден', 404);
    }

    // Calculate daily progress
    const dailyMap = new Map<string, { lessonsWatched: number; tokensEarned: number }>();

    // Process lesson progress
    student.lessonProgress.forEach((progress) => {
      if (progress.watchedAt) {
        const date = new Date(progress.watchedAt).toISOString().split('T')[0];
        if (!dailyMap.has(date)) {
          dailyMap.set(date, { lessonsWatched: 0, tokensEarned: 0 });
        }
        dailyMap.get(date)!.lessonsWatched++;
      }
    });

    // Process token transactions
    student.tokenTransactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt).toISOString().split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { lessonsWatched: 0, tokensEarned: 0 });
      }
      dailyMap.get(date)!.tokensEarned += transaction.amount;
    });

    // Convert to array and sort by date descending
    const dailyProgress = Array.from(dailyMap.entries())
      .map(([date, stats]) => ({
        date,
        lessonsWatched: stats.lessonsWatched,
        tokensEarned: stats.tokensEarned,
        isCompleted: stats.lessonsWatched > 0, // Consider day complete if at least 1 lesson watched
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    // Check current streak starting from today
    const sortedDates = dailyProgress.map(d => d.date).sort((a, b) => b.localeCompare(a));
    
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (currentDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
        currentStreak++;
        tempStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let consecutiveDays = 0;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const current = new Date(sortedDates[i]);
      const next = new Date(sortedDates[i + 1]);
      const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        consecutiveDays++;
        longestStreak = Math.max(longestStreak, consecutiveDays + 1);
      } else {
        consecutiveDays = 0;
      }
    }
    
    longestStreak = Math.max(longestStreak, currentStreak);

    return successResponse({
      currentStreak,
      longestStreak,
      totalDays: dailyProgress.length,
      dailyProgress: dailyProgress.slice(0, 30), // Last 30 days
    });
  } catch (error: any) {
    console.error('Get streak error:', error);

    if (error.message?.includes('Unauthorized')) {
      return errorResponse('Требуется авторизация', 401);
    }

    return serverErrorResponse();
  }
}
