<script setup lang="ts">
import { SEARCH_MIN_LENGTH, normalizeSearchText, searchEntries, type SearchIndexEntry } from '~~/utils/search';

/*
 * O site é estático: não há endpoint dinâmico de busca em produção.
 * O índice (/api/search-index.json) é pré-renderizado no build, baixado uma única
 * vez sob demanda (no primeiro foco/digitação) e filtrado localmente.
 */
const SEARCH_INDEX_URL = '/api/search-index.json';
let searchIndexPromise: Promise<SearchIndexEntry[]> | null = null;

const loadSearchIndex = (): Promise<SearchIndexEntry[]> => {
  searchIndexPromise ??= $fetch<SearchIndexEntry[]>(SEARCH_INDEX_URL, { responseType: 'json' })
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new TypeError('Índice de busca inválido');
      }
      return data;
    })
    .catch((error: unknown) => {
      // Permite nova tentativa na próxima busca em caso de falha de rede.
      searchIndexPromise = null;
      throw error;
    });
  return searchIndexPromise;
};

const query = ref('');
const results = ref<SearchIndexEntry[]>([]);
const showResults = ref(false);
const noResults = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const resetResults = () => {
  results.value = [];
  showResults.value = false;
  noResults.value = false;
};

const performSearch = async () => {
  if (import.meta.server) {
    return;
  }

  const term = query.value;
  if (normalizeSearchText(term).length < SEARCH_MIN_LENGTH) {
    resetResults();
    return;
  }

  try {
    const index = await loadSearchIndex();
    // Ignora respostas obsoletas caso o usuário tenha continuado digitando.
    if (term !== query.value) return;

    results.value = searchEntries(index, term);
    noResults.value = results.value.length === 0;
    showResults.value = true;
  } catch (error) {
    console.error('Error loading search index:', error);
    resetResults();
  }
};

// Pré-carrega o índice ao focar, para que a primeira busca seja instantânea.
const prefetchIndex = () => {
  loadSearchIndex().catch(() => { /* erro tratado em performSearch */ });
};

const handleInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(performSearch, 300);
};

const handleFocus = () => {
  prefetchIndex();
  if (query.value.trim()) {
    performSearch();
  }
};

const hideResultsAndCollapse = () => {
  setTimeout(() => {
    showResults.value = false;
    query.value = '';
  }, 200);
};

const onResultClick = () => {
  query.value = '';
  results.value = [];
  showResults.value = false;
  noResults.value = false;
};

const expandAndFocus = () => {
  if (searchInput.value) searchInput.value.focus();
};
</script>

<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <IconsSearch class="search-icon" @click="expandAndFocus" />
      <input
id="search-input" ref="searchInput" v-model="query" type="search" name="q" placeholder="Pesquisar..." autocomplete="off" @input="handleInput"
        @focus="handleFocus" @blur="hideResultsAndCollapse" >
    </div>
    <div v-if="showResults && results.length > 0" class="search-results">
      <NuxtLink
v-for="post in results" :key="post.path" :to="post.path" class="search-result-item"
        @click="onResultClick">
        <h3 class="search-result-title">{{ post.title }}</h3>
        <p class="search-result-description">{{ post.description }}</p>
      </NuxtLink>
    </div>
    <div v-if="showResults && noResults" class="search-no-results">
      Nenhum resultado encontrado para "{{ query }}"
    </div>
  </div>
</template>

<style scoped>
.search-container {
  margin-left: auto;
  /* Push to the right */
  margin-right: 1rem;
  /* Space from other elements */
}

.search-input-wrapper {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;

  & input {
    width: 250px;
    padding: 0.5rem 0.75rem;
    padding-left: 2.25rem;
    /* Make space for icon */
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-background);
    color: var(--color-text-primary);
    transition: all 0.2s ease;

    &:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.2);
      outline: none;
    }
  }
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  pointer-events: none;
  color: var(--color-text-secondary);
  /* Use semantic color */
}

/* Estilos comuns para o box de resultados e o box de "nenhum resultado" */
.search-results,
.search-no-results {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  left: auto;
  max-width: 500px;
  background-color: var(--color-background-elevated);
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px var(--color-shadow);
  z-index: 100;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.search-result-item {
  display: block;
  padding: 0.6rem 1rem;
  /* Ajusta o padding para um visual mais elegante */
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: background-color 0.2s ease;
  font-size: 0.95rem;
  /* Levemente menor para resultados */
  line-height: 1.4;
  border-bottom: 1px solid var(--color-border);
  /* Separador entre os itens */
}

.search-result-item:last-child {
  border-bottom: none;
  /* Remove o separador do último item */
}

.search-result-item:hover,
.search-result-item:focus,
/* Adiciona estado de foco para acessibilidade */
.search-result-item.selected {
  /* Classe para item selecionado (pode ser controlada por JS) */
  background-color: var(--color-background-hover);
  color: var(--color-primary);
  outline: none;
  /* Remove o outline padrão do foco */
}

.search-result-item .search-result-title {
  font-size: 1rem;
  /* Tamanho do título */
  font-weight: 600;
  /* Semibold */
  margin-bottom: 0.25rem;
  /* Espaçamento abaixo do título */
  color: var(--color-text-primary);
}

.search-result-item .search-result-description {
  font-size: 0.85rem;
  /* Tamanho da descrição */
  color: var(--color-text-secondary);
  line-height: 1.3;
}

.search-no-results {
  padding: 0.75rem 1rem;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  /* Garante uma altura mínima para centralização vertical */
}

/* Expansão apenas em mobile */
@media (max-width: 520px) {
  .search-input-wrapper input {
    width: 0;
    height: 0;
    padding: 0.5rem 0;
    overflow: hidden;
    border: none;
    position: absolute;
    right: 0;
  }

  .search-input-wrapper input:focus {
    position: fixed;
    top: 20px;
    right: 50%;
    transform: translateX(50%);
    width: 90%;
    height: auto;
    padding: 0.5rem 0.75rem 0.5rem 2.25rem;
    border: 1px solid var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.2);
    z-index: 15;
    background: var(--color-background);
    overflow: visible;
    padding-left: .5rem;
  }

  .search-icon {
    position: relative;
    pointer-events: auto;
    margin-right: .8rem;
  }
}
</style>
