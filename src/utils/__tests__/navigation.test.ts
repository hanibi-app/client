import { parseDeepLink, validateRoute, createInternalLink } from '../navigation';

describe('Navigation Utils', () => {
  describe('parseDeepLink', () => {
    it('should parse valid deep link URL', () => {
      const url = 'hanibi://tabs?param1=value1&param2=value2';
      const result = parseDeepLink(url);

      expect(result.screen).toBe('Tabs');
      expect(result.params).toEqual({
        param1: 'value1',
        param2: 'value2',
      });
    });

    it('should parse modal deep link', () => {
      const url = 'hanibi://modal';
      const result = parseDeepLink(url);

      expect(result.screen).toBe('Modal');
      expect(result.params).toBeUndefined();
    });

    it('should handle invalid URL gracefully', () => {
      const url = 'invalid-url';
      const result = parseDeepLink(url);

      expect(result.screen).toBeUndefined();
      expect(result.params).toBeUndefined();
    });
  });

  describe('validateRoute', () => {
    it('should validate correct route', () => {
      const result = validateRoute('Tabs');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid route', () => {
      const result = validateRoute('InvalidRoute');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid route: InvalidRoute');
    });

    it('should validate Modal route without parameters', () => {
      const result = validateRoute('Modal');

      expect(result.isValid).toBe(true);
    });

    it('should reject Modal route with parameters', () => {
      const result = validateRoute('Modal', { param: 'value' });

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Modal route does not accept parameters');
    });
  });

  describe('createInternalLink', () => {
    it('should create internal link without parameters', () => {
      const result = createInternalLink('Tabs');

      expect(result).toBe('hanibi://tabs');
    });

    it('should create internal link with parameters', () => {
      const result = createInternalLink('Tabs', { param1: 'value1', param2: 'value2' });

      expect(result).toBe('hanibi://tabs?param1=value1&param2=value2');
    });
  });
});
