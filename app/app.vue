<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
watchEffect(() => {
  useHead({
    titleTemplate: (titleChunk) => {
      return titleChunk ? `Heleno Salgado | ${titleChunk}` : 'Heleno Salgado - Tecnologia, Teologia e Literatura';
    },
    htmlAttrs: {
      lang: 'pt-BR'
    },
    link: [
      { rel: "icon", href: "/hsl-logo.ico", type: "image/x-icon" }
    ]
  });
})

// Define meta tags globais/padrão para todo o site.
// Páginas específicas podem (e devem) sobrescrever estas tags.
useSeoMeta({
  ogLocale: 'pt-BR',
  ogSiteName: 'Heleno Salgado',
  ogType: 'website',
  ogImage: 'https://heleno.dev/images/default-post.png', // Imagem padrão
  twitterCard: 'summary_large_image',
  twitterCreator: '@helenosalgado',
  twitterSite: '@helenosalgado',
  themeColor: '#14171a'
});
</script>
