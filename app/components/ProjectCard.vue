<script setup lang="ts">
import type { FeaturedProject } from '~~/app/data/featured-projects';

interface LegacyProject {
  name: string;
  description: string;
  url: string;
  language: string | null;
  stars: number;
}

const props = defineProps<{
  project: FeaturedProject | LegacyProject;
}>();

const isFeatured = (proj: FeaturedProject | LegacyProject): proj is FeaturedProject => {
  return 'category' in proj;
};

const featured = computed(() => isFeatured(props.project) ? props.project : null);
const legacy = computed(() => !isFeatured(props.project) ? props.project : null);
</script>

<template>
  <article v-if="featured" class="featured-card">
    <!-- Preview Visual / Mockup -->
    <div class="card-media">
      <img
        :src="featured.image"
        :alt="`Prévia de ${featured.title}`"
        loading="lazy"
        class="card-image"
      >
      <span class="category-badge">{{ featured.categoryLabel }}</span>
    </div>

    <!-- Conteúdo do Card -->
    <div class="card-body">
      <div class="card-header">
        <h3 class="card-title">{{ featured.title }}</h3>
      </div>

      <p class="card-description">{{ featured.description }}</p>

      <!-- Tags de Tecnologias -->
      <div class="card-tags">
        <span v-for="tag in featured.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <!-- Links de Ação -->
      <div class="card-actions">
        <a
          v-if="featured.githubUrl"
          :href="featured.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="action-btn primary"
          title="Ver código no GitHub"
        >
          <IconsGithub class="btn-icon" />
          <span>GitHub</span>
        </a>

        <a
          v-if="featured.npmUrl"
          :href="featured.npmUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="action-btn secondary"
          title="Ver pacote no NPM"
        >
          <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"/>
          </svg>
          <span>NPM</span>
        </a>

        <a
          v-if="featured.liveUrl"
          :href="featured.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="action-btn outline"
          title="Acessar projeto"
        >
          <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span>Demo</span>
        </a>
      </div>
    </div>
  </article>

  <!-- Fallback para itens da API legado -->
  <div v-else-if="legacy" class="legacy-card">
    <a :href="legacy.url" target="_blank" rel="noopener noreferrer">
      <h3 class="card-title">{{ legacy.name }}</h3>
      <p class="card-description">{{ legacy.description }}</p>
      <div class="card-meta">
        <span v-if="legacy.language" class="language">{{ legacy.language }}</span>
        <span class="stars">★ {{ legacy.stars }}</span>
      </div>
    </a>
  </div>
</template>

<style scoped>
.featured-card {
  background-color: var(--color-background-elevated);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 4px 20px var(--color-shadow);
}

.featured-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary);
  box-shadow: 0 12px 30px var(--color-shadow);
}

.card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: var(--color-background-hover);
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.4s ease;
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  border-radius: 0 !important;
}

.featured-card:hover .card-image {
  transform: scale(1.03);
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: var(--color-header-background);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--color-primary);
  border: 1px solid var(--color-border);
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  margin: 0 0 0.75rem 0 !important;
  font-family: var(--font-serif);
  font-size: 1.65rem !important;
  font-weight: 700;
  color: var(--color-text-heading);
  letter-spacing: -0.015em;
}

.card-description {
  font-family: var(--font-sans) !important;
  font-size: 0.95rem !important;
  line-height: 1.6 !important;
  color: var(--color-text-secondary) !important;
  margin: 0 0 1.25rem 0 !important;
  flex-grow: 1;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
}

.tag {
  background-color: var(--color-background-hover);
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  padding: 0.25rem 0.55rem;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background-color: var(--color-background-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.action-btn.primary:hover {
  background-color: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
}

.action-btn.secondary {
  background-color: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.action-btn.secondary:hover {
  border-color: #f97316;
  color: #f97316;
}

.action-btn.outline {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-border);
}

.action-btn.outline:hover {
  border-color: var(--color-primary);
}

.btn-icon {
  width: 15px;
  height: 15px;
}

/* Fallback do Card Legado */
.legacy-card {
  background-color: var(--color-background-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.legacy-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
}

.legacy-card a {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}
</style>
