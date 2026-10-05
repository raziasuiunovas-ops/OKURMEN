import { NextRequest } from 'next/server';
import { prisma } from '@okurmen/database';
import { requireAdmin } from '@/lib/auth/utils';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response';
import { z } from 'zod';

// Minimal structural type for group.students elements.
// Only fields actually used in the .map() callback are listed.
type StudentWithUser = { id: string; user: { fullName: string } };

// Local enum to avoid depending on generated Prisma types export
const EnrollmentStatus = {
  ACTIVE:    'ACTIVE',
  COMPLETED: 'COMPLETED',
  PAUSED:    'PAUSED',
  CANCELLED: 'CANCELLED',
} as const;

// Схема для открытия доступа к курсу для одного студента
const grantCourseAccessSchema = z.object({
  studentId: z.string().min(1, 'Student ID обязателен'),
  courseId: z.string().min(1, 'Course ID обязателен'),
  mentorId: z.string().optional(),
  startedAt: z.string().datetime().optional(),
});

// Схема для открытия доступа к курсу для всей группы
const grantGroupCourseAccessSchema = z.object({
  groupId: z.string().min(1, 'Group ID обязателен'),
  courseId: z.string().min(1, 'Course ID обязателен'),
  mentorId: z.string().optional(),
  startedAt: z.string().datetime().optional(),
});

// POST /api/admin/course-access - Grant course access to student or group
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const { type } = body; // 'student' или 'group'

    if (type === 'student') {
      // Открыть доступ одному студенту
      const validation = grantCourseAccessSchema.safeParse(body);

      if (!validation.success) {
        return validationErrorResponse(validation.error.flatten().fieldErrors);
      }

      const { studentId, courseId, mentorId, startedAt } = validation.data;

      // Проверяем существует ли студент
      const student = await prisma.studentProfile.findUnique({
        where: { id: studentId },
        include: { user: true },
      });

      if (!student) {
        return errorResponse('Студент не найден', 404);
      }

      // Проверяем существует ли курс
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          translations: {
            where: { languageCode: 'RU' },
            take: 1,
          },
        },
      });

      if (!course) {
        return errorResponse('Курс не найден', 404);
      }

      // Проверяем есть ли уже доступ
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
          studentId,
          courseId,
        },
      });

      if (existingEnrollment) {
        return errorResponse(
          `У студента "${student.user.fullName}" уже есть доступ к курсу "${course.translations[0]?.title}"`,
          400
        );
      }

      // Создаём enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId,
          courseId,
          mentorId,
          status: EnrollmentStatus.ACTIVE,
          startedAt: startedAt ? new Date(startedAt) : new Date(),
        },
        include: {
          student: {
            include: { user: true },
          },
          course: {
            include: {
              translations: {
                where: { languageCode: 'RU' },
                take: 1,
              },
            },
          },
        },
      });

      return successResponse(
        {
          enrollment,
          message: `✅ Доступ к курсу "${enrollment.course.translations[0]?.title}" открыт для студента "${enrollment.student.user.fullName}"`,
        },
        201
      );
    } else if (type === 'group') {
      // Открыть доступ всей группе
      const validation = grantGroupCourseAccessSchema.safeParse(body);

      if (!validation.success) {
        return validationErrorResponse(validation.error.flatten().fieldErrors);
      }

      const { groupId, courseId, mentorId, startedAt } = validation.data;

      // Проверяем существует ли группа
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          students: {
            include: { user: true },
          },
        },
      });

      if (!group) {
        return errorResponse('Группа не найдена', 404);
      }

      if (group.students.length === 0) {
        return errorResponse('В группе нет студентов', 400);
      }

      // Проверяем существует ли курс
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          translations: {
            where: { languageCode: 'RU' },
            take: 1,
          },
        },
      });

      if (!course) {
        return errorResponse('Курс не найден', 404);
      }

      // Создаём enrollments для всех студентов в группе
      const enrollments = await Promise.all(
        group.students.map(async (student: StudentWithUser) => {
          // Проверяем есть ли уже доступ
          const existing = await prisma.enrollment.findFirst({
            where: {
              studentId: student.id,
              courseId,
            },
          });

          if (existing) {
            return null; // Пропускаем если уже есть доступ
          }

          return prisma.enrollment.create({
            data: {
              studentId: student.id,
              courseId,
              mentorId,
              status: EnrollmentStatus.ACTIVE,
              startedAt: startedAt ? new Date(startedAt) : new Date(),
            },
          });
        })
      );

      const createdCount = enrollments.filter((e) => e !== null).length;
      const skippedCount = enrollments.length - createdCount;

      return successResponse(
        {
          createdCount,
          skippedCount,
          totalStudents: group.students.length,
          message: `✅ Доступ к курсу "${course.translations[0]?.title}" открыт для ${createdCount} студентов группы "${group.name}"${
            skippedCount > 0 ? ` (пропущено ${skippedCount} - уже имеют доступ)` : ''
          }`,
        },
        201
      );
    } else {
      return validationErrorResponse({
        type: ['Тип должен быть "student" или "group"'],
      });
    }
  } catch (error: any) {
    console.error('Grant course access error:', error);

    if (error.message?.includes('Forbidden')) {
      return errorResponse('Доступ запрещён', 403);
    }

    return serverErrorResponse();
  }
}

// GET /api/admin/course-access - Get course access information
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const groupId = searchParams.get('groupId');

    if (studentId) {
      // Получить доступы студента
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId },
        include: {
          course: {
            include: {
              translations: {
                where: { languageCode: 'RU' },
                take: 1,
              },
            },
          },
          mentor: {
            include: { user: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return successResponse({ enrollments });
    } else if (groupId) {
      // Получить доступы группы (агрегированные по курсам)
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          students: {
            include: {
              enrollments: {
                include: {
                  course: {
                    include: {
                      translations: {
                        where: { languageCode: 'RU' },
                        take: 1,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!group) {
        return errorResponse('Группа не найдена', 404);
      }

      // Агрегируем курсы
      const coursesMap = new Map();
      group.students.forEach((student) => {
        student.enrollments.forEach((enrollment) => {
          const courseId = enrollment.courseId;
          if (!coursesMap.has(courseId)) {
            coursesMap.set(courseId, {
              course: enrollment.course,
              studentCount: 0,
              totalStudents: group.students.length,
            });
          }
          coursesMap.get(courseId).studentCount++;
        });
      });

      const courses = Array.from(coursesMap.values());

      return successResponse({ group, courses });
    } else {
      return validationErrorResponse({
        query: ['Требуется studentId или groupId'],
      });
    }
  } catch (error: any) {
    console.error('Get course access error:', error);

    if (error.message?.includes('Forbidden')) {
      return errorResponse('Доступ запрещён', 403);
    }

    return serverErrorResponse();
  }
}
