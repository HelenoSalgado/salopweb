<template>
<ul v-if="from.categories?.length" class="categories-list">
       <li v-for="(category, index) in from.categories[0]" :key="category">
      <NuxtLink :to="`/blog/categorias/${slugified_categories[index]}`">
        {{ category }}
      </NuxtLink>
    </li>
    </ul>
</template>
<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';
const props = defineProps<{
  from: {
    categories: Array<BlogCollectionItem['categories']>,
    slugified_categories: Array<BlogCollectionItem['slugified_categories']>
  }
}>();
const slugified_categories = ref(props.from.slugified_categories[0]) as any;
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
