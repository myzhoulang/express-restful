import express, { Application, Request, Response, NextFunction } from 'express';
import {initMiddleway} from './middleway'
import * as Sentry from './util/sentry';

export const getApp = () => {
  const app: Application = express();
  initMiddleway(app);

  // sentry
  Sentry.request(app);

  app.post('/login', (req: Request, res: Response) => {
    res.status(400).json({
      errors: {
        userName: ['用户名或密码错误'],
      },
    });
  });

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
