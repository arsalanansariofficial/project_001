import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { prisma } from '../_db/db';
import { User } from '@prisma/client';

const signature = process.env.SIGNATURE as string;

export default async function (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.token as string;

    if (!token) throw { status: 401, error: { message: 'Unauthorized' } };

    const userId = (jwt.verify(token, signature) as JwtPayload).userId;

    if (!userId) throw { status: 401, error: { message: 'Unauthorized' } };

    const user = await prisma.user.findUnique({
      where: { id: userId, Token: { some: { token } } }
    });

    if (!user) throw { status: 401, error: { message: 'Unauthorized' } };

    req.user = user;
    next();
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}
