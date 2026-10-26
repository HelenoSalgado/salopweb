/**
 * site.js — Lightweight client interactions for zero-hydration static pages.
 * Handles search, theme toggling, mobile sidebar, reading progress bar,
 * newsletter subscription, and link sharing using event delegation.
 */
(() => {
  'use strict';

  // --- 1. Search Logic ---
  let searchIndex = null;
  let searchPromise = null;
  let searchDebounce = null;

  const escapeHtml = (str) =>
    (str || '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[m]));

  const normalizeText = (val) =>
    (val || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const loadSearchIndex = () => {
    if (!searchPromise) {
      searchPromise = fetch('/api/search-index.json')
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => {
          searchIndex = Array.isArray(data) ? data : [];
          return searchIndex;
        })
        .catch(() => {
          searchPromise = null;
          return [];
        });
    }
    return searchPromise;
  };

  const performSearch = async (term, resultsEl) => {
    if (!resultsEl) return;
    const cleanTerm = normalizeText(term);
    if (cleanTerm.length < 2) {
      resultsEl.style.display = 'none';
      resultsEl.innerHTML = '';
      return;
    }

    const index = searchIndex || (await loadSearchIndex());
    const matches = [];
    for (const item of index) {
      if (matches.length >= 8) break;
      if (
        normalizeText(item.title).includes(cleanTerm) ||
        normalizeText(item.description).includes(cleanTerm)
      ) {
        matches.push(item);
      }
    }

    if (matches.length === 0) {
      resultsEl.innerHTML = `<div class="search-no-results">Nenhum resultado encontrado para &quot;${escapeHtml(term)}&quot;</div>`;
    } else {
      resultsEl.innerHTML = matches
        .map(
          (m) =>
            `<a href="${m.path}" class="search-result-item">` +
            `<h3 class="search-result-title">${escapeHtml(m.title)}</h3>` +
            `<p class="search-result-description">${escapeHtml(m.description || '')}</p>` +
            `</a>`
        )
        .join('');
    }
    resultsEl.style.display = 'block';
  };

  // --- 2. Reading Progress Bar ---
  let progressTicking = false;
  const updateProgressBar = () => {
    const bar = document.getElementById('reading-progress-bar');
    if (!bar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
    bar.style.transform = `scaleX(${ratio})`;
    progressTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!progressTicking) {
      window.requestAnimationFrame(updateProgressBar);
      progressTicking = true;
    }
  }, { passive: true });

  // --- 3. Theme Toggle ---
  const applyTheme = (theme) => {
    document.cookie = `salop-color-mode=${theme};path=/;max-age=31536000;SameSite=Lax`;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-color-mode', theme);
  };

  // --- 4. Event Delegation on Document ---
  document.addEventListener('input', (e) => {
    const input = e.target;
    if (input && input.id === 'search-input') {
      const resultsEl = document.getElementById('search-results');
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        performSearch(input.value, resultsEl);
      }, 250);
    }
  });

  document.addEventListener('focusin', (e) => {
    const input = e.target;
    if (input && input.id === 'search-input') {
      loadSearchIndex();
      if (input.value.trim().length >= 2) {
        const resultsEl = document.getElementById('search-results');
        performSearch(input.value, resultsEl);
      }
    }
  });

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;

    // A) Search Icon click -> Focus search input
    const searchIcon = target.closest('.search-icon');
    if (searchIcon) {
      const input = document.getElementById('search-input');
      if (input) input.focus();
      return;
    }

    // B) Click Search Result item -> Close results
    if (target.closest('.search-result-item')) {
      const resultsEl = document.getElementById('search-results');
      if (resultsEl) resultsEl.style.display = 'none';
      const input = document.getElementById('search-input');
      if (input) input.value = '';
      return;
    }

    // C) Click outside search -> Close results
    if (!target.closest('.search-container')) {
      const resultsEl = document.getElementById('search-results');
      if (resultsEl) resultsEl.style.display = 'none';
    }

    // D) Hamburger Menu Toggle
    const hamburger = target.closest('.hextra-hamburger-menu');
    if (hamburger) {
      const sidebar = document.querySelector('.hextra-sidebar-container');
      const backdrop = document.getElementById('sidebar-backdrop');
      const isOpen = sidebar && sidebar.classList.contains('open-sidebar');
      if (sidebar) sidebar.classList.toggle('open-sidebar', !isOpen);
      hamburger.classList.toggle('open', !isOpen);
      if (backdrop) backdrop.style.display = !isOpen ? 'block' : 'none';
      return;
    }

    // E) Close Mobile Sidebar on Backdrop or Link click
    if (target.id === 'sidebar-backdrop' || (target.closest('.hextra-sidebar-container a') && window.innerWidth <= 768)) {
      const sidebar = document.querySelector('.hextra-sidebar-container');
      const backdrop = document.getElementById('sidebar-backdrop');
      const hamburgerEl = document.querySelector('.hextra-hamburger-menu');
      if (sidebar) sidebar.classList.remove('open-sidebar');
      if (hamburgerEl) hamburgerEl.classList.remove('open');
      if (backdrop) backdrop.style.display = 'none';
    }

    // F) Theme Toggle Button
    const themeBtn = target.closest('#theme-toggle-btn');
    if (themeBtn) {
      const options = document.getElementById('theme-toggle-options');
      if (options) {
        const isHidden = options.style.display === 'none' || !options.style.display;
        options.style.display = isHidden ? 'block' : 'none';
        themeBtn.classList.toggle('active', isHidden);
      }
      return;
    }

    // G) Theme Option Selection
    const themeOption = target.closest('[data-theme]');
    if (themeOption) {
      const theme = themeOption.getAttribute('data-theme');
      if (theme) applyTheme(theme);
      const options = document.getElementById('theme-toggle-options');
      const btn = document.getElementById('theme-toggle-btn');
      if (options) options.style.display = 'none';
      if (btn) btn.classList.remove('active');
      return;
    }

    // H) Click outside theme toggle
    if (!target.closest('.theme-switcher-container')) {
      const options = document.getElementById('theme-toggle-options');
      const btn = document.getElementById('theme-toggle-btn');
      if (options) options.style.display = 'none';
      if (btn) btn.classList.remove('active');
    }

    // I) Share Link Copy Button
    const copyBtn = target.closest('[data-action="copy-link"]');
    if (copyBtn) {
      const url = copyBtn.getAttribute('data-url') || window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        const textSpan = copyBtn.querySelector('.copy-text') || copyBtn;
        const originalText = textSpan.textContent;
        textSpan.textContent = 'Copiado!';
        setTimeout(() => {
          textSpan.textContent = originalText;
        }, 2000);
      }).catch((err) => {
        console.error('Falha ao copiar:', err);
      });
      return;
    }
  });

  // --- 5. Newsletter Form Submission ---
  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('.newsletter-form');
    if (!form) return;

    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageEl = form.parentElement.querySelector('#newsletter-message');
    if (!emailInput || !submitBtn) return;

    const email = emailInput.value.trim();
    if (!email) return;

    // Loading state
    submitBtn.disabled = true;
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loader"></span>';
    if (messageEl) messageEl.style.display = 'none';

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        emailInput.value = '';
        if (messageEl) {
          messageEl.className = 'message success';
          messageEl.innerHTML = `<span>${escapeHtml(data.message || 'Inscrição realizada com sucesso!')}</span>`;
          messageEl.style.display = 'flex';
        }
      } else {
        if (messageEl) {
          messageEl.className = 'message error';
          messageEl.innerHTML = `<span>${escapeHtml(data.message || 'Erro ao realizar inscrição.')}</span>`;
          messageEl.style.display = 'flex';
        }
      }
    } catch {
      if (messageEl) {
        messageEl.className = 'message error';
        messageEl.innerHTML = '<span>Erro de conexão. Tente novamente mais tarde.</span>';
        messageEl.style.display = 'flex';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  });

  // --- 6. Handle SPA Navigation Hook from nuxt-lite ---
  document.addEventListener('nuxt-lite:navigate', () => {
    // Reset reading progress bar
    updateProgressBar();

    // Close mobile sidebar
    const sidebar = document.querySelector('.hextra-sidebar-container');
    const backdrop = document.getElementById('sidebar-backdrop');
    const hamburgerEl = document.querySelector('.hextra-hamburger-menu');
    if (sidebar) sidebar.classList.remove('open-sidebar');
    if (hamburgerEl) hamburgerEl.classList.remove('open');
    if (backdrop) backdrop.style.display = 'none';

    // Close search results
    const resultsEl = document.getElementById('search-results');
    if (resultsEl) resultsEl.style.display = 'none';
  });
})();
