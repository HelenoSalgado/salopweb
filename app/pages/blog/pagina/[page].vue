<script setup lang="ts">
import { parsePageParam } from '~~/utils/pagination';

definePageMeta({
  // Rejeita (404) valores não canônicos, como "abc", "0" ou "02".
  validate: route => parsePageParam(route.params.page) !== null,
});

const route = useRoute();
const page = computed(() => parsePageParam(route.params.page) ?? 1);

// A página 1 tem como URL canônica /blog.
if (page.value === 1) {
  await navigateTo('/blog', { redirectCode: 301 });
}
</script>

<template>
  <BlogPostsListing :key="page" :page="page" />
</template>
