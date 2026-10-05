import { NextRequest } from 'next/server';
import { prisma, BookingStatus } from '@okurmen/database';
import { requireEmployee, getEmployeeProfile } from '@/lib/auth/employee-utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';

// GET /api/employee/bookings - Get employee's bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as BookingStatus | null;
    const timeFilter = searchParams.get('time'); // upcoming, past, today
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    const session = await requireEmployee(request);
    const employee = await getEmployeeProfile(session.user!.id);

    if (!employee) {
      return errorResponse('Employee profile not found', 404);
    }

    // Build where clause
    const whereClause: any = {
      mentorId: employee.id,
    };

    if (status) {
      whereClause.status = status;
    }

    // Time filters
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    if (timeFilter === 'upcoming') {
      whereClause.date = { gte: new Date() };
      whereClause.status = { in: ['PENDING', 'CONFIRMED'] };
    } else if (timeFilter === 'past') {
      whereClause.date = { lt: new Date() };
    } else if (timeFilter === 'today') {
      whereClause.date = {
        gte: todayStart,
        lte: todayEnd,
      };
    }

    // Get bookings
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
            group: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        course: {
          select: {
            id: true,
            slug: true,
            translations: {
              where: { languageCode: 'RU' },
              select: { title: true },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
      ...(limit && { take: limit }),
    });

    // Group by date for calendar view
    const groupedByDate = bookings.reduce((acc, booking) => {
      const dateKey = booking.date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(booking);
      return acc;
    }, {} as Record<string, typeof bookings>);

    // Calculate stats
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'PENDING').length,
      confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
      upcoming: bookings.filter(b => 
        b.date >= new Date() && 
        (b.status === 'PENDING' || b.status === 'CONFIRMED')
      ).length,
    };

    return successResponse({
      bookings,
      groupedByDate,
      stats,
    });
  } catch (error: any) {
    console.error('Get bookings error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    
    return serverErrorResponse();
  }
}
