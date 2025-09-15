<template>
  <footer class="hextra-footer">
    <div class="hextra-footer-container">
      <div class="theme-switcher-container">
        <div
          ref="themeSwitcher"
          class="hextra-theme-toggle"
          data-state="closed"
          @click="toggleThemeMenu"
        >
          <!-- Ícone do seletor de tema (simplificado) -->
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </div>
        <div
          ref="themeOptions"
          class="hextra-theme-toggle-options"
          v-show="isMenuOpen"
        >
          <p data-item="light" @click="switchTheme('light')">Claro</p>
          <p data-item="dark" @click="switchTheme('dark')">Escuro</p>
          <p data-item="system" @click="switchTheme('system')">Sistema</p>
        </div>
      </div>
      <div class="copyright">
        <p>© 2024 Heleno Salgado</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const themeSwitcher = ref(null);
const themeOptions = ref(null);
const isMenuOpen = ref(false);

const themes = ["light", "dark"];

// Lógica de Tema
const applyTheme = (theme) => {
  const effectiveTheme = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
};

const switchTheme = (theme) => {
  localStorage.setItem("color-theme", theme);
  applyTheme(theme);
  closeMenu(); // Fecha o menu após a seleção
};

// Lógica do Menu Dropdown
const toggleThemeMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleClickOutside = (event) => {
  if (
    themeSwitcher.value &&
    themeOptions.value &&
    !themeSwitcher.value.contains(event.target) &&
    !themeOptions.value.contains(event.target)
  ) {
    closeMenu();
  }
};

// Hooks do Ciclo de Vida
onMounted(() => {
  // Aplica o tema inicial
  const savedTheme = localStorage.getItem("color-theme") || 'system';
  applyTheme(savedTheme); // Apenas aplica, não salva novamente

  // Adiciona listeners
  document.addEventListener('click', handleClickOutside);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (localStorage.getItem("color-theme") === "system") {
      applyTheme("system");
    }
  });
});

onBeforeUnmount(() => {
  // Limpa os listeners
  document.removeEventListener('click', handleClickOutside);
});

</script>
