<script setup lang="ts">
const route = useRoute();
const POSTS_PER_PAGE = 7;

// Fetch all categories for the list component
const { data: allCategories } = await useAsyncData('all-blog-categories', async () => {
  const postsWithCategories = await queryCollection('blog').select('categories').all();

  const categories = postsWithCategories.flatMap(post => post.categories || []);
  return [...new Set(categories)].sort();
});

// currentPage is now a computed property based on the route.
const currentPage = computed(() => {
  const page = parseInt(route.query.page as string);
  return isNaN(page) || page < 1 ? 1 : page;
});

// useAsyncData will automatically re-fetch when `currentPage` changes.
const { data } = await useAsyncData(
  `blog-posts-list-${currentPage.value}`, // Dynamic key for caching
  async () => {
    const baseQuery = queryCollection('blog').order('date', 'DESC');

    const totalPosts = await baseQuery.count();
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    // Ensure currentPage doesn't exceed totalPages
    const pageToFetch = Math.min(currentPage.value, totalPages > 0 ? totalPages : 1);

    const paginatedPosts = await queryCollection('blog')
      .order('date', 'DESC')
      .skip((pageToFetch - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE)
      .all();

    return {
      posts: paginatedPosts,
      totalPosts,
      totalPages,
      currentPage: pageToFetch,
    };
  },
  {
    watch: [currentPage],
  }
);

</script>

<template>
  <div class="blog-index-page">
    <h1>Escritos Recentes</h1>
    <CategoriesList :from="allCategories" />
    <div v-if="data && data.posts && data.posts.length > 0" class="posts-grid">
      <BlogPostCard v-for="post in data.posts" :key="post.path" :post="post" />
    </div>
    <div v-else class="no-posts-message">
      <p>Nenhum artigo encontrado.</p>
    </div>

    <Pagination
      v-if="data && data.totalPages > 1"
      :current-page="currentPage"
      :total-pages="data.totalPages"
      base-url="/blog"
    />
  </div>
</template>

<style scoped>
.blog-index-page {
  padding: 2rem 0;
  max-width: 900px;
  margin: auto;
}
h1 {
  margin-bottom: 2rem;
  font-size: 2rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: 1fr; /* Single column for list-like display */
  gap: 0; /* No gap between list items */
  max-width: 900px; /* Limit container width */
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
