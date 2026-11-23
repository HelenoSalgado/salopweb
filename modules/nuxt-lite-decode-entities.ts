import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineNuxtModule } from '@nuxt/kit';
import {
  decodeNuxtLiteMeta,
  decodeNuxtLitePayload,
  type NuxtLiteMeta,
  type NuxtLitePayload,
} from '../utils/html-entities';

interface ManifestEntry {
  meta?: NuxtLiteMeta;
  [key: string]: unknown;
}

function collectPayloadFiles(directory: string, results: string[] = []): string[] {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      collectPayloadFiles(fullPath, results);
    } else if (entry.isFile() && entry.name === '_payload.json') {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Pós-processa os payloads gerados pelo `nuxt-lite` para decodificar entidades
 * HTML nos nós de texto (`t: 't'`) e metadados, evitando que `document.createTextNode`
 * exiba sequências literais como `&amp;` durante navegações SPA.
 */
export default defineNuxtModule({
  meta: {
    name: 'nuxt-lite-decode-entities',
  },
  setup(_options, nuxt) {
    if (nuxt.options.dev || nuxt.options._prepare) {
      return;
    }

    // Registra dentro de `modules:done` para garantir execução estritamente após
    // o hook `close` do `nuxt-lite`, quando `dist/**/_payload.json` e `manifest.json` já existem.
    nuxt.hook('modules:done', () => {
      nuxt.hook('close', () => {
        const publicDir = nuxt.options.nitro?.output?.publicDir || 'dist';
        const outputDir = resolve(nuxt.options.rootDir, publicDir);
        if (!existsSync(outputDir)) {
          return;
        }

        for (const payloadPath of collectPayloadFiles(outputDir)) {
          const payload = JSON.parse(readFileSync(payloadPath, 'utf-8')) as NuxtLitePayload;
          if (decodeNuxtLitePayload(payload)) {
            writeFileSync(payloadPath, JSON.stringify(payload), 'utf-8');
          }
        }

        const manifestPath = join(outputDir, 'manifest.json');
        if (existsSync(manifestPath)) {
          const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as Record<string, ManifestEntry>;
          let manifestChanged = false;

          for (const entry of Object.values(manifest)) {
            if (entry?.meta && decodeNuxtLiteMeta(entry.meta)) {
              manifestChanged = true;
            }
          }

          if (manifestChanged) {
            writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
          }
        }
      });
    });
  },
});
