import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from './util/sentry';

export const getApp = () => {
  const app: Application = express();
  app.use(
    cors({
      credentials: true,
      origin: 'http://127.0.0.1:8080',
    }),
  );
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // sentry
  Sentry.request(app);

  app.get('/api/v1/test', (req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message,
    });

    next();
  });

  return app;
};
