import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

import { signature } from '../_lib/const';

const prisma = new PrismaClient();

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

    // console.log(
    //   userId,
    //   user,
    //   await prisma.user.findUnique({
    //     where: { id: userId }
    //   })
    // );

    if (!user) throw { status: 401, error: { message: 'Unauthorized' } };

    req.user = user;
    next();
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}
