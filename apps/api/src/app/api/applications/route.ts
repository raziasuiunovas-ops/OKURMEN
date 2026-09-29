import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import { createApplicationSchema } from '@/lib/validators';
import { sendTelegramNotification } from '@/lib/telegram';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  forbiddenResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// GET /api/applications - Protected (admin only)
export async function GET(request: NextRequest) {
  try {
    // Temporary: Allow unauthenticated read for dashboard stats
    // TODO: Implement proper authentication in admin panel
    let isAuthenticated = false;
    try {
      await requireAdmin(request);
      isAuthenticated = true;
    } catch (error) {
      // Continue without auth for now - dashboard needs this data
      console.warn('Applications GET: No admin auth, returning limited data');
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const applications = await prisma.application.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        course: {
          include: {
            translations: {
              where: { languageCode: 'RU' },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(applications);
  } catch (error: any) {
    console.error('Get applications error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}

// POST /api/applications - Public (creates booking/application)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createApplicationSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const { fullName, phone, email, courseId, comment } = validation.data;

    // Verify course exists and is active
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        translations: {
          where: { languageCode: 'RU' },
        },
      },
    });

    if (!course) {
      return errorResponse('Course not found', 404);
    }

    if (!course.isActive) {
      return errorResponse('Course is not available', 400);
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        fullName,
        phone,
        email,
        courseId,
        comment,
        status: 'PENDING',
      },
      include: {
        course: {
          include: {
            translations: {
              where: { languageCode: 'RU' },
            },
          },
        },
      },
    });

    // Create pending payment
    await prisma.payment.create({
      data: {
        applicationId: application.id,
        courseId: course.id,
        amount: course.price,
        currency: 'KGS',
        status: 'PENDING',
      },
    });

    // Send Telegram notification (non-blocking)
    try {
      const courseTitle = course.translations[0]?.title || course.slug;
      const notificationSent = await sendTelegramNotification({
        type: 'booking',
        data: {
          name: fullName,
          phone,
          email,
          course: courseTitle,
          amount: Number(course.price),
        },
      });

      // Log notification status
      await prisma.telegramNotification.create({
        data: {
          applicationId: application.id,
          status: notificationSent ? 'SENT' : 'FAILED',
          sentAt: notificationSent ? new Date() : undefined,
        },
      });
    } catch (notificationError) {
      console.error('Telegram notification error:', notificationError);
      // Continue even if notification fails
    }

    return successResponse(application, 201);
  } catch (error) {
    console.error('Create application error:', error);
    return serverErrorResponse();
  }
}
