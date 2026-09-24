import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import { createAlumniSchema } from '@/lib/validators';
import {
  successResponse,
  validationErrorResponse,
  forbiddenResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// GET /api/alumni - Public
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';

    const alumni = await prisma.alumni.findMany({
      where: featured ? { isFeatured: true } : undefined,
      include: {
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

    return successResponse(alumni);
  } catch (error) {
    console.error('Get alumni error:', error);
    return serverErrorResponse();
  }
}

// POST /api/alumni - Protected (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validation = createAlumniSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const { name, company, position, story, photoUrl, isFeatured, studentId } = validation.data;

    const alumni = await prisma.alumni.create({
      data: {
        name,
        company,
        position,
        story,
        photoUrl,
        isFeatured: isFeatured ?? false,
        ...(studentId && { studentId }),
      },
      include: {
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
    });

    return successResponse(alumni, 201);
  } catch (error: any) {
    console.error('Create alumni error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}
