<template>
  <div>
    <h1>{{ page?.title }}</h1>
    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const siteUrl = config.public.site.url;

const { data: page } = await useFetch('/api/pages/sobre');

definePageMeta({
  title: 'Sobre'
});

watchEffect(() => {
  useSeoMeta({
  title: page.value?.title || 'Sobre Mim',
  description: page.value?.description || 'Conheça mais sobre Heleno Salgado, sua jornada e seus projetos.',
  ogTitle: page.value?.title || 'Sobre',
  ogDescription: page.value?.description || 'Conheça mais sobre Heleno Salgado, sua jornada e seus projetos.',
  ogImage: page.value?.image || `${siteUrl}/images/default-post.webp`,
  ogType: 'profile',
});
})
</script>
