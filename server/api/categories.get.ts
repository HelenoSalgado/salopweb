import { queryCollection } from "@nuxt/content/server";
import { Categories } from "~~/server/types";

export default defineEventHandler(async (event) => {

    const posts = await queryCollection(event, 'blog')
        .select('categories', 'slugified_categories')
        .all();

    if (posts.length === 0) {
        return { slugified_categories: [], categories: [] };
    }

    const categoryMap = new Map<string, string>();

    for (const post of posts) {
        if (post.categories && post.slugified_categories) {
            for (let i = 0; i < post.categories.length; i++) {
                const name = post.categories[i];
                const slug = post.slugified_categories[i];
                if (!categoryMap.has(name)) {
                    categoryMap.set(name, slug);
                }
            }
        }
    }

    const sortedCategories = [...categoryMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));

    const uniquesNamesCategories = sortedCategories.map(entry => entry[0]);
    const uniquesSlugifiedCategories = sortedCategories.map(entry => entry[1]);

    return <Categories>{
        slugified_categories: uniquesSlugifiedCategories,
        categories: uniquesNamesCategories
    }

});
