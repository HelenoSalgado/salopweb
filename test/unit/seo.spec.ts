import { describe, it, expect } from 'vitest';
import {
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  DEFAULT_PODCAST_OG_IMAGE_PATH,
  DEFAULT_SITE_URL,
  buildCanonicalUrl,
  buildOgImageMeta,
  inferImageMimeType,
  normalizeCanonicalPath,
  normalizeSiteUrl,
  resolveAbsoluteAssetUrl,
} from '../../utils/seo';

describe('normalizeSiteUrl', () => {
  it('removes trailing slashes and whitespace', () => {
    expect(normalizeSiteUrl('https://heleno.dev')).toBe('https://heleno.dev');
    expect(normalizeSiteUrl('https://heleno.dev/')).toBe('https://heleno.dev');
    expect(normalizeSiteUrl('  https://heleno.dev///  ')).toBe('https://heleno.dev');
  });
});

describe('normalizeCanonicalPath', () => {
  it('keeps root path as /', () => {
    expect(normalizeCanonicalPath('/')).toBe('/');
    expect(normalizeCanonicalPath('')).toBe('/');
    expect(normalizeCanonicalPath('///')).toBe('/');
  });

  it('appends trailing slash to page routes and ensures leading slash', () => {
    expect(normalizeCanonicalPath('/blog')).toBe('/blog/');
    expect(normalizeCanonicalPath('/blog/')).toBe('/blog/');
    expect(normalizeCanonicalPath('blog/meu-post')).toBe('/blog/meu-post/');
    expect(normalizeCanonicalPath('/blog//meu-post///')).toBe('/blog/meu-post/');
  });

  it('strips query strings and hash fragments', () => {
    expect(normalizeCanonicalPath('/blog?page=2#top')).toBe('/blog/');
    expect(normalizeCanonicalPath('/blog/post/?utm_source=whatsapp')).toBe('/blog/post/');
    expect(normalizeCanonicalPath('/?ref=home#projetos')).toBe('/');
  });

  it('does not append trailing slash to paths with file extensions', () => {
    expect(normalizeCanonicalPath('/rss.xml')).toBe('/rss.xml');
    expect(normalizeCanonicalPath('/sitemap.xml/')).toBe('/sitemap.xml');
    expect(normalizeCanonicalPath('/images/default-post.jpg')).toBe('/images/default-post.jpg');
    expect(normalizeCanonicalPath('/api/search-index.json')).toBe('/api/search-index.json');
  });
});

describe('buildCanonicalUrl', () => {
  it('combines site URL and normalized path cleanly', () => {
    expect(buildCanonicalUrl('https://heleno.dev/', '/')).toBe('https://heleno.dev/');
    expect(buildCanonicalUrl('https://heleno.dev/', '/blog')).toBe('https://heleno.dev/blog/');
    expect(buildCanonicalUrl('https://heleno.dev', 'blog/post/')).toBe('https://heleno.dev/blog/post/');
    expect(buildCanonicalUrl(DEFAULT_SITE_URL, '/rss.xml')).toBe('https://heleno.dev/rss.xml');
  });
});

describe('resolveAbsoluteAssetUrl', () => {
  it('resolves relative paths against siteUrl', () => {
    expect(resolveAbsoluteAssetUrl('https://heleno.dev/', '/images/foto.png')).toBe(
      'https://heleno.dev/images/foto.png',
    );
    expect(resolveAbsoluteAssetUrl('https://heleno.dev', 'images/foto.png')).toBe(
      'https://heleno.dev/images/foto.png',
    );
  });

  it('preserves absolute http/https URLs', () => {
    expect(resolveAbsoluteAssetUrl('https://heleno.dev', 'https://cdn.example.com/a.jpg')).toBe(
      'https://cdn.example.com/a.jpg',
    );
    expect(resolveAbsoluteAssetUrl('https://heleno.dev', 'http://cdn.example.com/a.jpg')).toBe(
      'http://cdn.example.com/a.jpg',
    );
  });

  it('falls back when assetPath is empty, null, or undefined', () => {
    expect(resolveAbsoluteAssetUrl('https://heleno.dev', null)).toBe(
      `https://heleno.dev${DEFAULT_OG_IMAGE_PATH}`,
    );
    expect(resolveAbsoluteAssetUrl('https://heleno.dev', undefined)).toBe(
      `https://heleno.dev${DEFAULT_OG_IMAGE_PATH}`,
    );
    expect(resolveAbsoluteAssetUrl('https://heleno.dev', '   ', DEFAULT_PODCAST_OG_IMAGE_PATH)).toBe(
      `https://heleno.dev${DEFAULT_PODCAST_OG_IMAGE_PATH}`,
    );
  });
});

describe('inferImageMimeType', () => {
  it('infers MIME types for supported extensions including query strings', () => {
    expect(inferImageMimeType('https://heleno.dev/images/a.jpg')).toBe('image/jpeg');
    expect(inferImageMimeType('https://heleno.dev/images/a.JPEG?v=2')).toBe('image/jpeg');
    expect(inferImageMimeType('https://heleno.dev/images/a.png#hash')).toBe('image/png');
    expect(inferImageMimeType('https://heleno.dev/images/a.gif')).toBe('image/gif');
    expect(inferImageMimeType('https://heleno.dev/images/a.webp')).toBeUndefined();
    expect(inferImageMimeType('https://heleno.dev/images/a.svg')).toBeUndefined();
  });
});

describe('buildOgImageMeta', () => {
  it('returns default WebP 1200x630 metadata when no image is provided', () => {
    expect(buildOgImageMeta('https://heleno.dev', undefined)).toEqual({
      url: 'https://heleno.dev/images/default-post.webp',
      secureUrl: 'https://heleno.dev/images/default-post.webp',
      type: undefined,
      width: DEFAULT_OG_IMAGE_WIDTH,
      height: DEFAULT_OG_IMAGE_HEIGHT,
      alt: DEFAULT_OG_IMAGE_ALT,
    });
  });

  it('preserves default WebP paths with 1200x630 dimensions and undefined og:image:type', () => {
    expect(buildOgImageMeta('https://heleno.dev/', '/images/default-post.webp', { alt: 'Post' })).toEqual({
      url: 'https://heleno.dev/images/default-post.webp',
      secureUrl: 'https://heleno.dev/images/default-post.webp',
      type: undefined,
      width: 1200,
      height: 630,
      alt: 'Post',
    });

    expect(
      buildOgImageMeta('https://heleno.dev', '/images/default-podcast.webp', {
        fallbackPath: DEFAULT_PODCAST_OG_IMAGE_PATH,
        alt: 'Podcast',
      }),
    ).toEqual({
      url: 'https://heleno.dev/images/default-podcast.webp',
      secureUrl: 'https://heleno.dev/images/default-podcast.webp',
      type: undefined,
      width: 1200,
      height: 630,
      alt: 'Podcast',
    });
  });

  it('resolves custom relative image without setting fabricated 1200x630 dimensions', () => {
    expect(
      buildOgImageMeta('https://heleno.dev', '/images/2026-02-20-055833_hyprshot.png', {
        alt: 'Bereia',
      }),
    ).toEqual({
      url: 'https://heleno.dev/images/2026-02-20-055833_hyprshot.png',
      secureUrl: 'https://heleno.dev/images/2026-02-20-055833_hyprshot.png',
      type: 'image/png',
      alt: 'Bereia',
    });
  });

  it('preserves external HTTPS image URLs without fabricated dimensions', () => {
    expect(
      buildOgImageMeta('https://heleno.dev', 'https://cdn.example.com/cover.jpg', {
        alt: 'External Cover',
      }),
    ).toEqual({
      url: 'https://cdn.example.com/cover.jpg',
      secureUrl: 'https://cdn.example.com/cover.jpg',
      type: 'image/jpeg',
      alt: 'External Cover',
    });
  });
});
