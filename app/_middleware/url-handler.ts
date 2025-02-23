import { User } from '@prisma/client';
import { Request, Response } from 'express';

import { parseReq } from '../_lib/utils';
import { urlSchema } from '../_lib/const';
import * as urlRepo from '../_repository/url-repository';

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
    const url = parseReq(req, urlSchema).url;
    res.status(201).json(await urlRepo.addUrl(url, req.user as User));
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function updateUrlHandler(req: Request, res: Response) {
  try {
    const url = parseReq(req, urlSchema).url;
    res.status(201).json(await urlRepo.updateUrl(url, req.params.slug));
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
