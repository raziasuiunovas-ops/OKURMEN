import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// DELETE /api/groups/[id]/students/[studentId] - Remove student from group
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; studentId: string }> }
) {
  try {
    await requireAdmin(request);

    const { id: groupId, studentId } = await params;

    // Check if student exists
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return notFoundResponse('Student');
    }

    // Remove student from group (set groupId to null)
    await prisma.studentProfile.update({
      where: { id: studentId },
      data: { groupId: null },
    });

    return successResponse({ message: 'Ученик удалён из группы' });
  } catch (error: any) {
    console.error('Remove student from group error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse('Доступ запрещён', 403);
    }
    
    return serverErrorResponse();
  }
}

// PATCH /api/groups/[id]/students/[studentId] - Update student in group
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; studentId: string }> }
) {
  try {
    await requireAdmin(request);

    const { id: groupId, studentId } = await params;
    const body = await request.json();

    // Check if student exists
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return notFoundResponse('Student');
    }

    // Update student
    const updatedStudent = await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.groupId !== undefined && { groupId: body.groupId }),
      },
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
    });

    return successResponse(updatedStudent);
  } catch (error: any) {
    console.error('Update student in group error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse('Доступ запрещён', 403);
    }
    
    return serverErrorResponse();
  }
}
