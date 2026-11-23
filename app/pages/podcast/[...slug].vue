<script setup lang="ts">
import type { PodcastsCollectionItem } from '@nuxt/content';
import {
  DEFAULT_PODCAST_OG_IMAGE_PATH,
  buildCanonicalUrl,
  buildOgImageMeta,
  resolveAbsoluteAssetUrl,
} from '~~/utils/seo';

const siteUrl = useRuntimeConfig().public.site.url;

const route = useRoute();

const slug = route.params.slug;

const { data: episode, error } = await useFetch<PodcastsCollectionItem>(`/api/podcasts/${slug}`);

if (error.value) {
    throw createError({
        statusCode: error?.value?.statusCode || 404,
        data: error?.value?.data || 'O recurso que você procura não existe ou foi movido de local.'
    });
}

// Caminho relativo para componentes locais como NuxtImg / PodcastPlayer
const relativeArtworkPath = computed(() => episode?.value?.image || '/images/default-podcast.webp');

// Configuração de SEO
watch(episode, (newData) => {
    if (newData) {
        const fullAudioUrl = newData.audioSrc ? resolveAbsoluteAssetUrl(siteUrl, newData.audioSrc, '') : '';
        const homeUrl = buildCanonicalUrl(siteUrl, '/');
        const podcastIndexUrl = buildCanonicalUrl(siteUrl, '/podcast/');
        const fullPageUrl = buildCanonicalUrl(siteUrl, newData.path || route.path);
        const ogImage = buildOgImageMeta(siteUrl, newData.image, {
            fallbackPath: DEFAULT_PODCAST_OG_IMAGE_PATH,
            alt: newData.title || 'Podcast - NotebookLM',
        });

        useSeoMeta({
            title: newData?.title,
            description: newData?.description,
            ogTitle: newData?.title,
            ogDescription: newData?.description,
            ogUrl: fullPageUrl,
            ogImage: ogImage.url,
            ogImageSecureUrl: ogImage.secureUrl,
            ogImageType: ogImage.type,
            ...(ogImage.width ? { ogImageWidth: ogImage.width } : {}),
            ...(ogImage.height ? { ogImageHeight: ogImage.height } : {}),
            ogImageAlt: ogImage.alt,
            ogType: 'music.song',
            ogAudio: fullAudioUrl,
            ogAudioSecureUrl: fullAudioUrl,
            ogAudioType: 'audio/mpeg',
            twitterCard: 'player',
            twitterPlayer: fullAudioUrl,
            twitterPlayerWidth: '480',
            twitterPlayerHeight: '80',
            twitterTitle: newData?.title,
            twitterDescription: newData?.description,
            twitterImage: ogImage.url,
            twitterImageAlt: ogImage.alt,
            articlePublishedTime: newData?.date,
            articleAuthor: ['Heleno Salgado'],
            articleTag: newData?.categories
        });

        useHead({
            script: [
                {
                    src: '/js/podcast-player.js',
                    defer: true
                },
                {
                    type: 'application/ld+json',
                    textContent: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "PodcastEpisode",
                        "url": fullPageUrl,
                        "name": newData?.title || 'Podcast do blog - NotebookLM',
                        "description": newData?.description || 'Tecnologia, Literatura e Teologia',
                        "image": ogImage.url,
                        "datePublished": newData?.date || '',
                        "timeRequired": newData.duration,
                        "associatedMedia": {
                            "@type": "MediaObject",
                            "contentUrl": fullAudioUrl,
                            "encodingFormat": "audio/mpeg",
                            "duration": newData.duration
                        },
                        "author": {
                            "@type": "Person",
                            "name": "Heleno Salgado",
                            "url": homeUrl
                        },
                        "partOfSeries": {
                            "@type": "PodcastSeries",
                            "name": "Podcast do Blog - NotebookLM",
                            "url": podcastIndexUrl
                        },
                        "inLanguage": "pt-BR"
                    })
                },
                {
                    type: 'application/ld+json',
                    textContent: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": homeUrl
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Podcast",
                                "item": podcastIndexUrl
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": newData?.title,
                                "item": fullPageUrl
                            }
                        ]
                    })
                }
            ]
        });
    }
}, { immediate: true });

</script>

<template>
    <article v-if="episode?.path" class="prose-container">

        <h1>{{ episode.title }}</h1>

        <div class="categories">
            <IconsTag />
            <CategoriesList
v-if="episode.categories?.length" v-bind="{
                categories: episode.categories,
                slugifiedCategories: episode.slugified_categories
            }" />
        </div>

        <div v-if="episode.dateFormatted" class="date-published">
            <IconsCalendar />
            <time :datetime="episode.dateFormatted">{{ episode.dateFormatted }}</time>
        </div>

        <p v-if="episode?.description" style="margin: 2rem 0 2.5rem 0"><em>{{ episode.description }}</em></p>

        <PodcastPlayer 
            :src="episode.audioSrc"
            :title="episode.title"
            :artist="'Heleno Salgado'"
            :album="'Podcast do Blog - NotebookLM'"
            :artwork="relativeArtworkPath"
        />

        <p v-if="episode?.sourceName" style="text-align: end; font-size: .9rem;">
            Fonte:
            <a :href="episode.sourceUrl" target="_blank" rel="noopener noreferrer">
                <em>{{ episode.sourceName }}</em>
            </a>
        </p>

        <SharePost :post-title="episode?.title || ''" :post-url="buildCanonicalUrl(siteUrl, episode.path || route.path)" />

        <ContentRenderer v-if="episode?.body" class="markdown-content" :value="episode.body" />

    </article>
</template>
