import React, { useState } from 'react';
import api from '../api/axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`search/?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (err) {
      setResults([]);
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-primary text-2xl font-bold mb-4">Search</h1>
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          className="flex-1 px-3 py-2 border border-border rounded-l outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users or posts..."
        />
        <button type="submit" className="bg-primary text-white px-4 rounded-r">Search</button>
      </form>
      {loading ? (
        <div className="space-y-2 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-lightgray h-8 w-full rounded" />
          ))}
        </div>
      ) : error ? (
        <div className="text-danger text-center">{error}</div>
      ) : results.length > 0 ? (
        <div className="space-y-2">
          {results.map((item, idx) => (
            <div key={idx} className="bg-white rounded shadow p-2">
              {item.username ? (
                <span className="font-semibold">User: {item.username}</span>
              ) : (
                <span>Post: {item.caption}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No results.</div>
      )}
    </div>
  );
};

export default Search; 