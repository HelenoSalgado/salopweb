<script setup lang="ts">
import { ref } from 'vue';
import IconGithub from './icons/IconGithub.vue';
import IconInstagram from './icons/IconInstagram.vue';
import IconTwitter from './icons/IconTwitter.vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <header class="hextra-header">
    <div class="hextra-header-container">
      <div class="brand">
        <NuxtLink to="/">Heleno Salgado</NuxtLink>
      </div>

      <TheSearch /> <!-- Integrated Search Component -->

      <!-- Navegação para Desktop -->
      <nav class="hextra-sidebar-container" :class="{ 'open-sidebar': isSidebarOpen }">
        <ul>
          <li><NuxtLink to="/blog">Artigos</NuxtLink></li>
          <li><NuxtLink to="/sobre">Sobre</NuxtLink></li>
        </ul>
        <div class="social-media">
          <a href="http://instagram.com/heleno_salgado" target="_blank" rel="noopener noreferrer">
            <IconInstagram />
          </a>
          <a href="http://x.com/HelenoSalgado" target="_blank" rel="noopener noreferrer">
            <IconTwitter />
          </a>
          <a href="http://github.com/HelenoSalgado" target="_blank" rel="noopener noreferrer">
            <IconGithub />
          </a>
        </div>
      </nav>
      <div class="hextra-hamburger-menu" :class="{ 'open': isSidebarOpen }" @click="toggleSidebar">
        <span></span><span></span><span></span>
      </div>
    </div>
  </header>
</template>
