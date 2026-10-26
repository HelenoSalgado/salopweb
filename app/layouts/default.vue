<template>
  <div class="layout-default">
    <TheHeader />
    <main class="main-default">
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
      href: '/fonts/EBGaramond-VariableFont_wght.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous'
    }
  ]
});
</script>
