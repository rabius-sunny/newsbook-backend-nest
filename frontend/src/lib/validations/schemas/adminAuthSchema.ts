import { z } from 'zod'

export const loginSchema = z.object({
  field: z.string(),
  // email: z.string().optional().nullable(), // .email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export const registerSchema = z
  .object({
    fullname: z.string(),
    phone: z.string(),
    email: z.string().email('Invalid email address'),
    address: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string().min(8, 'Confirm Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

export const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().min(8, 'OTP must be at least 8 characters long'),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type ResetSchema = z.infer<typeof resetSchema>
