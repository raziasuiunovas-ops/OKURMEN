'use client';

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Users,
  Search,
  CheckCircle2,
  Lock,
  Shield,
  AlertCircle,
  Loader2,
  Filter,
  Star,
  Clock,
} from 'lucide-react';

interface Student {
  id: string;
  userId: string;
  user: {
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
}

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  price: number;
  coverGradient: { from: string; to: string } | null;
  coverImage: string | null;
  icon: string | null;
  rating: number;
  enrolledStudents: number;
  totalHours: number;
}

interface StudentCourseAccess {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string | null;
  courses: Array<{
    courseId: string;
    hasAccess: boolean;
  }>;
}

export default function CourseAccessPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [accessData, setAccessData] = useState<StudentCourseAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      // Проверяем разрешение
      const permissionRes = await fetch('http://localhost:3002/api/mentor/permissions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const permissionData = await permissionRes.json();
      
      if (permissionData.success) {
        const canManage = permissionData.data.some(
          (p: any) => p.permissionType === 'MANAGE_STUDENT_COURSES' && p.isActive
        );
        setHasPermission(canManage);
      }

      // Получаем студентов группы
      const studentsRes = await fetch('http://localhost:3002/api/mentor/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentsData = await studentsRes.json();

      // Получаем все курсы
      const coursesRes = await fetch('http://localhost:3002/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const coursesData = await coursesRes.json();

      if (studentsData.success && coursesData.success) {
        setStudents(studentsData.data);
        setCourses(coursesData.data);

        // Загружаем информацию о доступах для каждого студента
        const accessPromises = studentsData.data.map(async (student: Student) => {
          const res = await fetch(
            `http://localhost:3002/api/mentor/students/${student.id}/courses`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          
          return {
            studentId: student.id,
            studentName: student.user.fullName,
            studentEmail: student.user.email,
            studentAvatar: student.user.avatarUrl,
            courses: data.success
              ? data.data.map((c: any) => ({
                  courseId: c.id,
                  hasAccess: c.hasAccess,
                }))
              : [],
          };
        });

        const accessResults = await Promise.all(accessPromises);
        setAccessData(accessResults);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccess = async (studentId: string, courseId: string, currentAccess: boolean) => {
    if (!hasPermission) return;

    const key = `${studentId}-${courseId}`;
    setToggling(key);

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      const response = await fetch(
        `http://localhost:3002/api/mentor/students/${studentId}/courses/${courseId}/toggle`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: currentAccess ? 'revoke' : 'grant',
          }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        // Обновляем локальное состояние
        setAccessData(prevData =>
          prevData.map(student =>
            student.studentId === studentId
              ? {
                  ...student,
                  courses: student.courses.map(course =>
                    course.courseId === courseId
                      ? { ...course, hasAccess: !currentAccess }
                      : course
                  ),
                }
              : student
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle access:', error);
    } finally {
      setToggling(null);
    }
  };

  const getStudentAccess = (studentId: string, courseId: string): boolean => {
    const student = accessData.find(s => s.studentId === studentId);
    const course = student?.courses.find(c => c.courseId === courseId);
    return course?.hasAccess || false;
  };

  const filteredStudents = students.filter(student =>
    student.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedCourses = selectedCourse
    ? courses.filter(c => c.id === selectedCourse)
    : courses;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary-600" />
          Управление доступом к курсам
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Открывайте и закрывайте доступ студентов к курсам
        </p>
      </div>

      {/* Permission Warning */}
      {!hasPermission && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Требуется разрешение</p>
              <p>
                У вас нет разрешения на управление курсами студентов. 
                Запросите разрешение в разделе{' '}
                <a href="/employee/permissions" className="underline font-medium">
                  Разрешения
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Студентов</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Курсов</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Открытых доступов</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {accessData.reduce(
                  (sum, s) => sum + s.courses.filter(c => c.hasAccess).length,
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск студентов..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
          />
        </div>

        {/* Course Filter */}
        <div className="relative md:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={selectedCourse || ''}
            onChange={(e) => setSelectedCourse(e.target.value || null)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white appearance-none"
          >
            <option value="">Все курсы</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                  Студент
                </th>
                {displayedCourses.map(course => (
                  <th
                    key={course.id}
                    className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white min-w-[200px]"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="line-clamp-2">{course.title}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 font-normal">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {course.rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{course.price.toLocaleString()} сом</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                        {student.user.avatarUrl ? (
                          <img
                            src={student.user.avatarUrl}
                            alt={student.user.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          student.user.fullName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {student.user.fullName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {student.user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  {displayedCourses.map(course => {
                    const hasAccess = getStudentAccess(student.id, course.id);
                    const isToggling = toggling === `${student.id}-${course.id}`;

                    return (
                      <td key={course.id} className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleAccess(student.id, course.id, hasAccess)}
                          disabled={!hasPermission || isToggling}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            hasAccess
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {isToggling ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : hasAccess ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Открыт
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              Закрыт
                            </>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">Студенты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
