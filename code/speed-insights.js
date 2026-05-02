// Vercel Speed Insights initialization
// This file initializes Speed Insights for the project
(function() {
  // Initialize the queue
  if (window.si) return;
  window.si = function(...params) {
    (window.siq = window.siq || []).push(params);
  };

  // Check if we're in development mode
  function isDevelopment() {
    try {
      const env = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname.includes('local');
      return env;
    } catch (e) {
      return false;
    }
  }

  // Get the appropriate script source
  function getScriptSrc() {
    if (isDevelopment()) {
      return 'https://va.vercel-scripts.com/v1/speed-insights/script.debug.js';
    }
    return '/_vercel/speed-insights/script.js';
  }

  // Inject the Speed Insights script
  const src = getScriptSrc();
  
  // Check if script is already loaded
  if (document.head.querySelector(`script[src*="${src}"]`)) {
    return;
  }

  // Create and inject the script
  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  script.dataset.sdkn = '@vercel/speed-insights';
  script.dataset.sdkv = '1.3.1';

  script.onerror = () => {
    console.log(
      `[Vercel Speed Insights] Failed to load script from ${src}. Please check if any content blockers are enabled and try again.`
    );
  };

  document.head.appendChild(script);
})();
