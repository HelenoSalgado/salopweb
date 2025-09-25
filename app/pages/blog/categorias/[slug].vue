<template>
  <div>
    <ClientOnly>
    <h1>Sobre {{ category }}</h1>

    <BlogPostCard v-if="data?.posts?.length" v-for="post in data.posts" :key="post.path" :post="post" />

    <Pagination
      v-if="data && data.totalPages > 1"
      :current-page="data.currentPage"
      :total-pages="data.totalPages"
      :base-url="`/blog/categorias/${category}`"
    />
   </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const category = route.params.slug as string;
const POSTS_PER_PAGE = 7;

// currentPage is a computed property based on the route query.
const currentPage = computed(() => {
  const page = parseInt(route.query.page as string);
  return isNaN(page) || page < 1 ? 1 : page;
});

// A single useAsyncData call to fetch paginated posts and totals.
const { data } = await useAsyncData(
  `posts-in-category-${category}-page-${currentPage.value}`, // A more descriptive and unique key
  async () => {
    // The query is built once. Note the quotes around the category for a more precise search.
    const queryBuilder = () => queryCollection('blog')
      .where('categories', 'LIKE', `%"${category}"%`)
      .order('date', 'DESC');

    // Fetch total count first.
    const totalPosts = await queryBuilder().count();
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    // Ensure the page to fetch is within valid bounds.
    const pageToFetch = Math.max(1, Math.min(currentPage.value, totalPages));

    if (totalPosts === 0) {
      return {
        posts: [],
        totalPages: 0,
        currentPage: 1,
      };
    }

    // Fetch the paginated posts for the correct page.
    const paginatedPosts = await queryBuilder()
      .skip((pageToFetch - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE)
      .all();

    return {
      posts: paginatedPosts,
      totalPages,
      currentPage: pageToFetch,
    };
  },
  {
    watch: [currentPage],
  }
);

if(!data.value?.posts.length){
 throw createError({
  statusCode: 404,
  message: 'O recurso que você procura não existe ou foi movido de local.'
 });
}

useSeoMeta({
  title: `Posts sobre ${category}`,
  description: `Explore todos os posts sobre ${category}.`
});
</script>
