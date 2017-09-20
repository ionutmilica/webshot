import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as dotEnv from 'dotenv';
import * as puppeteer from 'puppeteer';
import api from './routes';
import secretMiddleware from './middleware/secret';
import S3Manager from './lib/s3-manager';
import ScreenShotService from './services/screenshot';
import Container = global.Container;

dotEnv.config();

export default async () => {
  const { S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION } = process.env;
  const browser = await puppeteer.launch();
  const app = express();

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Compose options
  const opts: Container = {
    browser,
    screenshot: new ScreenShotService(
      browser,
      new S3Manager(S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION),
    ),
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
