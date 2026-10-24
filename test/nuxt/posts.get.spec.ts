import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils';
import type { CardPost, PostsPagination } from '~~/server/types';

describe('GET /api/posts', async () => {
  await setup({ server: true });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the first page of posts with default limit', async () => {
    const response = await $fetch<PostsPagination<CardPost[]>>('/api/posts', {
      params: { page: 1 },
    });

    expect(response.posts).toBeDefined();
    expect(response.posts.length).toBe(7); // Default limit
    expect(response.totalPages).toBeGreaterThanOrEqual(1);
    expect(response.posts[0]?.title).toBeTruthy();
  });

  it('should return the second page of posts with a custom limit', async () => {
    const response = await $fetch<PostsPagination<CardPost[]>>('/api/posts', {
      params: { page: 2, limit: 5 },
    });

    expect(response.posts.length).toBe(5);
    expect(response.totalPages).toBeGreaterThanOrEqual(2);
    expect(response.posts[0]?.title).toBeTruthy();
  });

  it('should return related posts filtered by categories and exclude the current post', async () => {
    const response = await $fetch<CardPost[]>('/api/posts', {
      params: {
        categories: ['Filosofia', 'Teologia', 'Virtude'],
        excludePath: '/blog/alem-dos-sentidos',
        limit: 4,
      },
    });

    expect(response).toBeDefined();
    expect(response.length).toBeLessThanOrEqual(4);
    expect(response.some((post) => post.path === '/blog/alem-dos-sentidos')).toBeFalsy();
    if (response.length > 0) {
      expect(response[0]?.title).toBeTruthy();
    }
  });
});
