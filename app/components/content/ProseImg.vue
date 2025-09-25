<template>
  <NuxtImg
    :src="src"
    :alt="alt"
    :width
    :height
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: [String, Number],
    default: 900
  },
  height: {
    type: [String, Number],
    default: 400
  },
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  }
})
</script>
