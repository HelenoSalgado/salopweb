<template>
  <NuxtLayout>
    <div class="page-error">
      <h2>Erro {{ error?.statusCode || ''}}</h2>
      <p>{{ error?.message }}</p>
      <button @click="handleError">Voltar para o Início</button>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { clearError } from 'nuxt/app';

const { error } = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
});

const handleError = () => clearError({ redirect: "/" });

// Define o template do título e outros atributos globais do <head>
useHead({
  titleTemplate: (titleChunk) => {
    // Se a página fornecer um título, anexa o nome do site.
    // Senão, usa o título padrão.
    return titleChunk ? `Heleno Salgado | ${titleChunk}` : 'Heleno Salgado - Tecnologia, Teologia e Literatura';
  },
  htmlAttrs: {
    lang: 'pt-BR'
  },
  link: [
    { rel: "icon", href: "/hsl-logo.ico", type: "image/x-icon" }
  ],
  script: [
    {
      textContent: `(function() {
        try {
          const savedTheme = localStorage.getItem('color-theme') || 'dark';
          const isDark = savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
          document.documentElement.classList.toggle('dark', isDark);
        } catch (e) {}
      })();`
    },
  ]
});
</script>

<style scoped>
.page-error {
  min-height: calc(100vh - 250px);
  display: flex;
  flex-direction: column;
  justify-content: center;

  & h2{
    margin: 1rem 0;
  }

  & button {
    display: inline-block;
    padding: .5rem 1rem;
    background-color: var(--color-primary);
    color: var(--color-primary-button-text);
    border: 1px solid var(--color-primary-button-border);
    border-radius: 4px;
    font-size: 1rem;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: fit-content;

    &:hover {
      background-color: var(--color-primary-hover);
    }
  }
}
</style>
