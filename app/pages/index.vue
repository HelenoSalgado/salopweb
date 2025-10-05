<template>
  <div class="portfolio-home">
    <!-- Seção 1: Apresentação -->
    <section class="presentation-section">
      <div class="bio">
        <h1 class="main-title">Heleno Salgado</h1>
        <p class="subtitle">Desenvolvedor e entusiasta de software livre, focado em performance e código limpo. Neste espaço, compartilho o que aprendo.</p>
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
        <div id="myCanvasContainer">
          <canvas id="myCanvas" width="500" height="500">
            <p>Seu navegador não suporta o elemento canvas.</p>
          </canvas>
        </div>
        <div id="tags" style="display: none;">
          <ul>
            <li><a href="#">TypeScript</a></li>
            <li><a href="#">Vue.js</a></li>
            <li><a href="#">Nuxt.js</a></li>
            <li><a href="#">Node.js</a></li>
            <li><a href="#">Nest.js</a></li>
            <li><a href="#">PHP</a></li>
            <li><a href="#">Laravel</a></li>
            <li><a href="#">SQL</a></li>
            <li><a href="#">Docker</a></li>
            <li><a href="#">Git</a></li>
            <li><a href="#">HTML5</a></li>
            <li><a href="#">CSS3</a></li>
            <li><a href="#">Perl</a></li>
            <li><a href="#">Linux</a></li>
          </ul>
        </div>
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

// Lógica para carregar o TagCanvas
useHead({
  script: [
    {
      src: 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js',
      tagPosition: 'bodyClose',
      onload: () => {
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://www.goat1000.com/jquery.tagcanvas.min.js';
        scriptTag.onload = () => {
          try {
            // Inicializa o canvas com o zoom ATIVADO
            $('#myCanvas').tagcanvas({
              textColour: '#007bff',
              outlineColour: 'transparent',
              reverse: true,
              depth: 0.8,
              maxSpeed: 0.05,
              weight: true,
              wheelZoom: true, // Ativado por padrão
            }, 'tags');

            // Adiciona um listener ao container para previnir o scroll da página
            const skillsCloudEl = document.querySelector('.skills-cloud');
            if (skillsCloudEl) {
              skillsCloudEl.addEventListener('wheel', (event) => {
                // Previne o scroll da página quando o mouse está sobre a área do gráfico
                event.preventDefault();
              }, { passive: false });
            }

          } catch(e) {
            const canvasContainer = document.getElementById('myCanvasContainer');
            if(canvasContainer) {
              canvasContainer.style.display = 'none';
            }
          }
        };
        document.body.appendChild(scriptTag);
      }
    }
  ]
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  min-height: 70vh;
}

.main-title {
  font-family: 'Inter', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.subtitle {
  font-family: 'Lora', serif;
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  margin-top: 1rem;
  line-height: 1.6;
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
  .presentation-section {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .skills-cloud {
    margin-top: 3rem;
  }

  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .main-title { font-size: 2.5rem; }
  .section-title { font-size: 2rem; }
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
