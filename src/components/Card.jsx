import React from 'react';

const Card = ({ children, className = '', ...rest }) => (
  <div className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 ${className}`} {...rest}>
    {children}
  </div>
);

export default Card;
