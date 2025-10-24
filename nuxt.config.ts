import { defineNuxtConfig } from "nuxt/config";
import nitro from "./server/nitro";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  //ssr: true,

  experimental: {
    sharedPrerenderData: true,
    renderJsonPayloads: true,
    entryImportMap: true,
    asyncContext: true,
    lazyHydration: true,
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: true
        }
      }
    }
  },

  features: {
    // Inline apenas CSS de componentes Vue, não CSS global
    // Reduz duplicação mantendo CSS global em arquivo separado cacheável
    inlineStyles: (id) => !!id && id.includes('.vue')
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
    formats: ['webp', 'avif'],
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280
    },
    presets: {
      profile: {
        modifiers: {
          width: 55,
          height: 55,
          quality: 100
        }
      }
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    optimizeDeps: {
      include: ['vue'],
      // Exclui @nuxt/content do cliente se usado apenas no servidor
      exclude: ['@nuxt/content']
    },

    build: {
      // Mantém true para code splitting de CSS por rota (reaproveitamento de estilos já baixados)
      cssCodeSplit: true,

      rollupOptions: {
        output: {
          manualChunks(id) {
            /*=== Componentes críticos de layout e core vue (apenas JS) ===*/
            /*
              Chunk 1: O esqueleto principal do layout. | Preciso entender melhor a forma como o Vue toma o controle no client, pois ele precisa de acesso imediato aos componentes principais do layout, tive que deixá-los no mesmo arquivo. Mesmo assim a otimização foi bem sucedida, pude dividir o chunk mais pesado em dois: 1. 103.34 kB 2 .157.42 kB.
            */

            if (
              (id.includes('vue') || id.includes('@vue')) ||
              id.includes('TheHeader') ||
              id.includes('TheSearch') ||
              id.includes('ReadingProgressBar') ||
              id.includes('TheFooter') ||
              id.includes('@nuxt/image')) {

              return 'chunk-layout-shell';

            }

            // Chunk 2: Componentes que renderizam conteúdo.
            if (id.includes('CategoriesList') || id.includes('RelatedPosts') || id.includes('BlogPostCard') || id.includes('Pagination')) {
              return 'chunk-content-helpers';
            }

            // Separação granular de node_modules
            if (id.includes('node_modules')) {

              // Isola a biblioteca TagCloud em seu próprio chunk
              if (id.includes('TagCloud')) {
                return 'tagcloud-lib';
              }

              /*
                @nuxt/content será excluído do cliente via optimizeDeps.exclude
                mas se algum código cliente ainda o referenciar, isola aqui.
              */
              if (id.includes('@nuxt/content')) {
                return 'nuxt-content-fallback';
              }

              // UI libraries
              if (id.includes('@headlessui') || id.includes('@heroicons')) {
                return 'ui-libs';
              }

              // Utilities
              if (id.includes('lodash') || id.includes('date-fns')) {
                return 'utils';
              }

              return 'vendor';
            }
          }
        }
      }
    }
  },

  modules: [
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxtjs/google-fonts",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
    "nuxt-vitalizer"
  ],

  // Configuração opcional do nuxt-vitalizer (se instalado)
  // vitalizer: {
  //    disableStylesheets: 'entry',
  //    disablePrefetchLinks: 'dynamicImports' // Melhora LCP
  // },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    storageKey: 'salop-color-mode',
    fallback: 'dark',
    storage: 'cookie'
  },

  googleFonts: {
    fontsDir: 'public/fonts',
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
    useStylesheet: false,
    download: true
  },

  content: {
    renderer: {
      anchorLinks: false,
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
