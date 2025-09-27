import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

// Mock data - 20 posts
const mockPosts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}`,
  date: new Date(2024, 0, 20 - i).toISOString(),
  // Ensure other necessary properties exist to avoid runtime errors
  description: `Description for post ${i + 1}`,
  categories: ['teste']
}));

// Mock implementation of the query builder
const mockQueryBuilder = {
  where: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  skip: vi.fn(function (this: any, num: number) {
    this.skipped = num;
    return this;
  }),
  limit: vi.fn(function (this: any, num: number) {
    this.limited = num;
    return this;
  }),
  count: vi.fn(),
  all: vi.fn(),
  // Internal state for the mock
  _skipped: 0,
  _limited: 0,
};

// Mock the entire module
vi.mock('@nuxt/content/server', () => ({
  queryCollection: vi.fn(() => mockQueryBuilder),
}));

describe('GET /api/posts', async () => {
  await setup({ server: true });

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock behavior for a successful query
    mockQueryBuilder.count.mockResolvedValue(mockPosts.length);
    mockQueryBuilder.all.mockImplementation(function (this: any) {
      const start = this.skipped || 0;
      const end = start + (this.limited || mockPosts.length);
      return Promise.resolve(mockPosts.slice(start, end));
    });
    // Reset internal state
    mockQueryBuilder._skipped = 0;
    mockQueryBuilder._limited = 0;
  });

  it('should return the first page of posts with default limit', async () => {
    const response = await $fetch('/api/posts', { params: { page: 1 } }) as any;

    expect(response.posts).toBeDefined();
    expect(response.posts.length).toBe(7); // Default limit
    expect(response.posts[0].title).toBe('Post 1');
    expect(response.totalPages).toBe(Math.ceil(20 / 7)); // 3
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(mockQueryBuilder.limit).toHaveBeenCalledWith(7);
  });

  it('should return the second page of posts with a custom limit', async () => {
    const response = await $fetch('/api/posts', { params: { page: 2, limit: 5 } }) as any;

    expect(response.posts.length).toBe(5);
    expect(response.posts[0].title).toBe('Post 6');
    expect(response.totalPages).toBe(Math.ceil(20 / 5)); // 4
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5); // (2 - 1) * 5
    expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
  });

  it('should return an empty array when no posts are found', async () => {
    // Arrange: Override default mock for this specific test
    mockQueryBuilder.count.mockResolvedValue(0);
    mockQueryBuilder.all.mockResolvedValue([]);

    const response = await $fetch('/api/posts') as any;

    expect(response.posts.length).toBe(0);
    expect(response.totalPages).toBe(0);
  });
});
