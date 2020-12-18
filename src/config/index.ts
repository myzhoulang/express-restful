import { CorsOptions } from "cors";
interface Conf {
  cors?: CorsOptions
}

const config:Conf = {
  cors: {
    credentials: true,
    origin: 'http://127.0.0.1:8080',
  }
}

export default config