# Child Vaccination Management System (CVMS)

A comprehensive web-based application for managing child vaccinations following India's Universal Immunization Programme (UIP). Built with pure HTML5, CSS3, and Vanilla JavaScript.

## 🌟 Features

### For Parents
- **Child Registration**: Register multiple children with complete profiles
- **Vaccination Tracking**: Monitor vaccination schedules and progress
- **Appointment Booking**: Schedule appointments with healthcare providers
- **Certificate Generation**: Download vaccination certificates with QR codes
- **Progress Monitoring**: Visual progress tracking and reminders

### For Hospitals/Clinics
- **Patient Management**: Manage children under their care
- **Appointment Scheduling**: Handle vaccination appointments
- **Inventory Management**: Track vaccine stock levels
- **Certificate Issuance**: Generate official vaccination certificates
- **Reporting**: Generate vaccination reports and analytics

### For Administrators
- **System Overview**: Complete dashboard with system statistics
- **Hospital Management**: Add and manage healthcare facilities
- **Analytics**: Comprehensive vaccination coverage analytics
- **User Management**: Manage system users and permissions
- **Data Export**: Export system data for analysis

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with glassmorphism design system
- **Data Storage**: localStorage-based database simulation
- **Charts**: Canvas-based charting library
- **Authentication**: Role-based authentication system

### Project Structure
```
cvms-complete/
├── index.html                 # Landing page
├── login.html                 # Authentication
├── signup.html                # User registration
├── admin/                     # Admin dashboard and pages
├── hospital/                  # Hospital dashboard and pages
├── parent/                    # Parent dashboard and pages
└── assets/
    ├── css/                   # Stylesheets
    │   ├── global.css        # Design system & variables
    │   ├── components.css    # UI components
    │   └── responsive.css    # Mobile responsiveness
    ├── js/                   # JavaScript modules
    │   ├── auth.js          # Authentication system
    │   ├── database.js      # localStorage database
    │   ├── uip-schedule.js  # Vaccination schedule
    │   ├── charts.js        # Chart rendering
    │   ├── qrcode.js        # QR code generation
    │   ├── animations.js    # UI animations
    │   ├── darkmode.js      # Dark mode toggle
    │   └── utils.js         # Utility functions
    └── images/               # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- No server-side dependencies required

### Installation
1. Clone or download the project
2. Open `index.html` in your web browser
3. The application runs entirely in the browser

### Demo Accounts
- **Admin**: username: `admin`, password: `admin123`
- **Hospital**: username: `hospital1`, password: `hospital123`
- **Parent**: username: `parent1`, password: `parent123`

## 📱 Features Overview

### Vaccination Schedule
- Follows India's Universal Immunization Programme
- 25+ vaccine doses from birth to 18 years
- Automated scheduling based on child's date of birth
- Age-appropriate vaccine recommendations

### User Roles & Permissions
- **Admin**: Full system access, user management, analytics
- **Hospital**: Patient management, appointments, inventory
- **Parent**: Child registration, vaccination tracking, appointments

### Data Management
- localStorage-based database simulation
- CRUD operations for all entities
- Data export functionality (CSV)
- Secure data handling

### UI/UX Features
- **Glassmorphism Design**: Modern, medical-themed interface
- **Dark Mode**: System preference detection with manual toggle
- **Responsive Design**: Mobile-first approach (320px+)
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant design patterns

## 🔧 Technical Implementation

### Database Schema
```javascript
// Children
{
  id: "string",
  name: "string",
  dateOfBirth: "YYYY-MM-DD",
  gender: "Male/Female",
  parentId: "string",
  hospitalId: "string",
  bloodGroup: "string",
  allergies: "string",
  createdAt: "ISO string"
}

// Vaccinations
{
  id: "string",
  childId: "string",
  vaccineName: "string",
  dateGiven: "YYYY-MM-DD",
  hospitalId: "string",
  batchNumber: "string",
  administeredBy: "string",
  nextDueDate: "YYYY-MM-DD"
}

// Appointments
{
  id: "string",
  childId: "string",
  hospitalId: "string",
  vaccineName: "string",
  date: "YYYY-MM-DD",
  time: "HH:MM",
  status: "scheduled/completed/cancelled",
  notes: "string"
}
```

### Key Components

#### Authentication System (`auth.js`)
- Role-based access control
- Session management with localStorage
- Password hashing simulation
- Route protection

#### Database Layer (`database.js`)
- localStorage CRUD operations
- Data relationships management
- Demo data generation
- Search and filtering

#### Chart System (`charts.js`)
- Canvas-based rendering
- Multiple chart types (pie, bar, line, doughnut)
- Responsive design
- Custom styling

#### QR Code Generation (`qrcode.js`)
- Custom QR code algorithm
- Certificate integration
- Download functionality

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6, #1E40AF)
- **Success**: Green (#10B981, #059669)
- **Warning**: Orange (#F59E0B, #D97706)
- **Error**: Red (#EF4444, #DC2626)
- **Medical**: Teal (#06B6D4, #0891B2)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Sizes**: 12px to 48px scale

### Components
- Glassmorphism cards with backdrop blur
- Consistent spacing (4px grid system)
- Hover states and transitions
- Mobile-responsive layouts

## 📊 Vaccination Schedule (UIP India)

### Birth (At Birth)
- BCG, OPV-0, Hepatitis B-1

### 6 Weeks
- DPT-1, OPV-1, Hepatitis B-2, Hib-1, Rotavirus-1, PCV-1

### 10 Weeks
- DPT-2, OPV-2, Hib-2, Rotavirus-2, PCV-2

### 14 Weeks
- DPT-3, OPV-3, Hepatitis B-3, Hib-3, Rotavirus-3, PCV-3

### 9-12 Months
- MMR-1, JE-1 (in endemic areas)

### 16-24 Months
- DPT Booster, OPV Booster, MMR-2, JE-2 (if required)

### 5-6 Years
- DPT Booster-2

### 10 Years
- TT

### 16 Years
- TT

## 🔒 Security & Privacy

- **Client-side Security**: All data stored locally
- **No External Dependencies**: Runs offline
- **Role-based Access**: Granular permissions
- **Data Encryption**: localStorage with JSON serialization
- **Input Validation**: Comprehensive form validation

## 🚀 Deployment

### Static Hosting
The application can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

### Offline Capability
- Works without internet connection
- All assets bundled locally
- Data persists in browser storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is developed by **Charulatha.R** for educational and demonstration purposes.

## 📞 Support

For questions or support, please contact the development team.

---

**Built with ❤️ by Charulatha.R**

*Following India's commitment to universal immunization coverage*