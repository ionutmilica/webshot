import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as dotEnv from 'dotenv';
import * as puppeteer from 'puppeteer';
import api from './routes';
import secretMiddleware from './middleware/secret';
import { Container } from './container';
import WebShotService from './services/webshot';
import { LocalUploader, S3Uploader, Uploader } from "./lib/uploader";
import * as path from "path";

dotEnv.config();

const basePath = path.join(__dirname, '..', 'public');

export default async () => {
  const { S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION, S3_BUCKET, STORAGE_DRIVER, APP_URL, SECRET } = process.env;
  const browser = await puppeteer.launch();
  const app = express();

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(basePath));

  // Compose options
  let uploader: Uploader;

  switch (STORAGE_DRIVER) {
    case 's3':
      uploader = new S3Uploader(S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, S3_REGION);
      break;
    default:
      uploader = new LocalUploader(basePath, APP_URL);
  }

  const opts: Container = {
    browser,
    webShot: new WebShotService(
      browser,
      uploader,
    ),
  };

  app.use('/api/v1', secretMiddleware(SECRET), api(opts));

  const server = app.listen(5000, () => {
    console.log(`Server started listening on port: ${5000}.`);
  });

  const close = async (callback = () => {}) => {
    await browser.close();
    server.close(callback);
  };

  return await { server, close };
};
