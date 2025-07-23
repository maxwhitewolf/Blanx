import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api/posts';

const tags = ['all', 'nature', 'food', 'travel', 'art', 'sports'];

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('trending');
  const [tag, setTag] = useState('all');
  const [user, setUser] = useState('all');
  const [users, setUsers] = useState([]);

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

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-primary text-2xl font-bold mb-4">Explore</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((t) => (
          <button
            key={t}
            className={`px-3 py-1 rounded ${tag === t ? 'bg-primary text-white' : 'bg-lightgray'}`}
            onClick={() => setTag(t)}
            aria-pressed={tag === t}
          >
            #{t}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <label htmlFor="user-filter" className="text-sm font-semibold">User:</label>
        <select
          id="user-filter"
          className="border border-border rounded px-2 py-1"
          value={user}
          onChange={e => setUser(e.target.value)}
        >
          {users.map(u => (
            <option key={u} value={u}>{u === 'all' ? 'All Users' : u}</option>
          ))}
        </select>
        <button
          className={`px-3 py-1 rounded ${filter === 'trending' ? 'bg-primary text-white' : 'bg-lightgray'}`}
          onClick={() => setFilter('trending')}
          aria-pressed={filter === 'trending'}
        >
          Trending
        </button>
        <button
          className={`px-3 py-1 rounded ${filter === 'recent' ? 'bg-primary text-white' : 'bg-lightgray'}`}
          onClick={() => setFilter('recent')}
          aria-pressed={filter === 'recent'}
        >
          Recent
        </button>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 animate-pulse">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-lightgray aspect-square rounded" />
          ))}
        </div>
      ) : error ? (
        <div className="text-danger text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 transition-all duration-300">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="relative bg-lightgray aspect-square rounded cursor-pointer hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              tabIndex={0}
              aria-label={post.caption || 'Post'}
            >
              {post.image && <img src={post.image} alt={post.caption || 'post'} className="w-full h-full object-cover rounded" />}
              <div className="absolute bottom-1 right-1 bg-white bg-opacity-80 rounded px-2 text-xs font-semibold">
                ❤️ {post.likes?.length || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Explore; 