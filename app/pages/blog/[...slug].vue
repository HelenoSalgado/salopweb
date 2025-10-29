<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';
import type { CardPost } from '~~/server/types';

const route = useRoute();

// Use useAsyncData para encadear as buscas de forma sequencial no servidor (SSR)
const { data, error } = await useAsyncData(route.path, async () => {
  // Busca o post principal
  const post = await $fetch<BlogCollectionItem>('/api/post', {
    query: { path: route.path.replace(/\/$/, '') }
  });

  // Busca os posts relacionados, dependendo do post principal
  const postsRelated = await $fetch<CardPost[]>('/api/posts', {
    query: {
      categories: post.categories || [],
      excludePath: post.path || '',
      limit: 4
    }
  });

  return { post, postsRelated };
});

if(error.value){
  throw createError({
    statusCode: error?.value?.statusCode || 404,
    data: error?.value?.data || 'O recurso que você procura não existe ou foi movido de local.'
  });
}

// Configuração de SEO
watch(data, (newData) => {
  if (newData?.post) {
    useSeoMeta({
      title: newData.post.title,
      description: newData.post.description,
      ogTitle: newData.post.title,
      ogDescription: newData.post.description,
      ogImage: newData.post.image || 'https://heleno.dev/images/default-post.webp',
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
            "headline": newData.post.title || 'Post do blog',
            "description": newData.post.description || 'Tecnologia, Literatura e Teologia',
            "image": newData.post.image || 'https://heleno.dev/images/default-post.webp',
            "datePublished": newData.post.date || '',
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
    <article v-if="data?.post?.id" class="prose-container">
      <h1>{{ data.post.title }}</h1>

      <div class="categories">
        <IconsTag />
        <CategoriesList v-if="data.post.categories?.length" v-bind="{
          categories: data.post.categories,
          slugifiedCategories: data.post.slugified_categories
        }" />
      </div>

      <div class="date-published">
        <IconsCalendar />
        <time v-if="data.post.dateFormatted" :datetime="data.post.dateFormatted">{{ data.post.dateFormatted }}</time>
      </div>

      <ContentRenderer class="markdown-content" :value="data.post.body" />

      <LazySharePost :post-title="data.post.title || 'Post'" :post-url="`https://heleno.dev${data.post.path}`" />

    </article>


    <h3 class="title-posts-related">Posts Relacionados</h3>

    <LazyBlogPostCard v-if="data?.postsRelated?.length" v-for="post in data.postsRelated" :key="post?.path"
      v-bind="post" />
    <div v-else style="display: inline-flex; column-gap: 1rem; align-items: center;">
        <LazyIconsFeather />
        <p>Escrevendo...</p>
    </div>
  </div>
</template>
<style scoped>
article {

  & .date-published,
  & .categories {
    display: flex;
    align-items: center;
    column-gap: 1rem;
    margin-bottom: .5rem;

    & svg {
      width: 20px;
      height: 20px;
    }

    & time {
      font-style: oblique;
    }

  }

  & .markdown-content {
    margin-top: 3rem;
  }

}

& .title-posts-related {
  margin-top: 5rem;
}
</style>
