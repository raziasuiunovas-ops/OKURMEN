import { z } from 'zod';

// Course validators
export const createCourseSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  price: z.number().positive(),
  duration: z.string().optional(),
  format: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']),
  isActive: z.boolean().default(true),
  translations: z.array(z.object({
    languageCode: z.enum(['KY', 'RU', 'EN']),
    title: z.string().min(1),
    description: z.string().optional(),
    program: z.string().optional(),
  })).min(1),
  teacherIds: z.array(z.string()).optional(),
});

export const updateCourseSchema = createCourseSchema.partial().omit({ slug: true });

// Employee validators
export const createEmployeeSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  position: z.enum(['FOUNDER', 'TEACHER', 'MENTOR', 'MANAGER', 'SALES', 'MARKETING', 'ADMIN_STAFF', 'OTHER']),
  bio: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  photoUrl: z.string().url().optional(),
  sortOrder: z.number().default(0),
  joinedAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

// Review validators
export const createReviewSchema = z.object({
  authorName: z.string().min(1),
  reviewType: z.enum(['STUDENT', 'PARENT']),
  text: z.string().min(10),
  rating: z.number().min(1).max(5).optional(),
  photoUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  status: z.enum(['PENDING', 'PUBLISHED', 'REJECTED']).default('PENDING'),
});

export const updateReviewSchema = createReviewSchema.partial();

// Alumni validators
export const createAlumniSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  position: z.string().optional(),
  story: z.string().optional(),
  photoUrl: z.string().url().optional(),
  isFeatured: z.boolean().default(false),
  studentId: z.string().optional(),
});

export const updateAlumniSchema = createAlumniSchema.partial();

// Application/Booking validators
export const createApplicationSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  courseId: z.string(),
  comment: z.string().optional(),
});

// Payment validators
export const createPaymentSchema = z.object({
  applicationId: z.string().optional(),
  studentId: z.string().optional(),
  courseId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('KGS'),
  provider: z.string().optional(),
});
