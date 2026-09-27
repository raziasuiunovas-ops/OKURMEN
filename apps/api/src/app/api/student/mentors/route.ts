import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAuth } from '@/lib/auth/utils';
import {
  successResponse,
  serverErrorResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/student/mentors - Protected
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return forbiddenResponse('Student profile not found');
    }

    // Получаем активных менторов/учителей
    const mentors = await prisma.employeeProfile.findMany({
      where: {
        isActive: true,
        position: { in: ['TEACHER', 'MENTOR'] },
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        courseTeachers: {
          include: {
            course: {
              select: {
                id: true,
                translations: {
                  where: { languageCode: 'RU' },
                  select: { title: true },
                },
              },
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const mentorsData = mentors.map(mentor => ({
      id: mentor.id,
      name: mentor.user.fullName,
      position: mentor.position,
      bio: mentor.bio,
      education: mentor.education,
      experience: mentor.experience,
      photoUrl: mentor.photoUrl,
      courses: mentor.courseTeachers.map(ct => ({
        id: ct.course.id,
        title: ct.course.translations[0]?.title || 'Untitled',
      })),
    }));

    return successResponse(mentorsData);
  } catch (error: any) {
    console.error('Get mentors error:', error);
    if (error.message === 'Unauthorized') {
      return forbiddenResponse();
    }
    return serverErrorResponse();
  }
}
