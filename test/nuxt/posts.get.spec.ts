import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('GET /api/posts', async () => {
  await setup({ server: true });

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the first page of posts with default limit', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await $fetch('/api/posts', { params: { page: 1 } }) as any;

    expect(response.posts).toBeDefined();
    expect(response.posts.length).toBe(7); // Default limit
    expect(response.posts[0].title).toBe('Ética a Nicômaco: Livro I'); // Post mais recente
    expect(response.totalPages).toBe(Math.ceil(22 / 7)); // 22 posts no total
  });

  it('should return the second page of posts with a custom limit', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await $fetch('/api/posts', { params: { page: 2, limit: 5 } }) as any;

    expect(response.posts.length).toBe(5);
    expect(response.posts[0].title).toBe('O Zed ainda não'); // Primeiro post da segunda página com limite 5
    expect(response.totalPages).toBe(Math.ceil(22 / 5)); // 22 posts no total
  });

  it('should return related posts filtered by categories and exclude the current post', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await $fetch('/api/posts', {
      params: {
        categories: ['Filosofia', 'Teologia', 'Virtude'],
        excludePath: '/blog/alem-dos-sentidos',
        limit: 4
      }
    }) as any;

    expect(response).toBeDefined();
    expect(response.length).toBe(4); // Limite de 4 posts relacionados
    expect(response.some(post => post.path === '/blog/alem-dos-sentidos')).toBeFalsy(); // Excluir o post atual

    // Verificar se os posts retornados têm categorias em comum e estão ordenados corretamente
    expect(response[0].title).toBe('Ética a Nicômaco: Livro I'); // Filosofia
    expect(response[1].title).toBe('O Propósito Filosófico do Trabalho: Além da Sobrevivência'); // Filosofia
    expect(response[2].title).toBe('Código à prova do tempo'); // Filosofia
    expect(response[3].title).toBe('Chame-os do que você é'); // Filosofia
  });

});
