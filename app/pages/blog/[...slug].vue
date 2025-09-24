<script lang="ts" setup>
const route = useRoute();

const { data: page } = await useAsyncData(`blog-post-${route.path}`, () =>
  queryCollection('blog').path(route.path).first()
);

// Fetch related posts
const { data: relatedPosts } = await useAsyncData(`blog-post-${route.path}-related`, () => {
  const currentPath = route.path;
  const categories = page.value?.categories;

  // If there are no categories, we can't find related posts.
  if (!categories || categories.length === 0) {
    return [];
  }

  // Start query:
  // 1. Must be in the 'blog' collection.
  // 2. Must NOT be the current post itself.
  // 3. Must have at least one matching category.
  const query = queryCollection('blog')
    .where('path', '<>', currentPath) // Exclude the current post
    .orWhere(q => {
      // Add an "OR" condition for each category.
      // The post must match at least one of them.
      for (const category of categories) {
        q.where('categories', 'LIKE', `%"${category}"%`);
      }
      return q;
    })
    .order('date', 'DESC') // Order by date to get the most recent posts
    .limit(4); // Limit to 4 related posts

  return query.all();
});

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
      <h1>{{ page?.title }}</h1>
      <!-- Render categories using the component -->
      <CategoriesList v-if="page?.categories?.length" :from="page.categories"/>
      <!-- Data published -->
      <time :datetime="page?.dateFormatted">{{ page?.dateFormatted }}</time>
      <!-- Render body posts -->
      <ContentRenderer class="markdown-content" v-if="page" :value="page" />
      <SharePost v-if="page" :postTitle="page.title" :postUrl="`https://heleno.dev${page.path}`" />
      <!-- Related Posts Section -->
      <RelatedPosts v-if="relatedPosts?.length" :posts="relatedPosts" />
    </article>
  </div>
</template>
