'use client';

import { useAuth } from '@/contexts/AuthContext';
import { MentorDashboard } from '@/components/dashboard/MentorDashboard';
import { TeacherDashboard } from '@/components/dashboard/TeacherDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

export default function EmployeeDashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  // Render dashboard based on employee position
  switch (user.position) {
    case 'MENTOR':
      return <MentorDashboard />;
    
    case 'TEACHER':
      return <TeacherDashboard />;
    
    case 'MANAGER':
      return <ManagerDashboard />;
    
    case 'SALES':
    case 'MARKETING':
    case 'DEVELOPER':
    case 'ADMIN_STAFF':
    case 'FOUNDER':
    case 'OTHER':
      // Generic dashboard for other roles
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Добро пожаловать!</h1>
            <p className="text-muted-foreground mt-1">Employee Portal - OKURMEN IT</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Добро пожаловать в Employee Portal
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Ваш рабочий профиль настроен. Используйте навигацию слева для доступа к функциям системы.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    
    default:
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Добро пожаловать!</h1>
            <p className="text-muted-foreground mt-1">Employee Portal - OKURMEN IT</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Используйте навигацию для доступа к доступным функциям
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
  }
}
