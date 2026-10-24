<script setup lang="ts">
import { buildPageUrl, parsePageParam } from '~~/utils/pagination';

definePageMeta({
  // Rejeita (404) valores não canônicos, como "abc", "0" ou "02".
  validate: route => parsePageParam(route.params.page) !== null,
});

const route = useRoute();
const category = computed(() => String(route.params.slug));
const page = computed(() => parsePageParam(route.params.page) ?? 1);

// A página 1 tem como URL canônica /blog/categorias/:slug.
if (page.value === 1) {
  await navigateTo(buildPageUrl(`/blog/categorias/${category.value}`, 1), { redirectCode: 301 });
}
</script>

<template>
  <CategoryPostsListing :key="`${category}-${page}`" :category="category" :page="page" />
</template>
