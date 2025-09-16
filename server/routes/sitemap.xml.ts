import { SitemapStream, streamToPromise } from 'sitemap';
import { queryCollection } from '@nuxt/content/server';

export default defineEventHandler(async (event) => {
  const sitemap = new SitemapStream({
    hostname: 'https://heleno.dev' // Replace with your actual domain
  });

  // Add static pages
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  sitemap.write({ url: '/blog', changefreq: 'weekly', priority: 0.9 });
  sitemap.write({ url: '/sobre', changefreq: 'monthly', priority: 0.8 });

  // Add dynamic pages from Nuxt Content
  const content = await queryCollection(event, 'blog').all()
  for (const item of content) {
    if (item.path) {
      sitemap.write({
        url: item.path === '/index' ? '/' : item.path,
        changefreq: 'monthly',
        priority: 0.7
      });
    }
  }

  sitemap.end();
  return streamToPromise(sitemap);
});