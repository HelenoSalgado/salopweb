/**
 * Utilitários de paginação baseada em caminho (ex.: /blog/pagina/2).
 *
 * A paginação usa segmentos de rota em vez de query string (?page=N) porque o
 * site é pré-renderizado (SSG): o prerender do Nitro descarta a query string ao
 * gravar os arquivos, fazendo /blog?page=2, /blog?page=3 etc. sobrescreverem
 * /blog/index.html e /blog/_payload.json. Isso gerava HTML e payload de páginas
 * diferentes e, consequentemente, erro de hidratação.
 */

export const PAGE_SEGMENT = 'pagina';

/** Monta a URL de uma página. A página 1 é sempre a URL base (canônica). */
export const buildPageUrl = (baseUrl: string, page: number): string => {
  const base = baseUrl.replace(/\/+$/, '');
  return page <= 1 ? base || '/' : `${base}/${PAGE_SEGMENT}/${page}`;
};

/**
 * Converte o parâmetro de rota em número de página.
 * Retorna `null` para qualquer valor que não seja um inteiro positivo canônico
 * (ex.: "02", "1.5", "abc", "-1"), evitando URLs duplicadas para o mesmo conteúdo.
 */
export const parsePageParam = (raw: unknown): number | null => {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    return null;
  }
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
};
