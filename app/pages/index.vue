<template>
    <ContentRenderer v-if="page" :value="page" />
</template>

<script setup lang="ts">
import { useHead } from '#app';

const { data: page } = await useAsyncData(`home`, () => { // More unique key
  return queryCollection('home').first();
}, {
  lazy: false,
  server: true, 
});

useHead(() => ({
  title: page.value?.title,
  meta: [
    { name: 'description', content: page.value?.description || 'Os olhos veem apenas o que traz consigo o poder de ver - Cícero.' },
    // Open Graph
    { property: 'og:title', content: page.value?.title },
    { property: 'og:description', content: page.value?.description || 'Os olhos veem apenas o que traz consigo o poder de ver - Cícero.' },
    { property: 'og:image', content: page.value?.image || 'https://heleno.dev/images/default-post.png' },
    { property: 'og:url', content: 'https://heleno.dev' + page.value?.path },
    { property: 'og:type', content: 'website' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: page.value?.title },
    { name: 'twitter:description', content: page.value?.description || 'Os olhos veem apenas o que traz consigo o poder de ver - Cícero.' },
    { name: 'twitter:image', content: page.value?.image || 'https://heleno.dev/images/default-post.png' },
  ],
}));
</script>