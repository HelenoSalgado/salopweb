import { describe, it, expect } from 'vitest';
import { slugify } from '../../utils/slugify';

describe('slugify utility', () => {
  it('converts simple words to lowercase', () => {
    expect(slugify('Filosofia')).toBe('filosofia');
    expect(slugify('TECNOLOGIA')).toBe('tecnologia');
  });

  it('removes accents and diacritics properly', () => {
    expect(slugify('Ética a Nicômaco')).toBe('etica-a-nicomaco');
    expect(slugify('Ação & Emoção')).toBe('acao-emocao');
    expect(slugify('Criação do Mundo')).toBe('criacao-do-mundo');
  });

  it('replaces spaces with hyphens and collapses multiple spaces', () => {
    expect(slugify('codigo   limpo  e  solido')).toBe('codigo-limpo-e-solido');
  });

  it('strips punctuation and special characters', () => {
    expect(slugify('O que é um nome de domínio?')).toBe('o-que-e-um-nome-de-dominio');
    expect(slugify('C++ & C# no Linux!')).toBe('c-c-no-linux');
  });

  it('handles repeated hyphens and boundary cases', () => {
    expect(slugify('---palavra---chave---')).toBe('-palavra-chave-');
    expect(slugify('')).toBe('');
  });
});
