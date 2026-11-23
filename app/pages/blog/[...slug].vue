<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';
import type { CardPost } from '~~/server/types';
import {
  DEFAULT_OG_IMAGE_ALT,
  buildCanonicalUrl,
  buildOgImageMeta,
} from '~~/utils/seo';

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

const canonicalPostUrl = computed(() =>
  buildCanonicalUrl(siteUrl, post.value?.path || route.path),
);

const { data: postsRelated } = await useFetch<CardPost[]>('/api/posts', {
  query: {
    categories: post.value?.categories || [],
    excludePath: post.value?.path || '',
    limit: 4
  },
  watch: [post]
})

// Configuração de SEO
if (post.value) {
  const ogImage = buildOgImageMeta(siteUrl, post.value.image, {
    alt: post.value.title || DEFAULT_OG_IMAGE_ALT,
  });

  useSeoMeta({
    articleAuthor: [post.value.author || "Heleno Salgado"],
    title: post.value.title,
    description: post.value.description,
    ogTitle: post.value.title,
    ogDescription: post.value.description,
    ogUrl: canonicalPostUrl.value,
    ogImage: ogImage.url,
    ogImageSecureUrl: ogImage.secureUrl,
    ogImageType: ogImage.type,
    ...(ogImage.width ? { ogImageWidth: ogImage.width } : {}),
    ...(ogImage.height ? { ogImageHeight: ogImage.height } : {}),
    ogImageAlt: ogImage.alt,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    twitterTitle: post.value.title,
    twitterDescription: post.value.description,
    twitterImage: ogImage.url,
    twitterImageAlt: ogImage.alt,
    articlePublishedTime: post.value.date,
  });

  const links = post.value.mathfont
    ? [
        {
          rel: 'preload',
          href: '/fonts/KaTeX_Main-Regular.woff2',
          as: 'font' as const,
          type: 'font/woff2',
          crossorigin: 'anonymous' as const
        }
      ]
    : [];

  useHead({
    link: links,
    script: [
      {
        type: 'application/ld+json',
        textContent: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.value.title || 'Post do blog',
          "description": post.value.description || 'Tecnologia, Literatura e Teologia',
          "image": ogImage.url,
          "url": canonicalPostUrl.value,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalPostUrl.value
          },
          "datePublished": post.value.date || '',
          "author": {
            "@type": "Person",
            "name": post.value.author
          }
        })
      }
    ]
  });
}
</script>

<template>

  <div>

    <ReadingProgressBar />

    <article v-if="post?.path" class="prose-container">

      <h1>{{ post.title }}</h1>

      <div v-if="post.categories?.length" class="categories">
        <IconsTag />
        <CategoriesList
v-bind="{
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

      <SharePost :post-title="''" :post-url="canonicalPostUrl" />

    </article>

    <template v-else>
      <ContentPlaceholder />
    </template>

    <h3 class="title-posts-related">Posts Relacionados</h3>

    <template v-if="postsRelated?.length">
      <LazyBlogPostCard v-for="relatedPost in postsRelated" :key="relatedPost?.path" v-bind="relatedPost" />
    </template>
    <div v-else style="display: inline-flex; column-gap: 1rem; align-items: center;">
      <LazyIconsFeather />
      <p>Escrevendo...</p>
    </div>

    <div class="newsletter-wrapper">
      <LazyNewsletterForm/>
    </div>
  </div>
</template>

<style scoped>
.newsletter-wrapper {
  margin-top: 4rem;
}
</style>
