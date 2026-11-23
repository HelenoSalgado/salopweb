<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import {
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_PATH,
  buildCanonicalUrl,
  buildOgImageMeta,
} from '~~/utils/seo';

const config = useRuntimeConfig();
const siteUrl = config.public.site.url;

const route = useRoute();
const canonicalUrl = computed(() => buildCanonicalUrl(siteUrl, route.path));
const defaultOgImage = buildOgImageMeta(siteUrl, DEFAULT_OG_IMAGE_PATH, {
  alt: DEFAULT_OG_IMAGE_ALT,
});

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Heleno Salgado` : 'Tecnologia, Teologia e Literatura | Heleno Salgado';
  },
  htmlAttrs: {
    lang: 'pt-BR'
  },
  link: [
    { rel: "icon", href: "/hsl-logo.ico", type: "image/x-icon" },
    { rel: "alternate", type: "application/rss+xml", title: "RSS Feed", href: "/rss.xml" },
    { rel: 'canonical', href: canonicalUrl }
  ]
});

// Define meta tags globais/padrão para todo o site.
// Páginas específicas podem (e devem) sobrescrever estas tags.
// Nota: ogImageWidth/ogImageHeight não são definidos globalmente para não
// propagar dimensões 1200x630 a páginas com imagens customizadas.
useSeoMeta({
  ogLocale: 'pt_BR',
  ogSiteName: 'Heleno Salgado',
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogImage: defaultOgImage.url,
  ogImageSecureUrl: defaultOgImage.secureUrl,
  ogImageType: defaultOgImage.type,
  ogImageAlt: defaultOgImage.alt,
  twitterCard: 'summary_large_image',
  twitterCreator: '@HelenoSalgado',
  twitterSite: '@HelenoSalgado',
  twitterImage: defaultOgImage.url,
  twitterImageAlt: defaultOgImage.alt,
  themeColor: '#14171a'
});
</script>
