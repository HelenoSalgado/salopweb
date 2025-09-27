import { BlogCollectionItem } from "@nuxt/content";
import { queryCollection } from "@nuxt/content/server";

export default defineEventHandler(async (event) => {
    const slug = getQuery(event).path as string;

    const baseQuery = queryCollection(event, 'blog');
    const post = await baseQuery.path(slug).select('categories', 'slugified_categories', 'description', 'body', 'dateFormatted', 'title', 'image').first();

    if (!post) {
       throw createError({ statusCode: 400 })
    }

    return post as BlogCollectionItem;

});
