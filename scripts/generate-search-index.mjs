import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const contentDir = path.resolve(process.cwd(), 'content', 'blog');
const outputFilePath = path.resolve(process.cwd(), 'public', 'search-index.json');

async function generateSearchIndex() {
  const searchIndex = [];
  try {
    const files = await fs.readdir(contentDir);

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(contentDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data } = matter(fileContent);

        // Assuming the path is derived from the filename
        const slug = file.replace(/\.md$/, '');
        const postPath = `/blog/${slug}`;

        searchIndex.push({
          path: postPath,
          title: data.title || slug, // Use slug if title is not available
          description: data.description || '',
        });
      }
    }

    await fs.writeFile(outputFilePath, JSON.stringify(searchIndex, null, 2), 'utf-8');
    console.log('Search index generated successfully:', outputFilePath);
  } catch (error) {
    console.error('Error generating search index:', error);
    process.exit(1);
  }
}

generateSearchIndex();
