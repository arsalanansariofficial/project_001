import { Request, Response } from 'express';

import { addUrl, getUrl } from '../_repository/url-repository';

interface RequestBody {
  data: { url: string };
}

export async function getUrlHandler(req: Request, res: Response) {
  try {
    const slug = req.params.slug;

    const formdata = new FormData();
    formdata.set('slug', slug);

    res.status(200).json(await getUrl(formdata));
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function addUrlHandler(req: Request, res: Response) {
  try {
    const body = req.body as RequestBody;

    if (!body?.data || !body?.data?.url) {
      throw {
        status: 400,
        error: {
          path: {
            data: body?.data ? undefined : 'Should be a valid data',
            url: body?.data?.url ? undefined : 'Should be a valid url'
          }
        }
      };
    }

    const formdata = new FormData();
    formdata.set('url', body.data.url);

    res.status(201).json(await addUrl(formdata));
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}
