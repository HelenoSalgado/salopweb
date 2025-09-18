<template>
  <ContentRenderer v-if="page" :value="page" />
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData(`sobre`, () => {
  return queryCollection('sobre').first();
});

// Define o título para o template no app.vue
definePageMeta({
  title: 'Sobre'
});

// Define as meta tags específicas para esta página
useSeoMeta({
  title: page.value?.title || 'Sobre Mim',
  description: page.value?.description || 'Conheça mais sobre Heleno Salgado, sua jornada e seus projetos.',
  ogTitle: page.value?.title || 'Sobre | Heleno Salgado',
  ogDescription: page.value?.description || 'Conheça mais sobre Heleno Salgado, sua jornada e seus projetos.',
  ogImage: page.value?.image || 'https://heleno.dev/images/default-post.png',
  ogType: 'profile',
});
</script>