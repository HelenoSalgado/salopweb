<template>
  <div>
    <h1>{{ page?.title }}</h1>
    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>

<script setup lang="ts">
import { buildOgImageMeta } from '~~/utils/seo';

const config = useRuntimeConfig();
const siteUrl = config.public.site.url;

const { data: page } = await useFetch('/api/pages/sobre');

const ogImage = computed(() =>
  buildOgImageMeta(siteUrl, page.value?.image, {
    alt: page.value?.title || 'Sobre Heleno Salgado',
  }),
);

definePageMeta({
  title: 'Sobre'
});

useSeoMeta({
  title: () => page.value?.title || 'Sobre Mim',
  description: () => page.value?.description || 'Conheça mais sobre Heleno Salgado, sua jornada e seus projetos.',
  ogTitle: () => page.value?.title || 'Sobre',
  ogDescription: () => page.value?.description || 'Conheça mais sobre Heleno Salgado, sua jornada e seus projetos.',
  ogImage: () => ogImage.value.url,
  ogImageSecureUrl: () => ogImage.value.secureUrl,
  ogImageType: () => ogImage.value.type,
  ogImageWidth: () => ogImage.value.width,
  ogImageHeight: () => ogImage.value.height,
  ogImageAlt: () => ogImage.value.alt,
  ogType: 'profile',
  twitterTitle: () => page.value?.title || 'Sobre',
  twitterDescription: () => page.value?.description || 'Conheça mais sobre Heleno Salgado, sua jornada e seus projetos.',
  twitterImage: () => ogImage.value.url,
  twitterImageAlt: () => ogImage.value.alt,
});
</script>
