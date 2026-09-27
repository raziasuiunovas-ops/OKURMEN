import { NextRequest } from 'next/server';
import { requireAuth } from './utils';
import { prisma, UserRole, EmployeePosition } from '@okurmen/database';

export async function requireEmployee(request?: NextRequest) {
  const session = await requireAuth(request);
  
  if (session.user.role !== UserRole.EMPLOYEE && session.user.role !== UserRole.ADMIN) {
    throw new Error('Forbidden: Employee access required');
  }
  
  return session;
}

export async function getEmployeeProfile(userId: string) {
  const employee = await prisma.employeeProfile.findUnique({
    where: { userId },
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
      mentoredGroup: {
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
            },
          },
          _count: {
            select: { students: true },
          },
        },
      },
    },
  });

  return employee;
}

export async function requireMentor(request?: NextRequest) {
  const session = await requireEmployee(request);
  
  const employee = await prisma.employeeProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!employee || employee.position !== EmployeePosition.MENTOR) {
    throw new Error('Forbidden: Mentor access required');
  }

  return { session, employee };
}

export async function requireTeacher(request?: NextRequest) {
  const session = await requireEmployee(request);
  
  const employee = await prisma.employeeProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!employee || employee.position !== EmployeePosition.TEACHER) {
    throw new Error('Forbidden: Teacher access required');
  }

  return { session, employee };
}

export async function requireManager(request?: NextRequest) {
  const session = await requireEmployee(request);
  
  const employee = await prisma.employeeProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!employee || employee.position !== EmployeePosition.MANAGER) {
    throw new Error('Forbidden: Manager access required');
  }

  return { session, employee };
}

export async function checkGroupOwnership(employeeId: string, groupId: string): Promise<boolean> {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  return group?.mentorId === employeeId;
}

export async function checkStudentAccess(employeeId: string, studentId: string): Promise<boolean> {
  // Check if employee is mentor of student's group
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      group: true,
    },
  });

  if (!student || !student.group) {
    return false;
  }

  return student.group.mentorId === employeeId;
}

export async function checkCourseTeaching(employeeId: string, courseId: string): Promise<boolean> {
  const courseTeacher = await prisma.courseTeacher.findUnique({
    where: {
      courseId_employeeId: {
        courseId,
        employeeId,
      },
    },
  });

  return !!courseTeacher;
}

export async function checkBookingOwnership(employeeId: string, bookingId: string): Promise<boolean> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  return booking?.mentorId === employeeId;
}
