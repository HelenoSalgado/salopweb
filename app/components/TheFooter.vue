<template>
  <footer class="hextra-footer">
    <div class="hextra-footer-container">
      <div class="theme-switcher-container" data-theme-switcher>
        <div
          data-theme-toggle-button
          class="hextra-theme-toggle"
          data-state="closed"
        >
          <!-- Ícone do seletor de tema (simplificado) -->
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </div>
        <div
          data-theme-options-container
          class="hextra-theme-toggle-options"
          style="display: none;"
        >
          <p data-item="light">Claro</p>
          <p data-item="dark">Escuro</p>
          <p data-item="system">Sistema</p>
        </div>
      </div>
      <div class="copyright">
        <p>© 2024 Heleno Salgado</p>
      </div>
    </div>
  </footer>
</template>
