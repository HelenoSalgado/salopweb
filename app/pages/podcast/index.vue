<template>
    <div>
        <h1>Podcast - NotebookLM</h1>
        <p>Episódios sobre filosofia, teologia e tecnologia, gerados com o auxílio de IA.</p>

        <section v-for="episode in episodes" :key="episode.path" class="podcast-episode">
            <h2>{{ episode.title }}</h2>
            <p style="margin-bottom: 2.5rem;">{{ episode.description }}</p>

            <PodcastPlayer :src="episode.audioSrc" />

            <div class="episode-footer">
                <p class="source">
                    Fonte:
                    <a :href="episode.sourceUrl" target="_blank" rel="noopener noreferrer">
                        <em>{{ episode.sourceName }}</em>
                    </a>
                </p>
                <SharePost :post-title="episode.title" :post-url="buildCanonicalUrl(siteUrl, episode.path)" />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { PodcastEpisode } from '../../../server/types';
import {
  DEFAULT_PODCAST_OG_IMAGE_PATH,
  buildCanonicalUrl,
  buildOgImageMeta,
  resolveAbsoluteAssetUrl,
} from '~~/utils/seo';

const siteUrl = useRuntimeConfig().public.site.url;

const { data: episodes } = await useFetch<PodcastEpisode[]>('/api/podcasts');

const title = "Podcast - NotebookLM";
const description = "Explore episódios de podcast sobre filosofia, teologia, tecnologia e mais. Conteúdo aprofundado gerado com o auxílio de IA.";
const canonicalUrl = buildCanonicalUrl(siteUrl, '/podcast/');
const ogImage = buildOgImageMeta(siteUrl, DEFAULT_PODCAST_OG_IMAGE_PATH, {
  fallbackPath: DEFAULT_PODCAST_OG_IMAGE_PATH,
  alt: title,
});
const publisherLogoUrl = resolveAbsoluteAssetUrl(siteUrl, '/images/profile.webp');

useSeoMeta({
    title: title,
    description: description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonicalUrl,
    ogImage: ogImage.url,
    ogImageSecureUrl: ogImage.secureUrl,
    ogImageType: ogImage.type,
    ogImageWidth: ogImage.width,
    ogImageHeight: ogImage.height,
    ogImageAlt: ogImage.alt,
    ogType: 'website',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage.url,
    twitterImageAlt: ogImage.alt,
});


useHead({
    script: [
        {
            src: '/js/podcast-player.js',
            defer: true
        },
        {
            type: 'application/ld+json',
            textContent: computed(() => JSON.stringify({
                "@context": "https://schema.org",
                "@type": "PodcastSeries",
                "name": title,
                "description": description,
                "url": canonicalUrl,
                "image": ogImage.url,
                "author": {
                    "@type": "Person",
                    "name": "Heleno Salgado"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Heleno Salgado",
                    "logo": {
                        "@type": "ImageObject",
                        "url": publisherLogoUrl
                    }
                }
            }))
        }
    ]
});

</script>

<style scoped>
.podcast-episode {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1.5rem 1.5rem 0.5rem 1.5rem;
    margin-top: 3rem;
    box-shadow: 0 2px 4px var(--color-shadow);
}

.episode-footer {
    display: flex;
    flex-direction: column;
    margin: 1.5rem 0;
}

.source {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    text-align: right;
    margin-top: 0;
    margin-bottom: 1rem;
}

.source a {
    text-decoration: underline;
}

/* Override SharePost component margin */
.episode-footer :deep(.share-post) {
    margin: 0;
    padding-top: 1rem;
}
</style>
