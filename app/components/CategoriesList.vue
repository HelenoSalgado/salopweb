<template>
<ul v-if="categories?.length" class="categories-list">
       <li v-for="(category, index) in categories" :key="category">
      <NuxtLink :to="`/blog/categorias/${slugifiedCategories[index]}`">
        {{ category }}
      </NuxtLink>
    </li>
    </ul>
</template>
<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

defineProps<{
  categories: BlogCollectionItem['categories'],
  slugifiedCategories: BlogCollectionItem['slugified_categories']
}>();
</script>

<style scoped>
.categories-list {
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  & li {
    list-style: none;
    border-bottom: 1px solid var(--color-background-hover);

    & a {
      text-decoration: none;
    }
  }
}
</style>
