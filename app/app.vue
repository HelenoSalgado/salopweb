<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Define o template do título e outros atributos globais do <head>
useHead({
  titleTemplate: (titleChunk) => {
    // Se a página fornecer um título, anexa o nome do site.
    // Senão, usa o título padrão.
    return titleChunk ? `Heleno Salgado | ${titleChunk}` : 'Heleno Salgado - Tecnologia, Teologia e Literatura';
  },
  htmlAttrs: {
    lang: 'pt-BR'
  },
  link: [
    { rel: "icon", href: "/hsl-logo.ico", type: "image/x-icon" }
  ]
});

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
