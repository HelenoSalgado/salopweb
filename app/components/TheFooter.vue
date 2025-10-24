<template>
  <footer class="hextra-footer">
    <div class="hextra-footer-container">
      <div class="theme-switcher-container">
        <div
          class="hextra-theme-toggle"
          :class="{ 'active': isOptionsOpen }"
          @click="isOptionsOpen = !isOptionsOpen"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </div>
        <div
          v-if="isOptionsOpen"
          class="hextra-theme-toggle-options"
        >
          <p @click="setTheme('light')">Claro</p>
          <p @click="setTheme('dark')">Escuro</p>
          <p @click="setTheme('system')">Sistema</p>
        </div>
      </div>
      <div class="copyright">
        <p>© 2025 Heleno Salgado • Estudante de Teologia pelo IRSE, desenvolvedor de software e web com foco em performance, domador de IA.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const isOptionsOpen = ref(false);
const colorMode = useColorMode();
const setTheme = (theme: string) => {
  colorMode.preference = theme;
  isOptionsOpen.value = false;
};
</script>

<style scoped>
.hextra-footer {
  position: relative;
  max-width: var(--hextra-max-footer-width);
  margin: 5rem auto 0 auto;
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  padding: 2rem 1rem;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  & .hextra-footer-container {
    width: 100%;
    display: flex;
    /* flex-wrap: wrap; */
    align-items: center;
    column-gap: 1rem;

  & .copyright {
    & p {
      font-family: 'Inter', sans-serif;
      margin: 0;
      color: var(--color-text-secondary);
      font-size: 0.9rem;
      white-space: normal;
      word-break: break-word;
    }
  }

  & .theme-switcher-container {
    position: relative;

    & .hextra-theme-toggle {
      cursor: pointer;
      border-radius: 6px;
      transition: background-color 0.2s ease;
    }

    & .hextra-theme-toggle-options {
      position: absolute;
      bottom: 110%;
      left: 0;
      z-index: 50;
      background-color: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 0.5rem;
      box-shadow: 0 10px 15px -3px var(--color-shadow-light), 0 4px 6px -2px var(--color-shadow-light);
      min-width: 120px;

      & p {
        margin: 0;
        padding: 0.5rem 1rem;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.2s ease;
        &:hover {
          background-color: var(--color-background-hover);
        }
      }
    }
   }
  }
}
</style>
