import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    service: 'OKURMEN API',
    status: 'ok',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        student: 'POST /api/auth/student/signin',
        employee: 'POST /api/auth/signin',
        '2fa_request': 'POST /api/auth/request-2fa',
        '2fa_verify': 'POST /api/auth/verify-2fa',
        me: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout',
      },
      resources: {
        courses: 'GET /api/courses',
        lessons: 'GET /api/lessons',
        employees: 'GET /api/employees',
        students: 'GET /api/student/*',
        applications: 'GET /api/applications',
        payments: 'GET /api/payments',
        reviews: 'GET /api/reviews',
        alumni: 'GET /api/alumni',
      },
    },
  });
}
