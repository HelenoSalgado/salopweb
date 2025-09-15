<template>
  <header class="hextra-header">
    <div class="hextra-header-container">
      <div class="brand">
        <a href="/">Heleno Salgado</a>
      </div>

      <!-- Navegação para Desktop -->
      <nav class="hextra-sidebar-container" ref="sidebar">
        <ul>
          <li><a href="/blog">Artigos</a></li>
          <li><a href="/sobre">Sobre</a></li>
        </ul>
      </nav>

      <!-- Botão Hamburger para Mobile -->
      <button class="hextra-hamburger-menu" @click="toggleMenu">
        <svg class="hamburger-icon" :class="{ open: isMenuOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const sidebar = ref(null);
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (sidebar.value) {
    sidebar.value.classList.toggle('open');
  }
  document.body.classList.toggle('hx:overflow-hidden', isMenuOpen.value);
};

const handleResize = () => {
  // Fecha o menu se a tela for redimensionada para desktop
  if (window.innerWidth > 768 && isMenuOpen.value) {
    toggleMenu();
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
