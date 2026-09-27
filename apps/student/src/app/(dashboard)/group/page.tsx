'use client';

import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  Users, 
  Trophy, 
  BookOpen, 
  Calendar,
  Flame,
  User,
  Loader2,
  MessageCircle
} from 'lucide-react';

interface Student {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  totalTokens: number;
  completedLessons: number;
  rank: number;
}

interface Mentor {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  specialization: string | null;
  bio: string | null;
}

interface GroupData {
  id: string;
  name: string;
  whatsappUrl: string | null;
  mentor: Mentor;
  students: Student[];
  currentStudent: {
    id: string;
    rank: number;
  };
}

export default function GroupPage() {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchGroupData();
  }, []);

  const fetchGroupData = async () => {
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
      if (result.success) {
        setGroupData(result.data);
      }
    } catch (error) {
      console.error('Group fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
        <Users className="w-20 h-20 mx-auto mb-4 text-gray-400" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Группа не назначена
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Вы пока не добавлены ни в одну учебную группу. Обратитесь к администратору.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Моя группа</h1>
        <p className="text-gray-600 dark:text-gray-400">{groupData.name}</p>
      </div>

      {/* Mentor Card */}
      <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Личный ментор группы</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Mentor Avatar */}
          <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
            {groupData.mentor.avatarUrl ? (
              <img
                src={groupData.mentor.avatarUrl}
                alt={groupData.mentor.fullName}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <User className="w-16 h-16 text-white/80" />
            )}
          </div>

          {/* Mentor Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-1">{groupData.mentor.fullName}</h3>
              {groupData.mentor.specialization && (
                <p className="text-white/90 text-lg">{groupData.mentor.specialization}</p>
              )}
            </div>

            {groupData.mentor.bio && (
              <p className="text-white/90 leading-relaxed">{groupData.mentor.bio}</p>
            )}

            <div className="flex flex-wrap gap-4">
              {groupData.mentor.phone && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Phone className="w-5 h-5" />
                  <span>{groupData.mentor.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Mail className="w-5 h-5" />
                <span>{groupData.mentor.email}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  // Navigate to bookings with mentor pre-selected
                  window.location.href = '/bookings';
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl hover:bg-white/90 transition-colors font-bold"
              >
                <Calendar className="w-5 h-5" />
                Забронировать занятие
              </button>

              {groupData.whatsappUrl && (
                <a
                  href={groupData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-bold"
                  title="Группа в WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp группа
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Студенты группы ({groupData.students.length})
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {groupData.students.map((student) => {
            const isCurrentUser = student.id === groupData.currentStudent.id;

            return (
              <div
                key={student.id}
                className={`p-4 transition-colors cursor-pointer ${
                  isCurrentUser
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center font-bold text-white text-lg">
                    #{student.rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {student.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={student.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">
                        {student.fullName}
                      </h3>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-full">
                          Это ты
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {student.email}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {student.totalTokens}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">токенов</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {student.completedLessons}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">уроков</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="md:hidden mt-3 flex gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {student.totalTokens} токенов
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-green-500" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {student.completedLessons} уроков
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                {selectedStudent.avatarUrl ? (
                  <img
                    src={selectedStudent.avatarUrl}
                    alt={selectedStudent.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedStudent.fullName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedStudent.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Место в рейтинге</span>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  #{selectedStudent.rank}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Всего токенов</span>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedStudent.totalTokens}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-green-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Уроков пройдено</span>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedStudent.completedLessons}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full mt-6 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
