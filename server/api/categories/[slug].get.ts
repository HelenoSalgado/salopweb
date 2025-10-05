import type { BlogCollectionItem } from '@nuxt/content';
import { queryCollection } from '@nuxt/content/server';
import { getQuery } from 'h3';
import type { H3Event } from 'h3';
import type { CardPost, PostsPagination } from '~~/server/types';

export default defineEventHandler(async (event: H3Event) => {
    const category = event.context.params?.slug as string;
    const query = getQuery(event);
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 7));

    if (!category) {
        throw createError({
            statusCode: 400,
            message: 'Categoria é obrigatória'
        });
    }

    try {
        const baseQuery = () => queryCollection(event, 'blog')
            .where('published', '=', true)
            .where('slugified_categories', 'LIKE', `%"${category}"%`);

        const totalPosts = await baseQuery().count();

        if (totalPosts === 0) {
            return { 
                posts: [], 
                totalPages: 0, 
                categoryName: '' 
            } as PostsPagination<CardPost[]>;
        }

        // Buscar nome da categoria
        let categoryName = '';
        const firstPost = await baseQuery()
            .select('categories', 'slugified_categories')
            .first() as {
                categories: BlogCollectionItem['categories'],
                slugified_categories: BlogCollectionItem['slugified_categories']
            };

        if (firstPost?.slugified_categories && firstPost?.categories) {
            const categoryIndex = firstPost.slugified_categories.indexOf(category);
            if (categoryIndex !== -1) {
                categoryName = firstPost.categories[categoryIndex];
            }
        }

        const totalPages = Math.ceil(totalPosts / limit);
        const offset = (page - 1) * limit;

        const paginatedPosts = await baseQuery()
            .select('id', 'title', 'description', 'path', 'date', 'dateFormatted', 'image')
            .order('date', 'DESC')
            .order('id', 'ASC')
            .skip(offset)
            .limit(limit)
            .all();

        return {
            posts: paginatedPosts,
            totalPages,
            categoryName,
        } as PostsPagination<CardPost[]>;

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }
        throw createError({
            statusCode: 500,
            message: 'Erro ao buscar posts da categoria'
        });
    }
});
