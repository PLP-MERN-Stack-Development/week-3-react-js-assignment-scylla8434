// import axios from 'axios';

// export const fetchPosts = async (page = 1, limit = 10, query = '') => {
//   const url = `https://jsonplaceholder.typicode.com/posts`;
//   const response = await axios.get(url);
//   let data = response.data;
//   if (query) {
//     data = data.filter(post => post.title.includes(query) || post.body.includes(query));
//   }
//   // Simple pagination
//   const start = (page - 1) * limit;
//   const end = start + limit;
//   return {
//     data: data.slice(start, end),
//     total: data.length,
//   };
// };

// Example: Fetching real tech news from NewsAPI (https://newsapi.org/)
// You need to get a free API key from https://newsapi.org/
import axios from 'axios';

const NEWS_API_KEY = 'b15a4f1c9ff94b97b05a7f11177abaf8'; // <-- Replace with your NewsAPI key
const BASE_URL = 'https://newsapi.org/v2/everything';

export const fetchPosts = async (page = 1, limit = 10, query = 'technology OR AI') => {
  const params = {
    q: query || 'technology OR AI',
    pageSize: limit,
    page,
    language: 'en',
    sortBy: 'publishedAt',
    apiKey: NEWS_API_KEY,
  };
  const response = await axios.get(BASE_URL, { params });
  // NewsAPI returns articles in response.data.articles
  return {
    data: response.data.articles.map((article, idx) => ({
      id: article.url || idx,
      title: article.title,
      body: article.description || article.content || '',
      url: article.url,
      source: article.source.name,
    })),
    total: response.data.totalResults,
  };
};
