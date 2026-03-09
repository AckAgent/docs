// Initialize Mermaid diagrams with theme detection for MkDocs Material
(function() {
  // Detect if dark mode is active
  function isDarkMode() {
    const scheme = document.body.getAttribute('data-md-color-scheme');
    return scheme === 'slate';
  }

  // Get the appropriate Mermaid theme
  function getMermaidTheme() {
    return isDarkMode() ? 'dark' : 'default';
  }

  // Initialize Mermaid with current theme
  function initMermaid() {
    mermaid.initialize({
      startOnLoad: false,
      theme: getMermaidTheme(),
      securityLevel: 'loose',
    });
    mermaid.run();
  }

  // Re-render diagrams when theme changes
  function setupThemeObserver() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'data-md-color-scheme') {
          // Re-initialize with new theme
          const diagrams = document.querySelectorAll('.mermaid');
          diagrams.forEach(function(diagram) {
            // Store original content if not already stored
            if (!diagram.getAttribute('data-original')) {
              diagram.setAttribute('data-original', diagram.textContent);
            }
            // Reset to original content for re-render
            diagram.textContent = diagram.getAttribute('data-original');
            diagram.removeAttribute('data-processed');
          });
          initMermaid();
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-md-color-scheme']
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initMermaid();
      setupThemeObserver();
    });
  } else {
    initMermaid();
    setupThemeObserver();
  }
})();
