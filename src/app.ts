import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
export const getApp = () => {
  const app: Application = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/api/v1/test', (_: Request, res: Response) => {
    res.json({ ok: true });
  });
  return app;
};
