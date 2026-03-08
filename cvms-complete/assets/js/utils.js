// Utility Functions for CVMS
// Common helper functions used across the application

class Utils {
  // Date and time utilities
  static formatDate(date, format = 'DD/MM/YYYY') {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD MMM YYYY':
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day} ${monthNames[d.getMonth()]} ${year}`;
      case 'HH:MM':
        return `${hours}:${minutes}`;
      case 'DD/MM/YYYY HH:MM':
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      default:
        return `${day}/${month}/${year}`;
    }
  }

  static calculateAge(birthDate) {
    if (!birthDate) return 0;

    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  static getAgeInMonths(birthDate) {
    if (!birthDate) return 0;

    const birth = new Date(birthDate);
    const today = new Date();

    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();

    return years * 12 + months;
  }

  static isDateInPast(date) {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  static isDateInFuture(date) {
    if (!date) return false;
    return new Date(date) > new Date();
  }

  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static getDaysDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // String utilities
  static capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static titleCase(str) {
    if (!str) return '';
    return str.split(' ')
      .map(word => this.capitalize(word))
      .join(' ');
  }

  static truncate(str, length = 50, suffix = '...') {
    if (!str || str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  }

  static slugify(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Number utilities
  static formatNumber(num, decimals = 0) {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  static formatCurrency(amount, currency = 'INR') {
    if (amount === null || amount === undefined) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  static clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  // Array utilities
  static unique(array) {
    return [...new Set(array)];
  }

  static shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  }

  static sortBy(array, key, direction = 'asc') {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Object utilities
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));

    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = this.deepClone(obj[key]);
    });
    return cloned;
  }

  static isEmpty(obj) {
    if (!obj) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    if (typeof obj === 'string') return obj.trim().length === 0;
    return false;
  }

  static pick(obj, keys) {
    const result = {};
    keys.forEach(key => {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key];
      }
    });
    return result;
  }

  // DOM utilities
  static createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'textContent') {
        element.textContent = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.substring(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    });

    // Add children
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });

    return element;
  }

  static getElement(selector, context = document) {
    return context.querySelector(selector);
  }

  static getElements(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }

  static showElement(element) {
    if (element) element.style.display = 'block';
  }

  static hideElement(element) {
    if (element) element.style.display = 'none';
  }

  static toggleElement(element) {
    if (element) {
      element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
  }

  static addClass(element, className) {
    if (element) element.classList.add(className);
  }

  static removeClass(element, className) {
    if (element) element.classList.remove(className);
  }

  static toggleClass(element, className) {
    if (element) element.classList.toggle(className);
  }

  static hasClass(element, className) {
    return element && element.classList.contains(className);
  }

  // Form utilities
  static serializeForm(form) {
    const data = new FormData(form);
    const result = {};

    for (let [key, value] of data.entries()) {
      if (result[key]) {
        if (Array.isArray(result[key])) {
          result[key].push(value);
        } else {
          result[key] = [result[key], value];
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  static validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static validatePhone(phone) {
    const regex = /^[\+]?[1-9][\d]{0,15}$/;
    return regex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static validateRequired(value) {
    return value !== null && value !== undefined && String(value).trim().length > 0;
  }

  static validateMinLength(value, minLength) {
    return String(value).length >= minLength;
  }

  static validateMaxLength(value, maxLength) {
    return String(value).length <= maxLength;
  }

  // URL and navigation utilities
  static getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  static setQueryParam(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
  }

  static removeQueryParam(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url);
  }

  static navigateTo(url, replace = false) {
    if (replace) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }
  }

  // Storage utilities
  static setLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      return false;
    }
  }

  static getLocalStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return defaultValue;
    }
  }

  static removeLocalStorage(key) {
    localStorage.removeItem(key);
  }

  static clearLocalStorage() {
    localStorage.clear();
  }

  // Debounce and throttle utilities
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // CSV export utility
  static exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // PDF export utility (basic)
  static exportToPDF(content, filename = 'export.pdf') {
    // This is a basic implementation - in a real app you'd use a proper PDF library
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  // Notification utilities
  static showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = this.createElement('div', {
      className: `notification notification-${type}`,
      textContent: message
    });

    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 16px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: '10000',
      maxWidth: '300px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      opacity: '0',
      transform: 'translateY(-20px)',
      transition: 'all 0.3s ease'
    });

    // Set background color based on type
    const colors = {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);

    // Auto remove
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  }

  // Loading state utilities
  static showLoading(element, text = 'Loading...') {
    if (!element) return;

    element.innerHTML = `
      <div class="loading-spinner" style="
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #e5e7eb;
        border-radius: 50%;
        border-top-color: #3b82f6;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
      "></div>
      ${text}
    `;

    // Add keyframes if not present
    if (!document.getElementById('loading-keyframes')) {
      const style = document.createElement('style');
      style.id = 'loading-keyframes';
      style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }
  }

  static hideLoading(element, originalContent = '') {
    if (!element) return;
    element.innerHTML = originalContent;
  }
}

// Export utility functions globally
window.Utils = Utils;

// Common utility functions
window.formatDate = Utils.formatDate;
window.calculateAge = Utils.calculateAge;
window.capitalize = Utils.capitalize;
window.formatNumber = Utils.formatNumber;
window.showNotification = Utils.showNotification;
window.debounce = Utils.debounce;
window.throttle = Utils.throttle;