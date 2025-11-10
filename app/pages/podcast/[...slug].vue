<script setup lang="ts">
import type { PodcastsCollectionItem } from '@nuxt/content';

const route = useRoute();

const slug = route.params.slug;

const { data: episode, error } = await useFetch<PodcastsCollectionItem>(`/api/podcasts/${slug}`);

if (error.value) {
    throw createError({
        statusCode: error?.value?.statusCode || 404,
        data: error?.value?.data || 'O recurso que você procura não existe ou foi movido de local.'
    });
}

// Configuração de SEO
watch(episode, (newData) => {
    if (newData) {
        useSeoMeta({
            title: newData?.title,
            description: newData?.description,
            ogTitle: newData?.title,
            ogDescription: newData?.description,
            ogImage: newData?.image || 'https://heleno.dev/images/default-podcast.webp',
            ogType: 'article',
            ogAudio: 'https://heleno.dev' + newData?.audioSrc,
            ogAudioType: 'audio/mpeg',
            twitterCard: 'summary_large_image',
            articlePublishedTime: newData?.date,
            ogUrl: 'https://heleno.dev' + newData.path
        });

        useHead({
            script: [
                {
                    type: 'application/ld+json',
                    textContent: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": newData?.title || 'Podcast do blog - NotebookLM',
                        "description": newData?.description || 'Tecnologia, Literatura e Teologia',
                        "image": newData?.image || 'https://heleno.dev/images/default-podcast.webp',
                        "datePublished": newData?.date || '',
                        "author": {
                            "@type": "Person",
                            "name": "Heleno Salgado"
                        },
                        "audio": newData.audioSrc ? {
                            "@type": "AudioObject",
                            "name": newData.title,
                            "contentUrl": 'https://heleno.dev' + newData?.audioSrc,
                            "description": newData.description,
                            "encodingFormat": "audio/mpeg",
                            "duration": newData.duration, // Duração no formato ISO 8601
                            "uploadDate": newData.date
                        } : undefined
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
            <CategoriesList v-if="episode.categories?.length" v-bind="{
                categories: episode.categories,
                slugifiedCategories: episode.slugified_categories
            }" />
        </div>

        <div v-if="episode.dateFormatted" class="date-published">
            <IconsCalendar />
            <time :datetime="episode.dateFormatted">{{ episode.dateFormatted }}</time>
        </div>

        <p v-if="episode?.description" style="margin: 2rem 0 2.5rem 0"><em>{{ episode.description }}</em></p>

        <PodcastPlayer :src="episode.audioSrc" />

        <p v-if="episode?.sourceName" style="text-align: end; font-size: .9rem;">
            Fonte:
            <a :href="episode.sourceUrl" target="_blank" rel="noopener noreferrer">
                <em>{{ episode.sourceName }}</em>
            </a>
        </p>

        <SharePost :post-title="episode.title || 'Podcast'" :post-url="`https://heleno.dev${episode.path}`" />

        <ContentRenderer v-if="episode?.body" class="markdown-content" :value="episode.body" />

    </article>
</template>
