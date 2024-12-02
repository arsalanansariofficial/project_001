import { Request, Response } from 'express';

function notFound(req: Request, res: Response) {
  res
    .status(404)
    .json({ error: { message: `Requested path ${req.path} not found` } });
}

export default notFound;
