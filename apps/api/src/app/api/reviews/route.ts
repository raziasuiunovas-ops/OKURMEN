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

// GET /api/reviews - Public (returns only published reviews with course and user data)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    const reviews = await prisma.review.findMany({
      where: includeUnpublished ? undefined : { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
        course: {
          select: {
            id: true,
            slug: true,
            translations: {
              select: {
                languageCode: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return successResponse(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    return serverErrorResponse();
  }
}

// POST /api/reviews - Public (anyone can submit, auto PENDING status)
export async function POST(request: NextRequest) {
  try {
    console.log('[POST /api/reviews] Starting...');
    
    const body = await request.json();
    console.log('[POST /api/reviews] Body received:', body);
    
    const validation = createReviewSchema.safeParse(body);
    console.log('[POST /api/reviews] Validation result:', validation.success);

    if (!validation.success) {
      console.error('[POST /api/reviews] Validation failed:', validation.error.flatten().fieldErrors);
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const { authorName, reviewType, text, rating, photoUrl, videoUrl, status, courseId, userId } = validation.data;
    
    console.log('[POST /api/reviews] Creating review with data:', {
      authorName,
      reviewType,
      textLength: text.length,
      rating,
      courseId,
      userId,
      status,
    });

    const review = await prisma.review.create({
      data: {
        authorName,
        reviewType,
        text,
        rating: rating ?? 5,
        photoUrl,
        videoUrl,
        courseId,
        userId,
        // Always set to PENDING for public submissions, only admin can set PUBLISHED
        status: status === 'PUBLISHED' ? 'PENDING' : (status ?? 'PENDING'),
      },
    });

    console.log('[POST /api/reviews] Review created successfully:', review.id);
    return successResponse(review, 201);
  } catch (error: any) {
    console.error('[POST /api/reviews] Error:', error);
    console.error('[POST /api/reviews] Error message:', error.message);
    console.error('[POST /api/reviews] Error stack:', error.stack);
    return serverErrorResponse();
  }
}