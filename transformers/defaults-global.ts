import { defineTransformer } from '@nuxt/content';

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default defineTransformer({
  name: 'defaults-global',
  extensions: ['.md'],
  async transform(file) {
    if (file.image == null) {
      file.image = `${siteUrl}/images/default-post.webp`;
    }
    return file;
  },
});
