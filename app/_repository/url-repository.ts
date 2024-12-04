import crypto from 'node:crypto';

import { prisma } from '../_db/db';

export async function getUrl(data: FormData) {
  const shortUrl = data.get('slug') as string;
  const url = await prisma.url.findUnique({ where: { shortUrl } });

  if (!url) {
    throw {
      status: 400,
      message: 'Slug should be valid'
    };
  }

  return await prisma.url.update({
    where: { fullUrl: url.fullUrl },
    data: { clicked: { increment: 1 } }
  });
}

export async function addUrl(data: FormData) {
  const fullUrl = data.get('url') as string;
  const shortUrl = crypto.randomBytes(4).toString('hex');
  const url = await prisma.url.findUnique({ where: { fullUrl } });

  if (url) {
    throw {
      status: 400,
      message: 'URL should be unique'
    };
  }

  return await prisma.url.create({ data: { fullUrl, shortUrl } });
}

export async function updateUrl(data: FormData) {
  const shortUrl = data.get('slug') as string;
  const newUrl = data.get('url') as string;

  const url = await prisma.url.findUnique({ where: { shortUrl } });

  if (!url) {
    throw {
      status: 400,
      message: 'Slug should be valid'
    };
  }

  return await prisma.url.update({
    where: { shortUrl },
    data: { fullUrl: newUrl }
  });
}
