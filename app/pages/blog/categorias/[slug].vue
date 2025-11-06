<script setup lang="ts">
import type { CardPost, PostsPagination } from '~~/server/types';

const route = useRoute();
const category = route.params.slug as string;
const POSTS_PER_PAGE = 7;

const currentPage = computed(() => {
  const page = parseInt(route.query.page as string);
  return isNaN(page) || page < 1 ? 1 : page;
});

const { data, error } = useFetch<PostsPagination<CardPost[]>>(`/api/categories/${category}`, {
  query: {
    page: currentPage,
    limit: POSTS_PER_PAGE
  },
  pick: ['categoryName', 'posts', 'totalPages']
});


if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 500,
    message: error.value.message || 'Ocorreu um erro ao buscar os posts.'
  });
}

useSeoMeta({
  title: `Posts sobre ${data.value?.categoryName || category}`,
  description: `Explore todos os posts na categoria ${data.value?.categoryName || category}.`
});

</script>

<template>
  <div>
    <h1>Sobre {{ data?.categoryName }}</h1>

    <BlogPostCard v-if="data?.posts.length" v-for="post in data.posts" :key="post.path" v-bind="post" />

    <Pagination v-if="data?.totalPages && data?.totalPages > 1" :current-page="currentPage"
      :total-pages="data.totalPages" :base-url="`/blog/categorias/${category}`" />
  </div>
</template>
