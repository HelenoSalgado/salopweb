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
/* Container principal com espaçamento responsivo */
.portfolio-home {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: hidden;

  /* Estilos herdados para sections */
  & section {
    margin: 4rem 0;
  }
}

/* Seção 1: Apresentação */
.presentation-section {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  justify-content: center;

  /* Bio e skills-cloud herdam flexibilidade */
  & .bio,
  & .skills-cloud {
    flex: 1 1 300px;
    min-width: 0;
    max-width: 100%;
  }

  & .bio {
    max-width: 550px;

    & .subtitle {
      font-size: 1.8rem;
      line-height: 1.4;
      color: var(--color-text-heading);
      margin-bottom: 1rem;
    }
  }

  & .subtitle-continuation {
    font-size: 1.25rem;
    color: var(--color-text-secondary);
    margin-top: 1rem;
    line-height: 1.7;

    & :deep(a) {
      color: var(--color-primary);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s ease, color 0.2s ease;

      &:hover {
        color: var(--color-primary-hover);
        border-bottom-color: var(--color-primary-hover);
      }
    }
  }

  & .social-links {
    margin-top: 2rem;
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;

    & a {
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: color 0.2s ease, transform 0.2s ease;
      display: inline-flex;
      padding: 0.5rem;
      border-radius: 8px;

      &:hover {
        color: var(--color-primary);
        transform: translateY(-2px);
      }

      & > :deep(svg) {
        width: 28px;
        height: 28px;
      }
    }
  }

  & .skills-cloud {
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1 / 1;
    max-width: 500px;
    margin: 0 auto;
    overflow: hidden;
    position: relative;

    & :deep(.tagcloud) {
      font-weight: 600;
      color: var(--color-primary);
    }

    & :deep(.tagcloud--item) {
      padding: 2px 4px;
      transition: color 0.3s ease, transform 0.2s ease;
      cursor: default;

      &:hover {
        color: var(--color-primary-hover);
      }
    }
  }
}

/* Lista de skills oculta para SEO (screen reader accessible) */
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

/* Seção 2: Projetos */
.projects-section {
  & .section-title {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 3rem;
    color: var(--color-text-heading);
  }

  & .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  & .loading-state,
  & .error-state {
    text-align: center;
    color: var(--color-text-secondary);
    padding: 3rem 0;
    font-size: 1.2rem;
  }
}

/* Seção 3: CTA */
.cta-section {
  text-align: center;
  padding: 3rem 1.5rem;
  margin-top: 5rem;
  background: linear-gradient(
    135deg,
    rgba(var(--color-primary-rgb), 0.05) 0%,
    transparent 100%
  );
  border-radius: 16px;

  & h2 {
    font-size: 1.8rem;
    color: var(--color-text-heading);
    margin-bottom: 0.75rem;
  }

  & p {
    font-size: 1.2rem;
    color: var(--color-text-secondary);
    margin-top: 0.5rem;
    margin-bottom: 2rem;
  }

  & .cta-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  & .cta-button {
    background-color: var(--color-primary);
    color: var(--color-primary-button-text);
    padding: 0.875rem 1.75rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    border: 2px solid transparent;

    &:hover {
      background-color: var(--color-primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--color-shadow);
    }

    &.secondary {
      background-color: transparent;
      color: var(--color-primary);
      border: 2px solid var(--color-primary);

      &:hover {
        background-color: var(--color-primary);
        color: var(--color-primary-button-text);
      }
    }
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .portfolio-home {
    padding: 0.75rem;
  }

  .presentation-section {
    gap: 1.5rem;

    & .bio {
      text-align: center;
      order: 1;

      & .subtitle {
        font-size: 1.5rem;
      }
    }

    & .subtitle-continuation {
      font-size: 1.15rem;
    }

    & .skills-cloud {
      order: 2;
      max-width: 320px;
      width: 100%;
    }

    & .social-links {
      justify-content: center;
    }
  }

  .projects-section {
    & .section-title {
      font-size: 1.75rem;
      margin-bottom: 2rem;
    }

    & .projects-grid {
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }
  }

  .cta-section {
    padding: 2rem 1rem;
    margin-top: 3rem;

    & h2 {
      font-size: 1.5rem;
    }

    & p {
      font-size: 1.1rem;
    }
  }
}

@media (max-width: 480px) {
  .presentation-section {
    & .bio {
      & .subtitle {
        font-size: 1.35rem;
      }
    }

    & .subtitle-continuation {
      font-size: 1.1rem;
    }

    & .skills-cloud {
      max-width: 280px;
    }
  }

  .cta-section {
    & .cta-links {
      flex-direction: column;
      align-items: center;
    }

    & .cta-button {
      text-align: center;
      width: 100%;
      max-width: 280px;
    }
  }
}
</style>
