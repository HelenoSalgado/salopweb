<template>
  <NuxtImg
    :src="src"
    :alt="alt || 'Image'"
    :title="title"
    :width="width || 900"
    :height="height || 'auto'"
    :modifiers="{
      width: 900,
      format: 'webp'
    }"
    loading="lazy"
    densities="x1 x2"
  />
</template>

<script setup lang="ts">
defineProps({
  src: { type: String, required: true },
  alt: String,
  title: String,
  width: [String, Number],
  height: [String, Number]
})
</script>
