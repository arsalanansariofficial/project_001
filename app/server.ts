import express from 'express';
import cookieParser from 'cookie-parser';
import { Express } from 'express-serve-static-core';

import * as lib from './_lib/const';
import urlRouter from './_router/url-router';
import userRouter from './_router/user-router';
import notFound from './_middleware/not-found-handler';

function addMiddlewares(app: Express) {
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
}

function addRouteHandlers(app: Express) {
  app.use(urlRouter);
  app.use(userRouter);
  app.use(notFound);
}

function serve() {
  if (!lib.port) throw new Error('Port should be valid');
  if (!lib.salt) throw new Error('Salt should be valid');

  if (!lib.signature) throw new Error('Signature should be valid');
  if (!lib.expiresIn) throw new Error('Expires In should be valid');
  if (!lib.databaseUrl) throw new Error('Database URL should be valid');

  const app = express();
  addMiddlewares(app);
  addRouteHandlers(app);
  app.listen(lib.port);
}

serve();
