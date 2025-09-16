<script setup lang="ts">
import IconGithub from './icons/IconGithub.vue';
import IconInstagram from './icons/IconInstagram.vue';
import IconTwitter from './icons/IconTwitter.vue';
</script>

<template>
  <header class="hextra-header">
    <div class="hextra-header-container">
      <div class="brand">
        <a href="/">Heleno Salgado</a>
      </div>

      <TheSearch /> <!-- Integrated Search Component -->

      <!-- Navegação para Desktop -->
      <nav class="hextra-sidebar-container">
        <ul>
          <li><a href="/blog">Artigos</a></li>
          <li><a href="/sobre">Sobre</a></li>
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
      <div class="hextra-hamburger-menu">
        <span></span><span></span><span></span>
      </div>
    </div>
  </header>
</template>
