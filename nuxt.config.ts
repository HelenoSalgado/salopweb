import { defineNuxtConfig } from "nuxt/config";
import nitro from "./server/nitro";

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: true, // Força SSR/hidratação híbrida explícito
  experimental: {
    sharedPrerenderData: false,
    renderJsonPayloads: false,
    entryImportMap: false,
    asyncContext: true,
    lazyHydration: true
  },
  features: {
    //inlineStyles: true  // Força todo CSS a ser inline
  },
  app: {
    buildAssetsDir: "nuxt",
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  nitro,
  hooks: {
    'vite:extendConfig'(config, { isClient }) {
      if (isClient) {
        config.build = config.build || {};
        config.build.rollupOptions = config.build.rollupOptions || {};
        config.build.rollupOptions.output = config.build.rollupOptions.output || {};

        config.build.rollupOptions.output.manualChunks = (id: string) => {
          // Mantém TODO o Vue no bundle principal para evitar problemas de hidratação
          if (id.includes('node_modules/vue')) {
            return null;
          }
          // Outras libs de node_modules vão para vendor
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        };

        config.build.rollupOptions.output.chunkFileNames = '[name]-[hash].js';
        config.build.rollupOptions.output.entryFileNames = '[name]-[hash].js';
      }
    }
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
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: ['vue']
    },
    ssr: {
      noExternal: ['@nuxt/content'] // Trata o módulo como não externo no SSR, reduzindo client bundle
    }
  },
  modules: ["@nuxt/content", "@nuxt/image", "@nuxt/eslint", "@nuxtjs/google-fonts", "@nuxtjs/color-mode", "@nuxtjs/sitemap"],
  colorMode: {
    classSuffix: '',
    preference: 'dark',
    storageKey: 'salop-color-mode',
    fallback: 'dark',
    storage: 'cookie'
  },
  googleFonts: {
    families: {
      Inter: [400, 700],
      Lora: {
        wght: [400, 700],
        ital: [400]
      }
    },
    subsets: ['latin-ext'],
    display: 'swap',
    preconnect: true,
    useStylesheet: true
  },
  content: {
    renderer: {
      anchorLinks: false, // Evita criação de índices
    },
    build: {
      transformers: [
        '~~/transformers/date-published',
        '~~/transformers/category-slugifier',
        '~~/transformers/defaults-global.ts'
      ]
    }
  },
  dir: {
    public: 'public'
  },
  $development: {
    debug: false,
    devtools: {
      vueDevTools: false
    }
  }
});