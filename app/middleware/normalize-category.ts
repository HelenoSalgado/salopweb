// middleware/normalize-category-slug.ts
export default defineNuxtRouteMiddleware((to) => {
  // Verifica se a rota começa com /blog/categorias/
  if (to.path.startsWith('/blog/categorias/')) {
    const slug = to.params.slug as string || '';  // Pega o slug dinâmico

    // Função slugify: minúsculas, remove acentos, espaços para hifens
    const slugify = (str: string) => {
      return str.toLowerCase()
        .normalize('NFD')  // Decompõe acentos
        .replace(/[\u0300-\u036f]/g, '')  // Remove diacríticos
        .replace(/[^a-z0-9 -]/g, '')  // Remove inválidos
        .replace(/\s+/g, '-')  // Espaços para hifens
        .replace(/-+/g, '-');  // Remove hifens duplicados
    };

    const normalizedSlug = slugify(slug);

    // Calcula o path normalizado esperado
    const normalizedPath = `/blog/categorias/${normalizedSlug}`;

    // Se o slug original for diferente do normalizado, redireciona
    if (slug !== normalizedSlug && decodeURI(to.path) !== normalizedPath) {
      // Define o estado global com o original (disponível na página)
      useState<string>('originalCategory').value = slug;
       // Salva no localStorage para persistir em reloads
      if (import.meta.client) {
        localStorage.setItem('originalCategory', slug);
      }
      return navigateTo({
        path: to.path.replace(slug, normalizedSlug),  // Atualiza o path com slug normalizado
      }, { redirectCode: 301 });  // Redirecionamento permanente
    }
  }
  // Continua normalmente se não for rota de categorias
  return;
});
