import jwt from 'jsonwebtoken';
import crypto, { sign } from 'node:crypto';

import { prisma } from '../_db/db';

const salt = process.env.SALT as string;
const signature = process.env.SIGNATURE as string;
const expiresIn = Number(process.env.EXPIRES_IN as string);

function verifyPassword(salt: string, hashed: string, password: string) {
  return hashPassword(salt, password) === hashed;
}

function hashPassword(salt: string, password: string) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function verifyToken(token: string, signature: string) {
  try {
    return jwt.verify(token, signature);
  } catch (e) {
    return null;
  }
}

async function createToken(userId: string, signature: string) {
  const token = await prisma.token.create({
    data: { userId, token: jwt.sign({ id: userId }, signature, { expiresIn }) }
  });

  setTimeout(async () => {
    await prisma.token.delete({ where: { id: token.id } });
  }, expiresIn);

  return { token: jwt.sign({ id: userId }, signature, { expiresIn }) };
}

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

  return createToken(user.id, signature);
}

export async function loginUser(email: string, password: string) {
  if (!salt || !signature || !expiresIn)
    throw { message: 'Internal Server Error' };

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !verifyPassword(salt, user.password, password))
    throw { status: 400, message: 'Bad Request' };

  return createToken(user.id, signature);
}
