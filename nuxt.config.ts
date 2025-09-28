import { defineNuxtConfig } from "nuxt/config";
import type { NitroConfig } from 'nitropack'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  app: {
    buildAssetsDir: "nuxt",
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  nitro: {
    preset: 'cloudflare-pages',
    output: {
      publicDir: 'dist',
    },
    minify: true,
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      concurrency: 3
    },
    compressPublicAssets: true,
    routeRules: <NitroConfig['routeRules']>{
      //'/blog/**': { ssr: true },
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
  },
  runtimeConfig: {
    public: {
      site: {
        defaultLocale: 'pt-BR',
        url: process.env.BASE_URL,
      },
    }
  },
  image: {
    provider: 'cloudflare',
    cloudflare: {
      baseURL: (process.env.BASE_URL || 'https://heleno.dev').trim().replace(/\/+$/, '')
    },
    formats: ['webp'],
    presets: {
      avatar: {
        modifiers: {
          width: 60,
          height: 60
        }
      },
      screens: {
        'xs': 320,
        'sm': 640,
        'md': 768,
        'lg': 1024,
        'xl': 1280,
        'xxl': 1536,
        '2xl': 1536
      }
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ["@nuxt/content", "@nuxt/image", "@nuxt/eslint", "@nuxtjs/google-fonts", "@nuxtjs/color-mode"],
  colorMode: {
    classSuffix: '',
    preference: 'dark',
    storageKey: 'salop-color-mode',
    fallback: 'dark',
    storage: 'localStorage'
  },
  googleFonts: {
    families: {
      Inter: [400, 700],
      Lora: {
        wght: [400, 700],
        ital: [400]
      }
    },
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    preconnect: true,
    useStylesheet: true
  },
  content: {
    renderer: {
      anchorLinks: false
    },
    build: {
      transformers: [
        '~~/transformers/date-published',
        '~~/transformers/category-slugifier',
        '~~/transformers/defaults-global.ts'
      ],
      markdown: {
        toc: {
          depth: 3, // include h3 headings
        }
      }
    }
  },
  dir: {
    public: 'public'
  },
  $development: {
    debug: true,
    devtools: {
      vueDevTools: true
    }
  }
});
