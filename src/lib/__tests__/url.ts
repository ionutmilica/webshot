import { normalizeUrl } from '../url';

describe('normalizeUrl tests', () => {
  describe('empty url', () => {
    it('should return empty string when empty url is provided', () => {
      expect(normalizeUrl('', '')).toEqual('');
    });
  });
  describe('stats with //', () => {
    it('should add the http protocol if it is starting with //', () => {
      expect(normalizeUrl('//www.tiny.ec', '')).toEqual('http://www.tiny.ec');
    });
  });
  describe('valid url', () => {
    it('should return url if the provided url is valid', () => {
      expect(normalizeUrl('http://test.com/img.png', '')).toEqual(
        'http://test.com/img.png',
      );
    });
  });
  describe('relative path', () => {
    it('should prepend the page base url if a relative path is used', () => {
      expect(normalizeUrl('/image.png', 'http://domain.com')).toEqual(
        'http://domain.com/image.png',
      );
      expect(normalizeUrl('/image.png', 'http://domain.com/page.html')).toEqual(
        'http://domain.com/image.png',
      );
    });
  });
});
