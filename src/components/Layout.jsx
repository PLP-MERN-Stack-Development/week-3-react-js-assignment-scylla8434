import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopLoadingBar from '../components/TopLoadingBar';

const ScrollToTopButton = () => {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return visible ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 animate-bounce"
      aria-label="Scroll to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
    </button>
  ) : null;
};

const Layout = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleEnd = () => setLoading(false);
    window.addEventListener('fetchStart', handleStart);
    window.addEventListener('fetchEnd', handleEnd);
    return () => {
      window.removeEventListener('fetchStart', handleStart);
      window.removeEventListener('fetchEnd', handleEnd);
    };
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 fade-in">
      <TopLoadingBar loading={loading} />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
        {children}
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;
