<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';
import type { CardPost } from '~~/server/types';
import { katexCSS } from '~~/server/utils/katex-css';

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
      articleAuthor: [newData.author || "Heleno Salgado"],
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

    const links: any[] = [];
    if (newData.mathfont) {
      links.push(
        {
          rel: 'preload',
          href: '/fonts/KaTeX_Main-Regular.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous'
        },
        {
          rel: 'preload',
          href: '/fonts/KaTeX_Math-Italic.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous'
        }
      );
    }

    useHead({
      link: links,
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
              "name": newData.author
            }
          })
        }
      ]
    });
  }
}, { immediate: true });

useHead({
  style: post.value?.mathfont? [katexCSS] : [],
})
</script>

<template>

  <div>

    <ReadingProgressBar />

    <article v-if="post?.path" class="prose-container">

      <h1>{{ post.title }}</h1>

      <div v-if="post.categories?.length" class="categories">
        <IconsTag />
        <CategoriesList v-bind="{
          categories: post.categories,
          slugifiedCategories: post.slugified_categories
        }" />
      </div>

      <div v-if="post.dateFormatted" class="date-published">
        <IconsCalendar />
        <time :datetime="post.dateFormatted">{{ post.dateFormatted }}</time>
      </div>

      <div v-if="(post.author != 'Heleno Salgado')" class="author">
        <IconsUser />
        <p>{{ post.author }}</p>
      </div>

      <ContentRenderer :value="post.body" class="markdown-content"/>

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

    <h3 style="margin-top: 5rem;">Newsletter</h3>
    <NewsletterForm/>
  </div>
</template>
