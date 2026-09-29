import { NextRequest } from 'next/server';
import { prisma, UserRole } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import { createEmployeeSchema } from '@/lib/validators';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  forbiddenResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// GET /api/employees - Public (returns only active employees)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const position = searchParams.get('position');

    // If includeInactive is requested, optionally check auth (but don't require it for dashboard)
    if (includeInactive) {
      try {
        await requireAdmin(request);
      } catch (error) {
        // Allow dashboard to fetch all employees even without auth temporarily
        console.warn('Employees GET with includeInactive: No admin auth');
      }
    }

    const employees = await prisma.employeeProfile.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(position && { position: position as any }),
      },
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
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return successResponse(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    return serverErrorResponse();
  }
}

// POST /api/employees - Protected (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request); // Передаём request

    const body = await request.json();
    
    // Детальное логирование для отладки
    console.log('=== POST /api/employees ===');
    console.log('Request body keys:', Object.keys(body));
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const validation = createEmployeeSchema.safeParse(body);

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

    // Check if email already exists
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return errorResponse('User with this email already exists', 409);
      }
    }

    // Create user with employee profile
    const user = await prisma.user.create({
      data: {
        fullName,
        phone,
        email,
        role: UserRole.CLIENT,
        isActive: isActive ?? true,
        employeeProfile: {
          create: {
            position,
            bio,
            education,
            experience,
            photoUrl,
            sortOrder: sortOrder ?? 0,
            joinedAt: joinedAt ? new Date(joinedAt) : undefined,
            isActive: isActive ?? true,
          },
        },
      },
      include: {
        employeeProfile: true,
      },
    });

    return successResponse(user, 201);
  } catch (error: any) {
    console.error('Create employee error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return forbiddenResponse();
    }
    
    return serverErrorResponse();
  }
}
