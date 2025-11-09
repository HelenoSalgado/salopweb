<template>
    <div class="podcast-page">
        <h1>Podcasts - NotebookLM</h1>
        <p class="subtitle">Episódios sobre filosofia, teologia e tecnologia, gerados com o auxílio de IA.</p>

        <section v-for="episode in episodes" :key="episode.path" class="podcast-episode">
            <h2>{{ episode.title }}</h2>
            <p>{{ episode.description }}</p>

            <PodcastPlayer :src="episode.audioSrc" />

            <div class="episode-footer">
                <p class="source">
                    Fonte: 
                    <a :href="episode.sourceUrl" target="_blank" rel="noopener noreferrer">
                        <em>{{ episode.sourceName }}</em>
                    </a>
                </p>
                <SharePost :post-title="episode.title" :post-url="`https://heleno.dev${episode.path}`" />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { PodcastEpisode } from '../../../server/types';

const { data: episodes } = await useFetch<PodcastEpisode[]>('/api/podcasts');

// SEO Meta
const pageTitle = "Podcasts | SalopWeb";
const pageDescription = "Explore episódios de podcast sobre filosofia, teologia, tecnologia e mais. Conteúdo aprofundado gerado com o auxílio de IA.";
useSeoMeta({
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
});
</script>

<style scoped>
.podcast-page h1 {
    margin-bottom: 0.5rem;
}

.subtitle {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    margin-top: 0;
    margin-bottom: 3rem;
}

.podcast-episode {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1.5rem 1.5rem 0.5rem 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px var(--color-shadow);
}

.podcast-episode h2 {
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--color-text-heading);
}

.episode-footer {
    display: flex;
    flex-direction: column;
    margin-top: 1.5rem;
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
