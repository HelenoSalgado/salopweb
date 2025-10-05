import { queryCollection } from "@nuxt/content/server";
import type { Categories } from "~~/server/types";

export default defineEventHandler(async (event) => {
    try {
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
                    if (name && slug && !categoryMap.has(name)) {
                        categoryMap.set(name, slug);
                    }
                }
            }
        }

        const sortedCategories = [...categoryMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));

        const categories = sortedCategories.map(entry => entry[0]);
        const slugified_categories = sortedCategories.map(entry => entry[1]);

        return <Categories>{
            categories,
            slugified_categories
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: 'Erro ao buscar categorias'
        });
    }
});
