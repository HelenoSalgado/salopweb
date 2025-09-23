import { defineNuxtConfig } from "nuxt/config";
import type { NitroConfig } from 'nitropack'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  routeRules: <NitroConfig['routeRules']>{
    // Aplica a regra para todas as rotas
    '/**': { trailingSlash: false }
  },
  app: {
    buildAssetsDir: "nuxt",
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  nitro: {
    preset: 'cloudflare-pages',
    output: {
      publicDir: 'dist',
    },
    minify: true, // Enabled minification for production
    prerender: {
      crawlLinks: true,
      routes: ['/']
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
  experimental: {
    //renderJsonPayloads: false,
    //payloadExtraction: false
  },
  runtimeConfig: {
    public: {
      site: {
        defaultLocale: 'pt-BR',
        url: process.env.BASE_URL
      },
    }
  },
  image: {
    format: ['webp'],
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
      },
      postImage: {
        sizes: 'sm:100vw md:70vw lg:800px xl:1200px', // Ajustado para desktop
        modifiers: {
          quality: 80, // Manter qualidade padrão, pode ser ajustado
        }
      }
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ["@nuxt/content", "@nuxt/image", "@nuxt/eslint", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Inter: [400, 700],
      Lora: {
        wght: [400, 700],
        ital: [400]
      }
    },
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
        '~~/transformers/date-published'
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

});
