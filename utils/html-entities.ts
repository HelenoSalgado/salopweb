export interface NuxtLiteDomNode {
  t?: 't' | 'c' | 'e';
  v?: string;
  g?: string;
  a?: Record<string, string>;
  c?: NuxtLiteDomNode[];
}

export interface NuxtLiteMeta {
  title?: string;
  description?: string;
  canonical?: string;
  og?: Record<string, string>;
  twitter?: Record<string, string>;
}

export interface NuxtLitePayload {
  dom?: NuxtLiteDomNode[];
  meta?: NuxtLiteMeta;
  [key: string]: unknown;
}

const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00A0',
  raquo: '»',
  laquo: '«',
  copy: '©',
  reg: '®',
  trade: '™',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  bull: '•',
  middot: '·',
};

const HTML_ENTITY_REGEX = /&(?:#(\d+)|#x([0-9a-f]+)|([a-z][a-z0-9]+));/gi;

/**
 * Decodifica entidades HTML comuns e referências numéricas em passagem única,
 * evitando dupla decodificação (ex.: `&amp;lt;` torna-se `&lt;`, nunca `<`).
 */
export function decodeHtmlEntities(input: string): string {
  if (!input.includes('&')) {
    return input;
  }

  return input.replace(
    HTML_ENTITY_REGEX,
    (fullMatch, dec?: string, hex?: string, named?: string) => {
      if (dec !== undefined || hex !== undefined) {
        const codePoint = dec !== undefined
          ? Number.parseInt(dec, 10)
          : Number.parseInt(hex!, 16);

        if (Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff) {
          return String.fromCodePoint(codePoint);
        }
        return fullMatch;
      }

      if (named !== undefined) {
        const exact = NAMED_HTML_ENTITIES[named];
        if (exact !== undefined) {
          return exact;
        }
        if (named === named.toUpperCase()) {
          const lower = NAMED_HTML_ENTITIES[named.toLowerCase()];
          if (lower !== undefined) {
            return lower;
          }
        }
      }

      return fullMatch;
    },
  );
}

function decodeRecordValues(record: Record<string, string> | undefined): boolean {
  if (!record) {
    return false;
  }

  let changed = false;
  for (const key of Object.keys(record)) {
    const original = record[key];
    if (typeof original === 'string') {
      const decoded = decodeHtmlEntities(original);
      if (decoded !== original) {
        record[key] = decoded;
        changed = true;
      }
    }
  }
  return changed;
}

/**
 * Decodifica entidades HTML presentes nos metadados extraídos pelo nuxt-lite.
 * Retorna `true` caso algum campo tenha sido modificado.
 */
export function decodeNuxtLiteMeta(meta: NuxtLiteMeta): boolean {
  let changed = false;

  if (typeof meta.title === 'string') {
    const decoded = decodeHtmlEntities(meta.title);
    if (decoded !== meta.title) {
      meta.title = decoded;
      changed = true;
    }
  }

  if (typeof meta.description === 'string') {
    const decoded = decodeHtmlEntities(meta.description);
    if (decoded !== meta.description) {
      meta.description = decoded;
      changed = true;
    }
  }

  if (decodeRecordValues(meta.og)) {
    changed = true;
  }

  if (decodeRecordValues(meta.twitter)) {
    changed = true;
  }

  return changed;
}

function decodeDomNodes(nodes: NuxtLiteDomNode[]): boolean {
  let changed = false;
  const stack: NuxtLiteDomNode[] = [...nodes];

  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) {
      continue;
    }

    if (node.t === 't' && typeof node.v === 'string') {
      const decoded = decodeHtmlEntities(node.v);
      if (decoded !== node.v) {
        node.v = decoded;
        changed = true;
      }
    } else if (Array.isArray(node.c) && node.c.length > 0) {
      for (const child of node.c) {
        stack.push(child);
      }
    }
  }

  return changed;
}

/**
 * Decodifica entidades HTML nos nós de texto (`t: 't'`) e metadados de um payload
 * do nuxt-lite, preservando comentários e atributos intactos.
 */
export function decodeNuxtLitePayload(payload: NuxtLitePayload): boolean {
  let changed = false;

  if (Array.isArray(payload.dom) && decodeDomNodes(payload.dom)) {
    changed = true;
  }

  if (payload.meta && typeof payload.meta === 'object' && decodeNuxtLiteMeta(payload.meta)) {
    changed = true;
  }

  return changed;
}
