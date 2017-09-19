import { Page } from 'puppeteer';

export async function getMeta(
  page: Page,
  url: string,
): Promise<{ title: string; description: string; image: string }> {
  // Will set the browser default view port resolution
  page.setViewport({ width: 1280, height: 720 });

  // Will allow node to see logs from chrome
  page.on('console', (...args: any[]) => console.log('CHROME:', ...args));

  // In the new tab, navigate to an url
  await page.goto(url);

  // Execute scripts in chrome dev tool in order to extract meta tags
  let meta = await page.evaluate(async () => {
    let meta: any = { title: document.title, description: '', image: '' };
    const tags = document.querySelectorAll('meta');
    const neededTags = ['title', 'image', 'description'];

    const filterTagName = (item: any) => {
      const name = item.getAttribute('property') || item.getAttribute('name');
      return (name || '').replace('og:', '');
    };

    const filterContent = (item: any) => item.getAttribute('content') || '';

    [...tags]
      .map(item => ({
        name: filterTagName(item),
        content: filterContent(item),
      }))
      .filter(({ content }) => !!content)
      .filter(({ name }) => neededTags.indexOf(name) !== -1)
      .forEach(({ name, content }) => {
        meta[name] = content;
      });

    return meta;
  });

  if (meta.image.length === 0) {
    await page.screenshot({ path: 'example.png' });
    meta = { ...meta, image: 'example.png' };
  }

  return meta;
}
