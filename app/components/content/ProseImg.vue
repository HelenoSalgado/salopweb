<template>
  <NuxtImg
    :src="src"
    :alt="alt || 'Image'"
    :title="title"
    :width="width || 900"
    :height="height || 400"
    :modifiers="{
      width: 900,
      height: 400,
      format: 'webp'
    }"
    loading="lazy"
    densities="x1 x2"
  />
</template>

<script setup>
defineProps({
  src: { type: String, required: true },
  alt: String,
  title: String,
  width: [String, Number],
  height: [String, Number]
})
</script>
