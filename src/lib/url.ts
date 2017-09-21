import * as url from 'url';

export function normalizeUrl(currentImageUrl: string, pageUrl: string): string {
  if (currentImageUrl.length === 0) {
    return '';
  }

  if (currentImageUrl.startsWith('//')) {
    currentImageUrl = `http:${currentImageUrl}`;
  }

  const parsedImageUrl = url.parse(currentImageUrl);

  // Url is valid, no need to normalize
  if (parsedImageUrl.protocol) {
    return currentImageUrl;
  }

  // Relative image path
  if (currentImageUrl.startsWith('/')) {
    const parsedPageUrl = url.parse(pageUrl);
    const hostname = parsedPageUrl.hostname;
    const protocol = `${parsedPageUrl.protocol}//`;

    return `${protocol}${hostname}${currentImageUrl}`;
  }

  return '';
}
