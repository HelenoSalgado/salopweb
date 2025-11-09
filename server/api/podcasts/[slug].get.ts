import { queryCollection } from "@nuxt/content/server";
import { PodcastEpisode } from "../../types";
import type { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
    const slug = event.context.params?.slug as string;

    console.log(slug)

    if (!slug) {
        throw createError({
            statusCode: 400,
            message: 'Parâmetro path é obrigatório'
        });
    }

    try {
        const podcast = await queryCollection(event, 'podcasts')
            .where('published', '=', true)
            .where('path', '=', slug)
            .select('id', 'description', 'audioSrc', 'date', 'dateFormatted', 'title', 'image', 'path')
            .first();

        console.log(podcast)

        if (!podcast) {
            throw createError({
                statusCode: 404,
                message: 'podcast não encontrado',
            });
        }

        console.log(podcast)

        return podcast as PodcastEpisode;

    } catch (error: any) {
        if (error.statusCode) {
            throw error;
        }
        throw createError({
            statusCode: 500,
            message: 'Erro interno do servidor'
        });
    }
});

