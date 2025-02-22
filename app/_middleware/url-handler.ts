import { Request, Response } from 'express';

import * as urlRepo from '../_repository/url-repository';

interface RequestBody {
  data: { url?: string; slug?: string };
}

function handleRequest(body: RequestBody) {
  if (!body?.data || !body?.data?.url)
    throw {
      status: 400,
      error: {
        path: {
          data: body?.data ? undefined : 'Should be a valid data',
          url: body?.data?.url ? undefined : 'Should be a valid url'
        }
      }
    };

  return body.data;
}

export async function getUrlHandler(req: Request, res: Response) {
  try {
    res.status(200).json(await urlRepo.getUrl(req.params.slug));
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function addUrlHandler(req: Request, res: Response) {
  try {
    const url = handleRequest(req.body).url as string;
    res.status(201).json(await urlRepo.addUrl(url));
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function updateUrlHandler(req: Request, res: Response) {
  try {
    const body = req.body as RequestBody;
    body.data.slug = req.params.slug;
    res
      .status(201)
      .json(
        await urlRepo.updateUrl(
          body.data.url as string,
          body.data.slug as string
        )
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
