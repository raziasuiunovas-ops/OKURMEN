'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatTime, formatDateTime, getStatusColor, getStatusLabel } from '@/lib/utils';

interface BookingWithDetails {
  id: string;
  date: Date;
  duration: number;
  status: string;
  notes: string | null;
  createdAt: Date;
  student: {
    id: string;
    user: {
      fullName: string;
      email: string;
      phone: string | null;
    };
  };
  group: {
    id: string;
    name: string;
  } | null;
}

interface ScheduleData {
  upcoming: BookingWithDetails[];
  today: BookingWithDetails[];
  past: BookingWithDetails[];
  summary: {
    totalUpcoming: number;
    todayCount: number;
    thisWeekCount: number;
    completedToday: number;
  };
}

export default function SchedulePage() {
  const [data, setData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past'>('today');

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      
      // Fetch all bookings categories
      const [upcomingRes, todayRes, pastRes] = await Promise.all([
        apiClient.employee.getBookings({ time: 'upcoming', limit: 50 }),
        apiClient.employee.getBookings({ time: 'today' }),
        apiClient.employee.getBookings({ time: 'past', limit: 20 }),
      ]);

      const upcoming = upcomingRes.data.data?.bookings || [];
      const today = todayRes.data.data?.bookings || [];
      const past = pastRes.data.data?.bookings || [];

      // Calculate summary
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const thisWeekCount = upcoming.filter((b: any) => new Date(b.date) <= weekFromNow).length;
      const completedToday = today.filter((b: any) => b.status === 'COMPLETED').length;

      setData({
        upcoming,
        today,
        past,
        summary: {
          totalUpcoming: upcoming.length,
          todayCount: today.length,
          thisWeekCount,
          completedToday,
        },
      });
    } catch (err: any) {
      console.error('Load schedule error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки расписания');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Расписание</h1>
        <EmptyState
          title="Ошибка загрузки"
          description={error}
          action={<Button onClick={loadSchedule}>Попробовать снова</Button>}
        />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const activeBookings = activeTab === 'today' ? data.today : activeTab === 'upcoming' ? data.upcoming : data.past;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Расписание</h1>
          <p className="text-muted-foreground mt-1">
            Управление встречами со студентами
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveTab('today')}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Сегодня</p>
              <p className="text-3xl font-bold text-primary mt-2">{data.summary.todayCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.summary.completedToday} завершено
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-success/50 transition-colors" onClick={() => setActiveTab('upcoming')}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Предстоящие</p>
              <p className="text-3xl font-bold text-success mt-2">{data.summary.totalUpcoming}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">На этой неделе</p>
              <p className="text-3xl font-bold text-foreground mt-2">{data.summary.thisWeekCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-muted-foreground/50 transition-colors" onClick={() => setActiveTab('past')}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Прошедшие</p>
              <p className="text-3xl font-bold text-muted-foreground mt-2">{data.past.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'today' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('today')}
            >
              Сегодня ({data.today.length})
            </Button>
            <Button
              variant={activeTab === 'upcoming' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('upcoming')}
            >
              Предстоящие ({data.upcoming.length})
            </Button>
            <Button
              variant={activeTab === 'past' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('past')}
            >
              Прошедшие ({data.past.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {activeBookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="Нет встреч"
              description={`Нет ${
                activeTab === 'today' ? 'встреч на сегодня' :
                activeTab === 'upcoming' ? 'предстоящих встреч' :
                'прошедших встреч'
              }`}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activeBookings.map((booking) => (
            <Card key={booking.id} hover>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Time Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {formatDate(booking.date)} в {formatTime(booking.date)}
                          </h3>
                          <Badge variant={getStatusColor(booking.status)}>
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Длительность: {booking.duration} минут
                        </p>
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="p-3 rounded-lg bg-muted/50 mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium text-foreground">{booking.student.user.fullName}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {booking.student.user.email && <span>{booking.student.user.email}</span>}
                        {booking.student.user.phone && <span>{booking.student.user.phone}</span>}
                      </div>
                      {booking.group && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Группа: {booking.group.name}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <div className="p-3 rounded-lg border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Заметки:</p>
                        <p className="text-sm text-foreground">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
