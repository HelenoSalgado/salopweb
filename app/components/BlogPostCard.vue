<template>
  <div class="blog-post-card">
    <div class="blog-post-card-content-wrapper">
      <h3>{{ post.title }}</h3>
      <p class="description">{{ post.description }}</p>
    </div>
    <NuxtLink :to="post.path" class="read-more-link">
      Leia Mais
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true,
  },
});
</script>


