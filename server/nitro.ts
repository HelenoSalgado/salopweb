import type { NitroConfig } from 'nitropack'

export default {
  preset: 'cloudflare-pages',
  cloudflare: {
    nodeCompat: true
  },
  output: {
    publicDir: 'dist',
  },
  minify: true,
  prerender: {
    crawlLinks: true,
    // '/api/search-index.json' e '/apoiar' (página isolada) não são descobertos
    // apenas pelo crawler, por isso precisam ser listados explicitamente.
    routes: ['/', '/apoiar', '/api/search-index.json'],
    ignore: [
      '__nuxt_content/home/sql_dump.txt',
      '__nuxt_content/blog/sql_dump.txt',
      '__nuxt_content/sobre/sql_dump.txt'
    ],
    // Aumenta paralelismo para prerender mais rápido
    concurrency: 3,
    failOnError: false
  },
  compressPublicAssets: true,
  routeRules: {
    '/api/**': { trailingSlash: false },
    '/**': {
      trailingSlash: true
    },
    '/css/**': { trailingSlash: false },
    '/js/**': { trailingSlash: false },
    '/fonts/**': { trailingSlash: false, headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/docs/**': { trailingSlash: false, headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/images/**': { trailingSlash: false, headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/podcast/*.mp3': { 
      trailingSlash: false, 
      headers: { 
        'Content-Type': 'audio/mpeg',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
      compress: false
    },
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
