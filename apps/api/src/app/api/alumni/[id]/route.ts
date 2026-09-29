import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import { updateAlumniSchema } from '@/lib/validators';
import {
  successResponse,
  validationErrorResponse,
  notFoundResponse,
  forbiddenResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// PATCH /api/alumni/[id] - Protected (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const body = await request.json();
    const validation = updateAlumniSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const existingAlumni = await prisma.alumni.findUnique({
      where: { id },
    });

    if (!existingAlumni) {
      return notFoundResponse('Alumni');
    }

    const alumni = await prisma.alumni.update({
      where: { id },
      data: validation.data,
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

    return successResponse(alumni);
  } catch (error: any) {
    console.error('Update alumni error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}

// DELETE /api/alumni/[id] - Protected (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;

    const existingAlumni = await prisma.alumni.findUnique({
      where: { id },
    });

    if (!existingAlumni) {
      return notFoundResponse('Alumni');
    }

    await prisma.alumni.delete({
      where: { id },
    });

    return successResponse({ message: 'Alumni deleted successfully' });
  } catch (error: any) {
    console.error('Delete alumni error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}
