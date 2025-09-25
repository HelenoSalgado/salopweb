import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const contentDir = path.resolve(process.cwd(), 'content', 'blog');
const outputFilePath = path.resolve(process.cwd(), 'public', 'search-index.json');

// Recursive function to get all files in a directory
async function getAllFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getAllFiles(res) : res;
    }),
  );
  return files.flat();
}

async function generateSearchIndex() {
  const searchIndex = [];
  try {
    const allFiles = await getAllFiles(contentDir);
    const mdFiles = allFiles.filter(file => file.endsWith('.md'));

    for (const filePath of mdFiles) {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data } = matter(fileContent);

      const slug = path.relative(contentDir, filePath).replace(/\.md$/, '');
      const postPath = `/blog/${slug}`;

      searchIndex.push({
        path: postPath,
        title: data.title || slug,
        description: data.description || '',
      });
    }

    await fs.writeFile(outputFilePath, JSON.stringify(searchIndex, null, 2), 'utf-8');
    console.log('Search index generated successfully:', outputFilePath);
  } catch (error) {
    console.error('Error generating search index:', error);
    process.exit(1);
  }
}

generateSearchIndex();