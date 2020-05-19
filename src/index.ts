import { config } from 'dotenv';
import { getApp } from 'src/app';
import cors from 'cors';

config();
const startServer = () => {
  try {
    const { PORT } = process.env;
    const app = getApp();

    app.use(
      cors({
        credentials: true,
        origin: 'http://127.0.0.1:8080',
      }),
    );

    app.listen(PORT, () => {
      console.log(`server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};
startServer();
