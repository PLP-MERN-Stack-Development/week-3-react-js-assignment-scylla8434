import React from 'react';

const BookmarkButton = ({ bookmarked, onClick }) => (
  <button
    aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    onClick={onClick}
    className={`ml-2 text-xl ${bookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'} transition-colors`}
    title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
  >
    {bookmarked ? '★' : '☆'}
  </button>
);

export default BookmarkButton;
