import React from 'react';

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
    ))}
  </div>
);

export default LoadingSkeleton;
