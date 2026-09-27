'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  GraduationCap,
  Loader2,
  Plus
} from 'lucide-react';

interface Booking {
  id: string;
  scheduledAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  mentorName: string;
  createdAt: string;
}

interface GroupMentor {
  id: string;
  fullName: string;
  avatarUrl: string | null;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<GroupMentor | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchGroupMentor();
  }, [filter]);

  const fetchGroupMentor = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      const response = await fetch('http://localhost:3002/api/student/group', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success && result.data.mentor) {
        setMentor(result.data.mentor);
      }
    } catch (error) {
      console.error('Mentor fetch error:', error);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      const response = await fetch(
        `http://localhost:3002/api/student/bookings?filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setBookings(result.data);
      }
    } catch (error) {
      console.error('Bookings fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!bookingDate || !bookingTime || !mentor) {
      alert('Выберите дату и время');
      return;
    }

    setBooking(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      const scheduledAt = new Date(`${bookingDate}T${bookingTime}`);

      const response = await fetch('http://localhost:3002/api/student/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mentorId: mentor.id,
          scheduledAt: scheduledAt.toISOString(),
        }),
      });

      const result = await response.json();
      if (result.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setShowBookingForm(false);
          setBookingDate('');
          setBookingTime('');
          setBookingSuccess(false);
          fetchBookings();
        }, 2000);
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setBooking(false);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    const labels = {
      PENDING: 'Ожидает',
      CONFIRMED: 'Подтверждено',
      COMPLETED: 'Завершено',
      CANCELLED: 'Отменено',
    };

    const icons = {
      PENDING: AlertCircle,
      CONFIRMED: CheckCircle2,
      COMPLETED: CheckCircle2,
      CANCELLED: XCircle,
    };

    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Мои бронирования
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Управляй своими занятиями с личным ментором
          </p>
        </div>
        {mentor && (
          <button
            onClick={() => setShowBookingForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Новое занятие
          </button>
        )}
      </div>

      {/* Mentor Info Card */}
      {mentor && (
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
              {mentor.avatarUrl ? (
                <img
                  src={mentor.avatarUrl}
                  alt={mentor.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-white/80" />
              )}
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Твой личный ментор</p>
              <h3 className="text-xl font-bold">{mentor.fullName}</h3>
            </div>
          </div>
        </div>
      )}

      {/* No Mentor Warning */}
      {!mentor && !loading && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-1">
                У тебя нет назначенного ментора
              </h3>
              <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                Ты пока не добавлен в учебную группу. Обратись к администратору для назначения ментора.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'upcoming'
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-500'
          }`}
        >
          Предстоящие
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'past'
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-500'
          }`}
        >
          История
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
          <Calendar className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {filter === 'upcoming' ? 'Нет предстоящих занятий' : 'История пуста'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filter === 'upcoming'
              ? 'Забронируй занятие с твоим ментором'
              : 'У тебя пока не было занятий с ментором'}
          </p>
          {filter === 'upcoming' && mentor && (
            <button
              onClick={() => setShowBookingForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Забронировать занятие
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const scheduledDate = new Date(booking.scheduledAt);
            const isPast = scheduledDate < new Date();

            return (
              <div
                key={booking.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {booking.mentorName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Ментор</p>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>{scheduledDate.toLocaleDateString('ru-RU', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>{scheduledDate.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</span>
                  </div>
                </div>

                {booking.status === 'PENDING' && !isPast && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ожидает подтверждения от ментора
                    </p>
                  </div>
                )}

                {booking.status === 'CONFIRMED' && !isPast && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Занятие подтверждено</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && mentor && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowBookingForm(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Забронировать занятие
            </h3>

            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ментор</p>
              <p className="font-bold text-gray-900 dark:text-white">{mentor.fullName}</p>
            </div>

            {bookingSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Бронирование успешно!
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Ментор получит уведомление о твоем запросе
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Дата
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Время
                  </label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={booking || !bookingDate || !bookingTime}
                    className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {booking ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Бронирование...
                      </>
                    ) : (
                      'Забронировать'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
