<template>
  <div v-if="posts.length > 0">
    <BlogPostCard v-for="post in posts" :key="post.id" v-bind="post" />
  </div>
</template>

<script setup lang="ts">
import type { CardPost } from '~~/server/types';
defineProps<{
  posts: CardPost[]
}>();
</script>
