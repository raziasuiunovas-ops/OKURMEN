import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import { createReviewSchema } from '@/lib/validators';
import {
  successResponse,
  validationErrorResponse,
  forbiddenResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// GET /api/reviews - Public (returns only published reviews)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    const reviews = await prisma.review.findMany({
      where: includeUnpublished ? undefined : { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    return serverErrorResponse();
  }
}

// POST /api/reviews - Protected (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const validation = createReviewSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const { authorName, reviewType, text, rating, photoUrl, videoUrl, status } = validation.data;

    const review = await prisma.review.create({
      data: {
        authorName,
        reviewType,
        text,
        rating: rating ?? 5,
        photoUrl,
        videoUrl,
        status: status ?? 'PENDING',
      },
    });

    return successResponse(review, 201);
  } catch (error: any) {
    console.error('Create review error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}
