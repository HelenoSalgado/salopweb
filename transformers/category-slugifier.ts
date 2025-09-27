import { defineTransformer } from '@nuxt/content';
import { slugify } from '../utils/slugify';

export default defineTransformer({
  name: 'category-slugifier',
  extensions: ['.md'],
  async transform(file) {
    if (file.categories && Array.isArray(file.categories)) {
      // Cria um novo campo 'slugified_categories' com as categorias normalizadas
      file.slugified_categories = file.categories.map(category => slugify(category as string));
    }
    return file;
  },
});
