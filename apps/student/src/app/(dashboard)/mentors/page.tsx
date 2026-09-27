'use client';

import { useEffect, useState } from 'react';
import { GraduationCap, Calendar, Star, Loader2, CheckCircle2 } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  email: string;
  specialization: string | null;
  bio: string | null;
  rating: number;
  totalBookings: number;
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingMentorId, setBookingMentorId] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      const response = await fetch('http://localhost:3002/api/student/mentors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setMentors(result.data);
      }
    } catch (error) {
      console.error('Mentors fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (mentorId: string) => {
    if (!bookingDate || !bookingTime) {
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
          mentorId,
          scheduledAt: scheduledAt.toISOString(),
        }),
      });

      const result = await response.json();
      if (result.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingMentorId(null);
          setBookingDate('');
          setBookingTime('');
          setBookingSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Наши менторы</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Забронируй индивидуальное занятие с опытным ментором
        </p>
      </div>

      {mentors.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
          <GraduationCap className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Менторы пока не добавлены
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Скоро здесь появятся наши опытные преподаватели
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {mentor.name}
                  </h3>
                  {mentor.specialization && (
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">
                      {mentor.specialization}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {mentor.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{mentor.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <div>{mentor.totalBookings} занятий проведено</div>
                  </div>
                </div>
              </div>

              {mentor.bio && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {mentor.bio}
                </p>
              )}

              {/* Booking Form */}
              {bookingMentorId === mentor.id ? (
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  {bookingSuccess ? (
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-4">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-medium">Бронирование успешно!</span>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Дата
                        </label>
                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Время
                        </label>
                        <input
                          type="time"
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setBookingMentorId(null)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={() => handleBooking(mentor.id)}
                          disabled={booking}
                          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                        >
                          {booking ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Бронирование...
                            </>
                          ) : (
                            'Забронировать'
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setBookingMentorId(mentor.id)}
                  className="w-full px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Забронировать занятие
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
