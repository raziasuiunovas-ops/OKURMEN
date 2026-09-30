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
    const body = await request.json();
    const validation = createReviewSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const { authorName, reviewType, text, rating, photoUrl, videoUrl, status, courseId, userId } = validation.data;

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

    return successResponse(review, 201);
  } catch (error: any) {
    console.error('Create review error:', error);
    return serverErrorResponse();
  }
}