<template>
    <ul v-if="from && from.length" class="categories-list">
      <li v-for="category in from" :key="category">
        <NuxtLink :to="`/blog/categorias/${category}`">
          {{ category }}
        </NuxtLink>
      </li>
    </ul>
</template>

<script setup>
defineProps({
  from: {
    type: Array,
    required: true,
  }
});
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
