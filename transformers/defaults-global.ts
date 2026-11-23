import { defineTransformer } from '@nuxt/content';
import { DEFAULT_OG_IMAGE_PATH } from '../utils/seo';

export default defineTransformer({
  name: 'defaults-global',
  extensions: ['.md'],
  async transform(file) {
    if (file.image == null) {
      file.image = DEFAULT_OG_IMAGE_PATH;
    }
    return file;
  },
});
