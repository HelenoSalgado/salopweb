<template>
  <div>
    <h1>{{ page?. }}</h1>
    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>

<script setup lang="ts">
const { data: page } = await useFetch('/api/pages/sobre');

definePageMeta({
  title: 'Sobre'
});

watchEffect(() => {
  useSeoMeta({
  title: page.value?.title || 'Sobre Mim',
  description: page.value?.description || 'Conheça mais sobre Heleno Salgado, sua jornada e seus projetos.',
  ogTitle: page.value?.title || 'Sobre | Heleno Salgado',
  ogDescription: page.value?.description || 'Conheça mais sobre Heleno Salgado, sua jornada e seus projetos.',
  ogImage: page.value?.image || 'https://heleno.dev/images/default-post.png',
  ogType: 'profile',
});
})
</script>
