const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });

  page.on('console', (...args) => console.log('PAGE LOG:', ...args));

  await page.goto('https://www.apple.com/macbook-pro/specs/');
  await page.screenshot({ path: 'example.png' });

  const meta = await page.evaluate(async () => {
    const meta = { title: document.title, description: '', image: '' };
    const tags = document.querySelectorAll('meta');
    const neededTags = ['title', 'image', 'description'];

    const filterTagName = (item) => {
      const name = item.getAttribute('property') || item.getAttribute('name');
      return (name || '').replace('og:', '');
    };

    const filterContent = (item) => item.getAttribute('content') || '';

    [...tags].map(item => ({ name: filterTagName(item), content: filterContent(item) }))
      .filter(({ content }) => !!content)
      .filter(({ name }) => neededTags.indexOf(name) !== -1)
      .forEach(({ name, content }) => {
        meta[name] = content;
      });

    return meta;
  });

  console.log("META:", meta);

  await browser.close();
})();
