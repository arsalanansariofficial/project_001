import { Request, Response } from 'express';

import * as userRepo from '../_repository/user-repository';

const validPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validEmail =
  /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/;

export async function signupHandler(req: Request, res: Response) {
  try {
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

    res
      .status(200)
      .json(
        await userRepo.singupUser(
          dob.toISOString(),
          data.name,
          data.email,
          data.password
        )
      );
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

    res.status(200).json(await userRepo.loginUser(data.email, data.password));
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}
