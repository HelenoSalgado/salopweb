<script setup lang="ts">
import ContentPodcastPlayer from '~/components/PodcastPlayer.vue';
import SharePost from '~/components/SharePost.vue';
import type { PodcastEpisode } from '../../../server/types';

const route = useRoute();

const slug = route.params.slug;

const { data: episode, error } = await useAsyncData<PodcastEpisode>(`podcast-${slug}`, () =>
    $fetch(`/api/podcasts/${slug}`)
);

console.log(episode.value)

if (error.value) {
  throw createError({
    statusCode: error?.value?.statusCode || 404,
    data: error?.value?.data || 'O recurso que você procura não existe ou foi movido de local.'
  });
}

useSeoMeta({
    title: episode.value?.title,
    description: episode.value?.description,
    ogTitle: episode.value?.title,
    ogDescription: episode.value?.description,
    ogType: 'music.song',
    ogUrl: 'https://heleno.dev/images/default-post.webp',
    ogImage: episode.value?.image || 'https://heleno.dev/images/default-post.webp',
    articlePublishedTime: episode.value?.date,
    twitterCard: 'summary_large_image',
});

</script>

<template>
    <article v-if="episode?.path">
        <header class="episode-header">
            <h1>{{ episode.title }}</h1>
            <p class="publish-date">Publicado em {{ episode.dateFormatted }}</p>
            <p class="description">{{ episode.description }}</p>
        </header>

        <ContentPodcastPlayer :src="episode.audioSrc" />

        <!-- O Nuxt Content renderizará o corpo do .md aqui se houver algum -->
        <!-- <ContentDoc /> -->

        <footer class="episode-footer">
            <p class="source" v-if="episode.sourceName">
                Fonte: 
                <a :href="episode.sourceUrl" target="_blank" rel="noopener noreferrer">
                    <em>{{ episode.sourceName }}</em>
                </a>
            </p>
            <SharePost :post-title="episode.title" :post-url="`https://heleno.dev${episode.path}`" />
        </footer>
    </article>
</template>

<style scoped>
.episode-header {
    margin-bottom: 2rem;
    text-align: center;
}

.episode-header h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    line-height: 1.2;
}

.publish-date {
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
}

.description {
    font-size: 1.2rem;
    max-width: 80ch;
    margin: 0 auto;
    line-height: 1.6;
}

.content-body {
    margin-top: 2rem;
}

.episode-footer {
    margin-top: 3rem;
    border-top: 1px solid var(--color-border);
    padding-top: 1rem;
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

.episode-footer :deep(.share-post) {
    margin: 0;
    padding-top: 1rem;
}
</style>
