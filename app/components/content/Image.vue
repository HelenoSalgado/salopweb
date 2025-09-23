<template>
  <div class="image-optimizer-container">
    <NuxtImg
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      preset="postImage"
      class="optimized-image"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: String || Number,
    default: 700
  },
  height: {
    type: String || Number,
    default: 400
  },
  src: {
    type: String,
    default: '/images/default.png'
  },
  alt: {
    type: String || null,
    default: 'Imagem'
  }
})
</script>

<style scoped>
.image-optimizer-container {
  margin: 1.5rem 0;
  text-align: center;

  & .optimized-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px var(--color-shadow);
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.02);
    }
  }
}
</style>
