import { queryCollection } from "@nuxt/content/server";
import { getQuery } from "h3";
import type { CardPost, PostsPagination } from "~~/server/types";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 7));
    const excludePath = query.excludePath as string;
    const categoriesParam = query.categories;

    const categories = Array.isArray(categoriesParam)
        ? categoriesParam
        : (typeof categoriesParam === 'string' ? [categoriesParam] : []);

    try {
        const baseQuery = () => queryCollection(event, 'blog').where('published', '=', true);

        // Posts relacionados por categoria
        if (categories.length > 0 && excludePath) {
            const relatedPosts = await baseQuery()
                .select('id', 'author', 'title', 'description', 'path', 'date', 'dateFormatted', 'image')
                .where('path', '<>', excludePath)
                .orWhere(q => {
                    for (const category of categories) {
                        q.where('categories', 'LIKE', `%"${category}"%`);
                    };
                    return q;
                })
                .order('date', 'DESC')
                .order('id', 'ASC')
                .limit(limit)
                .all();

            return relatedPosts;
        }

        // Lista paginada de posts
        const totalPosts = await baseQuery().count();

        if (totalPosts === 0) {
            return { posts: [], totalPages: 0 } as PostsPagination<CardPost[]>;
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
            totalPages
        } as PostsPagination<CardPost[]>;

    } catch (error) {
        throw createError({
            statusCode: 500,
            message: 'Erro ao buscar posts'
        });
    }
});
