import { S3 } from '../lib/s3-manager';
import { normalizeUrl } from '../lib/url';
import { Browser, Page } from 'puppeteer';

interface Meta {
  title: string;
  description: string;
  image: string;
}

export default class ScreenShotService {
  browser: Browser;
  s3Manager: S3;

  constructor(browser: any, s3Manager: S3) {
    this.browser = browser;
    this.s3Manager = s3Manager;
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
        .reduce((acc, { name, content }) => ({
          ...acc,
          [name]: content,
        }), meta);
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

    await page.goto(url);

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
    const page = await this.openPage(url);
    let meta: Meta = await this.getMeta(page);

    if (meta.image.length === 0) {
      await page.screenshot({ path: 'example.png' });
      meta = { ...meta, image: 'example.png' };
    }

    await page.close();
    return meta;
  }

}
