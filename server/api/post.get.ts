import type { BlogCollectionItem } from "@nuxt/content";
import { queryCollection } from "@nuxt/content/server";
import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const slug = query.path as string;

    if (!slug) {
        throw createError({
            statusCode: 400,
            message: 'Parâmetro path é obrigatório'
        });
    }

    try {
        const post = await queryCollection(event, 'blog')
            .where('path', '=', slug)
            .where('published', '=', true)
            .select('id', 'author', 'categories', 'slugified_categories', 'description', 'body', 'date', 'dateFormatted', 'title', 'image', 'path', 'mathfont')
            .first();

        if (!post) {
            throw createError({
                statusCode: 404,
                message: 'Post não encontrado',
            });
        }

        return post as BlogCollectionItem;
        
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
