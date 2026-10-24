import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils';
import type { PostsPagination, CardPost } from '~~/server/types';

interface PostMock {
  id: number;
  title: string;
  categories: string[];
  slugified_categories: string[];
}

// Mock data
const allPosts: PostMock[] = [
  { id: 1, title: 'Post 1', categories: ['Tech', 'News'], slugified_categories: ['tech', 'news'] },
  { id: 2, title: 'Post 2', categories: ['Life', 'Story'], slugified_categories: ['life', 'story'] },
  { id: 3, title: 'Post 3', categories: ['Tech', 'Guide'], slugified_categories: ['tech', 'guide'] },
  { id: 4, title: 'Post 4', categories: ['News'], slugified_categories: ['news'] },
  { id: 5, title: 'Post 5', categories: ['Tech'], slugified_categories: ['tech'] },
];

const techPosts = allPosts.filter(p => p.slugified_categories.includes('tech'));

interface QueryBuilderMock {
  where: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
  skip: (num: number) => QueryBuilderMock;
  limit: (num: number) => QueryBuilderMock;
  count: ReturnType<typeof vi.fn>;
  first: ReturnType<typeof vi.fn>;
  all: ReturnType<typeof vi.fn>;
  skipped: number;
  limited: number;
}

// Mock implementation of the query builder
const mockQueryBuilder: QueryBuilderMock = {
  where: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  skip: function (this: QueryBuilderMock, num: number) {
    this.skipped = num;
    return this;
  },
  limit: function (this: QueryBuilderMock, num: number) {
    this.limited = num;
    return this;
  },
  count: vi.fn(),
  first: vi.fn(),
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
    mockQueryBuilder.count.mockResolvedValue(techPosts.length);
    mockQueryBuilder.first.mockResolvedValue({
      categories: ['Tech'],
      slugified_categories: ['tech'],
    });
    mockQueryBuilder.all.mockImplementation(function (this: QueryBuilderMock) {
      const start = this.skipped || 0;
      const end = start + (this.limited || techPosts.length);
      return Promise.resolve(techPosts.slice(start, end));
    });
    mockQueryBuilder.skipped = 0;
    mockQueryBuilder.limited = 0;
  });

  it('should filter posts by slugified_categories and return the first page', async () => {
    const category = 'tech';
    const response = await $fetch<PostsPagination<CardPost[]>>(`/api/categories/${category}`, {
      params: { page: 1, limit: 2 },
    });

    expect(mockQueryBuilder.where).toHaveBeenCalledWith('slugified_categories', 'LIKE', `%"${category}"%`);
    expect(response.posts).toBeDefined();
    expect(response.posts.length).toBe(2);
    expect(response.posts[0]?.title).toBe('Post 1');
    expect(response.totalPages).toBe(Math.ceil(techPosts.length / 2));
  });

  it('should return the second page for a category', async () => {
    const category = 'tech';
    const response = await $fetch<PostsPagination<CardPost[]>>(`/api/categories/${category}`, {
      params: { page: 2, limit: 2 },
    });

    expect(mockQueryBuilder.where).toHaveBeenCalledWith('slugified_categories', 'LIKE', `%"${category}"%`);
    expect(response.posts.length).toBe(1);
    expect(response.posts[0]?.title).toBe('Post 5');
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(2);
  });

  it('should return empty results for a category with no posts', async () => {
    const category = 'empty-category';
    mockQueryBuilder.count.mockResolvedValue(0);
    mockQueryBuilder.all.mockResolvedValue([]);

    const response = await $fetch<PostsPagination<CardPost[]>>(`/api/categories/${category}`);

    expect(mockQueryBuilder.where).toHaveBeenCalledWith('slugified_categories', 'LIKE', `%"${category}"%`);
    expect(response.posts.length).toBe(0);
    expect(response.totalPages).toBe(0);
  });
});
