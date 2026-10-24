<script setup lang="ts">
import type { CardPost, Categories, PostsPagination } from '~~/server/types';

/**
 * Listagem paginada do blog. A página vem da rota (/blog ou /blog/pagina/N),
 * nunca da query string — ver utils/pagination.ts para o motivo.
 */
const { page } = defineProps<{ page: number }>();

const POSTS_PER_PAGE = 7;

const { data: allCategories } = await useFetch<Categories>('/api/categories', {
  key: 'blog-categories-list',
  pick: ['categories', 'slugified_categories'],
});

const { data, error } = await useFetch<PostsPagination<CardPost[]>>('/api/posts', {
  key: `blog-posts-page-${page}`,
  query: {
    limit: POSTS_PER_PAGE,
    page
  },
  pick: ['posts', 'totalPages']
});

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 500,
    message: error.value.message || 'Ocorreu um erro ao buscar os posts.'
  });
}

if (page > 1 && page > (data.value?.totalPages ?? 0)) {
  throw createError({ statusCode: 404, message: 'Página não encontrada.' });
}

useSeoMeta({
  title: page > 1 ? `Escritos Recentes — Página ${page}` : 'Escritos Recentes',
  description: 'Explore todos os posts do blog.',
});
</script>

<template>
  <div>
    <h1>Escritos Recentes</h1>

    <CategoriesList
      v-if="allCategories?.categories?.length" v-bind="{
        categories: allCategories.categories,
        slugifiedCategories: allCategories.slugified_categories
      }" />

    <BlogPostCard
      v-for="post in data?.posts"
      :key="post.path"
      v-bind="post"
    />

    <Pagination
      v-if="data?.totalPages && data.totalPages > 1" :current-page="page"
      :total-pages="data.totalPages" base-url="/blog" />
  </div>
</template>
