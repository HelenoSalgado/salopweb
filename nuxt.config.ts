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
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024
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
  hooks: {
    "vite:extendConfig"(config, { isClient }) {
      if (isClient) {
        config.build = config.build || {};
        config.build.rollupOptions = config.build.rollupOptions || {};
        config.build.rollupOptions.output = config.build.rollupOptions.output || {};

        config.build.rollupOptions.output.manualChunks = function manualChunks(id) {
          // Separar os módulos essenciais do Vue para manter hidratação
          if (
            id.includes('node_modules/vue/runtime-core') ||
            id.includes('node_modules/vue/runtime-dom') ||
            id.includes('node_modules/vue/server-renderer') ||
            id.includes('node_modules/.vite/deps/vue')
          ) {
            return 'vue-runtime';
          }

          // Separar a maior parte do sistema de reatividade
          if (
            id.includes('@vue/reactivity') ||
            (id.includes('reactivity') && !id.includes('runtime-core'))
          ) {
            return 'vue-reactivity';
          }

          // Separar utilitários compartilhados do Vue
          if (
            id.includes('@vue/shared') ||
            id.includes('vue/shared')
          ) {
            return 'vue-shared';
          }

          // Separar runtime do Vite e polyfills
          if (
            id.includes('vite/modulepreload-polyfill') ||
            id.includes('vite/client') ||
            id.includes('virtual:vite') ||
            id.includes('__vite__')
          ) {
            return 'vite-runtime';
          }

          // Todos os módulos restantes de node_modules
          if (
            id.includes('node_modules')
          ) {
            return 'vendor';
          }
        };

        config.build.rollupOptions.output.chunkFileNames = '[name]-[hash].js';
        config.build.rollupOptions.output.entryFileNames = '[name]-[hash].js';
      }
    }
  },
  modules: [
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxtjs/google-fonts",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap"
  ],
  colorMode: {
    classSuffix: '',
    preference: 'dark',
    storageKey: 'salop-color-mode',
    fallback: 'dark',
    storage: 'cookie',
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