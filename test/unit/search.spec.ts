import { describe, it, expect } from 'vitest';
import { normalizeSearchText, searchEntries, type SearchIndexEntry } from '../../utils/search';

const entries: SearchIndexEntry[] = [
  { path: '/blog/etica', title: 'Ética a Nicômaco', description: 'Resumo do livro de Aristóteles' },
  { path: '/blog/ia', title: 'IA supervisionada', description: 'A visão do programador' },
  { path: '/blog/fisica', title: 'Física', description: 'Natureza segundo Aristóteles' },
];

describe('normalizeSearchText', () => {
  it('removes accents, lowercases and trims', () => {
    expect(normalizeSearchText('  Ética a NICÔMACO ')).toBe('etica a nicomaco');
  });
});

describe('searchEntries', () => {
  it('matches title ignoring accents and case', () => {
    expect(searchEntries(entries, 'etica').map(e => e.path)).toEqual(['/blog/etica']);
    expect(searchEntries(entries, 'FÍSICA').map(e => e.path)).toEqual(['/blog/fisica']);
  });

  it('matches description', () => {
    expect(searchEntries(entries, 'aristoteles').map(e => e.path)).toEqual(['/blog/etica', '/blog/fisica']);
  });

  it('returns nothing for terms shorter than the minimum length', () => {
    expect(searchEntries(entries, 'a')).toEqual([]);
    expect(searchEntries(entries, '   ')).toEqual([]);
  });

  it('respects the limit', () => {
    expect(searchEntries(entries, 'aristoteles', 1)).toHaveLength(1);
  });

  it('returns empty when nothing matches', () => {
    expect(searchEntries(entries, 'inexistente')).toEqual([]);
  });
});
