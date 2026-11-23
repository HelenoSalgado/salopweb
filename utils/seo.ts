export const DEFAULT_SITE_URL = 'https://heleno.dev';
export const DEFAULT_OG_IMAGE_PATH = '/images/default-post.webp';
export const DEFAULT_PODCAST_OG_IMAGE_PATH = '/images/default-podcast.webp';
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;
export const DEFAULT_OG_IMAGE_ALT = 'Heleno Salgado — Tecnologia, Teologia e Literatura';

export type OgImageMimeType = 'image/jpeg' | 'image/png' | 'image/gif';

export interface OgImageMeta {
  url: string;
  secureUrl: string;
  type?: OgImageMimeType;
  width?: number;
  height?: number;
  alt: string;
}

export interface BuildOgImageOptions {
  fallbackPath?: string;
  alt?: string;
}

const FILE_EXTENSION_REGEX = /\.[a-z0-9]{1,8}$/i;

/**
 * Remove barras finais e espaços do URL base do site.
 */
export function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.trim().replace(/\/+$/, '');
}

/**
 * Normaliza um caminho de rota para o padrão canônico do site:
 * - Remove query strings e fragmentos.
 * - Colapsa barras repetidas e garante barra inicial.
 * - Preserva sem barra final rotas com extensão de arquivo (ex.: /rss.xml).
 * - Garante exatamente uma barra final em rotas de página (ex.: /blog/).
 */
export function normalizeCanonicalPath(path: string): string {
  const withoutFragment = path.split('#')[0] ?? '';
  const withoutQuery = (withoutFragment.split('?')[0] ?? '').trim();
  const prefixed = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
  const collapsed = prefixed.replace(/\/{2,}/g, '/');

  if (collapsed === '/') {
    return '/';
  }

  const trimmedEnd = collapsed.replace(/\/+$/, '');
  if (!trimmedEnd) {
    return '/';
  }

  const lastSegment = trimmedEnd.split('/').pop() ?? '';
  if (FILE_EXTENSION_REGEX.test(lastSegment)) {
    return trimmedEnd;
  }

  return `${trimmedEnd}/`;
}

/**
 * Monta a URL canônica absoluta combinando o URL base do site e o caminho normalizado.
 */
export function buildCanonicalUrl(siteUrl: string, path: string): string {
  return `${normalizeSiteUrl(siteUrl)}${normalizeCanonicalPath(path)}`;
}

/**
 * Resolve um caminho de asset (relativo ou absoluto) para uma URL absoluta.
 */
export function resolveAbsoluteAssetUrl(
  siteUrl: string,
  assetPath: string | null | undefined,
  fallbackPath: string = DEFAULT_OG_IMAGE_PATH,
): string {
  const raw = assetPath?.trim() || fallbackPath;

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  const normalized = `/${raw.replace(/^\/+/, '')}`;
  return `${normalizeSiteUrl(siteUrl)}${normalized}`;
}

/**
 * Infere o MIME type Open Graph aceito por `og:image:type` a partir da extensão da URL.
 * Formatos como `.webp` retornam `undefined` para que o crawler utilize o `Content-Type` HTTP.
 */
export function inferImageMimeType(url: string): OgImageMimeType | undefined {
  const withoutFragment = url.split('#')[0] ?? '';
  const cleanUrl = (withoutFragment.split('?')[0] ?? '').trim().toLowerCase();

  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  if (cleanUrl.endsWith('.png')) {
    return 'image/png';
  }
  if (cleanUrl.endsWith('.gif')) {
    return 'image/gif';
  }

  return undefined;
}

/**
 * Constrói os metadados de `og:image` com URL absoluta.
 * Atribui dimensões 1200x630 apenas quando a imagem resolvida corresponde às
 * imagens padrão conhecidas e omite `type` para WebP (compatível com Unhead/crawlers).
 */
export function buildOgImageMeta(
  siteUrl: string,
  imagePath?: string | null,
  options?: BuildOgImageOptions,
): OgImageMeta {
  const fallbackPath = options?.fallbackPath ?? DEFAULT_OG_IMAGE_PATH;
  const url = resolveAbsoluteAssetUrl(siteUrl, imagePath, fallbackPath);
  const defaultPostUrl = resolveAbsoluteAssetUrl(siteUrl, DEFAULT_OG_IMAGE_PATH);
  const defaultPodcastUrl = resolveAbsoluteAssetUrl(siteUrl, DEFAULT_PODCAST_OG_IMAGE_PATH);
  const isKnownDefaultSize = url === defaultPostUrl || url === defaultPodcastUrl;

  return {
    url,
    secureUrl: url,
    type: inferImageMimeType(url),
    ...(isKnownDefaultSize
      ? { width: DEFAULT_OG_IMAGE_WIDTH, height: DEFAULT_OG_IMAGE_HEIGHT }
      : {}),
    alt: options?.alt?.trim() || DEFAULT_OG_IMAGE_ALT,
  };
}
