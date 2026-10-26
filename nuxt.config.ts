import { defineNuxtConfig } from "nuxt/config";
import nitro from "./server/nitro";


export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  //ssr: true,

  experimental: {
    extractAsyncDataHandlers: false,
    sharedPrerenderData: true,
    renderJsonPayloads: true,
    entryImportMap: false,
    asyncContext: true,
    lazyHydration: false,
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: true
        },
        trailingSlash: "append"
      }
    },
    buildCache: true,
    viteEnvironmentApi: true
  },

  features: {
    inlineStyles: false
  },

  app: {
    buildAssetsDir: "nuxt",
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      script: [
        {
          src: '/js/site.js',
          defer: true
        }
      ],
      link: [
        {
          rel: 'preload',
          href: '/fonts/EBGaramond-VariableFont_wght.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous'
        },
        {
          rel: 'preload',
          href: '/fonts/Inter-VariableFont_opsz,wght.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous'
        },
      ]
    }
  },

  nitro,

  runtimeConfig: {
    public: {
      site: {
        url: process.env.NUXT_PUBLIC_SITE_URL || 'https://heleno.dev',
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
          manualChunks(id: string) {
            // Isola Podcast Player e dependências de áudio (não carrega no blog)
            if (id.includes('PodcastPlayer') || id.includes('/podcast/')) {
              return 'chunk-podcast';
            }

            // Isola componentes de projetos e portfólio (não carrega no blog)
            if (id.includes('ProjectCard') || id.includes('featured-projects')) {
              return 'chunk-portfolio';
            }
          }
        }
      }
    }
  },

  modules: [
    'nuxt-lite',
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
  ],

  nuxtLite: {
    optimizeCss: true,
    cleanHtml: true,
    pruneOutput: true,
    safelist: [
      'dark',
      'light',
      'open-sidebar',
      'open',
      'active',
      'search-container',
      'search-results',
      'search-result-item',
      'search-result-title',
      'search-result-description',
      'search-no-results',
      'hextra-sidebar-backdrop',
      'hextra-theme-toggle-options',
      'reading-progress-bar',
      'message',
      'success',
      'error',
      'loader',
      'page-enter-active',
      'page-enter-from',
      'page-enter-to',
      'page-leave-active',
      'page-leave-from',
      'page-leave-to',
    ],
  },

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
      markdown: {
        remarkPlugins: {
          'remark-math': {}
        },
        rehypePlugins: {
          'rehype-katex': {
            options: {
              output: 'mathml'
            }
          }
        }
      },
      transformers: [
        '~~/transformers/author-default.ts',
        '~~/transformers/date-published.ts',
        '~~/transformers/category-slugifier.ts',
        '~~/transformers/convert-time-podcast.ts',
        '~~/transformers/defaults-global.ts',
        '~~/transformers/math-font-detector.ts'
      ],
    }
  },

  image: {
    provider: 'ipx',
    domains: ['heleno.dev'],
    format: ['webp'],
    presets: {
      profile: {
        modifiers: {
          width: 40,
          height: 40,
          quality: 100
        }
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

  devtools: {
    enabled: false
  },

  $development: {
    debug: false,
    devtools: {
      enabled: false
    },
    runtimeConfig: {
      public: {
        site: {
          url: 'http://localhost:3000',
        }
      }
    }
  }
});
