import { User } from '@prisma/client';
import { Request, Response } from 'express';

import * as userRepo from '../_repository/user-repository';

const expiresIn = Number(process.env.EXPIRES_IN as string);

const validPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validEmail =
  /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/;

function parseSignupReq(req: Request) {
  const data = req.body?.data;
  const name = data && data?.name;
  const dob = data && new Date(data?.dob);

  const isValidDob = !isNaN((dob as Date).getTime());
  const isValidEmail = data && data?.email && validEmail.test(data.email);
  const isValidPassword =
    data && data?.password && validPassword.test(data.password);
  const isValidReq =
    data && name && isValidDob && isValidEmail && isValidPassword;

  if (!isValidReq)
    throw {
      status: 400,
      error: {
        path: {
          data: data ? undefined : 'Should be a valid data',
          name: name ? undefined : 'Should be a valid name',
          email: isValidEmail ? undefined : 'Should be a valid email',
          dob: isValidDob ? undefined : 'Should be a valid dob as DD-MM-YYY',
          password: isValidPassword
            ? undefined
            : 'Should be a valid password as Password@123'
        }
      }
    };

  return { ...data, dob: dob.toISOString() };
}

export async function signupHandler(req: Request, res: Response) {
  try {
    const data = parseSignupReq(req);

    const { token } = await userRepo.singupUser(
      data.dob,
      data.name,
      data.email,
      data.password
    );

    res
      .status(201)
      .cookie('token', token, {
        httpOnly: true,
        maxAge: expiresIn
      })
      .send();
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const data = req.body?.data;
    const isValidEmail = data && data?.email && validEmail.test(data.email);
    const isValidPassword =
      data && data?.password && validPassword.test(data.password);
    const isValidReq = data && isValidEmail && isValidPassword;

    if (!isValidReq)
      throw {
        status: 400,
        error: {
          path: {
            data: data ? undefined : 'Should be valid data',
            email: isValidEmail ? undefined : 'Should be valid email',
            password: isValidPassword
              ? undefined
              : 'Should be valid password as Password@123'
          }
        }
      };

    const { token } = await userRepo.loginUser(data.email, data.password);

    res
      .status(201)
      .cookie('token', token, {
        httpOnly: true,
        maxAge: expiresIn
      })
      .send();
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function updateUserHandler(
  req: Request & { user?: User },
  res: Response
) {
  try {
    res
      .status(201)
      .json(await userRepo.updateUser(parseSignupReq(req), req.user as User));
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}
