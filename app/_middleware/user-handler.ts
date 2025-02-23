import z from 'zod';
import { User } from '@prisma/client';
import { Request, Response } from 'express';

import * as userRepo from '../_repository/user-repository';

const expiresIn = Number(process.env.EXPIRES_IN as string);

const validPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().regex(validPassword)
});

const signupSchema = z.object({
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

function parseReq(
  req: Request,
  schema: typeof loginSchema | typeof signupSchema | typeof updateSchema
) {
  const result = schema.safeParse(req.body.data);

  if (result.error) {
    const fieldErrors = new Map<string, string>();
    const e = Object.entries(result.error.flatten().fieldErrors);
    for (const [key, value] of e) fieldErrors.set(key, value.join(', '));

    throw {
      status: 400,
      error: {
        path: {
          ...Object.fromEntries(fieldErrors),
          data: req.body.data ? undefined : 'Should be a valid data'
        }
      }
    };
  }

  return result.data;
}

export async function signupHandler(req: Request, res: Response) {
  try {
    const user = parseReq(req, signupSchema) as z.infer<typeof signupSchema>;
    user.dob = new Date(user.dob).toISOString();

    const token = await userRepo.singupUser(
      user.dob,
      user.name,
      user.email,
      user.password
    );

    res
      .status(201)
      .cookie('token', token.token, { httpOnly: true, maxAge: expiresIn })
      .json({ id: token.id });
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const user = parseReq(req, loginSchema) as z.infer<typeof loginSchema>;
    const token = await userRepo.loginUser(user.email, user.password);

    res
      .status(201)
      .cookie('token', token.token, { httpOnly: true, maxAge: expiresIn })
      .json({ id: token.id });
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function updateUserHandler(
  req: Request & { user?: User },
  res: Response
) {
  try {
    const user = parseReq(req, updateSchema) as z.infer<typeof updateSchema>;
    if (user.dob) user.dob = new Date(user.dob).toISOString();
    res.status(201).json(await userRepo.updateUser(req.user as User, user));
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}
