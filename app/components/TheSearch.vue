<script setup lang="ts">
import { ref } from 'vue';
import IconSearch from '~/components/icons/IconSearch.vue';

const query = ref('');
const results = ref([]);
const showResults = ref(false);
const noResults = ref(false);
let searchTimeout: NodeJS.Timeout | null = null;

const performSearch = async () => {
  if (!query.value.trim()) {
    results.value = [];
    showResults.value = false;
    noResults.value = false;
    return;
  }

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query.value.trim())}`);
    if (!response.ok) {
      throw new Error('Search request failed');
    }
    const data = await response.json();
    results.value = data.slice(0, 10);
    noResults.value = data.length === 0;
    showResults.value = true;
  } catch (error) {
    console.error('Error during search fetch:', error);
    results.value = [];
    showResults.value = false;
    noResults.value = true;
  }
};

const handleInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(performSearch, 300); // Debounce
};

const handleFocus = () => {
  if (query.value.trim()) {
    performSearch();
  }
};

const hideResults = () => {
  // Delay hiding to allow click on a result link
  setTimeout(() => {
    showResults.value = false;
  }, 200);
};

const onResultClick = () => {
  query.value = '';
  results.value = [];
  showResults.value = false;
  noResults.value = false;
};
</script>

<template>
  <div class="hextra-search-container">
    <div class="hextra-search-input-wrapper">
      <IconSearch class="hextra-search-icon" />
      <input
        type="search"
        placeholder="Pesquisar..."
        v-model="query"
        @input="handleInput"
        @focus="handleFocus"
        @blur="hideResults"
        class="hextra-search-input"
      />
    </div>
    <div v-if="showResults && results.length > 0" class="hextra-search-results">
      <NuxtLink
        v-for="post in results"
        :key="post.id"
        :to="post.path"
        class="hextra-search-result-item"
        @click="onResultClick"
      >
        <h3 class="hextra-search-result-title">{{ post.title }}</h3>
        <p class="hextra-search-result-description">{{ post.description }}</p>
      </NuxtLink>
    </div>
    <div v-if="showResults && noResults" class="hextra-search-no-results">
      Nenhum resultado encontrado para "{{ query }}"
    </div>
  </div>
</template>
