import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import { sendTelegramNotification } from '@/lib/telegram';
import {
  successResponse,
  notFoundResponse,
  forbiddenResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// PATCH /api/payments/[id] - Protected (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const body = await request.json();

    const existingPayment = await prisma.payment.findUnique({
      where: { id },
      include: {
        application: true,
        course: {
          include: {
            translations: {
              where: { languageCode: 'RU' },
            },
          },
        },
      },
    });

    if (!existingPayment) {
      return notFoundResponse('Payment');
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        status: body.status,
        ...(body.status === 'PAID' && !existingPayment.paidAt && { paidAt: new Date() }),
        ...(body.provider && { provider: body.provider }),
        ...(body.providerPaymentId && { providerPaymentId: body.providerPaymentId }),
      },
    });

    // Send Telegram notification for successful payment
    if (body.status === 'PAID' && existingPayment.status !== 'PAID') {
      try {
        const courseTitle = existingPayment.course.translations[0]?.title || existingPayment.course.slug;
        const notificationSent = await sendTelegramNotification({
          type: 'payment',
          data: {
            name: existingPayment.application?.fullName || 'Unknown',
            phone: existingPayment.application?.phone || 'Unknown',
            course: courseTitle,
            amount: Number(existingPayment.amount),
            status: 'PAID',
          },
        });

        await prisma.telegramNotification.create({
          data: {
            paymentId: payment.id,
            status: notificationSent ? 'SENT' : 'FAILED',
            sentAt: notificationSent ? new Date() : undefined,
          },
        });
      } catch (notificationError) {
        console.error('Telegram notification error:', notificationError);
      }
    }

    return successResponse(payment);
  } catch (error: any) {
    console.error('Update payment error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}
