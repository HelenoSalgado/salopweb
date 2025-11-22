import { defineTransformer } from '@nuxt/content';

export default defineTransformer({
    name: 'author-default',
    extensions: ['.md'],
    transform(file) {
        if (file.author == null) {
            file.author = "Heleno Salgado";
        }
        return file;
    },
});
