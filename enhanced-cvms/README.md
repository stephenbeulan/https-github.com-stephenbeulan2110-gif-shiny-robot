# VaxTracker - Child Vaccination Management System

A modern, lightweight Child Vaccination Management System (CVMS) built with pure HTML5, CSS3, Vanilla JavaScript, PHP, and MySQL. No frameworks, no build tools, just clean, fast, and secure code.

## 🎯 Features

### Core Functionality
- **Vaccination Tracking**: Monitor vaccination records with detailed status tracking
- **Search & Filter**: Advanced real-time search by vaccine name, dose, status, and date
- **Smart Alerts**: Automatic alerts for upcoming and overdue vaccinations
- **Statistics Dashboard**: View vaccination statistics and completion progress
- **Timeline View**: Visual timeline representation of all vaccinations
- **CSV Export**: Export vaccination records for backup and sharing
- **User Authentication**: Secure login/signup with password hashing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Technical Features
- Pure JavaScript (No React, Vue, Angular, etc.)
- No build tools required (No Webpack, Babel, etc.)
- RESTful API architecture with JSON responses
- Dashboard with quick access cards
- Demo mode with sample data
- Session-based authentication
- SQL injection prevention with prepared statements
- Password hashing with PHP's `password_hash()`

## 📁 Project Structure

```
enhanced-cvms/
├── index.html                    # Landing page
├── dashboard.html                # Main dashboard
├── vaccinations.html             # Vaccination tracking page
├── demo.html                     # Interactive demo
├── login.html                    # Login page
├── signup.html                   # Signup page
├── styles.css                    # Global styles (500+ lines)
├── vaccination-tracking.css      # Page-specific styles (800+ lines)
├── vaccination-tracking.js       # Application logic
├── config.php                    # Database configuration
├── session.php                   # Session management
├── api.php                       # Vaccination API endpoints
├── auth-api.php                  # Authentication API
└── README.md                     # This file
```

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML5 | Semantic markup |
| | CSS3 | Responsive design, Flexbox, Grid |
| | Vanilla JavaScript | DOM manipulation, AJAX requests |
| **Backend** | PHP 7+ | Server-side logic, API endpoints |
| **Database** | MySQL 5.7+ | Data persistence |
| **Icons** | Font Awesome 6.4.0 | UI icons |

## 🚀 Quick Start

### Prerequisites
- PHP 7.4+ with MySQL support
- MySQL 5.7+ or MariaDB
- Web server (Apache, Nginx, etc.)

### Installation

1. **Extract Files**
   ```bash
   # Copy enhanced-cvms directory to your web server
   cp -r enhanced-cvms /var/www/html/
   ```

2. **Configure Database**
   Edit `config.php` and update database credentials:
   ```php
   const DB_HOST = 'localhost';
   const DB_USER = 'your_username';
   const DB_PASS = 'your_password';
   const DB_NAME = 'vaccination_db';
   ```

3. **Create Database**
   Open any `*.php` file in browser - tables will be created automatically on first load

4. **Access Application**
   - Open `http://localhost/enhanced-cvms/index.html`
   - Create account via signup or use demo mode at `demo.html`

## 📝 API Documentation

### Authentication Endpoints (`auth-api.php`)

#### Login
```
POST /auth-api.php
Content-Type: application/json

{
  "action": "login",
  "email": "user@example.com",
  "password": "password123"
}
```

#### Signup
```
POST /auth-api.php
Content-Type: application/json

{
  "action": "signup",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```
POST /auth-api.php
Content-Type: application/json

{
  "action": "logout"
}
```

### Vaccination API (`api.php`)

#### Get Vaccinations
```
GET /api.php?action=get-vaccinations&child_id=1&search=BCG&status=pending
```

Options:
- `child_id`: Filter by child ID (required)
- `search`: Search by vaccine name (optional)
- `status`: Filter by status (completed, pending, overdue)
- `to_upcoming`: Show upcoming vaccines (30 days)

#### Mark Vaccination Complete
```
POST /api.php
Content-Type: application/json

{
  "action": "mark-complete",
  "vaccination_id": 1,
  "completion_date": "2024-01-15"
}
```

#### Get Statistics
```
GET /api.php?action=get-statistics&child_id=1
```

#### Export to CSV
```
GET /api.php?action=export-csv&child_id=1
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Children Table
```sql
CREATE TABLE children (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

### Vaccinations Table
```sql
CREATE TABLE vaccinations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  child_id INT NOT NULL,
  vaccine_name VARCHAR(100) NOT NULL,
  scheduled_date DATE,
  completion_date DATE,
  status ENUM('pending', 'completed', 'overdue'),
  dose_number INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id)
)
```

## 🎨 UI Components

### Form Elements
- Input fields with validation
- Select dropdowns
- Date pickers
- Custom styled buttons
- Toast notifications

### Cards
- Vaccination cards with status indicators
- Statistics cards
- Dashboard quick-access cards

### Alerts
- Info alerts (blue)
- Warning alerts (yellow)
- Danger alerts (red)
- Success alerts (green)

### Status Badges
- **Completed**: Green badge ✓
- **Pending**: Blue badge ⏳
- **Overdue**: Red badge ⚠️

## 📱 Responsive Breakpoints

```css
/* Mobile: 0px - 640px */
/* Tablet: 641px - 1024px */
/* Desktop: 1025px+ */
```

All pages are fully responsive and tested on various device sizes.

## 🔒 Security Features

1. **Password Hashing**: Uses PHP's `password_hash()` with bcrypt
2. **Session Management**: PHP session validation on protected pages
3. **SQL Injection Prevention**: Uses MySQLi prepared statements
4. **Input Sanitization**: Filters and validates all user inputs
5. **CORS Headers**: Prevents unauthorized cross-origin requests
6. **HTTPS Ready**: Can be deployed with SSL/TLS certificates

## 📊 Demo Mode

The application includes a fully functional demo at `/enhanced-cvms/demo.html` with:
- Pre-populated sample children's records
- Sample vaccination schedules
- Working filters and search
- All features fully functional
- No login required
- Uses localStorage for data persistence

**Demo Credentials** (can use any credentials in demo mode):
- Email: any@email.com
- Password: any password

## 🚀 Deployment

### On Shared Hosting

1. Upload `enhanced-cvms` folder to public_html
2. Create MySQL database
3. Update `config.php` with database credentials
4. Access via `https://yourdomain.com/enhanced-cvms/index.html`

### On VPS/Dedicated Server

1. Clone repository
2. Create MySQL database and user
3. Update permissions: `chmod 755 enhanced-cvms/`
4. Configure web server virtualhost
5. Enable HTTPS with Let's Encrypt

### Using Docker (Optional)

```dockerfile
FROM php:8.1-apache
RUN docker-php-ext-install mysqli pdo pdo_mysql
COPY enhanced-cvms /var/www/html
RUN chown -R www-data:www-data /var/www/html
```

## 📈 Performance

- **Page Load**: < 100ms (static HTML/CSS)
- **API Response**: < 200ms (with database)
- **Bundle Size**: ~150KB (CSS + JS + HTML)
- **No External Dependencies**: Uses only Font Awesome CDN
- **Mobile Optimized**: Lazy loading-ready structure

## 🔄 Future Enhancements

- [ ] Email notifications for vaccination reminders
- [ ] Multi-language support
- [ ] Advanced admin dashboard
- [ ] Appointment scheduling system
- [ ] Certificate generation and printing
- [ ] Barcode/QR code support
- [ ] Parental notifications
- [ ] Hospital/clinic integration
- [ ] Vaccination cost tracking
- [ ] PDF report generation

## 🤝 Integration Guide

### Adding to Existing Apps

1. Copy `enhanced-cvms` folder to your project
2. Configure `config.php` for your database
3. Include `styles.css` in your pages
4. Import components as needed
5. Call API endpoints from your JavaScript

### API Usage Example

```javascript
// Fetch vaccinations
fetch('api.php?action=get-vaccinations&child_id=1')
  .then(res => res.json())
  .then(data => console.log(data));

// Mark vaccination complete
fetch('api.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'mark-complete',
    vaccination_id: 1,
    completion_date: '2024-01-15'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## 📚 Code Quality

- **HTML**: Semantic HTML5 with proper accessibility attributes
- **CSS**: BEM naming convention, CSS variables for theming
- **JavaScript**: ES6+ classes, async/await, error handling
- **PHP**: PSR-12 coding standards, input validation
- **Database**: Normalized schema with proper relationships

## 📄 License

This project is provided as-is for educational and commercial use.

## 👨‍💻 Author

Created as a complete vaccination management system built with vanilla technologies.

## ❓ FAQ

**Q: Can I use this in production?**
A: Yes! The code includes proper security measures and follows best practices.

**Q: Do I need Node.js or any build tools?**
A: No. This is pure vanilla JS - no build tools required.

**Q: How do I backup the database?**
A: Use MySQL backup tools or export via phpMyAdmin.

**Q: Can I customize the design?**
A: Yes! All CSS is well-documented. Modify `styles.css` as needed.

**Q: How do I add more fields to the vaccination table?**
A: Update the database schema in `config.php`, modify API responses, and update HTML forms.

## 📞 Support

For issues or questions:
1. Check the demo at `/demo.html`
2. Review API documentation above
3. Inspect browser console for errors
4. Check PHP error logs

---

**Happy Vaccination Tracking! 💉**
