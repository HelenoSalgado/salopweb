<template>
  <footer class="hextra-footer">
    <div class="hextra-footer-container">
      <div class="theme-switcher-container">
        <div
          @click="toggleThemeOptions"
          class="hextra-theme-toggle"
          :class="{ 'active': isOptionsOpen }"
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
        <p>© 2025 Heleno Salgado</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useColorMode } from '#imports';

const isOptionsOpen = ref(false);
const colorMode = useColorMode();

const toggleThemeOptions = () => {
  isOptionsOpen.value = !isOptionsOpen.value;
};

const setTheme = (theme: string) => {
  colorMode.preference = theme;
  isOptionsOpen.value = false;
};

onMounted(() => {
  // Add listener to close dropdown when clicking outside.
  document.addEventListener('click', (e) => {
    const themeSwitcher = document.querySelector('.theme-switcher-container');
    if (themeSwitcher && !themeSwitcher.contains(e.target as Node)) {
      isOptionsOpen.value = false;
    }
  });
});
</script>

<style scoped>
/* ================== Footer ================== */
.hextra-footer {
  position: relative;
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  padding: 2rem 1rem;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  & .hextra-footer-container {
    width: var(--hextra-max-footer-width);
    margin: 0 auto;
    display: flex;
    align-items: center;
    column-gap: 1rem;
  }

  & .copyright {
    & p {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: 0.9rem;
    }
  }

  /* Theme Switcher */
  & .theme-switcher-container {
    position: relative; /* Added for absolute positioning of options */

    & .hextra-theme-toggle {
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: background-color 0.2s ease;
      &:hover {
        background-color: var(--color-background-hover);
      }
    }

    & .hextra-theme-toggle-options {
      position: absolute; /* Changed from fixed */
      bottom: 100%; /* Position above the button */
      left: 0; /* Align to the left of the button to prevent leaking */
      z-index: 50;
      background-color: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 0.5rem;
      box-shadow: 0 10px 15px -3px var(--color-shadow-light), 0 4px 6px -2px var(--color-shadow-light);
      min-width: 120px; /* Ensure it has a minimum width */

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
</style>
