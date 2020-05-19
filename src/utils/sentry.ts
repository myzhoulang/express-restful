import sentry from '@sentry/node';
import { Application } from 'express';

const request = (app: Application) => {
  // 只有在非开发环境下才启用 sentry
  if (process.env.NODE_ENV !== 'development') {
    sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      release: process.env.VERSION,
    });
    app.use(sentry.Handlers.requestHandler());
  }
};

const error = (app: Application) => {
  if (process.env.NODE_ENV !== 'development') {
    app.use(sentry.Handlers.errorHandler());
  }
};

export { request, error };
