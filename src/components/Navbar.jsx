import React from 'react';
import Button from './Button';
import { useTheme } from '../context/ThemeContext.jsx';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="bg-white dark:bg-gray-800 shadow mb-4">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 md:h-12 md:w-12 object-contain"
          />
          <span className="text-xl md:text-2xl font-bold">PLP Task Manager</span>
        </div>
        <Button variant="secondary" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
