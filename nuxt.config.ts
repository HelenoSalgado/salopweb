// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from "vite-tsconfig-paths";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  // vite: {
  //   plugins: [tsconfigPaths()],
  // },
  // devtools: { enabled: false },
  // nitro: {
  //   output: {
  //     publicDir: "dist",
  //   },
  //   baseURL: process.env.NUXT_APP_BASE_URL,
  //   minify: true,
  //   prerender: {
  //     crawlLinks: true,
  //     failOnError: false,
  //   },
  // },

  // experimental: {
  //   renderJsonPayloads: false,
  //   payloadExtraction: true,
  // },

  // app: {
  //   buildAssetsDir: "nuxt",
  //   head: {
  //     base: {
  //       href: process.env.BASE_URL,
  //     },
  //     htmlAttrs: {
  //       lang: "pt-BR",
  //     },
  //     charset: "utf-8",
  //     viewport: "width=device-width, initial-scale=1",
  //     meta: [{ name: "theme-color", content: "#14171a" }],
  //     link: [{ rel: "icon", href: "/hsl-logo.ico", type: "image/x-icon" }],
  //   },
  // },

  // $development: {
  //   devtools: { enabled: false },
  // },

  // $production: {
  //   nitro: {
  //     static: true,
  //   },
  //   app: {
  //     head: {
  //       link: [
  //         { rel: "stylesheet", href: "/css/main.min.css", type: "text/css" },
  //       ],
  //     },
  //   },
  // },

  // runtimeConfig: {
  //   public: {
  //     site: {
  //       defaultLocale: "pt-BR",
  //       url: process.env.BASE_URL,
  //     },
  //   },
  // },
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3, // include h3 headings
        }
      }
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ["@nuxt/content", "@nuxt/image"],
});
