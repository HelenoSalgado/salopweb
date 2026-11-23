import type { BlogCollectionItem } from '@nuxt/content'
import { queryCollection } from '@nuxt/content/server'
import type { H3Event } from 'h3'
import { buildCanonicalUrl, resolveAbsoluteAssetUrl } from '~~/utils/seo'

export default defineEventHandler(async (event: H3Event) => {

  const siteUrl = useRuntimeConfig().public.site.url
  const channelUrl = buildCanonicalUrl(siteUrl, '/')
  const feedUrl = resolveAbsoluteAssetUrl(siteUrl, '/rss.xml')
  
  // Busca todos os posts do blog publicados
  const posts = await queryCollection(event, 'blog')
    .where('published', '=', true)
    .order('date', 'DESC')
    .all() as BlogCollectionItem[]

  // Gera o XML do RSS
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Heleno Salgado - Blog</title>
    <link>${channelUrl}</link>
    <description>Blog de filosofia, teologia e reflexões</description>
    <language>pt-BR</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    ${posts.map(post => {
      const postUrl = buildCanonicalUrl(siteUrl, post.path || '/')
      return `
    <item>
      <title>${escapeXml(post.title || '')}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${post.date ? new Date(post.date).toUTCString() : ''}</pubDate>
      <description>${escapeXml(post.description || '')}</description>
      ${post.categories ? post.categories.map((cat: string) => `<category>${escapeXml(cat)}</category>`).join('\n      ') : ''}
    </item>`
    }).join('')}
  </channel>
</rss>`

  // Define o content-type como XML
  event.node.res.setHeader('Content-Type', 'application/xml')
  
  return rss
})

// Função para escapar caracteres especiais no XML
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
