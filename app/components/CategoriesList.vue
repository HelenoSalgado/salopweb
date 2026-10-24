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
  column-gap: 0.75rem;
  row-gap: 0.50rem;

  & li {
    list-style: none;
    border-bottom: 1px solid var(--color-border);

    & a {
      font-family: var(--font-serif);
      font-size: 1.35rem;
      text-decoration: none;
      color: var(--color-primary);
      transition: color 0.2s ease;

      &:hover {
        color: var(--color-primary-hover);
      }
    }
  }
}
</style>
