import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import { updateGroupSchema } from '@/lib/validators';
import {
  successResponse,
  validationErrorResponse,
  notFoundResponse,
  serverErrorResponse,
  errorResponse,
} from '@/lib/api-response';

// GET /api/groups/[id] - Get single group with students
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
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
        students: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
            enrollments: {
              select: {
                id: true,
                courseId: true,
                startDate: true,
                endDate: true,
                status: true,
              },
            },
          },
        },
        _count: {
          select: { students: true },
        },
      },
    });

    if (!group) {
      return notFoundResponse('Group');
    }

    return successResponse(group);
  } catch (error) {
    console.error('Get group error:', error);
    return serverErrorResponse();
  }
}

// PATCH /api/groups/[id] - Update group (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const body = await request.json();
    const validation = updateGroupSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const { name, description, courseId, mentorId, whatsappUrl, startDate, endDate, isActive } = validation.data;

    // Check if group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id },
    });

    if (!existingGroup) {
      return notFoundResponse('Group');
    }

    // If name is being changed, check it's not taken
    if (name && name !== existingGroup.name) {
      const nameExists = await prisma.group.findUnique({
        where: { name },
      });

      if (nameExists) {
        return errorResponse('Группа с таким названием уже существует', 409);
      }
    }

    const group = await prisma.group.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(courseId !== undefined && { courseId }),
        ...(mentorId !== undefined && { mentorId }),
        ...(whatsappUrl !== undefined && { whatsappUrl: whatsappUrl || null }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
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
        _count: {
          select: { students: true },
        },
      },
    });

    return successResponse(group);
  } catch (error: any) {
    console.error('Update group error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse('Доступ запрещён', 403);
    }
    
    return serverErrorResponse();
  }
}

// DELETE /api/groups/[id] - Delete group (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;

    // Check if group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id },
      include: {
        _count: {
          select: { students: true },
        },
      },
    });

    if (!existingGroup) {
      return notFoundResponse('Group');
    }

    // Check if group has students
    if (existingGroup._count.students > 0) {
      return errorResponse(
        `Невозможно удалить группу с учениками. Сначала переместите ${existingGroup._count.students} учеников в другую группу.`,
        400
      );
    }

    await prisma.group.delete({
      where: { id },
    });

    return successResponse({ message: 'Группа успешно удалена' });
  } catch (error: any) {
    console.error('Delete group error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse('Доступ запрещён', 403);
    }
    
    return serverErrorResponse();
  }
}
