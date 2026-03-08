import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Syringe, LogOut, User, Settings } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Syringe className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">VaxTracker</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/children" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              Children
            </Link>
            <Link to="/vaccinations" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              Vaccinations
            </Link>
            <Link to="/appointments" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              Appointments
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{user.name}</span>
              </div>
            )}

            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>

            {user && (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;