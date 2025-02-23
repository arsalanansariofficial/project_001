import crypto from 'node:crypto';
import { Request } from 'express';
import z, { ZodSchema } from 'zod';

export function verifyPassword(salt: string, hashed: string, password: string) {
  return hashPassword(salt, password) === hashed;
}

export function hashPassword(salt: string, password: string) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function parseReq<T extends ZodSchema>(req: Request, schema: T) {
  const result = schema.safeParse(req.body.data);

  if (result.error) {
    const fieldErrors = new Map<string, string>();
    const e = Object.entries(result.error.flatten().fieldErrors);
    for (const [key, value] of e)
      if (value) fieldErrors.set(key, value.join(', '));

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

  return result.data as z.infer<T>;
}
