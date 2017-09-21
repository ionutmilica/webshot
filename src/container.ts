import { Browser } from 'puppeteer';
import WebShotService from './services/webshot';

export interface Container {
  browser: Browser;
  webShot: WebShotService;
}
