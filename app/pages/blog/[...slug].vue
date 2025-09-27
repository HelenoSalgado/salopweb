<script lang="ts" setup>
import type { BlogCollectionItem } from '@nuxt/content';
const route = useRoute();
const relatedPosts = ref<BlogCollectionItem[]>([]);

// --- Buscas de Dados ---
const { data: post, error } = useFetch<BlogCollectionItem>('/api/post', {
  query: {
    path: route.path
  },
  pick: ['categories', 'slugified_categories', 'description', 'body', 'dateFormatted', 'title', 'image']
});

// --- Efeitos Reativos e Lógica Secundária ---
watch([post, error], ([newPage, newError]) => {

  if (newError) {
    throw createError({
      statusCode: newError.statusCode || 404,
      message: newError.message || 'O recurso que você procura não existe ou foi movido de local.'
    });
  }

  if (newPage) {
    useSeoMeta({
      title: newPage.title,
      description: newPage.description,
      ogTitle: newPage.title,
      ogDescription: newPage.description,
      ogImage: newPage.image || 'https://heleno.dev/images/default-post.png',
      ogType: 'article',
      twitterCard: 'summary_large_image',
    });

    if (newPage.categories?.length) {
      $fetch<BlogCollectionItem[]>('/api/posts', {
        query: {
          categories: JSON.stringify(newPage.categories),
          excludePath: newPage.path,
          limit: 4
        }
      }).then(data => {
        relatedPosts.value = data;
      });
    } else {
      relatedPosts.value = [];
    }
  }
}, { immediate: true });


// --- Metadados Estruturados (JSON-LD) ---
const jsonLd = computed(() => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.value?.title || '',
  "description": post.value?.description || '',
  "image": post.value?.image || 'https://heleno.dev/images/default-post.png',
  "datePublished": post.value?.date || '',
  "author": {
    "@type": "Person",
    "name": "Heleno Salgado"
  }
}));

// A função `textContent` garante que o script seja atualizado quando `jsonLd` mudar.
useHead({
  script: [
    {
      type: 'application/ld+json',
      textContent: () => JSON.stringify(jsonLd.value)
    }
  ]
});
</script>
<template>
  <div>
    <ReadingProgressBar />
    <article v-if="post" class="prose-container">
      <h1>{{ post.title }}</h1>

      <CategoriesList v-if="post.categories?.length" :from="{
        categories: [post.categories],
        slugified_categories: [post.slugified_categories]
      }" />

      <time v-if="post.dateFormatted" :datetime="post.dateFormatted">{{ post.dateFormatted }}</time>

      <ContentRenderer v-if="post.body" class="markdown-content" :value="post.body" />

      <SharePost :postTitle="post.title" :postUrl="`https://heleno.dev${post.path}`" />

      <RelatedPosts v-if="relatedPosts.length" :posts="relatedPosts" />
    </article>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 1.5rem;
}
</style>
