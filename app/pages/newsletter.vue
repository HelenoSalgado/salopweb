<script setup lang="ts">
import { DEFAULT_OG_IMAGE_PATH, buildOgImageMeta } from '~~/utils/seo';

const siteUrl = useRuntimeConfig().public.site.url;
const title = 'Newsletter';
const description = 'Inscreva-se na newsletter de Heleno Salgado para receber novos textos sobre tecnologia, teologia e literatura.';
const ogImage = buildOgImageMeta(siteUrl, DEFAULT_OG_IMAGE_PATH, { alt: `${title} — Heleno Salgado` });

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogImage: ogImage.url,
  ogImageSecureUrl: ogImage.secureUrl,
  ogImageType: ogImage.type,
  ogImageWidth: ogImage.width,
  ogImageHeight: ogImage.height,
  ogImageAlt: ogImage.alt,
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: ogImage.url,
  twitterImageAlt: ogImage.alt,
});
</script>

<template>
  <div>
    <h1>Newsletter</h1>
    <NewsletterForm />
  </div>
</template>
