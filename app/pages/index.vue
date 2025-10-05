<template>
  <div class="portfolio-home">
    <!-- Seção 1: Apresentação -->
    <section class="presentation-section">
      <div class="bio">
        <p class="subtitle">Desenvolvedor e entusiasta de software livre, focado em performance e código limpo. Neste espaço, compartilho o que aprendo, não só sobre código, mas os <NuxtLink to="/sobre">meus interesses mais pertinentes</NuxtLink>. Obrigado pela visita.</p>
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
        <!-- O container para a nova nuvem de tags. A biblioteca irá preenchê-lo. -->
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
      <h2 class="section-title">Gostou do que viu?</h2>
      <p>Explore meus artigos ou entre em contato.</p>
      <div class="cta-links">
        <NuxtLink to="/blog" class="cta-button">Ler meus escritos</NuxtLink>
        <NuxtLink to="/sobre" class="cta-button secondary">Sobre mim</NuxtLink>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import TagCloud from 'TagCloud';
import IconsGithub from '~/components/Icons/Github.vue';
import IconsTwitter from '~/components/Icons/Twitter.vue';
import IconsInstagram from '~/components/Icons/Instagram.vue';

// Busca os projetos da API interna
const { data: projects, pending, error } = await useAsyncData('github-projects', () => $fetch('/api/github'));

// Define o título e a descrição para a página
definePageMeta({
  title: 'Home',
  description: 'Portfólio de projetos e habilidades de Heleno Salgado.',
});

let tagCloudInstance: any = null;

onMounted(() => {
  const container = '.skills-cloud';
  const texts = [
    'TypeScript', 'Vue.js', 'Nuxt.js',
    'Node.js', 'Nest.js', 'PHP',
    'Laravel', 'SQL', 'Docker',
    'Git', 'HTML5', 'CSS3',
    'Perl', 'Linux', 'JavaScript',
  ];

  const options = {
    radius: 250, // O raio da esfera
    maxSpeed: 'normal' as const, // Velocidade da animação
    initSpeed: 'normal' as const,
    direction: 135,
    keep: true, // Manter a animação mesmo quando o mouse está fora
    // Personalização de cores será feita via CSS
  };

  // Apenas executa no lado do cliente
  if (typeof window !== 'undefined') {
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
  padding: 4rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

section {
  margin-bottom: 6rem;
}

/* Seção 1: Apresentação */
.presentation-section {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  min-height: 70vh;
}

.bio, .skills-cloud {
  flex: 1 1 400px;
  min-width: 300px;
}

.bio {
  text-align: left;
}

.subtitle {
  font-family: 'Lora', serif;
  font-size: 1.35rem;
  color: var(--color-text-secondary);
  margin-top: 1rem;
  line-height: 1.4;
}

.subtitle :deep(a) {
  text-decoration: underline;
  color: var(--color-primary);
  transition: color 0.2s ease;
  text-decoration: none;
}

.subtitle :deep(a:hover) {
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

/* Estilização para a nova biblioteca TagCloud.js */
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


/* Seção 2: Projetos */
.section-title {
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.loading-state, .error-state {
  font-family: 'Lora', serif;
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
  }
}
</style>