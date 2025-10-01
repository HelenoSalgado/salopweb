
import { getQuery } from 'h3';
import { queryCollection } from '@nuxt/content/server';

// Função auxiliar para remover acentos
const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchTerm = removeAccents((query.q as string || '').toLowerCase());

  if (!searchTerm) {
    return [];
  }

  // Busca os posts diretamente do Nuxt Content
  const posts = await queryCollection(event, 'blog')
    .where('published', '=', true)
    .select('path', 'title', 'description')
    .all();

  const filteredPosts = posts.filter(post => {
    const normalizedTitle = post.title ? removeAccents(post.title.toLowerCase()) : '';
    const normalizedDescription = post.description ? removeAccents(post.description.toLowerCase()) : '';

    const titleMatch = normalizedTitle.includes(searchTerm);
    const descriptionMatch = normalizedDescription.includes(searchTerm);
    return titleMatch || descriptionMatch;
  });

  const result = filteredPosts.map(post => ({
    path: post.path,
    title: post.title,
    description: post.description,
  }));

  return result;
});
