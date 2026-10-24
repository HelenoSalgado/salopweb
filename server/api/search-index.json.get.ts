import { queryCollection } from '@nuxt/content/server';
import type { SearchIndexEntry } from '~~/utils/search';

/**
 * Índice de busca estático, pré-renderizado no build (ver `prerender.routes`
 * em server/nitro.ts). A filtragem acontece no cliente (TheSearch.vue),
 * pois o site é servido como estático e não possui runtime de servidor.
 */
export default defineEventHandler(async (event): Promise<SearchIndexEntry[]> => {
    try {
        const posts = await queryCollection(event, 'blog')
            .where('published', '=', true)
            .order('date', 'DESC')
            .select('path', 'title', 'description')
            .all();

        return posts.flatMap(({ path, title, description }) =>
            path ? [{ path, title: title ?? '', description: description ?? '' }] : []
        );
    } catch (err) {
        console.error('Error in /api/search-index.json:', err);
        throw createError({
            statusCode: 500,
            message: 'Erro ao gerar índice de busca'
        });
    }
});
