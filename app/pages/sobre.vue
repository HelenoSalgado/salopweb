<template>
  <ContentRenderer v-if="page" :value="page" />
</template>

<script setup lang="ts">
import { useHead } from '#app';

const route = useRoute()
const { data: page } = await useAsyncData(`sobre-${route.path}`, () => { // More unique key
  return queryCollection('sobre').path(route.path).first()
}, {
  lazy: false, // Ensure it's not lazy-loaded during prerender
  server: true, // Ensure it runs on server
});

useHead(() => ({
  title: page.value?.title,
  meta: [
    { name: 'description', content: page.value?.description || 'Os olhos veem apenas o que traz consigo o poder de ver - Cícero.' },
    // Open Graph
    { property: 'og:title', content: page.value?.title },
    { property: 'og:description', content: page.value?.description || 'Os olhos veem apenas o que traz consigo o poder de ver - Cícero.' },
    { property: 'og:image', content: page.value?.image || 'https://heleno.dev/images/default-post.png' },
    { property: 'og:url', content: 'https://heleno.dev' + route.path },
    { property: 'og:type', content: 'profile' }, // Or 'website' if it's a general about page
  ],
}));
</script>

<style scoped>
.about-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}
h1 {
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
}
p {
  line-height: 1.6;
  margin-bottom: 1rem;
}
</style>