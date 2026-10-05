import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAuth } from '@/lib/auth/utils';
import {
  successResponse,
  serverErrorResponse,
  forbiddenResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-response';

// GET /api/student/bookings - Protected
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user!.id },
    });

    if (!studentProfile) {
      return errorResponse('Student profile not found', 403);
    }

    const bookings = await prisma.booking.findMany({
      where: { studentId: studentProfile.id },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
        course: {
          select: {
            id: true,
            translations: {
              where: { languageCode: 'RU' },
              select: { title: true },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
      take: 50,
    });

    return successResponse(
      bookings.map(b => ({
        id: b.id,
        mentorId: b.mentorId,
        mentorName: b.mentor.user.fullName,
        mentorPhoto: b.mentor.photoUrl,
        courseId: b.courseId,
        courseName: b.course?.translations[0]?.title,
        date: b.date,
        duration: b.duration,
        status: b.status,
        notes: b.notes,
        createdAt: b.createdAt,
      }))
    );
  } catch (error: any) {
    console.error('Get bookings error:', error);
    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }
    return serverErrorResponse();
  }
}

// POST /api/student/bookings - Protected
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const body = await request.json();
    const { mentorId, courseId, date, duration, notes } = body;

    if (!mentorId || !date) {
      return validationErrorResponse({
        mentorId: mentorId ? [] : ['Mentor is required'],
        date: date ? [] : ['Date is required'],
      });
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user!.id },
    });

    if (!studentProfile) {
      return errorResponse('Student profile not found', 403);
    }

    const bookingDate = new Date(date);

    // Проверяем, что дата в будущем
    if (bookingDate < new Date()) {
      return errorResponse('Cannot book in the past', 400);
    }

    // Проверяем конфликт времени у ментора
    const endDate = new Date(bookingDate);
    endDate.setMinutes(endDate.getMinutes() + (duration || 60));

    const conflict = await prisma.booking.findFirst({
      where: {
        mentorId,
        date: {
          gte: bookingDate,
          lt: endDate,
        },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (conflict) {
      return errorResponse('This time slot is already booked', 409);
    }

    // Создаем booking
    const booking = await prisma.booking.create({
      data: {
        studentId: studentProfile.id,
        mentorId,
        courseId: courseId || null,
        date: bookingDate,
        duration: duration || 60,
        notes: notes || null,
        status: 'PENDING',
      },
      include: {
        mentor: {
          include: {
            user: {
              select: { fullName: true },
            },
          },
        },
      },
    });

    return successResponse(
      {
        id: booking.id,
        mentorName: booking.mentor.user.fullName,
        date: booking.date,
        duration: booking.duration,
        status: booking.status,
      },
      201
    );
  } catch (error: any) {
    console.error('Create booking error:', error);
    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }
    return serverErrorResponse();
  }
}
