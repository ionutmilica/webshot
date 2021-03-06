import { promisify } from 'util';
import * as fs from 'fs';
import * as uuid from 'uuid/v4';
import { normalizeUrl } from '../lib/url';
import { Browser, Page } from 'puppeteer';
import { Uploader } from '../lib/uploader';

const existsAsync = promisify(fs.exists);
const unlinkAsync = promisify(fs.unlink);

interface Meta {
  title: string;
  description: string;
  image: string;
}

export default class WebShotService {
  browser: Browser;
  uploader: Uploader;

  constructor(browser: Browser, uploader: Uploader) {
    this.browser = browser;
    this.uploader = uploader;
  }

  /**
   * Get meta data from page
   *
   * @param {Page} page
   * @returns {Promise<Meta>}
   */
  protected async getMeta(page: Page): Promise<Meta> {
    return await page.evaluate(async () => {
      const meta: Meta = { title: document.title, description: '', image: '' };
      const tags = document.querySelectorAll('meta');
      const neededTags = ['title', 'image', 'description'];

      const filterTagName = (item: any) => {
        const name = item.getAttribute('property') || item.getAttribute('name');
        return (name || '').replace('og:', '');
      };

      const filterContent = (item: any) => item.getAttribute('content') || '';

      return [...tags]
        .map(item => ({
          name: filterTagName(item),
          content: filterContent(item),
        }))
        .filter(({ content }) => !!content)
        .filter(({ name }) => neededTags.indexOf(name) !== -1)
        .reduce(
          (acc, { name, content }) => ({
            ...acc,
            [name]: content,
          }),
          meta,
        );
    });
  }

  /**
   * Open page and prepare it for processing
   *
   * @param {string} url
   * @returns {Promise<Page>}
   */
  protected async openPage(url: string): Promise<Page> {
    const page = await this.browser.newPage();
    // Will set the browser default view port resolution
    page.setViewport({ width: 1280, height: 720 });
    // Will allow node to see logs from chrome
    page.on('console', (...args: any[]) => console.log('CHROME:', ...args));

    await page.goto(url, { waitUntil: 'networkidle2' });

    return page;
  }

  /**
   * Process page:
   * - Fetch metadata
   * - Optional screenshot if no og:image is present
   *
   * @param {string} url
   * @returns {Promise<Meta>}
   */
  async process(url: string): Promise<Meta> {
    let imageUrl: string;
    const page = await this.openPage(url);
    const meta: Meta = await this.getMeta(page);

    // If there is no image found, make a screenshot
    if (meta.image.length === 0) {
      imageUrl = await this.screenShotAndUpload(page);
    } else {
      imageUrl = normalizeUrl(meta.image, url);
    }

    // Close the browser tab so we don't waste memory
    await page.close();

    return { ...meta, image: imageUrl };
  }

  /**
   * This method will create a screen shot, store it locally then upload it to the S3
   *
   * @param {Page} page
   * @returns {string}
   */
  protected async screenShotAndUpload(page: Page): Promise<string> {
    const filename = `${uuid()}.jpeg`;
    const filePath = `/tmp/${filename}`;

    // Create a new screen shot
    await page.screenshot({ path: filePath });

    await this.uploader.upload(filePath, filename);

    if (await existsAsync(filePath)) {
      await unlinkAsync(filePath);
    }

    return this.uploader.getPublicUrl(filename);
  }
}
