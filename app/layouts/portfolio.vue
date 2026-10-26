<template>
  <div class="layout-portfolio">
    <TheHeader />
    <main class="main-portfolio">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'preload',
      href: '/fonts/Inter-VariableFont_opsz,wght.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous'
    }
  ]
});
</script>
