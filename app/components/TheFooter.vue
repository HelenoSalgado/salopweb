<template>
  <footer class="hextra-footer">
    <div class="hextra-footer-container">
      <div class="theme-switcher-container">
        <button id="theme-toggle-btn" type="button" class="hextra-theme-toggle" title="Tema" aria-label="Alterar tema visual">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>
        <div id="theme-toggle-options" class="hextra-theme-toggle-options" style="display: none;">
          <p data-theme="light">Claro</p>
          <p data-theme="dark">Escuro</p>
          <p data-theme="system">Sistema</p>
        </div>
      </div>
      <div class="credentials">
        <a href="https://orcid.org/0009-0003-3945-2493" rel="me noopener noreferrer" title="ORCID" aria-label="Meu Perfil no ORCID">
          <IconsOrcid />
        </a>
        <a href="https://github.com/HelenoSalgado" rel="me noopener noreferrer" title="GitHub" aria-label="Meu Perfil no GitHub">
          <IconsGithub />
        </a>
        <a href="https://www.linkedin.com/in/helenosalgado" rel="me noopener noreferrer" title="Linkedin" aria-label="Meu Perfil do LinkedIn">
          <IconsLinkedin />
        </a>
      </div>
    </div>
  </footer>
</template>

<style>
.hextra-footer {
  position: relative;
  max-width: var(--hextra-max-footer-width);
  margin: 5rem auto 0 auto;
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  padding: 2rem 1rem;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.hextra-footer .hextra-footer-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  column-gap: 1rem;
  row-gap: 3rem;
}

.hextra-footer .credentials {
  display: flex;
  align-items: center;
  justify-content: end;
  column-gap: 1.5rem;
}

.hextra-footer .credentials a svg {
  width: 22px;
  height: 22px;
}

.theme-switcher-container {
  position: relative;
  display: flex;
  align-items: center;
  column-gap: 1rem;
}

.hextra-theme-toggle {
  cursor: pointer;
  border-radius: 6px;
  background: transparent;
  border: none;
  padding: 0.25rem;
  color: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.hextra-theme-toggle-options {
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
}

.hextra-theme-toggle-options p {
  margin: 0;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.hextra-theme-toggle-options p:hover {
  background-color: var(--color-background-hover);
}
</style>
