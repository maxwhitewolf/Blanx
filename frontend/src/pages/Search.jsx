import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`posts/search/?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (err) {
      setResults({ users: [], posts: [] });
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-primary text-2xl font-bold mb-4">Search</h1>
      <form onSubmit={handleSearch} className="flex mb-6">
        <input
          className="flex-1 px-3 py-2 border border-border rounded-l outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users or posts..."
        />
        <button type="submit" className="bg-primary text-white px-4 rounded-r">Search</button>
      </form>
      {loading ? (
        <div className="flex gap-6">
          <div className="flex-1 space-y-2 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-10 w-full rounded" />
            ))}
          </div>
          <div className="flex-[2] space-y-2 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 w-full rounded" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-danger text-center">{error}</div>
      ) : (
        <div className="flex gap-6">
          {/* User Search Block */}
          <div className="flex-1 bg-white rounded shadow p-4 max-h-[500px] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Users</h2>
            {results.users.length > 0 ? (
              <div className="space-y-2">
                {results.users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUserClick(user.username)}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center">No users found.</div>
            )}
          </div>
          {/* Post Search Block */}
          <div className="flex-[2] bg-white rounded shadow p-4 max-h-[500px] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Posts</h2>
            {results.posts.length > 0 ? (
              <div className="space-y-4">
                {results.posts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center">No posts found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search; 