<template>
    <ContentRenderer v-if="page" :value="page" />
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData(`home`, () => {
  return queryCollection('home').first();
});

// Define o título para o template no app.vue
definePageMeta({
  title: 'Início'
});

// Define as meta tags específicas para esta página
useSeoMeta({
  title: page.value?.title || 'Início',
  description: page.value?.description || 'Veja os artigos mais recentes. Conheça o propósito deste blog.',
  ogTitle: page.value?.title || 'Heleno Salgado',
  ogDescription: page.value?.description || 'Veja os artigos mais recentes. Conheça o propósito deste blog.',
  ogImage: page.value?.image || 'https://heleno.dev/images/default-post.png',
  twitterCard: 'summary_large_image',
});
</script>