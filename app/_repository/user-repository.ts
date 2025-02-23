import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { Token, User, PrismaClient } from '@prisma/client';

import { hashPassword, verifyPassword } from '../_lib/utils';
import { expiresIn, salt, signature, updateSchema } from '../_lib/const';

const prisma = new PrismaClient();

export async function singupUser(
  dob: string,
  name: string,
  email: string,
  password: string
) {
  if (!salt || !signature || !expiresIn)
    throw { message: 'Internal Server Error' };

  const exUser = await prisma.user.findUnique({ where: { email } });

  if (exUser)
    throw {
      status: 400,
      message: 'Email should be unique'
    };

  const user = await prisma.user.create({
    data: {
      dob,
      name,
      email,
      password: hashPassword(salt, password)
    }
  });

  const token = await prisma.token.create({
    data: {
      userId: user.id,
      token: jwt.sign({ userId: user.id }, signature, { expiresIn })
    }
  });

  setTimeout(async () => {
    await prisma.token.delete({ where: { id: token.id } });
  }, expiresIn);

  return token;
}

export async function loginUser(email: string, password: string) {
  if (!salt || !signature || !expiresIn)
    throw { message: 'Internal Server Error' };

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !verifyPassword(salt, user.password, password))
    throw { status: 400, message: 'Bad Request' };

  const token = await prisma.token.create({
    data: {
      userId: user.id,
      token: jwt.sign({ userId: user.id }, signature, { expiresIn })
    }
  });

  setTimeout(async () => {
    await prisma.token.delete({ where: { id: token.id } });
  }, expiresIn);

  return token;
}

export async function logoutUser(user: User, token: string) {
  const { id } = (await prisma.token.findFirst({ where: { token } })) as Token;
  return await prisma.token.delete({ where: { id } });
}

export async function updateUser(
  exUser: User,
  user: z.infer<typeof updateSchema>
) {
  if (!salt) throw { message: 'Internal Server Error' };

  if (user.password && !verifyPassword(salt, exUser.password, user.password))
    user.password = hashPassword(salt, user.password);
  else user.password = exUser.password;

  return await prisma.user.update({
    data: { ...user },
    where: { id: exUser.id }
  });
}

export async function deleteUser(userId: string) {
  return await prisma.user.delete({
    where: { id: userId },
    select: { id: true }
  });
}
