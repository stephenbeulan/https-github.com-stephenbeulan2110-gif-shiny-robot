// Dark Mode Toggle System for CVMS
// Pure JavaScript implementation with localStorage persistence

class DarkModeManager {
  constructor() {
    this.isDark = false;
    this.storageKey = 'cvms-dark-mode';
    this.init();
  }

  init() {
    // Load saved preference
    const saved = localStorage.getItem(this.storageKey);
    this.isDark = saved === 'true';

    // Apply initial theme
    this.applyTheme();

    // Listen for system preference changes
    this.watchSystemPreference();
  }

  toggle() {
    this.isDark = !this.isDark;
    this.applyTheme();
    this.savePreference();
    this.dispatchEvent();
  }

  setDark(isDark) {
    this.isDark = isDark;
    this.applyTheme();
    this.savePreference();
    this.dispatchEvent();
  }

  applyTheme() {
    const root = document.documentElement;

    if (this.isDark) {
      root.setAttribute('data-theme', 'dark');
      root.style.setProperty('--bg-primary', '#0F172A');
      root.style.setProperty('--bg-secondary', '#1E293B');
      root.style.setProperty('--bg-tertiary', '#334155');
      root.style.setProperty('--text-primary', '#F8FAFC');
      root.style.setProperty('--text-secondary', '#CBD5E1');
      root.style.setProperty('--text-muted', '#94A3B8');
      root.style.setProperty('--border-color', '#475569');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--glass-bg', 'rgba(30, 41, 59, 0.8)');
      root.style.setProperty('--glass-border', 'rgba(71, 85, 105, 0.3)');
    } else {
      root.removeAttribute('data-theme');
      root.style.setProperty('--bg-primary', '#FFFFFF');
      root.style.setProperty('--bg-secondary', '#F8FAFC');
      root.style.setProperty('--bg-tertiary', '#F1F5F9');
      root.style.setProperty('--text-primary', '#1E293B');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--text-muted', '#64748B');
      root.style.setProperty('--border-color', '#E2E8F0');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.8)');
      root.style.setProperty('--glass-border', 'rgba(226, 232, 240, 0.3)');
    }

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor();
  }

  updateMetaThemeColor() {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = this.isDark ? '#0F172A' : '#FFFFFF';
  }

  savePreference() {
    localStorage.setItem(this.storageKey, this.isDark.toString());
  }

  watchSystemPreference() {
    // Check if user has no saved preference and follow system
    if (!localStorage.getItem(this.storageKey)) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.isDark = mediaQuery.matches;

      mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem(this.storageKey)) {
          this.isDark = e.matches;
          this.applyTheme();
        }
      });
    }
  }

  dispatchEvent() {
    const event = new CustomEvent('themeChange', {
      detail: { isDark: this.isDark }
    });
    document.dispatchEvent(event);
  }

  // Get current theme state
  isDarkMode() {
    return this.isDark;
  }

  // Reset to system preference
  resetToSystem() {
    localStorage.removeItem(this.storageKey);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDark = mediaQuery.matches;
    this.applyTheme();
  }
}

// Create toggle button component
function createDarkModeToggle(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const opts = {
    size: 24,
    showLabel: true,
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    ...options
  };

  const toggle = document.createElement('button');
  toggle.id = 'dark-mode-toggle';
  toggle.className = 'dark-mode-toggle';
  toggle.setAttribute('aria-label', 'Toggle dark mode');
  toggle.style.cssText = `
    position: ${opts.position};
    top: ${opts.top};
    right: ${opts.right};
    z-index: ${opts.zIndex};
    width: ${opts.size * 2}px;
    height: ${opts.size}px;
    border: none;
    border-radius: ${opts.size}px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 2px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px var(--shadow-color);
  `;

  const knob = document.createElement('div');
  knob.className = 'toggle-knob';
  knob.style.cssText = `
    width: ${opts.size - 4}px;
    height: ${opts.size - 4}px;
    border-radius: 50%;
    background: var(--text-primary);
    transition: transform 0.3s ease, background-color 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  `;

  const icon = document.createElement('div');
  icon.className = 'toggle-icon';
  icon.style.cssText = `
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    color: var(--text-secondary);
    transition: opacity 0.3s ease;
    pointer-events: none;
  `;

  const sunIcon = '☀️';
  const moonIcon = '🌙';

  toggle.appendChild(knob);
  toggle.appendChild(icon);

  // Update toggle appearance
  function updateToggle() {
    if (darkMode.isDarkMode()) {
      knob.style.transform = `translateX(${opts.size}px)`;
      icon.textContent = moonIcon;
      icon.style.left = 'auto';
      icon.style.right = '4px';
      toggle.style.background = 'var(--bg-tertiary)';
    } else {
      knob.style.transform = 'translateX(0)';
      icon.textContent = sunIcon;
      icon.style.left = '4px';
      icon.style.right = 'auto';
      toggle.style.background = 'var(--bg-secondary)';
    }
  }

  // Initial state
  updateToggle();

  // Toggle event
  toggle.addEventListener('click', () => {
    darkMode.toggle();
  });

  // Listen for theme changes
  document.addEventListener('themeChange', updateToggle);

  // Add label if requested
  if (opts.showLabel) {
    const label = document.createElement('span');
    label.className = 'toggle-label';
    label.textContent = 'Dark Mode';
    label.style.cssText = `
      margin-left: 8px;
      font-size: 14px;
      color: var(--text-secondary);
      user-select: none;
    `;
    toggle.appendChild(label);
  }

  container.appendChild(toggle);
  return toggle;
}

// Auto-apply dark mode to elements with data attributes
function applyDarkModeToElements() {
  // Elements that should have different styles in dark mode
  const darkModeElements = document.querySelectorAll('[data-dark-class]');

  darkModeElements.forEach(element => {
    const darkClass = element.getAttribute('data-dark-class');
    const lightClass = element.getAttribute('data-light-class') || '';

    if (darkMode.isDarkMode()) {
      element.classList.remove(lightClass);
      element.classList.add(darkClass);
    } else {
      element.classList.remove(darkClass);
      element.classList.add(lightClass);
    }
  });
}

// Initialize dark mode manager
const darkMode = new DarkModeManager();

// Listen for theme changes to update elements
document.addEventListener('themeChange', applyDarkModeToElements);

// Utility functions
function toggleDarkMode() {
  darkMode.toggle();
}

function setDarkMode(isDark) {
  darkMode.setDark(isDark);
}

function isDarkMode() {
  return darkMode.isDarkMode();
}

function resetDarkModeToSystem() {
  darkMode.resetToSystem();
}

// Export for global use
window.DarkModeManager = DarkModeManager;
window.darkMode = darkMode;
window.createDarkModeToggle = createDarkModeToggle;
window.toggleDarkMode = toggleDarkMode;
window.setDarkMode = setDarkMode;
window.isDarkMode = isDarkMode;
window.resetDarkModeToSystem = resetDarkModeToSystem;