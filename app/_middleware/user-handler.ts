import { User } from '@prisma/client';
import { Request, Response } from 'express';

import * as lib from '../_lib/const';
import { parseReq } from '../_lib/utils';
import * as userRepo from '../_repository/user-repository';

export async function signupHandler(req: Request, res: Response) {
  try {
    const user = parseReq(req, lib.signupSchema);
    user.dob = new Date(user.dob).toISOString();

    const token = await userRepo.singupUser(
      user.dob,
      user.name,
      user.email,
      user.password
    );

    res
      .status(201)
      .cookie('token', token.token, { httpOnly: true, maxAge: lib.expiresIn })
      .json({ id: token.id });
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const user = parseReq(req, lib.loginSchema);
    const token = await userRepo.loginUser(user.email, user.password);

    res
      .status(201)
      .cookie('token', token.token, { httpOnly: true, maxAge: lib.expiresIn })
      .json({ id: token.id });
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function logoutHandler(
  req: Request & { user?: User },
  res: Response
) {
  try {
    const token = await userRepo.logoutUser(
      req.user as User,
      req.cookies.token
    );

    res
      .status(201)
      .cookie('token', token.token, { httpOnly: true, maxAge: lib.expiresIn })
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
    const user = parseReq(req, lib.updateSchema);
    if (user.dob) user.dob = new Date(user.dob).toISOString();
    res.status(201).json(await userRepo.updateUser(req.user as User, user));
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function deleteUserHandler(
  req: Request & { user?: User },
  res: Response
) {
  try {
    res.status(201).json(await userRepo.deleteUser((req.user as User).id));
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}
