import { defineEventHandler } from 'h3';
import { queryCollection } from '@nuxt/content/server';

export default defineEventHandler(async (event) => {
    
    try {
        const page = await queryCollection(event, 'sobre').first();

        if (!page) {
            throw createError({
                statusCode: 404,
                message: 'Página não encontrada'
            });
        }

        return page;
    } catch (error: any) {
        if (error.statusCode) {
            throw error;
        }
        throw createError({
            statusCode: 500,
            message: 'Erro ao buscar página'
        });
    }
});
