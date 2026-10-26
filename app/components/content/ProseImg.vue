<template>
  <NuxtImg
    :src="src"
    :alt="alt || 'Image'"
    :title="title"
    :width="width || 900"
    :height="height"
    :modifiers="{
      width: 900,
      format: 'webp'
    }"
    loading="lazy"
    densities="x1 x2"
  />
</template>

<script setup lang="ts">
interface Props {
  src: string;
  alt?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
}

withDefaults(defineProps<Props>(), {
  alt: 'Image',
  title: undefined,
  width: 900,
  height: undefined
});
</script>
