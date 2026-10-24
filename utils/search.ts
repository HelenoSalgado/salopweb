/**
 * Busca client-side sobre um índice estático pré-renderizado.
 *
 * O site é publicado como estático (sem runtime de servidor), portanto endpoints
 * dinâmicos como /api/search?q=... não existem em produção. Em vez disso, um
 * índice JSON é gerado no build e filtrado no navegador.
 */

export interface SearchIndexEntry {
  path: string;
  title: string;
  description: string;
}

export const SEARCH_MIN_LENGTH = 2;
export const SEARCH_MAX_RESULTS = 10;

/** Minúsculas, sem acentos e sem espaços nas pontas. */
export const normalizeSearchText = (value: string): string =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export const searchEntries = (
  entries: readonly SearchIndexEntry[],
  term: string,
  limit: number = SEARCH_MAX_RESULTS
): SearchIndexEntry[] => {
  const needle = normalizeSearchText(term);
  if (needle.length < SEARCH_MIN_LENGTH) {
    return [];
  }

  const results: SearchIndexEntry[] = [];
  for (const entry of entries) {
    if (results.length >= limit) break;
    if (
      normalizeSearchText(entry.title).includes(needle) ||
      normalizeSearchText(entry.description).includes(needle)
    ) {
      results.push(entry);
    }
  }
  return results;
};
