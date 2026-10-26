<script setup lang="ts">
import { ref, computed } from 'vue';
import { FEATURED_PROJECTS, CATEGORIES, type ProjectCategory } from '~~/app/data/featured-projects';

const config = useRuntimeConfig();
const siteUrl = config.public.site.url;

definePageMeta({
  layout: 'portfolio'
});

// Categoria ativa para filtro
const activeCategory = ref<ProjectCategory>('all');

const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') {
    return FEATURED_PROJECTS;
  }
  return FEATURED_PROJECTS.filter(project => project.category === activeCategory.value);
});

useHead({
  title: 'Heleno Salgado — Arquiteto de Sistemas & Engenheiro de Software',
  meta: [
    {
      name: 'description',
      content: 'Portfólio de Heleno Salgado. Projetos em Kotlin Multiplatform, Inteligência Artificial local (RAG), Cloudflare Workers, Linux (Hyprland) e Nuxt.'
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
          'jobTitle': 'Engenheiro de Software & Arquiteto de Sistemas',
          'knowsAbout': [
            'Kotlin Multiplatform', 'Compose Desktop', 'Python', 'RAG / FAISS',
            'Cloudflare Workers', 'TypeScript', 'Nuxt.js', 'Linux', 'Hyprland'
          ],
          'sameAs': [
            'https://github.com/HelenoSalgado',
            'https://x.com/HelenoSalgado',
            'https://instagram.com/heleno_salgado',
            'https://orcid.org/0009-0003-3945-2493',
            'https://www.linkedin.com/in/helenosalgado'
          ]
        }
      })
    }
  ]
});
</script>

<template>
  <div class="portfolio-home">
    <!-- Seção 1: Hero & Apresentação -->
    <section class="hero-section">
      <div class="hero-badge">
        <span class="pulse-dot"></span>
        <span>Arquiteto de Sistemas • Engenharia de Software • Linux & IA</span>
      </div>

      <h1 class="hero-title">
        Construindo software resiliente, ferramentas de IA local e sistemas à prova do tempo.
      </h1>

      <p class="hero-bio">
        Desenvolvo aplicações desktop multiplataforma nativas em <strong>Kotlin</strong> (Linux, Windows e Android),
        pipelines de extração e <strong>RAG com IA local</strong> em Python, e arquiteturas de ultra-baixa latência
        na borda com <strong>Cloudflare Workers</strong> e <strong>Nuxt</strong>. Priorizo Clean Architecture,
        desempenho nativo e zero dívida técnica.
      </p>

      <div class="hero-actions">
        <a href="#projetos" class="cta-primary">Explorar Projetos Selecionados ↓</a>
        <NuxtLink to="/blog" class="cta-secondary">Ler Escritos & Ensaios →</NuxtLink>
      </div>

      <!-- Grid de Especialidades -->
      <div class="specialties-grid">
        <div class="specialty-card">
          <div class="specialty-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
          </div>
          <h4>Desktop & Multiplataforma</h4>
          <p>Compose Desktop, Kotlin Multiplatform, SQLite local e integrações com Hyprland e Wayland.</p>
        </div>

        <div class="specialty-card">
          <div class="specialty-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 9h6v6H9z" />
              <path d="M15 2v1" /><path d="M15 21v1" />
              <path d="M9 2v1" /><path d="M9 21v1" />
              <path d="M2 15h1" /><path d="M21 15h1" />
              <path d="M2 9h1" /><path d="M21 9h1" />
            </svg>
          </div>
          <h4>IA Local & Pipelines RAG</h4>
          <p>Indexação vetorial com FAISS, conversão acadêmica de PDFs via MinerU e modelos locais (Ollama).</p>
        </div>

        <div class="specialty-card">
          <div class="specialty-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h4>Edge Computing & Nuxt</h4>
          <p>Cloudflare Workers, roteadores sob medida (RouterWorkers no npm) e SSR veloz com Nuxt 4.</p>
        </div>

        <div class="specialty-card">
          <div class="specialty-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" x2="20" y1="19" y2="19" />
            </svg>
          </div>
          <h4>Linux & Desktop Shell</h4>
          <p>Arch Linux como ecossistema nativo, widgets em AGS/GTK e automação profunda de fluxo de trabalho.</p>
        </div>
      </div>
    </section>

    <!-- Seção 2: Vitrine de Projetos com Prints Reais -->
    <section id="projetos" class="projects-section">
      <div class="section-header">
        <span class="sub-badge">Showcase de Engenharia</span>
        <h2 class="section-title">Projetos em Destaque</h2>
        <p class="section-subtitle">
          Softwares reais, bibliotecas publicadas e ferramentas open-source construídas para resolver problemas complexos.
        </p>

        <!-- Filtros de Categoria -->
        <div class="category-filters">
          <button
            v-for="cat in CATEGORIES"
            :key="cat.key"
            class="filter-btn"
            :class="{ active: activeCategory === cat.key }"
            @click="activeCategory = cat.key"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <div class="projects-grid">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
        />
      </div>

      <div class="github-more">
        <p>Procurando outros repositórios, ferramentas de linha de comando ou experimentos?</p>
        <a
          href="https://github.com/HelenoSalgado?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
        >
          <IconsGithub class="gh-icon" />
          <span>Ver todos os repositórios no GitHub →</span>
        </a>
      </div>
    </section>

    <!-- Seção 3: Filosofia de Engenharia -->
    <section class="philosophy-section">
      <div class="philosophy-container">
        <span class="sub-badge">Princípios & Rigor</span>
        <h2 class="section-title">Filosofia de Engenharia</h2>
        <p class="philosophy-intro">
          Não sigo práticas de mercado cegamente. Cada projeto é projetado para o mundo real com princípios perenes:
        </p>

        <div class="pillars-grid">
          <div class="pillar-card">
            <span class="pillar-number">01</span>
            <h3>Clean Architecture & SOLID</h3>
            <p>
              Desacoplamento estrito entre regras de negócio, dados e interfaces. O código nasce testável, legível e preparado para evolução contínua.
            </p>
          </div>

          <div class="pillar-card">
            <span class="pillar-number">02</span>
            <h3>Código à Prova do Tempo</h3>
            <p>
              Prioridade a formatos abertos, SQLite local, Markdown e padrões que duram décadas, em vez de depender de dependências efêmeras ou lock-in.
            </p>
          </div>

          <div class="pillar-card">
            <span class="pillar-number">03</span>
            <h3>Zero Dívida Técnica</h3>
            <p>
              Sem gambiarras ou soluções parciais. Rigor com tipagem forte, testes automatizados e adequação precisa às necessidades reais de cada projeto.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção 4: Call to Action -->
    <section class="cta-section">
      <div class="cta-box">
        <h2>Vamos conversar ou construir algo juntos?</h2>
        <p>Explore minhas reflexões sobre teologia e tecnologia ou acompanhe meus códigos no GitHub.</p>
        <div class="cta-links">
          <NuxtLink to="/blog" class="cta-primary">Acessar Escritos</NuxtLink>
          <NuxtLink to="/sobre" class="cta-secondary">Mais Sobre Mim</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.portfolio-home {
  padding: 1.5rem;
  padding-top: calc(var(--hextra-header-height) + 2rem);
  min-height: 75vh;
  max-width: 1200px;
  margin: 0 auto;
  font-family: var(--font-sans);
}

/* ==========================================================================
   Hero Section
   ========================================================================== */
.hero-section {
  padding: 2.5rem 0 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid var(--color-border);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.9rem;
  background-color: var(--color-background-elevated);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: var(--color-primary);
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.25);
  animation: pulse-glow 2s infinite ease-in-out;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

.hero-title {
  margin: 0 0 1.5rem 0 !important;
  font-family: var(--font-serif);
  font-size: clamp(2.4rem, 5vw, 3.4rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--color-text-heading);
  letter-spacing: -0.02em;
  max-width: 950px;
}

.hero-bio {
  font-family: var(--font-sans) !important;
  font-size: clamp(1.1rem, 2vw, 1.25rem) !important;
  line-height: 1.8 !important;
  color: var(--color-text-secondary) !important;
  max-width: 860px;
  margin: 0 0 2.2rem 0 !important;
}

.hero-bio strong {
  color: var(--color-text-primary);
  font-weight: 600;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3.5rem;
}

.cta-primary {
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text) !important;
  padding: 0.85rem 1.6rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(var(--color-primary-rgb), 0.25);
}

.cta-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

.cta-secondary {
  background-color: var(--color-background-elevated);
  color: var(--color-text-primary) !important;
  border: 1px solid var(--color-border);
  padding: 0.85rem 1.6rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.cta-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary) !important;
  transform: translateY(-2px);
}

/* Specialties Grid */
.specialties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  width: 100%;
}

.specialty-card {
  background-color: var(--color-background-elevated);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.specialty-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-3px);
}

.specialty-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: var(--color-background-hover);
  color: var(--color-primary);
  border: 1px solid var(--color-border);
  margin-bottom: 1.1rem;
  transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.specialty-icon svg {
  width: 22px;
  height: 22px;
}

.specialty-card:hover .specialty-icon {
  background-color: var(--color-primary);
  color: #ffffff;
  transform: scale(1.05);
}

.specialty-card h4 {
  margin: 0 0 0.5rem 0;
  font-family: var(--font-sans);
  font-size: 1.08rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.specialty-card p {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

/* ==========================================================================
   Projects Section
   ========================================================================== */
.projects-section {
  padding: 4.5rem 0;
}

.section-header {
  text-align: center;
  max-width: 750px;
  margin: 0 auto 3rem auto;
}

.sub-badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
}

.section-title {
  margin: 0.4rem 0 1rem 0 !important;
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 2.7rem);
  font-weight: 700;
  color: var(--color-text-heading);
  letter-spacing: -0.015em;
}

.section-subtitle {
  font-family: var(--font-sans);
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0 0 2rem 0;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.filter-btn {
  background-color: var(--color-background-elevated);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  padding: 0.55rem 1.1rem;
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

.filter-btn.active {
  background-color: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.github-more {
  text-align: center;
  padding: 2.5rem 1.5rem;
  background-color: var(--color-background-elevated);
  border: 1px dashed var(--color-border);
  border-radius: 12px;
  max-width: 650px;
  margin: 0 auto;
}

.github-more p {
  margin: 0 0 1rem 0;
  color: var(--color-text-secondary);
  font-size: 0.98rem;
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none !important;
  transition: transform 0.2s ease;
}

.github-link:hover {
  transform: translateX(4px);
  color: var(--color-primary-hover);
}

.gh-icon {
  width: 18px;
  height: 18px;
}

/* ==========================================================================
   Philosophy Section
   ========================================================================== */
.philosophy-section {
  padding: 4.5rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.philosophy-container {
  text-align: center;
}

.philosophy-intro {
  max-width: 700px;
  margin: 0 auto 3rem auto;
  color: var(--color-text-secondary);
  font-size: 1.05rem;
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  text-align: left;
}

.pillar-card {
  background-color: var(--color-background-elevated);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem 1.75rem;
  position: relative;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.pillar-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
}

.pillar-number {
  font-family: var(--font-mono);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-primary);
  opacity: 0.4;
  display: block;
  margin-bottom: 0.75rem;
}

.pillar-card h3 {
  margin: 0 0 0.8rem 0 !important;
  font-family: var(--font-serif);
  font-size: 1.45rem !important;
  color: var(--color-text-heading);
  font-weight: 700;
}

.pillar-card p {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

/* ==========================================================================
   CTA Section
   ========================================================================== */
.cta-section {
  padding: 5rem 0 2rem 0;
}

.cta-box {
  background-color: var(--color-background-elevated);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 3.5rem 2rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 10px 30px var(--color-shadow);
}

.cta-box h2 {
  margin: 0 0 1rem 0 !important;
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 3.5vw, 2.4rem);
  font-weight: 700;
  color: var(--color-text-heading);
}

.cta-box p {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 2rem auto;
  line-height: 1.6;
}

.cta-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .specialties-grid {
    grid-template-columns: 1fr;
  }
}
</style>
