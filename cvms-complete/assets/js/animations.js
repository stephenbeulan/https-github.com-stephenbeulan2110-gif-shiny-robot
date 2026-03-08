// Pure CSS/JavaScript Animations for CVMS
// No external libraries - custom animation system

class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.isRunning = false;
  }

  // Smooth fade in animation
  fadeIn(element, duration = 300, delay = 0) {
    if (!element) return Promise.resolve();

    return new Promise(resolve => {
      element.style.opacity = '0';
      element.style.display = 'block';

      setTimeout(() => {
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '1';

        setTimeout(() => {
          element.style.transition = '';
          resolve();
        }, duration);
      }, delay);
    });
  }

  // Smooth fade out animation
  fadeOut(element, duration = 300, delay = 0) {
    if (!element) return Promise.resolve();

    return new Promise(resolve => {
      element.style.transition = `opacity ${duration}ms ease-in-out`;

      setTimeout(() => {
        element.style.opacity = '0';

        setTimeout(() => {
          element.style.display = 'none';
          element.style.transition = '';
          resolve();
        }, duration);
      }, delay);
    });
  }

  // Slide in from direction
  slideIn(element, direction = 'up', duration = 300, delay = 0) {
    if (!element) return Promise.resolve();

    const directions = {
      up: { transform: 'translateY(100%)', final: 'translateY(0)' },
      down: { transform: 'translateY(-100%)', final: 'translateY(0)' },
      left: { transform: 'translateX(100%)', final: 'translateX(0)' },
      right: { transform: 'translateX(-100%)', final: 'translateX(0)' }
    };

    const dir = directions[direction] || directions.up;

    return new Promise(resolve => {
      element.style.transform = dir.transform;
      element.style.opacity = '0';
      element.style.display = 'block';

      setTimeout(() => {
        element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
        element.style.transform = dir.final;
        element.style.opacity = '1';

        setTimeout(() => {
          element.style.transition = '';
          resolve();
        }, duration);
      }, delay);
    });
  }

  // Slide out to direction
  slideOut(element, direction = 'up', duration = 300, delay = 0) {
    if (!element) return Promise.resolve();

    const directions = {
      up: 'translateY(-100%)',
      down: 'translateY(100%)',
      left: 'translateX(-100%)',
      right: 'translateX(100%)'
    };

    const transform = directions[direction] || directions.up;

    return new Promise(resolve => {
      element.style.transition = `transform ${duration}ms ease-in, opacity ${duration}ms ease-in`;

      setTimeout(() => {
        element.style.transform = transform;
        element.style.opacity = '0';

        setTimeout(() => {
          element.style.display = 'none';
          element.style.transform = '';
          element.style.transition = '';
          resolve();
        }, duration);
      }, delay);
    });
  }

  // Scale animation
  scaleIn(element, duration = 300, delay = 0) {
    if (!element) return Promise.resolve();

    return new Promise(resolve => {
      element.style.transform = 'scale(0.8)';
      element.style.opacity = '0';
      element.style.display = 'block';

      setTimeout(() => {
        element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';

        setTimeout(() => {
          element.style.transition = '';
          resolve();
        }, duration);
      }, delay);
    });
  }

  // Bounce animation
  bounceIn(element, duration = 500, delay = 0) {
    if (!element) return Promise.resolve();

    return new Promise(resolve => {
      element.style.transform = 'scale(0.3)';
      element.style.opacity = '0';
      element.style.display = 'block';

      setTimeout(() => {
        element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity ${duration}ms ease-out`;
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';

        setTimeout(() => {
          element.style.transition = '';
          resolve();
        }, duration);
      }, delay);
    });
  }

  // Pulse animation
  pulse(element, duration = 1000, repeat = true) {
    if (!element) return;

    const animation = () => {
      element.style.transition = `transform ${duration}ms ease-in-out`;
      element.style.transform = 'scale(1.05)';

      setTimeout(() => {
        element.style.transform = 'scale(1)';

        if (repeat) {
          setTimeout(animation, duration);
        } else {
          element.style.transition = '';
        }
      }, duration);
    };

    animation();
  }

  // Shake animation for errors
  shake(element, duration = 500) {
    if (!element) return Promise.resolve();

    return new Promise(resolve => {
      const originalTransform = element.style.transform || '';
      let startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
          const shake = Math.sin(progress * 20) * 5;
          element.style.transform = `${originalTransform} translateX(${shake}px)`;
          requestAnimationFrame(animate);
        } else {
          element.style.transform = originalTransform;
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  // Counter animation for numbers
  animateCounter(element, startValue, endValue, duration = 1000, suffix = '') {
    if (!element) return;

    const startTime = Date.now();
    const difference = endValue - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(startValue + difference * this.easeOutCubic(progress));

      element.textContent = currentValue.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  // Progress bar animation
  animateProgress(element, percentage, duration = 1000) {
    if (!element) return;

    const startWidth = element.style.width || '0%';
    const startValue = parseFloat(startWidth);
    const difference = percentage - startValue;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentWidth = startValue + difference * this.easeOutCubic(progress);

      element.style.width = currentWidth + '%';

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  // Stagger animation for multiple elements
  staggerAnimation(elements, animationFn, staggerDelay = 100, ...args) {
    if (!elements || elements.length === 0) return Promise.resolve();

    const promises = elements.map((element, index) => {
      return animationFn.call(this, element, ...args, index * staggerDelay);
    });

    return Promise.all(promises);
  }

  // Loading spinner
  createSpinner(container, size = 40, color = '#3B82F6') {
    if (!container) return null;

    const spinner = document.createElement('div');
    spinner.className = 'cvms-spinner';
    spinner.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      border: 3px solid #E5E7EB;
      border-top: 3px solid ${color};
      border-radius: 50%;
      animation: cvms-spin 1s linear infinite;
      display: inline-block;
    `;

    // Add keyframes if not already present
    if (!document.getElementById('cvms-spinner-keyframes')) {
      const style = document.createElement('style');
      style.id = 'cvms-spinner-keyframes';
      style.textContent = `
        @keyframes cvms-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    container.appendChild(spinner);
    return spinner;
  }

  // Remove spinner
  removeSpinner(spinner) {
    if (spinner && spinner.parentNode) {
      spinner.parentNode.removeChild(spinner);
    }
  }

  // Easing functions
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Page transition
  pageTransition(fromElement, toElement, direction = 'left') {
    const slideOutDir = direction === 'left' ? 'left' : 'right';
    const slideInDir = direction === 'left' ? 'right' : 'left';

    return Promise.all([
      this.slideOut(fromElement, slideOutDir, 300),
      this.slideIn(toElement, slideInDir, 300, 150)
    ]);
  }

  // Modal animations
  showModal(modal, backdrop) {
    if (!modal || !backdrop) return Promise.resolve();

    modal.style.display = 'block';
    backdrop.style.display = 'block';

    return Promise.all([
      this.fadeIn(backdrop, 200),
      this.scaleIn(modal, 300, 100)
    ]);
  }

  hideModal(modal, backdrop) {
    if (!modal || !backdrop) return Promise.resolve();

    return Promise.all([
      this.fadeOut(backdrop, 200),
      this.scaleOut(modal, 200)
    ]).then(() => {
      modal.style.display = 'none';
      backdrop.style.display = 'none';
    });
  }

  scaleOut(element, duration = 200) {
    if (!element) return Promise.resolve();

    return new Promise(resolve => {
      element.style.transition = `transform ${duration}ms ease-in, opacity ${duration}ms ease-in`;
      element.style.transform = 'scale(0.9)';
      element.style.opacity = '0';

      setTimeout(() => {
        element.style.display = 'none';
        element.style.transform = '';
        element.style.transition = '';
        resolve();
      }, duration);
    });
  }

  // Notification toast animation
  showToast(toast, duration = 3000) {
    if (!toast) return;

    this.slideIn(toast, 'right', 300).then(() => {
      setTimeout(() => {
        this.slideOut(toast, 'right', 300);
      }, duration);
    });
  }

  // Smooth scroll to element
  scrollTo(element, duration = 500, offset = 0) {
    if (!element) return;

    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = this.easeOutCubic(progress);

      window.scrollTo(0, startPosition + distance * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
}

// Global animation manager instance
const animations = new AnimationManager();

// Utility functions for common animations
function fadeIn(element, duration = 300) {
  return animations.fadeIn(element, duration);
}

function fadeOut(element, duration = 300) {
  return animations.fadeOut(element, duration);
}

function slideIn(element, direction = 'up', duration = 300) {
  return animations.slideIn(element, direction, duration);
}

function slideOut(element, direction = 'up', duration = 300) {
  return animations.slideOut(element, direction, duration);
}

function showModal(modalId, backdropId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById(backdropId);
  return animations.showModal(modal, backdrop);
}

function hideModal(modalId, backdropId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById(backdropId);
  return animations.hideModal(modal, backdrop);
}

function animateCounter(element, endValue, duration = 1000, suffix = '') {
  return animations.animateCounter(element, 0, endValue, duration, suffix);
}

function createSpinner(container, size = 40) {
  return animations.createSpinner(container, size);
}

// Export for global use
window.AnimationManager = AnimationManager;
window.animations = animations;
window.fadeIn = fadeIn;
window.fadeOut = fadeOut;
window.slideIn = slideIn;
window.slideOut = slideOut;
window.showModal = showModal;
window.hideModal = hideModal;
window.animateCounter = animateCounter;
window.createSpinner = createSpinner;