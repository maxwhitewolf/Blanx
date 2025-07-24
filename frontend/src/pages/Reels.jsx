import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api/posts';

const isVideo = (url) => /\.(mp4|webm|ogg|mov)$/i.test(url || '');

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReels = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPosts();
        setReels(res.data.filter((p) => isVideo(p.image)));
      } catch (err) {
        setReels([]);
        setError('Failed to load reels.');
      } finally {
        setLoading(false);
      }
    };
    loadReels();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-primary text-2xl font-bold mb-4">Reels</h1>
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-lightgray h-96 w-full rounded" />
          ))}
        </div>
      ) : error ? (
        <div className="text-danger text-center">{error}</div>
      ) : reels.length > 0 ? (
        <div className="space-y-4">
          {reels.map((reel) => (
            <div key={reel.id} className="bg-black rounded overflow-hidden">
              <video src={reel.image} controls className="w-full h-96 object-cover" />
              <div className="p-2 text-white">{reel.caption}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No reels yet.</div>
      )}
    </div>
  );
};

export default Reels; 