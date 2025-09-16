(function() {
  function applyTheme(theme) {
    const effectiveTheme = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
  }
  try {
    const savedTheme = localStorage.getItem("color-theme") || 'dark';
    applyTheme(savedTheme);
  } catch (e) {
    // localStorage can be disabled in some browsers or modes
  }
})();
