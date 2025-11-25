<template>
  <div class="portfolio-home">
    <!-- Seção 1: Apresentação -->
    <section class="presentation-section">
      <div class="bio">
        <h2>Desenvolvo Software com foco em performance, código limpo e SEO.</h2>
        <p>Neste espaço, compartilho o que aprendo, não só sobre código, mas os meus interesses mais pertinentes.
          Obrigado pela visita.</p>
        <div class="social-links">
          <a href="https://github.com/HelenoSalgado" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <IconsGithub />
          </a>
          <a href="https://twitter.com/HelenoSalgado" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <IconsTwitter />
          </a>
          <a href="https://instagram.com/heleno_salgado" target="_blank" rel="noopener noreferrer"
            aria-label="Instagram">
            <IconsInstagram />
          </a>
        </div>
      </div>
      <div class="skills-cloud"></div>
    </section>

    <!-- Seção 2: Projetos em Destaque -->
    <section class="projects-section">
      <h2 class="section-title">Projetos em Destaque</h2>
      <div v-if="pending" class="loading-state">Carregando projetos...</div>
      <div v-else-if="error || !projects || projects.length === 0" class="error-state">
        Não foi possível carregar os projetos do GitHub no momento.
      </div>
      <div v-else class="projects-grid">
        <LazyProjectCard v-for="project in projects" :key="project.name" :project="project" />
      </div>
    </section>

    <!-- Seção 3: Call to Action -->
    <section class="cta-section">
      <h2>Gostou do que viu?</h2>
      <p>Explore meus artigos ou entre em contato.</p>
      <div class="cta-links">
        <NuxtLink to="/blog">Blog</NuxtLink>
        <NuxtLink to="/sobre">Sobre</NuxtLink>
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
  link: [
    { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
    { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' }
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

  const containerEl = document.querySelector(container);
  const width = window.innerWidth;

  const options = {
    radius: Math.min(250, width / 2),
    maxSpeed: 'normal' as const,
    initSpeed: 'normal' as const,
    direction: 135,
    keep: true,
  };
  
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/TagCloud@2.2.0/dist/TagCloud.min.js';
  script.onload = () => {
    // @ts-ignore
    const TagCloud = window.TagCloud;
    if (TagCloud) {
      tagCloudInstance = TagCloud(container, texts, options);
    }
  };
  document.head.appendChild(script);
});

onUnmounted(() => {
  // Destrói a instância para evitar memory leaks
  if (tagCloudInstance) {
    tagCloudInstance.destroy();
  }
});

</script>

<style scoped>
section {
  margin: 4rem 0;
}

.portfolio-home {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Baskervville', serif;
}

.presentation-section {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;

  & p {
    font-size: 1.2rem;
  }

  & .bio,
  & .skills-cloud {
    flex: 1 1 400px;
    min-width: 280px;
  }

  & .social-links {
    margin-top: 2rem;
    display: flex;
    gap: 1.5rem;

    & a> :deep(svg) {
      width: 25px;
      height: 25px;
    }
  }

  & .skills-cloud {
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1 / 1;
    max-width: 500px;
    margin: 0 auto;
  }
}

.projects-section {

  & h2 {
    text-align: center;
  }

  & .projects-grid {
    margin-top: 3rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
}

.loading-state,
.error-state {
  font-family: 'Baskervville', serif;
  text-align: center;
  color: var(--color-text-secondary);
  padding: 4rem 0;
}

.cta-section {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  text-align: center;

  & p {
    margin-bottom: 2rem;
  }

  & .cta-links {
    display: flex;
    justify-content: center;
    gap: 1rem;

    & a {
      font-family: 'Baskervville', sans-serif;
      color: #fff;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }

    & a:first-child {
      background: linear-gradient(to left, var(--color-primary), blueviolet);
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.34);

      &:hover {
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.34);
      }
    }

    & a:last-child {
      background-color: transparent;
      border: 1px solid var(--color-border);
      transition: border-color 0.2s ease, transform 0.2s ease;

      &:hover{
        border-color: var(--color-primary);
      }
    }
  }
}

@media (max-width: 900px) {
  .bio {
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .skills-cloud {
    max-width: 100% !important;
    width: 100%;
  }
}
</style>
