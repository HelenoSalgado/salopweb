import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import type { PostsPagination, CardPost } from '~~/server/types';

// Mock data
const allPosts = [
  { id: 1, title: 'Post 1', categories: ['tech', 'news'] },
  { id: 2, title: 'Post 2', categories: ['life', 'story'] },
  { id: 3, title: 'Post 3', categories: ['tech', 'guide'] },
  { id: 4, title: 'Post 4', categories: ['news'] },
  { id: 5, title: 'Post 5', categories: ['tech'] },
];

const techPosts = allPosts.filter(p => p.categories.includes('tech')); // 3 posts

// Mock implementation of the query builder
const mockQueryBuilder = {
  where: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  skip: vi.fn(function(this: any, num: number) {
    this.skipped = num;
    return this;
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  limit: vi.fn(function(this: any, num: number) {
    this.limited = num;
    return this;
  }),
  count: vi.fn(),
  all: vi.fn(),
  skipped: 0,
  limited: 0,
};

// Mock the entire module
vi.mock('@nuxt/content/server', () => ({
  queryCollection: vi.fn(() => mockQueryBuilder),
}));

describe('GET /api/categories/:slug', async () => {
  await setup({ server: true });

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock behavior for a successful query on 'tech' posts
    mockQueryBuilder.count.mockResolvedValue(techPosts.length);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockQueryBuilder.all.mockImplementation(function(this: any) {
      const start = this.skipped || 0;
      const end = start + (this.limited || techPosts.length);
      // Return a slice of the filtered posts
      return Promise.resolve(techPosts.slice(start, end));
    });
    mockQueryBuilder.skipped = 0;
    mockQueryBuilder.limited = 0;
  });

  it('should filter posts by category and return the first page', async () => {
    const category = 'tech';
    const response = await $fetch(`/api/categories/${category}`, {
      params: { page: 1, limit: 2 }
    }) as PostsPagination<CardPost[]>;

    expect(mockQueryBuilder.where).toHaveBeenCalledWith('categories', 'LIKE', `%"${category}"%`);
    expect(response.posts).toBeDefined();
    expect(response.posts.length).toBe(2);
    expect(response.posts[0].title).toBe('Post 1');
    expect(response.totalPages).toBe(Math.ceil(techPosts.length / 2)); // 3 posts / 2 per page = 2
  });

  it('should return the second page for a category', async () => {
    const category = 'tech';
    const response = await $fetch(`/api/categories/${category}`, {
      params: { page: 2, limit: 2 }
    });

    expect(mockQueryBuilder.where).toHaveBeenCalledWith('categories', 'LIKE', `%"${category}"%`);
    expect(response.posts.length).toBe(1); // Last post on the second page
    expect(response.posts[0].title).toBe('Post 5');
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(2); // (2 - 1) * 2
  });

  it('should return empty results for a category with no posts', async () => {
    const category = 'empty-category';
    // Arrange: Override mock for this specific test
    mockQueryBuilder.count.mockResolvedValue(0);
    mockQueryBuilder.all.mockResolvedValue([]);

    const response = await $fetch(`/api/categories/${category}`);

    expect(mockQueryBuilder.where).toHaveBeenCalledWith('categories', 'LIKE', `%"${category}"%`);
    expect(response.posts.length).toBe(0);
    expect(response.totalPages).toBe(0);
  });
});
