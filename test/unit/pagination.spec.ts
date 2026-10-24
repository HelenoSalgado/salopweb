import { describe, it, expect } from 'vitest';
import { buildPageUrl, parsePageParam } from '../../utils/pagination';

describe('buildPageUrl', () => {
  it('returns the base URL for page 1 (canonical)', () => {
    expect(buildPageUrl('/blog', 1)).toBe('/blog');
    expect(buildPageUrl('/blog/', 1)).toBe('/blog');
  });

  it('returns a path-based URL for pages > 1', () => {
    expect(buildPageUrl('/blog', 2)).toBe('/blog/pagina/2');
    expect(buildPageUrl('/blog/categorias/ia/', 3)).toBe('/blog/categorias/ia/pagina/3');
  });

  it('never produces a query string', () => {
    expect(buildPageUrl('/blog', 5)).not.toContain('?');
  });
});

describe('parsePageParam', () => {
  it('parses canonical positive integers', () => {
    expect(parsePageParam('1')).toBe(1);
    expect(parsePageParam('12')).toBe(12);
    expect(parsePageParam(['4'])).toBe(4);
  });

  it('rejects non-canonical or invalid values', () => {
    for (const value of ['0', '-1', '02', '1.5', 'abc', '', ' 2', undefined, null, 3, [], '99999999999999999999']) {
      expect(parsePageParam(value)).toBeNull();
    }
  });
});
