// Authentication System for CVMS
// Role-based authentication with localStorage sessions

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.sessionKey = 'cvms-session';
    this.usersKey = 'cvms-users';
    this.init();
  }

  init() {
    // Load current session
    this.loadSession();

    // Initialize default users if not exist
    this.initializeDefaultUsers();
  }

  initializeDefaultUsers() {
    const users = this.getUsers();
    if (users.length === 0) {
      // Create default admin user
      const defaultUsers = [
        {
          id: 'admin-001',
          username: 'admin',
          email: 'admin@cvms.com',
          password: this.hashPassword('admin123'),
          role: 'admin',
          name: 'System Administrator',
          hospitalId: null,
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: null
        },
        {
          id: 'hospital-001',
          username: 'hospital1',
          email: 'hospital1@cvms.com',
          password: this.hashPassword('hospital123'),
          role: 'hospital',
          name: 'City General Hospital',
          hospitalId: 'hosp-001',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: null
        },
        {
          id: 'parent-001',
          username: 'parent1',
          email: 'parent1@cvms.com',
          password: this.hashPassword('parent123'),
          role: 'parent',
          name: 'John Smith',
          hospitalId: null,
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: null
        }
      ];

      defaultUsers.forEach(user => this.saveUser(user));
    }
  }

  // Password hashing (simple for demo - use proper hashing in production)
  hashPassword(password) {
    // Simple hash for demo purposes - NOT secure for production
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // User management
  saveUser(user) {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }

    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    } catch (e) {
      console.error('Error loading users:', e);
      return [];
    }
  }

  getUserById(id) {
    const users = this.getUsers();
    return users.find(user => user.id === id);
  }

  getUserByUsername(username) {
    const users = this.getUsers();
    return users.find(user => user.username === username);
  }

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(user => user.email === email);
  }

  // Authentication methods
  async login(username, password) {
    const users = this.getUsers();
    const user = users.find(u =>
      (u.username === username || u.email === username) &&
      u.password === this.hashPassword(password) &&
      u.isActive
    );

    if (!user) {
      throw new Error('Invalid username/email or password');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.saveUser(user);

    // Create session
    this.currentUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      hospitalId: user.hospitalId
    };

    this.saveSession();
    this.dispatchAuthEvent('login');

    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.sessionKey);
    this.dispatchAuthEvent('logout');
  }

  register(userData) {
    const { username, email, password, name, role, hospitalId } = userData;

    // Validate input
    if (!username || !email || !password || !name) {
      throw new Error('All fields are required');
    }

    if (!Utils.validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Check if user already exists
    const existingUser = this.getUserByUsername(username) || this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // Create new user
    const newUser = {
      id: Utils.generateId(),
      username,
      email,
      password: this.hashPassword(password),
      name,
      role: role || 'parent',
      hospitalId: role === 'hospital' ? hospitalId : null,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    this.saveUser(newUser);

    // Auto login for new users
    this.currentUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      hospitalId: newUser.hospitalId
    };

    this.saveSession();
    this.dispatchAuthEvent('register');

    return this.currentUser;
  }

  // Session management
  saveSession() {
    if (this.currentUser) {
      const session = {
        user: this.currentUser,
        timestamp: Date.now()
      };
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
    }
  }

  loadSession() {
    try {
      const session = JSON.parse(localStorage.getItem(this.sessionKey));
      if (session && session.user) {
        // Check if session is not too old (24 hours)
        const sessionAge = Date.now() - session.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (sessionAge < maxAge) {
          this.currentUser = session.user;
          return;
        }
      }
    } catch (e) {
      console.error('Error loading session:', e);
    }

    // Clear invalid session
    this.logout();
  }

  // Authorization methods
  isAuthenticated() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  hasAnyRole(roles) {
    return this.currentUser && roles.includes(this.currentUser.role);
  }

  canAccess(resource, action = 'read') {
    if (!this.currentUser) return false;

    const permissions = {
      admin: {
        users: ['read', 'write', 'delete'],
        hospitals: ['read', 'write', 'delete'],
        children: ['read', 'write', 'delete'],
        vaccinations: ['read', 'write', 'delete'],
        appointments: ['read', 'write', 'delete'],
        certificates: ['read', 'write', 'delete'],
        analytics: ['read']
      },
      hospital: {
        users: ['read'],
        hospitals: ['read'],
        children: ['read', 'write'],
        vaccinations: ['read', 'write'],
        appointments: ['read', 'write'],
        certificates: ['read', 'write'],
        analytics: ['read']
      },
      parent: {
        users: ['read'],
        hospitals: ['read'],
        children: ['read', 'write'],
        vaccinations: ['read'],
        appointments: ['read', 'write'],
        certificates: ['read'],
        analytics: []
      }
    };

    const userPermissions = permissions[this.currentUser.role];
    return userPermissions && userPermissions[resource] &&
           userPermissions[resource].includes(action);
  }

  // Route protection
  requireAuth() {
    if (!this.isAuthenticated()) {
      this.redirectToLogin();
      return false;
    }
    return true;
  }

  requireRole(role) {
    if (!this.requireAuth()) return false;

    if (!this.hasRole(role)) {
      this.showAccessDenied();
      return false;
    }
    return true;
  }

  requireAnyRole(roles) {
    if (!this.requireAuth()) return false;

    if (!this.hasAnyRole(roles)) {
      this.showAccessDenied();
      return false;
    }
    return true;
  }

  // UI helpers
  redirectToLogin() {
    const currentPath = window.location.pathname;
    if (!currentPath.includes('login.html')) {
      window.location.href = `login.html?redirect=${encodeURIComponent(currentPath)}`;
    }
  }

  redirectToDashboard() {
    const role = this.currentUser?.role;
    if (role) {
      window.location.href = `${role}/dashboard.html`;
    } else {
      window.location.href = 'index.html';
    }
  }

  showAccessDenied() {
    Utils.showNotification('Access denied. You do not have permission to view this page.', 'error');
    this.redirectToDashboard();
  }

  // Event system
  dispatchAuthEvent(type, data = {}) {
    const event = new CustomEvent('authChange', {
      detail: {
        type,
        user: this.currentUser,
        ...data
      }
    });
    document.dispatchEvent(event);
  }

  onAuthChange(callback) {
    document.addEventListener('authChange', (e) => callback(e.detail));
  }

  // Password reset (simplified for demo)
  requestPasswordReset(email) {
    const user = this.getUserByEmail(email);
    if (!user) {
      throw new Error('No account found with this email address');
    }

    // In a real app, send email with reset token
    const resetToken = Utils.generateId(32);
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + (15 * 60 * 1000); // 15 minutes
    this.saveUser(user);

    console.log(`Password reset token for ${email}: ${resetToken}`);
    return { success: true, message: 'Password reset instructions sent to your email' };
  }

  resetPassword(token, newPassword) {
    const users = this.getUsers();
    const user = users.find(u => u.resetToken === token);

    if (!user) {
      throw new Error('Invalid reset token');
    }

    if (Date.now() > user.resetTokenExpiry) {
      throw new Error('Reset token has expired');
    }

    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    user.password = this.hashPassword(newPassword);
    delete user.resetToken;
    delete user.resetTokenExpiry;
    this.saveUser(user);

    return { success: true, message: 'Password reset successfully' };
  }

  // Profile management
  updateProfile(userData) {
    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    const user = this.getUserById(this.currentUser.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Update allowed fields
    const allowedFields = ['name', 'email'];
    allowedFields.forEach(field => {
      if (userData[field] !== undefined) {
        user[field] = userData[field];
      }
    });

    this.saveUser(user);

    // Update current session
    this.currentUser = {
      ...this.currentUser,
      ...Utils.pick(user, allowedFields)
    };
    this.saveSession();

    this.dispatchAuthEvent('profileUpdate');
    return this.currentUser;
  }

  changePassword(currentPassword, newPassword) {
    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    const user = this.getUserById(this.currentUser.id);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== this.hashPassword(currentPassword)) {
      throw new Error('Current password is incorrect');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    user.password = this.hashPassword(newPassword);
    this.saveUser(user);

    Utils.showNotification('Password changed successfully', 'success');
    return { success: true };
  }
}

// Initialize auth manager
const auth = new AuthManager();

// Export globally
window.AuthManager = AuthManager;
window.auth = auth;

// Convenience functions
window.login = (username, password) => auth.login(username, password);
window.logout = () => auth.logout();
window.register = (userData) => auth.register(userData);
window.isAuthenticated = () => auth.isAuthenticated();
window.getCurrentUser = () => auth.getCurrentUser();
window.hasRole = (role) => auth.hasRole(role);
window.canAccess = (resource, action) => auth.canAccess(resource, action);
window.requireAuth = () => auth.requireAuth();
window.requireRole = (role) => auth.requireRole(role);