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
          <li><NuxtLink to="/blog">Escritos</NuxtLink></li>
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
<style scoped>
/* ================== Header ================== */
.hextra-header {
  width: 100%;
  background-color: var(--color-header-background);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem;
  position: fixed;
  top: 0;
  z-index: 10; /* Increased z-index to overlap sidebar */
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
    & a {
      font-weight: bold;
      font-size: 1.1rem; /* Slightly smaller font size */
      text-decoration: none;
      color: var(--color-text-secondary);
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
        background-color: var(--color-text-primary); /* Use semantic color */
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
    background-color: var(--color-header-background);
    width: 100%;
    max-width: 400px;
    position: fixed;
    height: calc(100vh - var(--hextra-header-height));
    top: calc(var(--hextra-header-height) + 4px);
    right: -400px;
    transition: ease 200ms;

    & ul{
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      gap: 2rem;
      padding: 1rem;

      & li{
        font-weight: bold;
        padding-bottom: .4rem;
        border-bottom: 1px solid var(--color-border); /* Use semantic border color */
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

    & .social-media{
  margin-top: 2rem;
  display: inline-flex;
  justify-content: start;
  align-items: center;
  gap: 1rem;
  width: calc(100% - 2rem);
  margin-left: 1rem;
  border-bottom: 1px solid var(--color-border); /* Use semantic border color */
  /*padding: 0 1rem 0 0;*/

  & a {
    font-size: 1.3rem;
    width: 2rem;
    color: var(--color-text-secondary);
    transition: color 0.2s ease;
  }

  & a:hover {
    color: var(--color-primary);
  }
}
  }
  & .open-sidebar {
    right: 0;
  }

  & :deep(.hextra-search-container) {
    margin-left: auto;
    margin-right: 1rem;
    position: relative;

    & .hextra-search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    & .hextra-search-input {
      width: 200px;
      padding: 0.5rem 0.75rem;
      padding-left: 2.25rem;
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

    & .hextra-search-icon {
      position: absolute;
      left: 0.75rem;
      pointer-events: none;
      color: var(--color-text-secondary);
    }

    & .hextra-search-results,
    & .hextra-search-no-results {
      position: absolute;
      top: 100%;
      right: 0;
      left: auto;
      max-width: 500px;
      background-color: var(--color-background);
      border-bottom-left-radius: 6px;
      box-shadow: 0 4px 12px var(--color-shadow-light);
      z-index: 100;
      border: 1px solid var(--color-border);
    }

    & .hextra-search-results {
      max-height: 200px;
      overflow-y: auto;

      & .hextra-search-result-item {
        display: block;
        padding: 0.6rem 1rem;
        color: var(--color-text-secondary);
        text-decoration: none;
        transition: background-color 0.2s ease;
        font-size: 0.95rem;
        line-height: 1.4;
        border-bottom: 1px solid var(--color-border);

        &:last-child {
          border-bottom: none;
        }

        &:hover,
        &:focus,
        &.selected {
          background-color: var(--color-background-hover);
          color: var(--color-primary);
          outline: none;
        }

        & .hextra-search-result-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--color-text-primary);
        }

        & .hextra-search-result-description {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.3;
        }
      }
    }

    & .hextra-search-no-results {
      padding: 0.75rem 1rem;
      color: var(--color-text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 50px;
    }

    @media (max-width: 768px) {
      & {
        display: none;
        margin-left: 1rem;
        margin-right: 1rem;
        width: calc(100% - 2rem);
      }

      & .hextra-search-input {
        width: 100%;
      }

      & .hextra-search-results {
        left: 0;
        right: auto;
        max-width: 100%;
        border-radius: 0 0 6px 6px;
      }
    }
  }
}
</style>
