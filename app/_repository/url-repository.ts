import crypto from 'node:crypto';

import { prisma } from '../_db/db';
import { User } from '@prisma/client';

export async function getUrl(shortUrl: string) {
  const url = await prisma.url.findUnique({ where: { shortUrl } });

  if (!url)
    throw {
      status: 400,
      message: 'Slug should be valid'
    };

  return await prisma.url.update({
    where: { fullUrl: url.fullUrl },
    data: { clicked: { increment: 1 } }
  });
}

export async function addUrl(url: string, user: User) {
  const shortUrl = crypto.randomBytes(4).toString('hex');
  const exUrl = await prisma.url.findUnique({ where: { fullUrl: url } });

  if (exUrl)
    throw {
      status: 400,
      message: 'URL should be unique'
    };

  return await prisma.url.create({
    data: { shortUrl, fullUrl: url, userId: user.id }
  });
}

export async function updateUrl(fullUrl: string, shortUrl: string) {
  const exURL = await prisma.url.findUnique({ where: { shortUrl } });

  if (!exURL)
    throw {
      status: 400,
      message: 'Slug should be valid'
    };

  return await prisma.url.update({
    where: { shortUrl },
    data: { fullUrl }
  });
}

export async function deleteUrl(shortUrl: string) {
  const url = await prisma.url.findUnique({ where: { shortUrl } });

  if (!url)
    throw {
      status: 400,
      message: 'Slug should be valid'
    };

  return await prisma.url.delete({ where: { fullUrl: url.fullUrl } });
}
