<template>
  <div class="portfolio-home">
    <!-- Seção 1: Apresentação -->
    <section class="presentation-section">
      <div class="bio">
        <h2 class="subtitle">Desenvolvo Software com foco em performance, código limpo e SEO.</h2>
        <p class="subtitle-continuation">Neste espaço, compartilho o que aprendo, não só sobre código, mas os <NuxtLink to="/sobre">meus interesses mais pertinentes</NuxtLink>. Obrigado pela visita.</p>
        <div class="social-links">
          <a href="https://github.com/HelenoSalgado" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <IconsGithub />
          </a>
          <a href="https://twitter.com/HelenoSalgado" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <IconsTwitter />
          </a>
          <a href="https://instagram.com/heleno_salgado" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <IconsInstagram />
          </a>
        </div>
      </div>
      <div class="skills-cloud">
        <ul class="skills-list-for-seo">
          <li>TypeScript</li>
          <li>Vue.js</li>
          <li>Nuxt.js</li>
          <li>Node.js</li>
          <li>Nest.js</li>
          <li>PHP</li>
          <li>Laravel</li>
          <li>SQL</li>
          <li>Docker</li>
          <li>Git</li>
          <li>HTML5</li>
          <li>CSS3</li>
          <li>Perl</li>
          <li>Linux</li>
          <li>Kotlin</li>
          <li>JavaScript</li>
        </ul>
      </div>
    </section>

    <!-- Seção 2: Projetos em Destaque -->
    <section class="projects-section">
      <h2 class="section-title">Projetos em Destaque</h2>
      <div v-if="pending" class="loading-state">Carregando projetos...</div>
      <div v-else-if="error || !projects || projects.length === 0" class="error-state">
        Não foi possível carregar os projetos do GitHub no momento.
      </div>
      <div v-else class="projects-grid">
        <ProjectCard v-for="project in projects" :key="project.name" :project="project" />
      </div>
    </section>

    <!-- Seção 3: Call to Action -->
    <section class="cta-section">
      <h2>Gostou do que viu?</h2>
      <p>Explore meus artigos ou entre em contato.</p>
      <div class="cta-links">
        <NuxtLink to="/blog" class="cta-button">Ler meus escritos</NuxtLink>
        <NuxtLink to="/sobre" class="cta-button secondary">Sobre mim</NuxtLink>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">

const config = useRuntimeConfig();
const siteUrl = config.public.site.url;

definePageMeta({
  layout: 'portfolio'
});

// Busca os projetos da API interna
const { data: projects, pending, error } = await useAsyncData('github-projects', () => $fetch('/api/github'));

useHead({
  title: 'Heleno Salgado | Desenvolvedor de Software e Portfólio',
  meta: [
    {
      name: 'description',
      content: 'Portfólio de Heleno Salgado, desenvolvedor de software especialista em Nuxt.js, Vue.js, e PHP. Explore meus projetos, artigos sobre tecnologia e código limpo.'
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        'mainEntity': {
          '@type': 'Person',
          'name': 'Heleno Salgado',
          'alternateName': 'Leno',
          'url': siteUrl,
          'jobTitle': 'Desenvolvedor de Software',
          'knowsAbout': [
            'TypeScript', 'Vue.js', 'Nuxt.js', 'Node.js', 'PHP', 'Laravel', 'SQL', 'Docker', 'Linux', 'Kotlin'
          ],
          'sameAs': [
            'https://github.com/HelenoSalgado',
            'https://x.com/HelenoSalgado',
            'https://instagram.com/heleno_salgado',
            'https://orcid.org/0009-0003-3945-2493'
          ]
        }
      })
    }
  ]
})

let tagCloudInstance: any = null;

onMounted(async () => {
  const container = '.skills-cloud';
  const texts = [
    'TypeScript', 'Vue.js', 'Nuxt.js',
    'Node.js', 'Nest.js', 'PHP',
    'Laravel', 'SQL', 'Docker',
    'Git', 'HTML5', 'CSS3',
    'Perl', 'Linux', 'JavaScript',
  ];

  const options = {
    radius: 250,
    maxSpeed: 'normal' as const,
    initSpeed: 'normal' as const,
    direction: 135,
    keep: true,
  };

  // Lazy load TagCloud apenas quando necessário
  if (typeof window !== 'undefined') {
    const TagCloud = (await import('TagCloud')).default;
    tagCloudInstance = TagCloud(container, texts, options);
  }
});

onUnmounted(() => {
  // Destrói a instância para evitar memory leaks
  if (tagCloudInstance) {
    tagCloudInstance.destroy();
  }
});

</script>

<style scoped>
.portfolio-home {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

section {
  margin: 6rem 0;
}

/* Seção 1: Apresentação */
.presentation-section {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
}

.bio, .skills-cloud {
  flex: 1 1 400px;
  min-width: 300px;
}

.subtitle-continuation {
  font-family: 'Lora', serif;
  font-size: 1.35rem;
  color: var(--color-text-secondary);
  margin-top: 1rem;
  line-height: 1.4;
}

.subtitle-continuation :deep(a) {
  text-decoration: underline;
  color: var(--color-primary);
  transition: color 0.2s ease;
  text-decoration: none;
}

.subtitle-continuation :deep(a:hover) {
  color: var(--color-primary-hover);
}

.social-links {
  margin-top: 2rem;
  display: flex;
  gap: 1.5rem;
}

.social-links a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.social-links a:hover {
  color: var(--color-primary);
}

.social-links a > :deep(svg) {
  width: 28px;
  height: 28px;
}

.skills-cloud {
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1 / 1;
  max-width: 500px;
  margin: 0 auto;
}

.skills-list-for-seo {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.skills-cloud :deep(.tagcloud) {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    color: var(--color-primary);
}

.skills-cloud :deep(.tagcloud--item) {
    padding: 2px 4px;
    transition: color 0.3s ease;
}

.skills-cloud :deep(.tagcloud--item:hover) {
    color: var(--color-primary-hover);
}


.section-title {
  font-family: 'Baskervville', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 5rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.loading-state, .error-state {
  font-family: 'Baskervville', serif;
  text-align: center;
  color: var(--color-text-secondary);
  padding: 4rem 0;
}

/* Seção 3: CTA */
.cta-section {
  text-align: center;
}

.cta-section p {
  font-family: 'Lora', serif;
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.cta-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.cta-button {
  font-family: 'Inter', sans-serif;
  background-color: var(--color-primary);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.cta-button:hover {
  background-color: #7a15a1; /* Um tom mais escuro de roxo */
}

.cta-button.secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

/* Responsividade */
@media (max-width: 900px) {
  .bio {
    text-align: center;
  }
  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .section-title { font-size: 2rem; }
  .projects-grid {
    grid-template-columns: 1fr;
    gap-row: 1.5rem
  }
}
</style>
