import type { NitroConfig } from 'nitropack'

export default {
  preset: 'cloudflare-module',
  cloudflare: {
    nodeCompat: true
  },
  output: {
    publicDir: 'dist',
  },
  minify: true,
  prerender: {
    crawlLinks: true,
    // '/api/search-index.json' não é descoberto pelo crawler (só é buscado
    // via JS no cliente), por isso precisa ser listado explicitamente.
    routes: ['/', '/api/search-index.json'],
    ignore: [
      '__nuxt_content/home/sql_dump.txt',
      '__nuxt_content/blog/sql_dump.txt',
      '__nuxt_content/sobre/sql_dump.txt'
    ],
    // Aumenta paralelismo para prerender mais rápido
    concurrency: 3,
    failOnError: true
  },
  compressPublicAssets: true,
  routeRules: {
    '/': { static: true },
    '/**': {
      trailingSlash: false
    }
  },
  publicAssets: [
    {
      baseURL: '/',
      dir: 'public',
    }
  ],
  esbuild: { 
    options: { 
      legalComments: 'none',
      // Otimizações adicionais do esbuild
      treeShaking: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
    } 
  },
  // Otimiza imports externos
  externals: {
    inline: ['#internal/nitro']
  }
} as NitroConfig
