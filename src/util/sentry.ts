import * as express from 'express';
import * as Sentry from '@sentry/node';
import * as Integrations from '@sentry/integrations';

const request = (app: express.Application) => {
  // 只有在非开发环境下才启用 sentry
  const { SENTRY_DSN, NODE_ENV, SENTRY_RELEASE } = process.env;
  console.log(NODE_ENV);
  if (NODE_ENV !== 'development') {
    console.log(Sentry);
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: NODE_ENV,
      release: SENTRY_RELEASE,
      integrations: [new Integrations.RewriteFrames()],
    });
    app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
  }
};

const error = (app: express.Application) => {
  if (process.env.NODE_ENV !== 'development') {
    app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
  }
};

export { request, error };
