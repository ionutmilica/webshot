import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as dotEnv from 'dotenv';
import * as puppeteer from 'puppeteer';
import api from './routes';
import secretMiddleware from './middleware/secret';
import Container = global.Container;

dotEnv.config();

export default async () => {
  const browser = await puppeteer.launch();
  const app = express();

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Compose options
  const opts: Container = {
    browser,
  };

  app.use('/api/v1', secretMiddleware('secret'), api(opts));

  const server = app.listen(5000, () => {
    console.log(`Server started listening on port: ${5000}.`);
  });

  const close = async (callback = () => {}) => {
    await browser.close();
    server.close(callback);
  };

  return await { server, close };
};
