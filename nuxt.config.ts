import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  app: {
    buildAssetsDir: "nuxt",
    head: {
      base: {
        href: process.env.BASE_URL,
      },
      htmlAttrs: {
        lang: "pt-BR",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Heleno Salgado - Tecnologia, Teologia e Literatura", // Global title
      meta: [
        { name: "theme-color", content: "#14171a" },
        { name: "description", content: "Os olhos veem apenas o que traz consigo o poder de ver - Cícero" }, // Global description
        // Open Graph Tags
        { property: "og:title", content: "Heleno Salgado - Tecnologia, Teologia e Literatura" },
        { property: "og:description", content: "Os olhos veem apenas o que traz consigo o poder de ver - Cícero" },
        { property: "og:image", content: "https://heleno.dev/images/default-post.png" }, // Replace with a suitable default image
        { property: "og:url", content: "https://heleno.dev" },
        { property: "og:type", content: "website" },
        // Twitter Card Tags
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@helenosalgado" }, // Replace with your Twitter handle
        { name: "twitter:creator", content: "@helenosalgado" }, // Replace with your Twitter handle
        { name: "twitter:title", content: "Heleno Salgado - Tecnologia, Teologia e Literatura" },
        { name: "twitter:description", content: "Os olhos veem apenas o que traz consigo o poder de ver - Cícero" },
        { name: "twitter:image", content: "https://heleno.dev/images/default-post.png" }, // Replace with a suitable default image
      ],
      link: [
        { rel: "icon", href: "/hsl-logo.ico", type: "image/x-icon" },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lora:ital,wght@0,400;0,700;1,400&display=swap' }
      ],
      script: [{ src: '/js/main.js', defer: true }, { src: '/js/theme.js'}], // NEW: Import main.js
    },
  },
  nitro: {
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
    renderJsonPayloads: false,
    payloadExtraction: true
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
  modules: ["@nuxt/content", "@nuxt/image", "@nuxt/eslint"],
  content: {
    renderer: {
      anchorLinks: false
    },
    ignore: ['**/*.txt'],
    build: {
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
