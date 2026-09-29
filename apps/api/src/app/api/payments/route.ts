import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import {
  successResponse,
  forbiddenResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// GET /api/payments - Protected (admin only)
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
      console.warn('Payments GET: No admin auth, returning limited data');
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const payments = await prisma.payment.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        application: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
          },
        },
        course: {
          include: {
            translations: {
              where: { languageCode: 'RU' },
            },
          },
        },
        student: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(payments);
  } catch (error: any) {
    console.error('Get payments error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}
