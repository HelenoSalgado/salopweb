import { defineNuxtConfig } from "nuxt/config";
import nitro from "./server/nitro";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  //ssr: true,

  experimental: {
    sharedPrerenderData: true,
    renderJsonPayloads: true,
    entryImportMap: false,
    asyncContext: true,
    lazyHydration: true,
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: true
        }
      }
    },
    buildCache: true,
    viteEnvironmentApi: true
  },

  features: {
    // Inline apenas CSS de componentes Vue, não CSS global
    // Reduz duplicação mantendo CSS global em arquivo separado cacheável
    inlineStyles: false
  },

  app: {
    buildAssetsDir: "nuxt",
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  nitro,

  runtimeConfig: {
    public: {
      site: {
        url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:8788',
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
      
      // Reduz tamanho do bundle
      minify: 'esbuild',
      
      // Remove comentários e sourcemaps em produção
      sourcemap: false,
      
      // Otimizações de performance
      target: 'esnext',
      
      // Controla tamanho dos chunks para melhor caching
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        output: {
          manualChunks(id) {

            // if (id.includes('PodcastPlayer')) {
            //   return 'chunk-podcast';
            // }

            // if (id.includes('CategoriesList') || id.includes('RelatedPosts') || id.includes('BlogPostCard') || id.includes('Pagination')) {
            //   return 'chunk-content-helpers';
            // }

            // if (id.includes('@nuxt/content')) {
            //   return 'vendor-nuxt-content';
            // }

            if (
              (id.includes('vue') || id.includes('@vue')) ||
              id.includes('TheHeader') ||
              id.includes('TheSearch') ||
              id.includes('ReadingProgressBar') ||
              id.includes('TheFooter') ||
              id.includes('@nuxt/image')) {

              return 'chunk-layout-shell';

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
  vitalizer: {
     disableStylesheets: 'entry',
     disablePrefetchLinks: 'dynamicImports' // Melhora LCP
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    storageKey: 'salop-color-mode',
    fallback: 'dark',
    storage: 'cookie'
  },

  googleFonts: {
    outputDir: 'app/assets',
    fontsDir: 'fonts',
    fontsPath: '~/assets/fonts',
    families: {
      Inter: [400],  // Removido 700 - não usado no CSS
      Lora: {
        wght: [400],  // Removido 700 - pode usar font-weight: bold que simula
        ital: [400]
      }
    },
    subsets: ['latin'],  // Mudado de latin-ext para latin (menor)
    display: 'swap',
    preconnect: true,
    useStylesheet: false,
    overwriting: false,
    preload: true,
    inject: true,
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
        '~~/transformers/convert-time-podcast.ts',
        '~~/transformers/defaults-global.ts'
      ]
    }
  },

  image: {
    provider: 'ipx',
    domains: ['heleno.dev'],
    format: ['webp'],
    presets: {
      profile: {
        width: 60,
        height: 60,
        quality: 100
      }
    },
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280
    },
    ipx: {
      maxAge: 31536000
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
