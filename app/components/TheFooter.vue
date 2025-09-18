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

const isOptionsOpen = ref(false);
const currentTheme = ref('dark');

const toggleThemeOptions = () => {
  isOptionsOpen.value = !isOptionsOpen.value;
};

const applyTheme = (theme: string) => {
  const effectiveTheme = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
};

const setTheme = (theme: string) => {
  currentTheme.value = theme;
  localStorage.setItem("color-theme", theme);
  applyTheme(theme);
  isOptionsOpen.value = false;
};

onMounted(() => {
  // 1. Initialize component state from localStorage without re-applying the theme.
  // The initial theme is already set by the script in app.html.
  currentTheme.value = localStorage.getItem("color-theme") || 'dark';

  // 2. Add listener for system theme changes.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem("color-theme") === "system") {
      applyTheme('system');
    }
  });

  // 3. Add listener to close dropdown when clicking outside.
  document.addEventListener('click', (e) => {
    const themeSwitcher = document.querySelector('.theme-switcher-container');
    if (themeSwitcher && !themeSwitcher.contains(e.target as Node)) {
      isOptionsOpen.value = false;
    }
  });
});
</script>
