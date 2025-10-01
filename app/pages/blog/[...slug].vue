<script lang="ts" setup>
import type { BlogCollectionItem } from '@nuxt/content';
import type { CardPost, PostsPagination } from '~~/server/types';
const route = useRoute();

// --- Buscas de Dados ---
const { data, error: postError } = await useAsyncData(`post-${route.path}`, async () => {
  const postData = await $fetch<BlogCollectionItem>('/api/post', {
    query: { path: route.path }
  });

  if (!postData) {
    throw createError({ statusCode: 404 });
  }
  let relatedPostsData: CardPost[] = [];
  if (postData.categories?.length) {
    const relatedResponse = await $fetch<PostsPagination<CardPost[]>>('/api/posts', {
      query: {
        categories: postData.categories,
        excludePath: postData.path,
        limit: 4
      }
    });
    relatedPostsData = relatedResponse.posts || [];
  }
  return { post: postData, relatedPosts: relatedPostsData };
});

const post = computed(() => data.value?.post);
const relatedPosts = computed(() => data.value?.relatedPosts);

watchEffect(() => {
  if (postError?.value) {
    throw createError({
      statusCode: postError.value.statusCode || 404,
      message: postError.value.message || 'O recurso que você procura não existe ou foi movido de local.'
    });
  }
})

watchEffect(() => {
  useSeoMeta({
    title: post?.value?.title,
    description: post?.value?.description,
    ogTitle: post?.value?.title,
    ogDescription: post?.value?.description,
    ogImage: post?.value?.image || 'https://heleno.dev/images/default-post.png',
    ogType: 'article',
    twitterCard: 'summary_large_image',
  });
  useHead({
    script: [
      {
        type: 'application/ld+json',
        textContent: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.value?.title || 'Post do blog',
          "description": post.value?.description || 'Tecnologia, Literatura e Teologia',
          "image": post.value?.image || 'https://heleno.dev/images/default-post.png',
          "datePublished": post.value?.date || '',
          "author": {
            "@type": "Person",
            "name": "Heleno Salgado"
          }
        })
      }
    ]
  });
})
</script>
<template>
  <div>
    <ReadingProgressBar />
    <article v-if="post?.id" class="prose-container">

      <h1>{{ post.title }}</h1>

      <CategoriesList
v-if="post.categories?.length" v-bind="{
        categories: post.categories,
        slugifiedCategories: post.slugified_categories
      }" />

      <time v-if="post.dateFormatted" :datetime="post.dateFormatted">{{ post.dateFormatted }}</time>

      <ContentRenderer class="markdown-content" :value="post.body" />

      <SharePost :post-title="post.title || 'Post'" :post-url="`https://heleno.dev${post.path}`" />

      <RelatedPosts v-if="relatedPosts?.length" :posts="relatedPosts" />
    </article>
  </div>
</template>
