import { Request, Response } from 'express';

import { addUrl, getUrl, updateUrl } from '../_repository/url-repository';

interface RequestBody {
  data: { url?: string; slug?: string };
}

function handleRequest(body: RequestBody) {
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

  Object.keys(body.data).forEach(key => {
    formdata.append(key, body.data[key as keyof typeof body.data] as string);
  });

  return formdata;
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
    const formdata = handleRequest(req.body);
    res.status(201).json(await addUrl(formdata));
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}

export async function updateUrlHandler(req: Request, res: Response) {
  try {
    const body = req.body as RequestBody;

    body.data.slug = req.params.slug;
    const formdata = handleRequest(body);

    res.status(201).json(await updateUrl(formdata));
  } catch (e: any) {
    res.status(e.status || 500).json(e.error || { message: e.message });
  }
}
