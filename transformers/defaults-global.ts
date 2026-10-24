import { defineTransformer } from '@nuxt/content';

export default defineTransformer({
  name: 'defaults-global',
  extensions: ['.md'],
  async transform(file) {
    if (file.image == null) {
      file.image = '/images/default-post.webp';
    }
    return file;
  },
});
