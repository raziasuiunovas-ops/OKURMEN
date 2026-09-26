import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import { updateEmployeeSchema } from '@/lib/validators';
import {
  successResponse,
  validationErrorResponse,
  notFoundResponse,
  forbiddenResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// GET /api/employees/[id] - Public
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const employee = await prisma.employeeProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!employee) {
      return notFoundResponse('Employee');
    }

    return successResponse(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    return serverErrorResponse();
  }
}

// PATCH /api/employees/[id] - Protected (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request); // Передаём request

    const { id } = await params;
    const body = await request.json();
    
    // Детальное логирование для отладки
    console.log('=== PATCH /api/employees/[id] ===');
    console.log('Employee ID:', id);
    console.log('Request body keys:', Object.keys(body));
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const validation = updateEmployeeSchema.safeParse(body);

    if (!validation.success) {
      console.error('Validation failed:', validation.error.flatten().fieldErrors);
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }
    
    console.log('Validation passed ✓');

    const {
      fullName,
      phone,
      email,
      position,
      bio,
      education,
      experience,
      photoUrl,
      sortOrder,
      joinedAt,
      isActive,
    } = validation.data;

    // Check if employee exists
    const existingEmployee = await prisma.employeeProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingEmployee) {
      return notFoundResponse('Employee');
    }

    // Update user and employee profile
    const employee = await prisma.user.update({
      where: { id: existingEmployee.userId },
      data: {
        ...(fullName && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        employeeProfile: {
          update: {
            ...(position && { position }),
            ...(bio !== undefined && { bio }),
            ...(education !== undefined && { education }),
            ...(experience !== undefined && { experience }),
            ...(photoUrl !== undefined && { photoUrl }),
            ...(sortOrder !== undefined && { sortOrder }),
            ...(joinedAt !== undefined && { joinedAt: new Date(joinedAt) }),
            ...(isActive !== undefined && { isActive }),
          },
        },
      },
      include: {
        employeeProfile: true,
      },
    });

    return successResponse(employee);
  } catch (error: any) {
    console.error('Update employee error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}

// DELETE /api/employees/[id] - Protected (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request); // Передаём request

    const { id } = await params;

    // Check if employee exists
    const existingEmployee = await prisma.employeeProfile.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return notFoundResponse('Employee');
    }

    // Delete user (cascade will delete employee profile)
    await prisma.user.delete({
      where: { id: existingEmployee.userId },
    });

    return successResponse({ message: 'Employee deleted successfully' });
  } catch (error: any) {
    console.error('Delete employee error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}
