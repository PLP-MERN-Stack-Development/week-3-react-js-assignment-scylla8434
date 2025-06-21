import React from 'react';

const TopLoadingBar = ({ loading }) => (
  <div
    className={`fixed top-0 left-0 w-full h-1 z-[9999] transition-opacity duration-300 pointer-events-none ${loading ? 'opacity-100' : 'opacity-0'}`}
    aria-hidden="true"
  >
    <div className="h-full bg-blue-500 animate-loading-bar" style={{ width: loading ? '100%' : '0%' }} />
    <style>{`
      @keyframes loading-bar {
        0% { width: 0%; }
        80% { width: 90%; }
        100% { width: 100%; }
      }
      .animate-loading-bar {
        animation: loading-bar 1.2s cubic-bezier(0.4,0,0.2,1) infinite;
      }
    `}</style>
  </div>
);

export default TopLoadingBar;
