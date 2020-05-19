import { config } from 'dotenv';
import { getApp } from 'src/app';
import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from 'src/utils/sentry';

config();
const startServer = () => {
  try {
    const { PORT } = process.env;
    const app = getApp();

    Sentry.request(app);

    app.use(
      cors({
        credentials: true,
        origin: 'http://127.0.0.1:8080',
      }),
    );

    app.use(helmet());

    app.listen(PORT, () => {
      console.log(`server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};
startServer();
