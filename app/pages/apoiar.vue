<script setup lang="ts">
import { DONATION_CONFIG } from '~~/app/data/donation';

const runtimeConfig = useRuntimeConfig();
const siteUrl = runtimeConfig.public.site.url;

definePageMeta({
  title: 'Apoiar o Trabalho'
});

useHead({
  script: [
    {
      src: '/js/apoiar.js',
      defer: true
    }
  ]
});

useSeoMeta({
  title: `${DONATION_CONFIG.title} — Heleno Salgado`,
  description: DONATION_CONFIG.description,
  ogTitle: `${DONATION_CONFIG.title} — Heleno Salgado`,
  ogDescription: DONATION_CONFIG.description,
  ogImage: `${siteUrl}/images/profile.webp`,
  ogType: 'website'
});
</script>

<template>
  <div class="apoiar-page">
    <header class="apoiar-header">
      <h1>{{ DONATION_CONFIG.title }}</h1>
      <p class="apoiar-description">
        {{ DONATION_CONFIG.description }}
      </p>
    </header>

    <DonationCard />
  </div>
</template>

<style scoped>
.apoiar-page {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}

.apoiar-header {
  text-align: left;
  margin-bottom: 2rem;
}

.apoiar-header h1 {
  margin-bottom: 1rem;
}

.apoiar-description {
  max-width: 100%;
  text-align: left;
}
</style>
