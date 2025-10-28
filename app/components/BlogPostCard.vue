<script setup lang="ts">
import type { CardPost } from '~~/server/types';

const { title, description, path } = defineProps<CardPost>();
</script>
<template>
  <div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <NuxtLink :to="path" class="button">
      Leia Mais &raquo;
    </NuxtLink>
  </div>
</template>

<style scoped>
div{
  display: block;
  border-bottom: 1px solid var(--color-background-hover);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  padding: 1rem 0;
  position: relative;
  background-color: var(--color-background); /* Default background */
  margin-bottom: 1.5rem; /* Spacing between cards */

  & h3{
    margin: .5rem 0 1rem 0;
  }

  & p{
    line-height: 1.7rem;
  }

  & a{
    font-size: clamp(.9rem, 5vw, 1.3rem );
    text-decoration: none;
  }
}
</style>


