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
  border-bottom: 1px solid var(--color-border);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  padding: 1.25rem 0;
  position: relative;
  background-color: transparent;
  margin-bottom: 1rem;

  & h3{
    margin: .5rem 0 0.8rem 0;
    font-family: var(--font-serif);
    font-size: 1.85rem;
    letter-spacing: -0.015em;
  }

  & p{
    line-height: 2rem;
    font-family: var(--font-serif);
    font-weight: 400;
    font-optical-sizing: auto;
    font-size: 1.5rem;
    color: var(--color-text-secondary);
  }

  & a{
    font-family: var(--font-sans);
    font-size: 1.15rem;
    font-weight: 500;
    text-decoration: none;
    color: var(--color-primary);
    display: inline-block;
    margin-top: 0.5rem;
    transition: color 0.2s ease, transform 0.2s ease;

    &:hover {
      color: var(--color-primary-hover);
      transform: translateX(4px);
    }
  }
}
</style>


