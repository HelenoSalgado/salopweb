import { describe, it, expect } from 'vitest';
import {
  decodeHtmlEntities,
  decodeNuxtLiteMeta,
  decodeNuxtLitePayload,
  type NuxtLitePayload,
} from '../../utils/html-entities';

describe('decodeHtmlEntities', () => {
  it('returns strings without & untouched', () => {
    expect(decodeHtmlEntities('Texto simples sem entidades')).toBe('Texto simples sem entidades');
  });

  it('decodes named HTML entities', () => {
    expect(decodeHtmlEntities('Linux &amp; IA')).toBe('Linux & IA');
    expect(decodeHtmlEntities('res.ok&lt;T&gt;()')).toBe('res.ok<T>()');
    expect(decodeHtmlEntities('&quot;aspas&quot; e &apos;simples&apos;')).toBe('"aspas" e \'simples\'');
    expect(decodeHtmlEntities('Leia Mais &raquo; &laquo; Voltar')).toBe('Leia Mais » « Voltar');
    expect(decodeHtmlEntities('safe&nbsp;refusal')).toBe('safe\u00A0refusal');
    expect(decodeHtmlEntities('A &ndash; B &mdash; C &hellip;')).toBe('A – B — C …');
  });

  it('decodes decimal and hexadecimal numeric entities', () => {
    expect(decodeHtmlEntities('safe&#160;refusal')).toBe('safe\u00A0refusal');
    expect(decodeHtmlEntities('It&#39;s &#x27;ok&#x27; &#xA0;!')).toBe("It's 'ok' \u00A0!");
  });

  it('prevents double decoding in a single pass', () => {
    expect(decodeHtmlEntities('&amp;lt;script&amp;gt;')).toBe('&lt;script&gt;');
    expect(decodeHtmlEntities('&amp;amp;')).toBe('&amp;');
  });

  it('preserves unknown entities and invalid numeric code points', () => {
    expect(decodeHtmlEntities('Keep &inexistente; and &#99999999; intact')).toBe(
      'Keep &inexistente; and &#99999999; intact',
    );
  });
});

describe('decodeNuxtLiteMeta', () => {
  it('decodes entities across meta fields and returns true when changed', () => {
    const meta = {
      title: 'Tecnologia &amp; Teologia',
      description: 'Citação &quot;direta&quot;',
      og: { title: 'IA &amp; Linux' },
      twitter: { description: 'Mais &raquo; detalhes' },
    };

    expect(decodeNuxtLiteMeta(meta)).toBe(true);
    expect(meta).toEqual({
      title: 'Tecnologia & Teologia',
      description: 'Citação "direta"',
      og: { title: 'IA & Linux' },
      twitter: { description: 'Mais » detalhes' },
    });
    expect(decodeNuxtLiteMeta(meta)).toBe(false);
  });
});

describe('decodeNuxtLitePayload', () => {
  it('decodes nested text nodes and meta while preserving comments and attributes', () => {
    const payload: NuxtLitePayload = {
      dom: [
        {
          g: 'section',
          a: { 'data-label': 'A &amp; B' },
          c: [
            { t: 'c', v: 'comment &amp; preserved' },
            { t: 't', v: 'Desktop &amp; Multiplataforma' },
            {
              g: 'code',
              c: [{ t: 't', v: 'res.ok&lt;T&gt;()' }],
            },
          ],
        },
      ],
      meta: {
        title: 'Heleno &amp; Salgado',
        og: { description: 'Linux &amp; IA' },
      },
    };

    expect(decodeNuxtLitePayload(payload)).toBe(true);
    expect(payload.dom?.[0]?.a?.['data-label']).toBe('A &amp; B');
    expect(payload.dom?.[0]?.c?.[0]).toEqual({ t: 'c', v: 'comment &amp; preserved' });
    expect(payload.dom?.[0]?.c?.[1]).toEqual({ t: 't', v: 'Desktop & Multiplataforma' });
    expect(payload.dom?.[0]?.c?.[2]?.c?.[0]).toEqual({ t: 't', v: 'res.ok<T>()' });
    expect(payload.meta).toEqual({
      title: 'Heleno & Salgado',
      og: { description: 'Linux & IA' },
    });
  });

  it('is idempotent and returns false when nothing changed', () => {
    const payload: NuxtLitePayload = {
      dom: [{ g: 'p', c: [{ t: 't', v: 'Texto limpo & normal' }] }],
      meta: { title: 'Título limpo' },
    };

    expect(decodeNuxtLitePayload(payload)).toBe(false);
  });
});
