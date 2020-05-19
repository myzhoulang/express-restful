import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
export const getApp = () => {
  const app: Application = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/api/v1/test', (_: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message,
    });

    next();
  });

  return app;
};
