<script lang="ts" setup>
const route = useRoute();

const { data: page } = await useAsyncData(`blog-post-${route.path}`, () =>
  queryCollection('blog').path(route.path).first()
);

// Adiciona uma verificação para garantir que a página foi encontrada
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Página não encontrada', fatal: true });
}

// Fetch related posts
const { data: relatedPosts } = await useAsyncData(`blog-post-${route.path}-related`, () => {

  if (!page.value?.categories?.length) {
    return Promise.resolve([]);
  }

  const query = queryCollection('blog').where('path', '<', route.path);
  const categories = page.value.categories || [];

  query.orWhere(q => {
    for (const category of categories) {
      q.where('categories', 'LIKE', `%"${category}"%`);
    }
    return q;
  });
  return query.limit(4).all();
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
