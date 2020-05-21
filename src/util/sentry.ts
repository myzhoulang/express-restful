import * as express from 'express';
import Sentry from '@sentry/node';
import { Application } from 'express';

const request = (app: Application) => {
  // 只有在非开发环境下才启用 sentry
  const { SENTRY_DSN, NODE_ENV, SENTRY_RELEASE } = process.env;
  if (NODE_ENV !== 'development') {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: NODE_ENV,
      release: SENTRY_RELEASE,
    });
    app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
  }
};

const error = (app: Application) => {
  if (process.env.NODE_ENV !== 'development') {
    app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
  }
};

export { request, error };
