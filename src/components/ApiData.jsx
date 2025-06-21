import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { fetchPosts } from '../api/posts';

// Hardcoded tech/AI posts in English
const techPosts = [
  {
    id: 1,
    title: 'The Rise of Artificial Intelligence',
    body: 'AI is transforming industries from healthcare to finance, enabling smarter automation and decision-making.'
  },
  {
    id: 2,
    title: 'React.js: The Modern Front-End Library',
    body: 'React.js makes building interactive UIs easy and efficient with its component-based architecture.'
  },
  {
    id: 3,
    title: 'Machine Learning in Everyday Life',
    body: 'From recommendations on Netflix to voice assistants, machine learning is everywhere.'
  },
  {
    id: 4,
    title: 'The Future of Robotics',
    body: 'Robots are becoming more advanced, working alongside humans in factories and even homes.'
  },
  {
    id: 5,
    title: 'Understanding Neural Networks',
    body: 'Neural networks are the backbone of deep learning, powering image and speech recognition.'
  },
  {
    id: 6,
    title: 'Cloud Computing and Scalability',
    body: 'Cloud platforms like AWS and Azure allow businesses to scale applications globally.'
  },
  {
    id: 7,
    title: 'Natural Language Processing (NLP)',
    body: 'NLP enables computers to understand and generate human language, powering chatbots and translators.'
  },
  {
    id: 8,
    title: 'The Ethics of AI',
    body: 'As AI grows, ethical considerations like bias and transparency become increasingly important.'
  },
  {
    id: 9,
    title: 'Edge Computing Explained',
    body: 'Edge computing brings computation closer to data sources, reducing latency for IoT devices.'
  },
  {
    id: 10,
    title: 'Getting Started with Python for Data Science',
    body: 'Python is the go-to language for data science, with libraries like pandas and scikit-learn.'
  }
];

const ApiData = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [useApi, setUseApi] = useState(true); // Toggle between API and hardcoded
  const limit = 4;
  const [total, setTotal] = useState(techPosts.length);
  const [toast, setToast] = useState(null);
  const searchRef = useRef();

  // Toast helpers
  const showToast = (msg, type = 'danger') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    if (error) showToast(error, 'danger');
  }, [error]);

  useEffect(() => {
    if (searchRef.current) searchRef.current.focus();
  }, [useApi]);

  useEffect(() => {
    if (useApi) {
      window.dispatchEvent(new Event('fetchStart'));
      setLoading(true);
      setError(null);
      fetchPosts(page, limit, query)
        .then(({ data, total }) => {
          setPosts(data);
          setTotal(total);
        })
        .catch(() => setError('Failed to fetch data'))
        .finally(() => {
          setLoading(false);
          window.dispatchEvent(new Event('fetchEnd'));
        });
    } else {
      window.dispatchEvent(new Event('fetchStart'));
      setLoading(true);
      let filtered = techPosts;
      if (query) {
        const q = query.toLowerCase();
        filtered = techPosts.filter(
          post => post.title.toLowerCase().includes(q) || post.body.toLowerCase().includes(q)
        );
      }
      const start = (page - 1) * limit;
      const end = start + limit;
      setPosts(filtered.slice(start, end));
      setTotal(filtered.length);
      setLoading(false);
      window.dispatchEvent(new Event('fetchEnd'));
    }
  }, [page, query, useApi]);

  const totalPages = Math.ceil(total / limit);

  return (
    <Card>
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white ${toast.type === 'danger' ? 'bg-red-600' : 'bg-green-600'}`}>{toast.msg}</div>
      )}
      <h2 className="text-2xl font-bold mb-4">{useApi ? 'Tech & AI News (Live)' : 'Tech & AI Posts (Hardcoded)'}</h2>
      <div className="mb-4 flex gap-2 items-center">
        <input
          ref={searchRef}
          type="text"
          placeholder={useApi ? 'Search news...' : 'Search tech posts...'}
          value={query}
          onChange={e => { setPage(1); setQuery(e.target.value); }}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        {!!query && (
          <Button variant="secondary" size="sm" onClick={() => setQuery('')}>Clear</Button>
        )}
        <Button variant="secondary" size="sm" onClick={() => { setPage(1); setUseApi(!useApi); }}>
          {useApi ? 'Show Hardcoded' : 'Show Live News'}
        </Button>
      </div>
      {loading ? (
        <LoadingSkeleton />
      ) : error ? null : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m9 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>No results found</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-200">
          {posts.map(post => (
            <div key={post.id} className="border rounded p-4 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800 flex flex-col h-full group animate-fadeIn">
              {/* Post image if available */}
              {post.imageUrl || post.urlToImage ? (
                <img
                  src={post.imageUrl || post.urlToImage}
                  alt={post.title}
                  className="w-full h-40 object-cover rounded mb-3 border dark:border-gray-700 group-hover:scale-105 transition-transform duration-300 shadow-md group-hover:shadow-blue-200 dark:group-hover:shadow-blue-900"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded mb-3 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 dark:border-blue-800 group-hover:shadow-lg transition-shadow duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400 mb-1 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z" /></svg>
                  <span className="text-xs text-blue-500 dark:text-blue-300 font-semibold animate-fadeIn">No Image Available</span>
                </div>
              )}
              <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{post.title}</h3>
              <p className="mb-2 line-clamp-3 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200">{post.body}</p>
              {post.url && (
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline block mt-auto group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">Read more</a>
              )}
              {post.source && (
                <span className="text-xs text-gray-400 block mt-1">Source: {post.source}</span>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap justify-between items-center mt-6 gap-2">
        <div className="flex gap-2">
          <Button onClick={() => setPage(1)} disabled={page === 1} variant="secondary">First</Button>
          <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="secondary">Previous</Button>
        </div>
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} variant="secondary">Next</Button>
          <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} variant="secondary">Last</Button>
        </div>
      </div>
    </Card>
  );
};

export default ApiData;
