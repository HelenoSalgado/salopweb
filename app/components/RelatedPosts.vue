<template>
  <div v-if="posts.length > 0">
    <h3>Posts Relacionados</h3>
    <BlogPostCard v-for="post in posts" :key="post.path" v-bind="post"/>
  </div>
</template>

<script setup lang="ts">
import type { CardPost } from '~~/server/types';
defineProps<{
  posts: CardPost[]
}>();
</script>
