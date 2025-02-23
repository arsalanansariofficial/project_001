import { z } from 'zod';

export const port = process.env.PORT;
export const salt = process.env.SALT as string;
export const databaseUrl = process.env.DATABASE_URL;
export const signature = process.env.SIGNATURE as string;
export const expiresIn = Number(process.env.EXPIRES_IN as string);

export const urlSchema = z.object({ url: z.string().url() });
export const validPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().regex(validPassword)
});

export const signupSchema = z.object({
  dob: z.string().date(),
  name: z.string().min(8),
  email: z.string().email(),
  password: z.string().regex(validPassword)
});

export const updateSchema = z.object({
  dob: z.string().date().optional(),
  name: z.string().min(8).optional(),
  email: z.string().email().optional(),
  password: z.string().regex(validPassword).optional()
});
