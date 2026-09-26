import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'OKURMEN API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      auth: [
        'POST /api/auth/signin',
        'GET /api/auth/me',
        'POST /api/auth/logout',
      ],
      resources: [
        'GET /api/courses',
        'GET /api/employees',
        'GET /api/applications',
        'GET /api/payments',
        'GET /api/reviews',
        'GET /api/alumni',
      ],
    },
  });
}
