<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const siteUrl = config.public.site.url;


// --- Possível causa de renderização dupla ---
watchEffect(() => {
  useHead({
    titleTemplate: (titleChunk) => {
      return titleChunk ? `Heleno Salgado | ${titleChunk}` : 'Heleno Salgado - Tecnologia, Teologia e Literatura';
    },
    htmlAttrs: {
      lang: 'pt-BR'
    },
    link: [
      { rel: "icon", href: "/hsl-logo.ico", type: "image/x-icon" },
      { rel: "alternate", type: "application/rss+xml", title: "RSS Feed", href: "/rss.xml" }
    ]
  });
})

// Define meta tags globais/padrão para todo o site.
// Páginas específicas podem (e devem) sobrescrever estas tags.
useSeoMeta({
  ogLocale: 'pt-BR',
  ogSiteName: 'Heleno Salgado',
  ogType: 'website',
  ogImage: `${siteUrl}/images/default-post.webp`, // Imagem padrão
  twitterCard: 'summary_large_image',
  twitterCreator: '@HelenoSalgado',
  twitterSite: '@HelenoSalgado',
  themeColor: '#14171a'
});
</script>
