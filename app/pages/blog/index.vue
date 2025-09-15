<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-posts', () =>
  queryContent('/blog')
    .where({ _file: { $ne: 'index.md' } }) // Exclude index.md
    .only(['title', 'description', 'image', '_path'])
    .find()
);

</script>

<template>
  <div class="blog-index-page">
    <h1>Artigos Recentes</h1>

    <div v-if="posts && posts.length > 0" class="posts-grid">
      <BlogPostCard v-for="post in posts" :key="post._path" :post="post" />
    </div>
    <div v-else class="no-posts-message">
      <p>Nenhum artigo encontrado.</p>
    </div>
  </div>
</template>

<style scoped>
.blog-index-page {
  padding: 2rem 0;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  color: #333;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: var(--hextra-max-page-width);
  margin: 0 auto;
}

.no-posts-message {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  padding: 3rem 0;
}

/* Dark Mode */
.dark h1 {
  color: #eee;
}

.dark .no-posts-message {
  color: #aaa;
}
</style>
