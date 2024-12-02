import express, { Application, Router } from 'express';

const router = Router();

const urls = [
  {
    _id: '123',
    full_url: 'http://www.example.com',
    short_url: 'example_123'
  }
];

router.get('/:slug', function (req, res) {
  const slug = req.params.slug;
  const url = urls.find(url => url.short_url === slug);

  if (url) {
    return res.status(200).json({ data: { url } }) as any;
  }

  res
    .status(400)
    .json({ error: { message: `No record found for slug '${slug}'` } });
});

export default router;
