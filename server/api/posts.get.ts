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
            // Buscar todos os posts primeiro e filtrar no código
            const allPosts = await baseQuery()
                .select('id', 'title', 'description', 'path', 'date', 'dateFormatted', 'image', 'categories')
                .where('path', '<>', excludePath)
                .order('date', 'DESC')
                .order('id', 'ASC')
                .all();

            // Filtrar posts que compartilham pelo menos uma categoria
            const relatedPosts = allPosts.filter(post => {
                if (!post.categories || !Array.isArray(post.categories)) return false;
                return categories.some(category => post.categories.includes(category));
            }).slice(0, limit);

            return relatedPosts.map(post => ({
                id: post.id,
                title: post.title,
                description: post.description,
                path: post.path,
                date: post.date,
                dateFormatted: post.dateFormatted,
                image: post.image
            })) as CardPost[];
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
