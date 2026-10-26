<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <IconsSearch class="search-icon" />
      <input
        id="search-input"
        type="search"
        name="q"
        placeholder="Pesquisar..."
        autocomplete="off"
        aria-label="Pesquisar no site"
      >
    </div>
    <div id="search-results" class="search-results" style="display: none;" />
  </div>
</template>

<style>
.search-container {
  margin-left: auto;
  margin-right: 1rem;
}

.search-input-wrapper {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.search-input-wrapper input {
  width: 250px;
  padding: 0.5rem 0.75rem;
  padding-left: 2.25rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  transition: all 0.2s ease;
}

.search-input-wrapper input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.2);
  outline: none;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  pointer-events: none;
  color: var(--color-text-secondary);
}

.search-results,
.search-no-results {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  left: auto;
  max-width: 500px;
  background-color: var(--color-background-elevated);
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px var(--color-shadow);
  z-index: 100;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.search-result-item {
  display: block;
  padding: 0.6rem 1rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: background-color 0.2s ease;
  font-size: 0.95rem;
  line-height: 1.4;
  border-bottom: 1px solid var(--color-border);
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover,
.search-result-item:focus,
.search-result-item.selected {
  background-color: var(--color-background-hover);
  color: var(--color-primary);
  outline: none;
}

.search-result-item .search-result-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--color-text-primary);
}

.search-result-item .search-result-description {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.3;
}

.search-no-results {
  padding: 0.75rem 1rem;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
}

@media (max-width: 520px) {
  .search-input-wrapper input {
    width: 0;
    height: 0;
    padding: 0.5rem 0;
    overflow: hidden;
    border: none;
    position: absolute;
    right: 0;
  }

  .search-input-wrapper input:focus {
    position: fixed;
    top: 20px;
    right: 50%;
    transform: translateX(50%);
    width: 90%;
    height: auto;
    padding: 0.5rem 0.75rem 0.5rem 2.25rem;
    border: 1px solid var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.2);
    z-index: 15;
    background: var(--color-background);
    overflow: visible;
    padding-left: .5rem;
  }

  .search-icon {
    position: relative;
    pointer-events: auto;
    margin-right: .8rem;
  }
}
</style>
