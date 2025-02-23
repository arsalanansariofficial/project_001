import { z } from 'zod';
import { User } from '@prisma/client';
import { Request, Response } from 'express';

import { parseReq } from './user-handler';
import * as urlRepo from '../_repository/url-repository';

const urlSchema = z.object({ url: z.string().url() });

export async function getUrlHandler(req: Request, res: Response) {
  try {
    res.redirect((await urlRepo.getUrl(req.params.slug)).fullUrl);
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function addUrlHandler(
  req: Request & { user?: User },
  res: Response
) {
  try {
    res
      .status(201)
      .json(
        await urlRepo.addUrl(parseReq(req, urlSchema).url, req.user as User)
      );
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function updateUrlHandler(req: Request, res: Response) {
  try {
    res
      .status(201)
      .json(
        await urlRepo.updateUrl(parseReq(req, urlSchema).url, req.params.slug)
      );
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function deleteUrlHandler(req: Request, res: Response) {
  try {
    res.status(200).json(await urlRepo.deleteUrl(req.params.slug));
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}
