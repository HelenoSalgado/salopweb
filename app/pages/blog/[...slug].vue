<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';
import type { CardPost } from '~~/server/types';

const config = useRuntimeConfig();
const siteUrl = config.public.site.url;

const route = useRoute();

// Busca o post principal
const { data: post, error } = await useFetch<BlogCollectionItem>('/api/post', {
  query: { path: route.path.replace(/\/$/, '') },
  server: true
})

if (error.value) {
  throw createError({
    statusCode: error?.value?.statusCode || 404,
    data: error?.value?.data || 'O recurso que você procura não existe ou foi movido de local.'
  });
}

const { data: postsRelated } = await useFetch<CardPost[]>('/api/posts', {
  query: {
    categories: post.value?.categories || [],
    excludePath: post.value?.path || '',
    limit: 4
  },
  watch: [post]
})

// Configuração de SEO
watch(post, (newData) => {
  if (newData) {
    useSeoMeta({
      title: newData?.title,
      description: newData?.description,
      ogTitle: newData?.title,
      ogDescription: newData?.description,
      ogImage: newData?.image || `${siteUrl}/images/default-post.webp`,
      ogType: 'article',
      twitterCard: 'summary_large_image',
      articlePublishedTime: newData?.date,
      ogUrl: siteUrl + newData.path
    });

    useHead({
      script: [
        {
          type: 'application/ld+json',
          textContent: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": newData?.title || 'Post do blog',
            "description": newData?.description || 'Tecnologia, Literatura e Teologia',
            "image": newData?.image || `${siteUrl}/images/default-post.webp`,
            "datePublished": newData?.date || '',
            "author": {
              "@type": "Person",
              "name": "Heleno Salgado"
            }
          })
        }
      ]
    });
  }
}, { immediate: true });
</script>

<template>

  <div>

    <ReadingProgressBar />

    <article v-if="post?.path" class="prose-container">

      <h1>{{ post.title }}</h1>

      <div class="categories">
        <IconsTag />
        <CategoriesList v-if="post.categories?.length" v-bind="{
          categories: post.categories,
          slugifiedCategories: post.slugified_categories
        }" />
      </div>

      <div v-if="post.dateFormatted" class="date-published">
        <IconsCalendar />
        <time :datetime="post.dateFormatted">{{ post.dateFormatted }}</time>
      </div>

      <ContentRenderer class="markdown-content" :value="post.body" />

      <SharePost :post-title="''" :post-url="`${siteUrl}${post.path}`" />

    </article>

    <template v-else>
      <ContentPlaceholder />
    </template>

    <h3 class="title-posts-related">Posts Relacionados</h3>

    <BlogPostCard v-if="postsRelated?.length" v-for="post in postsRelated" :key="post?.path" v-bind="post" />
    <div v-else style="display: inline-flex; column-gap: 1rem; align-items: center;">
      <LazyIconsFeather />
      <p>Escrevendo...</p>
    </div>
  </div>
</template>
