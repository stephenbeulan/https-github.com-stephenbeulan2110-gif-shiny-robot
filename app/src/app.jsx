import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import LandingPage from '@/pages/LandingPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import ChildManagementPage from '@/pages/ChildManagementPage.jsx';
import VaccinationTrackingPage from '@/pages/VaccinationTrackingPage.jsx';
import AppointmentBookingPage from '@/pages/AppointmentBookingPage.jsx';
import CertificatePage from '@/pages/CertificatePage.jsx';
import SettingsPage from '@/pages/SettingsPage.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/children"
            element={
              <ProtectedRoute>
                <ChildManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vaccinations"
            element={
              <ProtectedRoute>
                <VaccinationTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute>
                <CertificatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;