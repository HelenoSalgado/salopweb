// Header Menu Logic
const menuHambuger = document.querySelector('.hextra-hamburger-menu');

menuHambuger.addEventListener('click', () => {
  menuHambuger.classList.toggle('open');
  document.querySelector('.hextra-sidebar-container').classList.toggle('open-sidebar');
});


// Search Logic
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('[data-search-input]');
  const searchResultsContainer = document.querySelector('[data-search-results-container]');
  const noResultsMessage = document.querySelector('[data-search-no-results-message]');
  let searchTimeout = null;

  if (!searchInput || !searchResultsContainer || !noResultsMessage) {
    // If elements are missing, do nothing.
    window.searchApp = { handleFocus: () => {}, handleBlur: () => {} };
    return;
  }

  const hideResults = () => {
    searchResultsContainer.style.display = 'none';
    noResultsMessage.style.display = 'none';
  };

  const performSearch = async () => {
    const query = searchInput.value.trim();
    if (!query) {
      hideResults();
      return;
    }

    try {
      // Fetch results from the dynamic API
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        // Handle server errors if needed
        hideResults();
        return;
      }
      const filteredResults = await response.json();

      searchResultsContainer.innerHTML = ''; // Clear previous results
      if (filteredResults.length > 0) {
        filteredResults.slice(0, 10).forEach(post => {
          const link = document.createElement('a');
          link.href = post.path;
          link.className = 'hextra-search-result-item';
          link.onclick = () => hideResults();

          const titleElement = document.createElement('h3');
          titleElement.textContent = post.title;
          titleElement.className = 'hextra-search-result-title'; // Adiciona uma classe para estilização

          const descriptionElement = document.createElement('p');
          descriptionElement.textContent = post.description;
          descriptionElement.className = 'hextra-search-result-description'; // Adiciona uma classe para estilização

          link.appendChild(titleElement);
          link.appendChild(descriptionElement);
          searchResultsContainer.appendChild(link);
        });
        searchResultsContainer.style.display = 'block';
        noResultsMessage.style.display = 'none';
      } else {
        searchResultsContainer.style.display = 'none';
        noResultsMessage.style.display = 'block';
        noResultsMessage.textContent = `Nenhum resultado encontrado para "${searchInput.value}"`;
      }
    } catch (error) {
      console.error('Error during search fetch:', error);
      hideResults();
    }
  };

  // Attach listener for user input, with debouncing
  searchInput.addEventListener('input', () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(performSearch, 300);
  });

  // Expose necessary functions for the inline onfocus/onblur attributes
  window.searchApp = {
    handleFocus: () => {
      // Perform search on focus if there is already text
      if (searchInput.value) {
        performSearch();
      }
    },
    handleBlur: () => {
      // Delay hiding to allow click on a result link
      setTimeout(hideResults, 200);
    }
  };
});

    // Dark mode styles (basic)
    const applyDarkModeStyles = () => {
      if (document.documentElement.classList.contains('dark')) {
        button.style.borderColor = 'var(--color-border-dark)';
        button.style.backgroundColor = 'var(--color-bg-dark)';
        button.style.color = 'var(--color-text-light-dark)';
      } else {
        button.style.borderColor = 'var(--color-border-light)';
        button.style.backgroundColor = 'var(--color-bg-light)';
        button.style.color = 'var(--color-text-dark)';
      }
    };

// Theme Switcher Logic
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleButton = document.querySelector('[data-theme-toggle-button]');
  const themeOptionsContainer = document.querySelector('[data-theme-options-container]');
  const themeOptions = document.querySelectorAll('[data-theme-options-container] p[data-item]');
  const themeSwitcherContainer = document.querySelector('[data-theme-switcher]');

  let isMenuOpen = false;

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

  const toggleThemeMenu = () => {
    isMenuOpen = !isMenuOpen;
    themeOptionsContainer.style.display = isMenuOpen ? 'block' : 'none';
  };

  const closeMenu = () => {
    isMenuOpen = false;
    themeOptionsContainer.style.display = 'none';
  };

  const handleClickOutside = (event) => {
    if (
      themeSwitcherContainer &&
      themeOptionsContainer &&
      !themeSwitcherContainer.contains(event.target) &&
      !themeOptionsContainer.contains(event.target)
    ) {
      closeMenu();
    }
  };

  

  // Event Listeners
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleThemeMenu);
  }

  themeOptions.forEach(option => {
    option.addEventListener('click', (event) => {
      const theme = event.target.dataset.item;
      switchTheme(theme);
    });
  });

  document.addEventListener('click', handleClickOutside);

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (localStorage.getItem("color-theme") === "system") {
      applyTheme("system");
    }
  });
});
