<script setup>
import IconSearch from '~/components/icons/IconSearch.vue';
</script>

<template>
  <div class="hextra-search-container">
    <div class="hextra-search-input-wrapper">
      <IconSearch class="hextra-search-icon" />
      <input
        type="search"
        placeholder="Pesquisar..."
        value=""
        data-search-input
        onfocus="window.searchApp.handleFocus(this)"
        onblur="window.searchApp.handleBlur()"
        class="hextra-search-input"
      >
    </div>
    <div data-search-results-container class="hextra-search-results" style="display: none;">
      <!-- Results will be populated by main.js -->
    </div>
    <div data-search-no-results-message class="hextra-search-no-results" style="display: none;">
      Nenhum resultado encontrado para ""
    </div>
  </div>
</template>