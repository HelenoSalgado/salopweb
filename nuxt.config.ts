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
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        {
          rel: 'preload',
          href: '/fonts/Baskervville-Regular.ttf',
          as: 'font',
          type: 'font/ttf',
          crossorigin: 'anonymous'
        },
      ]
    }
  },

  nitro,

  runtimeConfig: {
    public: {
      site: {
        url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
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
      cssCodeSplit: false,

      // Gera um manifesto para análise de bundle
      manifest: false,

      // Reduz tamanho do bundle
      minify: 'esbuild',

      // Remove comentários e sourcemaps em produção
      sourcemap: false,

      // Otimizações de performance
      target: 'esnext',

      // Controla tamanho dos chunks para melhor caching
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        cache: true,
        output: {
          compact: true,
          manualChunks(id) {

            // Isola a página index
            if (id.includes('pages/index.vue')) {
              return 'page-index';
            }

            // Isola outras páginas específicas
            if (id.includes('pages/sobre.vue')) {
              return 'page-sobre';
            }

            if (id.includes('pages/newsletter.vue')) {
              return 'page-newsletter';
            }

            if (id.includes('pages/blog')) {
              return 'page-blog';
            }

            if (id.includes('pages/podcast')) {
              return 'page-podcast';
            }

            // Componentes compartilhados apenas quando necessário
            if (id.includes('TheHeader') || id.includes('TheFooter')) {
              return 'layout-components';
            }

            // Vue core separado
            if (id.includes('vue') || id.includes('@vue')) {
              return 'vue-core';
            }

            // Dependências específicas
            if (id.includes('node_modules')) {
              if (id.includes('TagCloud')) {
                return 'vendor-tagcloud';
              }
              if (id.includes('@nuxt/image')) {
                return 'vendor-image';
              }
              if (id.includes('@nuxt/content')) {
                return 'vendor-content';
              }
              // Outras dependências
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
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
  ],

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    storageKey: 'salop-color-mode',
    fallback: 'dark',
    storage: 'cookie'
  },

  content: {
    renderer: {
      anchorLinks: false

    },
    build: {
      transformers: [
        '~~/transformers/author-default.ts',
        '~~/transformers/date-published.ts',
        '~~/transformers/category-slugifier.ts',
        '~~/transformers/convert-time-podcast.ts',
        '~~/transformers/defaults-global.ts'
      ],
      markdown: {
        remarkPlugins: {
          'remark-math': {}
        },
        rehypePlugins: {
          'rehype-katex': {}
        }
      },
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
