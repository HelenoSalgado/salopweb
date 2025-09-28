<template>
  <div class="reading-progress-bar" :style="{ width: progress + '%' }"/>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const progress = ref(0);

const handleScroll = () => {
  const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
  const currentScroll = window.scrollY;
  progress.value = (currentScroll / totalScroll) * 100;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background-color: var(--color-primary);
  z-index: 9999;
  transition: width 0.2s ease;
}
</style>
