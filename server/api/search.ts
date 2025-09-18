import { getQuery } from 'h3';
// Import the JSON file directly
import searchIndex from '../../public/search-index.json';

// Função auxiliar para remover acentos
const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, "");
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchTerm = removeAccents((query.q as string || '').toLowerCase());

  if (!searchTerm) {
    return [];
  }

  // Use the directly imported search index
  const posts = searchIndex;

  const filteredPosts = posts.filter(post => {
    const normalizedTitle = post.title ? removeAccents(post.title.toLowerCase()) : '';
    const normalizedDescription = post.description ? removeAccents(post.description.toLowerCase()) : '';

    const titleMatch = normalizedTitle.includes(searchTerm);
    const descriptionMatch = normalizedDescription.includes(searchTerm);
    return titleMatch || descriptionMatch;
  });

  return filteredPosts.map(post => ({
    path: post.path,
    title: post.title,
    description: post.description,
  }));
});