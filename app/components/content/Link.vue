<template>
  <div class="image-optimizer-container">
    <NuxtLink
      :to="link"
      target="test"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  link: {
    type: String,
    default: '/images/default.png'
  }
})
</script>
