<script setup lang="ts">
import { DONATION_CONFIG } from '~~/app/data/donation';
import { DEFAULT_OG_IMAGE_PATH, buildOgImageMeta } from '~~/utils/seo';

const runtimeConfig = useRuntimeConfig();
const siteUrl = runtimeConfig.public.site.url;
const pageTitle = `${DONATION_CONFIG.title} — Heleno Salgado`;
const ogImage = buildOgImageMeta(siteUrl, DEFAULT_OG_IMAGE_PATH, { alt: pageTitle });

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
  title: pageTitle,
  description: DONATION_CONFIG.description,
  ogTitle: pageTitle,
  ogDescription: DONATION_CONFIG.description,
  ogImage: ogImage.url,
  ogImageSecureUrl: ogImage.secureUrl,
  ogImageType: ogImage.type,
  ogImageWidth: ogImage.width,
  ogImageHeight: ogImage.height,
  ogImageAlt: ogImage.alt,
  ogType: 'website',
  twitterTitle: pageTitle,
  twitterDescription: DONATION_CONFIG.description,
  twitterImage: ogImage.url,
  twitterImageAlt: ogImage.alt,
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
