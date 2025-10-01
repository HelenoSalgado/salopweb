
import type { BlogCollectionItem } from "@nuxt/content";
import { queryCollection } from "@nuxt/content/server";

export default defineEventHandler(async (event) => {
    const slug = getQuery(event).path as string;

    const baseQuery = queryCollection(event, 'blog');
    const post = await baseQuery.path(slug)
    .where('published', '=', true)
    .select('id', 'categories', 'slugified_categories', 'description', 'body', 'date', 'dateFormatted', 'title', 'image').first();

    if (!post) {
       throw createError({ statusCode: 404, statusMessage: 'Post não encontrado' })
    }

    return post as BlogCollectionItem;

});
