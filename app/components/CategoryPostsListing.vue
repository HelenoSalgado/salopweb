<script setup lang="ts">
import type { CardPost, PostsPagination } from '~~/server/types';
import { DEFAULT_OG_IMAGE_PATH, buildOgImageMeta } from '~~/utils/seo';

/**
 * Listagem paginada de uma categoria. A página vem da rota
 * (/blog/categorias/:slug ou /blog/categorias/:slug/pagina/N), nunca da query
 * string — ver utils/pagination.ts para o motivo.
 */
const { category, page } = defineProps<{ category: string; page: number }>();

const POSTS_PER_PAGE = 7;

const { data, error } = await useFetch<PostsPagination<CardPost[]>>(`/api/categories/${category}`, {
  key: `category-${category}-page-${page}`,
  query: {
    page,
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

if (page > 1 && page > (data.value?.totalPages ?? 0)) {
  throw createError({ statusCode: 404, message: 'Página não encontrada.' });
}

const categoryName = data.value?.categoryName || category;
const siteUrl = useRuntimeConfig().public.site.url;
const title = page > 1 ? `Posts sobre ${categoryName} — Página ${page}` : `Posts sobre ${categoryName}`;
const description = `Explore todos os posts na categoria ${categoryName}.`;
const ogImage = buildOgImageMeta(siteUrl, DEFAULT_OG_IMAGE_PATH, { alt: title });

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: ogImage.url,
  ogImageSecureUrl: ogImage.secureUrl,
  ogImageType: ogImage.type,
  ogImageWidth: ogImage.width,
  ogImageHeight: ogImage.height,
  ogImageAlt: ogImage.alt,
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: ogImage.url,
  twitterImageAlt: ogImage.alt,
});
</script>

<template>
  <div>
    <h1>Sobre {{ data?.categoryName }}</h1>

    <template v-if="data?.posts?.length">
      <BlogPostCard v-for="post in data.posts" :key="post.path" v-bind="post" />
    </template>

    <Pagination
      v-if="data?.totalPages && data.totalPages > 1" :current-page="page"
      :total-pages="data.totalPages" :base-url="`/blog/categorias/${category}`" />
  </div>
</template>
