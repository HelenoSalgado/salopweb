<script lang="ts" setup>
import ReadingProgressBar from '~/components/ReadingProgressBar.vue';
const route = useRoute();
const { data: page } = await useAsyncData(`blog-post-${route.path}`, () => 
  queryCollection('blog').path(route.path).first()
);

// Define o título para o template no app.vue
definePageMeta({
  title: 'Artigo'
});

// Define as meta tags específicas para este post
useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
  ogTitle: page.value?.title,
  ogDescription: page.value?.description,
  ogImage: page.value?.image || 'https://heleno.dev/images/default-post.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
});

// Adiciona o JSON-LD para Rich Results do Google
useHead({
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": page.value?.title,
        "description": page.value?.description,
        "image": page.value?.image || 'https://heleno.dev/images/default-post.png',
        "datePublished": page.value?.date,
        "author": {
          "@type": "Person",
          "name": "Heleno Salgado"
        }
      })
    }
  ]
});
</script>

<template>
  <div>
    <ReadingProgressBar />
    <article class="prose-container">
      <ContentRenderer v-if="page" :value="page" />
      <SharePost v-if="page" :postTitle="page.title" :postUrl="`https://heleno.dev${page.path}`" />
    </article>
  </div>
</template>
