<template>
  <div class="project-card">
    <a :href="project.url" target="_blank" rel="noopener noreferrer">
      <h3 class="project-name">{{ project.name }}</h3>
      <p class="project-description">{{ project.description }}</p>
      <div class="project-meta">
        <span v-if="project.language" class="language">
          <span class="language-color-dot" :style="{ backgroundColor: getLanguageColor(project.language) }"></span>
          {{ project.language }}
        </span>
        <span class="stars">
          ★ {{ project.stars }}
        </span>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  project: {
    type: Object as () => {
      name: string;
      description: string;
      url: string;
      language: string | null;
      stars: number;
    },
    required: true
  }
});

// Mapeamento de cores para linguagens populares para consistência visual
const languageColors: { [key: string]: string } = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Vue: '#41b883',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Python: '#3572A5',
  // Adicione outras linguagens e cores conforme necessário
};

const getLanguageColor = (lang: string) => {
  return languageColors[lang] || '#cccccc'; // Retorna uma cor padrão
}
</script>

<style scoped>
.project-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
}

.project-card a {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.project-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.project-description {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  flex-grow: 1;
  margin-bottom: 1rem;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.language {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
}

.language-color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.5rem;
  border: 1px solid var(--color-border);
}

.stars {
  font-weight: 500;
  font-size: 1.1rem;
}
</style>
