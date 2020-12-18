import {Application} from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';

export const initMiddleway = (app: Application) => {
  app.use(cors(config.cors));
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
}