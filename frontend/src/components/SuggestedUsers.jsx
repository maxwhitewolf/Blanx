import React, { useEffect, useState } from 'react';
import { fetchSuggestedUsers } from '../api/auth';

const SuggestedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuggestedUsers()
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load suggestions');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-gray-400">Loading suggestions...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <aside className="bg-white rounded shadow p-4 mb-4">
      <h2 className="text-primary font-bold mb-2">Suggested Users</h2>
      {users.length === 0 ? (
        <div className="text-gray-500 text-sm">No suggestions.</div>
      ) : (
        <ul>
          {users.map(u => (
            <li key={u.id} className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-lightgray rounded-full" />
              <span>{u.username}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default SuggestedUsers; 