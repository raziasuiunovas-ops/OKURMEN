import { z } from 'zod';

// Course validators
export const createCourseSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  price: z.number().positive(),
  duration: z.string().optional(),
  format: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']),
  coverImage: z.string().optional().nullable(),
  coverGradient: z.string().optional().nullable(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
  translations: z.array(z.object({
    languageCode: z.enum(['KY', 'RU', 'EN']),
    title: z.string().min(1),
    description: z.string().optional(),
    program: z.string().optional(),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
  })).min(1),
  teacherIds: z.array(z.string()).optional(),
});

export const updateCourseSchema = createCourseSchema.partial().omit({ slug: true });

// Employee validators
export const createEmployeeSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().optional().transform(val => val === '' ? undefined : val),
  email: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().email().optional()
  ),
  position: z.enum(['FOUNDER', 'TEACHER', 'MENTOR', 'MANAGER', 'DEVELOPER', 'SALES', 'MARKETING', 'ADMIN_STAFF', 'OTHER']),
  bio: z.string().optional().transform(val => val === '' ? undefined : val),
  education: z.string().optional().transform(val => val === '' ? undefined : val),
  experience: z.string().optional().transform(val => val === '' ? undefined : val),
  photoUrl: z.string().optional().transform(val => val === '' ? undefined : val),
  sortOrder: z.number().default(0),
  joinedAt: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().datetime().optional()
  ),
  isActive: z.boolean().default(true),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

// Review validators
export const createReviewSchema = z.object({
  authorName: z.string().min(1),
  reviewType: z.enum(['STUDENT', 'PARENT']),
  text: z.string().min(10),
  rating: z.number().min(1).max(5).optional(),
  photoUrl: z.string().optional(), // Разрешаем любую строку (включая base64)
  videoUrl: z.string().url().optional(),
  status: z.enum(['PENDING', 'PUBLISHED', 'REJECTED']).default('PENDING'),
  courseId: z.string().optional(),
  userId: z.string().optional(),
});

export const updateReviewSchema = createReviewSchema.partial();

// Alumni validators
export const createAlumniSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  position: z.string().optional(),
  story: z.string().optional(),
  photoUrl: z.string().optional(), // Разрешаем любую строку (включая base64)
  isFeatured: z.boolean().default(false),
  studentId: z.string().optional(),
});

export const updateAlumniSchema = createAlumniSchema.partial();

// Group validators
export const createGroupSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  courseId: z.string().optional(),
  mentorId: z.string().optional(),
  whatsappUrl: z.string().url().optional().or(z.literal('')),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
});

export const updateGroupSchema = createGroupSchema.partial();

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
