import type { PodcastEpisode } from '~~/server/types';
import { queryCollection } from '@nuxt/content/server';

export default defineEventHandler(async (event) => {
    try {
        const episodes = await queryCollection(event, 'podcasts')
            .where('published', '=', true)
            .select('title', 'description', 'audioSrc', 'sourceName', 'sourceUrl', 'path', 'date', 'dateFormatted', 'image')
            .order('date', 'DESC')
            .all();

        return episodes as PodcastEpisode[];

    } catch (error) {
        console.error('Erro ao buscar podcasts:', error);
        throw createError({
            statusCode: 500,
            message: 'Erro interno do servidor ao buscar podcasts.'
        });
    }
});
