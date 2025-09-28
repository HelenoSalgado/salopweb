// server/api/categories/[slug].get.ts
import type { BlogCollectionItem } from '@nuxt/content';
import { queryCollection } from '@nuxt/content/server';
import { getQuery } from 'h3';
import type { H3Event } from 'h3';
import type { CardPost, PostsPagination } from '~~/server/types';

export default defineEventHandler(async (event: H3Event) => {
    const category = event.context.params?.slug as string;
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 7;

    const baseQuery = () => queryCollection(event, 'blog')
        .where('slugified_categories', 'LIKE', `%"${category}"%`);

    const totalPosts = await baseQuery().count();

    if (totalPosts === 0) {
        return { posts: [], totalPages: 0, categoryName: '' };
    }

    let categoryName = '';
    const firstPostForCat = await baseQuery().select('categories', 'slugified_categories').first() as {
        categories: BlogCollectionItem['categories'],
        slugified_categories: BlogCollectionItem['slugified_categories']
    };

    if (firstPostForCat) {
        const categoryIndex = firstPostForCat?.slugified_categories?.indexOf(category);
        if (categoryIndex !== -1 && firstPostForCat.categories) {
            categoryName = firstPostForCat.categories[categoryIndex as number];
        }
    }

    const totalPages = Math.ceil(totalPosts / limit);
    const offset = (page - 1) * limit;

    const paginatedPosts = await baseQuery()
        .select('id', 'title', 'description', 'path', 'date', 'dateFormatted', 'image')
        .order('date', 'DESC')
        .skip(offset)
        .limit(limit)
        .all();

    return <PostsPagination<CardPost[]>>{
        posts: paginatedPosts,
        totalPages,
        categoryName,
    };
});
