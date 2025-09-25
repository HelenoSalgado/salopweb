<script setup lang="ts">
const route = useRoute();
const POSTS_PER_PAGE = 7;

// Fetch all categories for the list component
const { data: allCategories } = await useAsyncData('all-blog-categories', async () => {
  const postsWithCategories = await queryCollection('blog').select('categories').all();

  const categories = postsWithCategories.flatMap(post => post.categories || []);
  return [...new Set(categories)].sort();
});

const { data } = await useAsyncData(
  () => `blog-posts-list-${route.query.page || 1}`,
  async () => {
    const page = parseInt(route.query.page as string);
    const currentPage = isNaN(page) || page < 1 ? 1 : page;

    const baseQuery = queryCollection('blog').order('date', 'DESC');

    const totalPosts = await baseQuery.count();
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    const pageToFetch = Math.min(currentPage, totalPages > 0 ? totalPages : 1);

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
  }
);

</script>

<template>
  <div>
    <ClientOnly>
    <h1>Escritos Recentes</h1>
    <CategoriesList :from="allCategories" />
    <div v-if="data && data.posts && data.posts.length > 0">
      <BlogPostCard v-for="post in data.posts" :key="post.path" :post="post" />
    </div>

    <Pagination v-if="data && data.totalPages > 1" :current-page="data.currentPage" :total-pages="data.totalPages"
      base-url="/blog" />
      </ClientOnly>
  </div>
</template>
