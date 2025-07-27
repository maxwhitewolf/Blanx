import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api/posts';
import { useNavigate } from 'react-router-dom';

const tags = ['all', 'nature', 'food', 'travel', 'art', 'sports'];

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('trending');
  const [tag, setTag] = useState('all');
  const [user, setUser] = useState('all');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPosts();
        setPosts(res.data);
        // Collect unique users for filter
        const uniqueUsers = Array.from(new Set(res.data.map(p => p.user?.username).filter(Boolean)));
        setUsers(['all', ...uniqueUsers]);
      } catch (err) {
        console.error('Explore error:', err);
        setPosts([]);
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  let filteredPosts = posts;
  if (tag !== 'all') {
    filteredPosts = filteredPosts.filter((p) => p.tags?.includes(tag));
  }
  if (user !== 'all') {
    filteredPosts = filteredPosts.filter((p) => p.user?.username === user);
  }
  filteredPosts =
    filter === 'trending'
      ? [...filteredPosts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      : [...filteredPosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const handlePostClick = (post) => {
    // Navigate to post detail or profile
    if (post.user?.username) {
      navigate(`/profile/${post.user.username}`);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-primary text-2xl font-bold mb-4">Explore</h1>
      
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((t) => (
          <button
            key={t}
            className={`px-3 py-1 rounded transition-colors ${
              tag === t 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setTag(t)}
          >
            #{t}
          </button>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <label htmlFor="user-filter" className="text-sm font-semibold">User:</label>
        <select
          id="user-filter"
          className="border border-gray-300 rounded px-2 py-1"
          value={user}
          onChange={e => setUser(e.target.value)}
        >
          {users.map(u => (
            <option key={u} value={u}>{u === 'all' ? 'All Users' : u}</option>
          ))}
        </select>
        <button
          className={`px-3 py-1 rounded transition-colors ${
            filter === 'trending' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('trending')}
        >
          Trending
        </button>
        <button
          className={`px-3 py-1 rounded transition-colors ${
            filter === 'recent' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('recent')}
        >
          Recent
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 animate-pulse">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-gray-200 aspect-square rounded" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 transition-all duration-300">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="relative bg-gray-100 aspect-square rounded cursor-pointer hover:scale-105 transition-transform duration-200 overflow-hidden"
              onClick={() => handlePostClick(post)}
            >
              {post.image && (
                <img 
                  src={post.image} 
                  alt={post.caption || 'post'} 
                  className="w-full h-full object-cover" 
                />
              )}
              <div className="absolute bottom-1 right-1 bg-white bg-opacity-80 rounded px-2 text-xs font-semibold">
                ❤️ {post.likes?.length || 0}
              </div>
              {post.caption && (
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded max-w-[80%] truncate">
                  {post.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No posts found with the current filters.
        </div>
      )}
    </main>
  );
};

export default Explore; 