import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        window.location.href = '/auth/signin';
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const apiClient = {
  // Direct HTTP methods
  get: (url: string, config?: AxiosRequestConfig) => api.get(url, config),
  post: (url: string, data?: any, config?: AxiosRequestConfig) => api.post(url, data, config),
  patch: (url: string, data?: any, config?: AxiosRequestConfig) => api.patch(url, data, config),
  delete: (url: string, config?: AxiosRequestConfig) => api.delete(url, config),
  
  // Auth
  auth: {
    signin: (email: string, password: string) =>
      api.post('/auth/signin', { email, password }),
    
    request2FA: (email: string, password: string) =>
      api.post('/auth/request-2fa', { email, password }),
    
    verify2FA: (email: string, code: string) =>
      api.post('/auth/verify-2fa', { email, code }),
    
    logout: () => api.post('/auth/logout'),
    
    getMe: () => api.get('/auth/me'),
  },

  // Employee
  employee: {
    getProfile: () => api.get('/employee/profile'),
    
    updateProfile: (data: any) => api.patch('/employee/profile', data),
    
    getMyGroup: () => api.get('/employee/my-group'),
    
    getMyStudents: (params?: any) => api.get('/employee/my-students', { params }),
    
    getMyCourses: () => api.get('/employee/my-courses'),
    
    getBookings: (params?: any) => api.get('/employee/bookings', { params }),
    
    getAnalytics: (params?: any) => api.get('/employee/analytics', { params }),
  },

  // Groups
  groups: {
    getAll: (params?: any) => api.get('/groups', { params }),
    
    getById: (id: string) => api.get(`/groups/${id}`),
    
    create: (data: any) => api.post('/groups', data),
    
    update: (id: string, data: any) => api.patch(`/groups/${id}`, data),
    
    delete: (id: string) => api.delete(`/groups/${id}`),
  },

  // Students
  students: {
    getAll: (params?: any) => api.get('/student/list', { params }),
    
    getById: (id: string) => api.get(`/student/${id}`),
    
    getProgress: (studentId: string) => api.get(`/student/${studentId}/progress`),
    
    getEnrollments: (studentId: string) => api.get(`/student/${studentId}/enrollments`),
  },

  // Courses
  courses: {
    getAll: (params?: any) => api.get('/courses', { params }),
    
    getById: (id: string) => api.get(`/courses/${id}`),
    
    getLessons: (courseId: string) => api.get(`/courses/${courseId}/lessons`),
  },

  // Lessons
  lessons: {
    getAll: (params?: any) => api.get('/lessons', { params }),
    
    getById: (id: string) => api.get(`/lessons/${id}`),
    
    create: (data: any) => api.post('/lessons', data),
    
    update: (id: string, data: any) => api.patch(`/lessons/${id}`, data),
    
    delete: (id: string) => api.delete(`/lessons/${id}`),
  },

  // Bookings
  bookings: {
    getAll: (params?: any) => api.get('/bookings', { params }),
    
    getById: (id: string) => api.get(`/bookings/${id}`),
    
    create: (data: any) => api.post('/bookings', data),
    
    update: (id: string, data: any) => api.patch(`/bookings/${id}`, data),
    
    cancel: (id: string) => api.patch(`/bookings/${id}`, { status: 'CANCELLED' }),
  },

  // Reviews
  reviews: {
    getAll: (params?: any) => api.get('/reviews', { params }),
    
    getCourseReviews: (courseId: string) => api.get(`/reviews/course/${courseId}`),
  },
};

export default api;
