import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

// Get the directory name of the current module
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const distPath = resolve(__dirname, '../dist'); // Assuming scripts/ is inside project root

const cleanupHtmlFile = (filePath) => {
  try {
    const html = readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);

    // Remove <script type="importmap">
    $('script[type="importmap"]').remove();

    // Remove <link rel="modulepreload">
    $('link[rel="modulepreload"]').remove();

    // Remove <script id="__NUXT_DATA__">
    $('script#__NUXT_DATA__').remove();

    // Remove <script type="module"> (general module scripts, including _nuxt/entry.js)
    // This targets any script tag with type="module"
    $('script[type="module"]').remove();

    // Remove <link rel="preload"> and <link rel="prefetch">
    $('link[rel="preload"]').remove();
    $('link[rel="prefetch"]').remove();

    // Remove <div id="teleports"> // NEW: Remove teleports div
    $('div#teleports').remove();

    // Write the cleaned HTML back
    writeFileSync(filePath, $.html(), 'utf8');
    console.log(`Cleaned: ${filePath}`);
  } catch (error) {
    console.error(`Error cleaning ${filePath}:`, error);
  }
};

const traverseDirectory = (directory) => {
  const files = readdirSync(directory);

  for (const file of files) {
    const filePath = join(directory, file);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      traverseDirectory(filePath); // Recurse into subdirectories
    } else if (stats.isFile() && filePath.endsWith('.html')) {
      cleanupHtmlFile(filePath); // Process HTML files
    }
  }
};

console.log('Starting HTML cleanup...');
traverseDirectory(distPath);
console.log('HTML cleanup finished.');