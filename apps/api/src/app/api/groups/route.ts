import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import { createGroupSchema } from '@/lib/validators';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// GET /api/groups - Get all groups with students
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const groups = await prisma.group.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
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
                startedAt: true,
                completedAt: true,
                status: true,
              },
            },
          },
        },
        _count: {
          select: { students: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(groups);
  } catch (error) {
    console.error('Get groups error:', error);
    return serverErrorResponse();
  }
}

// POST /api/groups - Create new group (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const validation = createGroupSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const { name, description, courseId, startDate, endDate, isActive } = validation.data;

    // Check if group name already exists
    const existingGroup = await prisma.group.findUnique({
      where: { name },
    });

    if (existingGroup) {
      return errorResponse('Группа с таким названием уже существует', 409);
    }

    const group = await prisma.group.create({
      data: {
        name,
        description,
        courseId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive: isActive ?? true,
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

    return successResponse(group, 201);
  } catch (error: any) {
    console.error('Create group error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse('Доступ запрещён', 403);
    }
    
    return serverErrorResponse();
  }
}
