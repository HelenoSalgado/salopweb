<script setup lang="ts">
import type { CardPost, Categories, PostsPagination } from '~~/server/types';
import { DEFAULT_OG_IMAGE_PATH, buildOgImageMeta } from '~~/utils/seo';

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

const siteUrl = useRuntimeConfig().public.site.url;
const title = page > 1 ? `Escritos Recentes — Página ${page}` : 'Escritos Recentes';
const description = 'Explore todos os posts do blog.';
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
