import { queryCollection } from "@nuxt/content/server";
import { PostsPagination } from "~~/server/types";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 7;
    const excludePath = query.excludePath as string;
    const categories = query.categories as string[];

    const baseQuery = () => queryCollection(event, 'blog');

    // Se a query 'categories' estiver presente, retorna posts relacionados (lógica para outro componente)
    if (categories?.length > 0) {
        const relatedPostsQuery = baseQuery()
            .select('title', 'description', 'path', 'date')
            .where('path', '<>', excludePath)
            .orWhere(q => {
                for (const category of categories) {
                    q.where('categories', 'LIKE', `%"${category}"%`);
                }
                return q;
            })
            .order('date', 'DESC')
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
        .select('title', 'description', 'path', 'date')
        .order('date', 'DESC')
        .skip(offset)
        .limit(limit)
        .all();

    return <PostsPagination>{
        posts: paginatedPosts,
        totalPages
    };
});
