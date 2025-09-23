<template>
    <h1>Sobre {{ category }}</h1>
    <BlogPostCard v-if="posts && posts.length" v-for="post in posts" :key="post.path" :post="post" />
    <p v-else>Nenhum post encontrado nesta categoria.</p>
</template>

<script setup>
const route = useRoute();
const category = route.params.slug;

const { data: posts } = await useAsyncData(`posts-in-category-${category}`, () =>
  queryCollection('blog')
    .where('categories', 'LIKE', `%"${category}"%`)
    .all()
);

useSeoMeta({
  title: `Posts sobre ${category}`,
  description: `Explore todos os posts sobre ${category}.`
});
</script>
