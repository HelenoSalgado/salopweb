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

      <TheSearch />

      <!-- Navegação para Desktop / Mobile -->
      <nav class="hextra-sidebar-container" :class="{ 'open-sidebar': isSidebarOpen }">
        <ul>
          <li><NuxtLink to="/sobre">Sobre</NuxtLink></li>
          <li><NuxtLink to="/blog">Escritos</NuxtLink></li>
          <li><NuxtLink to="/podcast">Podcast</NuxtLink></li>
          <li><NuxtLink to="/newsletter">Newsletter</NuxtLink></li>
        </ul>
        <div class="social-media">
          <a href="https://instagram.com/heleno_salgado" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Meu Perfil no Instagram">
            <IconsInstagram />
          </a>
          <a href="https://x.com/HelenoSalgado" target="_blank" rel="noopener noreferrer" title="X" aria-label="Meu Perfil no X">
            <IconsTwitter />
          </a>
          <a href="https://github.com/HelenoSalgado" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="Meu Perfil no GitHub">
            <IconsGithub />
          </a>
        </div>
      </nav>

      <Transition name="fade">
        <div
          v-if="isSidebarOpen"
          class="hextra-sidebar-backdrop"
          aria-hidden="true"
          @click="isSidebarOpen = false"
        />
      </Transition>

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
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid var(--color-border);
  height: var(--hextra-header-height);
  position: fixed;
  top: 0;
  display: flex;
  justify-items: center;
  z-index: 30;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  & .hextra-header-container {
    width: 100%;
    max-width: var(--hextra-max-navbar-width);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
  }

  & .brand {
    min-width: 200px;

    & a {
      font-weight: bold;
      font-size: 1.1rem;
      text-decoration: none;
      line-break: anywhere;
      display: inline-flex;
      align-items: center;
      column-gap: .7rem;

      & img{
        border-radius: 50%;
        width: 40px;
      }
    }
  }

  /* Hamburger Menu Button */
  & .hextra-hamburger-menu {
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    z-index: 35;
    background: transparent;

    & span {
      display: block;
      background-color: var(--color-text-primary);
      width: 26px;
      height: 2.5px;
      border-radius: 2px;
      transition: all 250ms ease;
    }

    & span:first-child {
      margin-bottom: 6px;
    }

    & span:last-child {
      margin-top: 6px;
    }

    &.open span:nth-child(2) {
      opacity: 0;
      transform: translateX(10px);
    }

    &.open span:nth-child(1) {
      transform: translateY(8.5px) rotate(45deg);
    }

    &.open span:nth-child(3) {
      transform: translateY(-8.5px) rotate(-45deg);
    }
  }

  /* Sidebar com Efeito Vidro Desfocado (Frosted Glass) */
  & .hextra-sidebar-container {
    width: 100%;
    max-width: 360px;
    position: fixed;
    height: calc(100vh - var(--hextra-header-height));
    background-color: var(--color-sidebar-background);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-left: 1px solid var(--color-border);
    top: calc(var(--hextra-header-height));
    right: -380px;
    transition: right 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease;
    z-index: 25;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2rem 1.5rem;
    box-sizing: border-box;

    & ul {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      gap: 1.5rem;
      padding: 0;
      margin: 0;

      & li {
        font-family: var(--font-sans);
        font-weight: 600;
        border-bottom: 1px solid var(--color-border);
        list-style: none;
        padding-bottom: 0.6rem;
      }

      & a {
        text-decoration: none;
        color: var(--color-text-primary);
        transition: color 0.2s ease, transform 0.2s ease;
        font-size: 1.35rem;
        display: block;
      }

      & a:hover {
        color: var(--color-primary);
        transform: translateX(4px);
      }
    }

    & .social-media {
      margin-top: 2rem;
      display: inline-flex;
      justify-content: flex-start;
      align-items: center;
      gap: 1.25rem;
      width: 100%;
      border-top: 1px solid var(--color-border);
      padding-top: 1.25rem;

      & a {
        width: 2.25rem;
        height: 2.25rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-secondary);
        transition: color 0.2s ease, transform 0.2s ease;

        & svg{
          width: 22px;
          height: 22px;
        }
      }

      & a:hover {
        color: var(--color-primary);
        transform: translateY(-2px);
      }
    }
  }

  & .open-sidebar {
    right: 0;
    box-shadow: -10px 0 40px var(--color-shadow);
  }
}

/* Backdrop escurecido e desfocado com clique para fechar */
.hextra-sidebar-backdrop {
  position: fixed;
  top: var(--hextra-header-height);
  left: 0;
  width: 100vw;
  height: calc(100vh - var(--hextra-header-height));
  background-color: var(--color-backdrop-overlay);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 20;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
