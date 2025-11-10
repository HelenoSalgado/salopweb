import type { NitroConfig } from 'nitropack'

export default {
  preset: 'cloudflare-pages',
  output: {
    publicDir: 'dist',
  },
  minify: true,
  prerender: {
    crawlLinks: true,
    routes: ['/'],
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
      baseURL: 'css',
      dir: 'public/css',
    },
    {
      baseURL: 'images',
      dir: 'public/images',
    },
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
  }
} as NitroConfig
