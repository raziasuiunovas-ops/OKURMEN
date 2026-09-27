import { NextRequest } from 'next/server';
import { prisma, UserRole, StudentStatus } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api-response';
import { z } from 'zod';

// Валидатор для добавления ученика в группу
const addStudentSchema = z.object({
  fullName: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  age: z.number().int().min(5).max(100).optional(),
  studyDuration: z.string().optional(),
  courseId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'DROPPED']).default('ACTIVE'),
});

// POST /api/groups/[id]/students - Add student to group
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id: groupId } = await params;
    const body = await request.json();
    const validation = addStudentSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const { fullName, username, email, phone, age, studyDuration, courseId, startDate, status } = validation.data;

    // Check if group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return notFoundResponse('Group');
    }

    // Check if email already exists
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        // If user exists, check if they already have a student profile
        const existingStudent = await prisma.studentProfile.findUnique({
          where: { userId: existingUser.id },
        });

        if (existingStudent) {
          // Update existing student's group
          const updatedStudent = await prisma.studentProfile.update({
            where: { id: existingStudent.id },
            data: { groupId },
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          });

          return successResponse(updatedStudent);
        }
      }
    }

    // Create new user with student profile
    const user = await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        phone,
        age,
        studyDuration,
        role: UserRole.CLIENT,
        isActive: true,
        studentProfile: {
          create: {
            groupId,
            status: status as StudentStatus,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    // If courseId and startDate provided, create enrollment
    if (courseId && user.studentProfile) {
      await prisma.enrollment.create({
        data: {
          studentId: user.studentProfile.id,
          courseId,
          startDate: startDate ? new Date(startDate) : new Date(),
          status: 'ACTIVE',
        },
      });
    }

    return successResponse(user.studentProfile, 201);
  } catch (error: any) {
    console.error('Add student to group error:', error);
    
    if (error.message?.includes('Forbidden')) {
      return errorResponse('Доступ запрещён', 403);
    }
    
    return serverErrorResponse();
  }
}

// DELETE /api/groups/[id]/students/[studentId] handled in separate file
