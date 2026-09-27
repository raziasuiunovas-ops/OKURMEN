import { EmployeePosition } from '@okurmen/database';

export interface User {
  id: string;
  name: string;
  email: string | null;
  role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
}

export interface AuthUser extends User {
  position?: EmployeePosition;
  photoUrl?: string | null;
}

export interface EmployeeProfile {
  id: string;
  userId: string;
  position: EmployeePosition;
  bio?: string | null;
  education?: string | null;
  experience?: string | null;
  photoUrl?: string | null;
  sortOrder: number;
  joinedAt?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    fullName: string;
    phone?: string | null;
    email?: string | null;
  };
}

export interface Group {
  id: string;
  name: string;
  description?: string | null;
  courseId?: string | null;
  mentorId?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  course?: {
    id: string;
    slug: string;
    translations: Array<{ title: string }>;
  } | null;
  mentor?: EmployeeProfile | null;
  students?: StudentProfile[];
  _count?: {
    students: number;
  };
}

export interface StudentProfile {
  id: string;
  userId: string;
  groupId?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'DROPPED';
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    fullName: string;
    email?: string | null;
    phone?: string | null;
  };
  group?: Group | null;
  enrollments?: Enrollment[];
  lessonProgress?: LessonProgress[];
  courseReviews?: CourseReview[];
  bookings?: Booking[];
}

export interface Course {
  id: string;
  slug: string;
  price: number;
  duration?: string | null;
  totalHours?: number | null;
  format: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  coverImage?: string | null;
  rating?: number | null;
  totalReviews: number;
  enrolledStudents: number;
  isActive: boolean;
  translations: Array<{
    languageCode: 'KY' | 'RU' | 'EN';
    title: string;
    description?: string | null;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  }>;
  lessons?: Lesson[];
  _count?: {
    lessons: number;
    enrollments: number;
  };
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  duration?: number | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  course?: Course;
}

export interface LessonProgress {
  id: string;
  studentId: string;
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
  watchedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  student?: StudentProfile;
  lesson?: Lesson;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  mentorId?: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  startedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  student?: StudentProfile;
  course?: Course;
  mentor?: EmployeeProfile | null;
}

export interface Booking {
  id: string;
  studentId: string;
  mentorId: string;
  courseId?: string | null;
  date: Date;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  student?: StudentProfile;
  mentor?: EmployeeProfile;
  course?: Course | null;
}

export interface CourseReview {
  id: string;
  courseId: string;
  studentId: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
  course?: Course;
  student?: StudentProfile;
}

export interface DashboardStats {
  totalStudents?: number;
  activeStudents?: number;
  completedLessons?: number;
  averageProgress?: number;
  upcomingBookings?: number;
  pendingReviews?: number;
  totalCourses?: number;
  totalLessons?: number;
}

export interface AnalyticsData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }>;
}

export type LanguageCode = 'ky' | 'ru' | 'en';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
