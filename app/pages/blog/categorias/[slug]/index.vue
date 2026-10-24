<script setup lang="ts">
const route = useRoute();
const category = computed(() => String(route.params.slug));
</script>

<template>
  <CategoryPostsListing :key="category" :category="category" :page="1" />
</template>
