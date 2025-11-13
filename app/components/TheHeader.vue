<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const isSidebarOpen = ref(false);
const route = useRoute();

watch(() => route.fullPath, () => {
  isSidebarOpen.value = false;
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <header class="hextra-header">
    <div class="hextra-header-container">
      <div class="brand">
        <NuxtLink to="/"><NuxtImg src="/images/profile.webp" preset="profile" alt="logo"/> Heleno Salgado</NuxtLink>
      </div>

      <TheSearch /> <!-- Integrated Search Component -->

      <!-- Navegação para Desktop -->
      <nav class="hextra-sidebar-container" :class="{ 'open-sidebar': isSidebarOpen }">
        <ul>
          <li><NuxtLink to="/sobre">Sobre</NuxtLink></li>
          <li><NuxtLink to="/blog">Escritos</NuxtLink></li>
          <li><NuxtLink to="/podcast">Podcast</NuxtLink></li>
        </ul>
        <div class="social-media">
          <a href="http://instagram.com/heleno_salgado" target="_blank" rel="noopener noreferrer" title="Instagram" arial-label="Meu Perfil no Instagram">
            <IconsInstagram />
          </a>
          <a href="http://x.com/HelenoSalgado" target="_blank" rel="noopener noreferrer" title="X" arial-label="Meu Perfil no X">
            <IconsTwitter />
          </a>
          <a href="http://github.com/HelenoSalgado" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="Meu Perfil no GitHub">
            <IconsGithub />
          </a>
        </div>
      </nav>
      <div class="hextra-hamburger-menu" :class="{ 'open': isSidebarOpen }" @click="toggleSidebar">
        <span/><span/><span/>
      </div>
    </div>
  </header>
</template>
<style scoped>
.hextra-header {
  width: 100%;
  background-color: var(--color-header-background);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
  padding: 0 1rem;
  height: var(--hextra-header-height);
  position: fixed;
  top: 0;
  display: flex;
  justify-items: center;
  z-index: 10;
  /* Increased z-index to overlap sidebar */
  transition: background-color 0.3s ease, border-color 0.3s ease;

  & .hextra-header-container {
    width: 100%;
    max-width: var(--hextra-max-navbar-width);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  & .brand {
    min-width: 200px;

    & a {
      font-weight: bold;
      font-size: 1.1rem;
      text-decoration: none;
      color: var(--color-text-secondary);
      line-break: anywhere;
      display: inline-flex;
      align-items: center;
      column-gap: .7rem;

      & img{
        border-radius: 50%;
        max-width: 40px;
      }
    }
  }

  /* Hamburger Menu Button */
  & .hextra-hamburger-menu {
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 1px;

    & span {
      display: block;
      background-color: var(--color-text-primary);
      /* Use semantic color */
      width: 30px;
      height: 3px;
      border-radius: 3px;
      transition: ease 200ms;
    }

    & span:first-child {
      margin-bottom: 5px;
    }

    & span:last-child {
      margin-top: 5px;
    }

    &.open span:nth-child(2) {
      opacity: 0;
    }

    &.open span:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }

    &.open span:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }
  }

  /* Desktop Navigation */
  & .hextra-sidebar-container {
    width: 100%;
    max-width: 400px;
    position: fixed;
    height: calc(100vh - var(--hextra-header-height));
    background-color: var(--color-header-background);
    top: calc(var(--hextra-header-height));
    right: -400px;
    transition: ease 200ms;
    z-index: 10;

    & ul {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      gap: 2rem;
      padding: 1rem;

      & li {
        font-weight: bold;
        border-bottom: 1px solid var(--color-border);
        list-style: none;
        padding-bottom: .2rem;
      }

      & a {
        text-decoration: none;
        color: var(--color-text-primary);
        transition: color 0.2s ease;
        font-size: 1.5rem;
      }

      & a:hover {
        color: var(--color-primary);
      }
    }

    & .social-media {
      margin-top: 2rem;
      display: inline-flex;
      justify-content: start;
      align-items: center;
      gap: 1rem;
      width: calc(100% - 2rem);
      margin-left: 1rem;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: .2rem;

      & a {
        width: 2rem;
        font-size: 1.5rem;
        color: var(--color-text-secondary);
        transition: color 0.2s ease;

        & svg{
          width: 22px;
          height: 22px;
        }
      }

      & a:hover {
        color: var(--color-primary);
      }
    }
  }

  & .open-sidebar {
    right: 0;
  }
}
</style>
