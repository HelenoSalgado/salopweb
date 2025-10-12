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
    concurrency: 3,
    failOnError: true
  },
  compressPublicAssets: true,
  routeRules: {
    '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/css/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    // '/__nuxt_content/**': { prerender: false, ssr: true },
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
  ]
} as NitroConfig
