<script lang="ts" setup>
import { useHead } from '#app';

const route = useRoute()
const { data: page } = await useAsyncData(`blog-post-detail-${route.path}`, () => { // More unique key
  return queryCollection('blog').path(route.path).first()
}, {
  lazy: false, // Ensure it's not lazy-loaded during prerender
  server: true, // Ensure it runs on server
});
const postUrl = 'https://heleno.dev' + route.path;

useHead(() => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.value?.title,
    "description": page.value?.description || 'Os olhos veem apenas o que traz consigo o poder de ver - Cícero.',
    "image": page.value?.image || 'https://heleno.dev/images/default-post.png',
    "datePublished": page.value?.date, // Assuming 'date' is available in page.value
    "author": {
      "@type": "Person",
      "name": "Heleno Salgado" // Replace with actual author name
    },
    "publisher": {
      "@type": "Organization",
      "name": "Heleno Salgado Blog", // Replace with your blog name
      "logo": {
        "@type": "ImageObject",
        "url": "https://heleno.dev/hsl-logo.ico" // Replace with your logo URL
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    }
  };

  return {
    title: page.value?.title,
    meta: [
      { name: 'description', content: page.value?.description || 'Os olhos veem apenas o que traz consigo o poder de ver - Cícero' },
      // Open Graph
      { property: 'og:title', content: page.value?.title },
      { property: 'og:description', content: page.value?.description || 'Os olhos veem apenas o que traz consigo o poder de ver - Cícero' },
      { property: 'og:image', content: page.value?.image || 'https://heleno.dev/images/default-post.png' },
      { property: 'og:url', content: postUrl },
      { property: 'og:type', content: 'article' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: page.value?.title },
      { name: 'twitter:description', content: page.value?.description || 'Os olhos veem apenas o que traz consigo o poder de ver - Cícero' },
      { name: 'twitter:image', content: page.value?.image || 'https://heleno.dev/images/default-post.png' },
    ],
    script: [
      { type: 'application/ld+json', children: JSON.stringify(articleSchema) },
      { src: '/js/share.js', defer: true }
    ]
  };
});
</script>

<template>
  <article class="prose-container">
    <ContentRenderer v-if="page" :value="page" />
    <SharePost v-if="page" :postTitle="page.title" :postUrl="postUrl" />
  </article>
</template>
