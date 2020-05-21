import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import * as Sentry from 'src/util/sentry';
export const getApp = () => {
  const app: Application = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/api/v1/test', (_: Request, res: Response) => {
    throw new Error('hello123');
    res.json({ ok: true });
  });

  Sentry.error(app);

  app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message,
    });

    next();
  });

  return app;
};
