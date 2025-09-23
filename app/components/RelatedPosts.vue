<template>
  <BlogPostCard v-for="post in posts" :key="post.path" :post="post" />
</template>

<script setup>
defineProps({
  posts: {
    type: Array,
    required: true,
  }
});
</script>
