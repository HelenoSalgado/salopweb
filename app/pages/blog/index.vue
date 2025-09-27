<script setup lang="ts">
import type { Categories, PostsPagination } from '~~/server/types';
const route = useRoute();

const POSTS_PER_PAGE = 7;

const currentPage = computed(() => {
  const page = parseInt(route.query.page as string);
  return isNaN(page) || page < 1 ? 1 : page;
});

// Fetch all categories for the list component
const { data: allCategories } = await useFetch<Categories>('/api/categories', {
  pick: ['categories', 'slugified_categories'],
});

// --- Busca de Dados ---
const { data, error } = useFetch<PostsPagination>('/api/posts', {
  query: {
    limit: POSTS_PER_PAGE,
    page: currentPage
  },
  pick: ['posts', 'totalPages'],
})

useSeoMeta({
  title: 'Escritos Recentes',
  description: 'Explore todos os posts do blog.',
});

// --- Efeitos Reativos e Metadados ---
watch(error, () => {
if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 500,
    message: error.value.message || 'Ocorreu um erro ao buscar os posts.'
});
}
}, { immediate: true });

</script>

<template>
  <div>
    <h1>Escritos Recentes</h1>
    <CategoriesList v-if="allCategories?.categories?.length" :from="{
      categories: [allCategories?.categories],
      slugified_categories: [allCategories?.slugified_categories]
    }" />
    <div v-if="data && data.posts && data.posts.length > 0">
      <BlogPostCard v-for="post in data.posts" :key="post.path" :post="post" />
    </div>

    <Pagination v-if="data?.totalPages && data?.totalPages > 1" :current-page="currentPage"
      :total-pages="data?.totalPages" :base-url="`/blog`" />
  </div>
</template>
