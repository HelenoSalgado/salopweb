<template>
  <div class="reading-progress-bar" :style="{ width: progress + '%' }" />
</template>

<script setup lang="ts">
const progress = ref(0);

const handleScroll = () => {
  const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (totalScroll <= 0) {
    progress.value = 0;
    return;
  }
  const currentScroll = window.scrollY;
  progress.value = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
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
