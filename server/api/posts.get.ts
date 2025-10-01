import { queryCollection } from "@nuxt/content/server";
import type { CardPost, PostsPagination } from "~~/server/types";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 7;
    const excludePath = query.excludePath as string;
    const categoriesParam = query.categories;

    const categories = Array.isArray(categoriesParam) ? categoriesParam : (typeof categoriesParam === 'string' ? [categoriesParam] : []);

    const baseQuery = () => queryCollection(event, 'blog');

    // Se a query 'categories' estiver presente, retorna posts relacionados
    if (categories.length > 0 && excludePath) {
        const relatedPostsQuery = baseQuery()
            .select('id', 'title', 'description', 'path', 'date', 'dateFormatted', 'image')
            .where('path', '<>', excludePath)
            .orWhere(q => {
                for (const category of categories) {
                    q.where('categories', 'LIKE', `%"${category}"%`);
                }
                return q;
            })
            .order('date', 'DESC')
            .order('id', 'ASC')
            .limit(limit);

        const posts = await relatedPostsQuery.all();
        return posts;
    }

    // Lógica de paginação para a lista principal de posts
    const totalPosts = await baseQuery().count();

    if (totalPosts === 0) {
        return { posts: [], totalPages: 0 };
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

    return <PostsPagination<CardPost[]>>{
        posts: paginatedPosts,
        totalPages
    };
});
