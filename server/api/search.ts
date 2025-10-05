
import { getQuery } from 'h3';
import { queryCollection } from '@nuxt/content/server';

// Função auxiliar para remover acentos
const removeAccents = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const searchTerm = query.q as string;

    if (!searchTerm?.trim()) {
        return [];
    }

    const normalizedSearchTerm = removeAccents(searchTerm.toLowerCase().trim());

    if (normalizedSearchTerm.length < 2) {
        throw createError({
            statusCode: 400,
            message: 'Termo de busca deve ter pelo menos 2 caracteres'
        });
    }

    try {
        // Busca os posts diretamente do Nuxt Content
        const posts = await queryCollection(event, 'blog')
            .where('published', '=', true)
            .select('path', 'title', 'description')
            .all();

        const filteredPosts = posts.filter(post => {
            const normalizedTitle = post.title ? removeAccents(post.title.toLowerCase()) : '';
            const normalizedDescription = post.description ? removeAccents(post.description.toLowerCase()) : '';

            return normalizedTitle.includes(normalizedSearchTerm) || 
                   normalizedDescription.includes(normalizedSearchTerm);
        });

        // Limita a 10 resultados para performance
        return filteredPosts
            .slice(0, 10)
            .map(post => ({
                path: post.path,
                title: post.title,
                description: post.description,
            }));

    } catch (error) {
        throw createError({
            statusCode: 500,
            message: 'Erro ao realizar busca'
        });
    }
});
