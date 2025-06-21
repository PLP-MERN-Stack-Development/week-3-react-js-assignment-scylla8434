import React from 'react';

const Footer = () => (
  <footer className="bg-white dark:bg-gray-800 shadow mt-auto">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-center text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} PLP Task Manager. All rights reserved.
        </p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="https://react.dev/" className="hover:underline text-blue-500" target="_blank" rel="noopener noreferrer">React</a>
          <a href="https://tailwindcss.com/" className="hover:underline text-blue-500" target="_blank" rel="noopener noreferrer">Tailwind CSS</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
