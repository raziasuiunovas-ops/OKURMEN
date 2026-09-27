import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireEmployee, getEmployeeProfile } from '@/lib/auth/employee-utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';

// GET /api/employee/profile - Get current employee profile
export async function GET(request: NextRequest) {
  try {
    const session = await requireEmployee(request);

    const employee = await getEmployeeProfile(session.user.id);

    if (!employee) {
      return errorResponse('Employee profile not found', 404);
    }

    return successResponse(employee);
  } catch (error: any) {
    console.error('Get employee profile error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    
    return serverErrorResponse();
  }
}

// PATCH /api/employee/profile - Update employee profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireEmployee(request);
    const body = await request.json();

    const { bio, education, experience, photoUrl } = body;

    const employee = await prisma.employeeProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return errorResponse('Employee profile not found', 404);
    }

    const updated = await prisma.employeeProfile.update({
      where: { id: employee.id },
      data: {
        ...(bio !== undefined && { bio }),
        ...(education !== undefined && { education }),
        ...(experience !== undefined && { experience }),
        ...(photoUrl !== undefined && { photoUrl }),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            preferredLanguage: true,
          },
        },
      },
    });

    return successResponse(updated);
  } catch (error: any) {
    console.error('Update employee profile error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    
    return serverErrorResponse();
  }
}
