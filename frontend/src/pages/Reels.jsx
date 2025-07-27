import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api/posts';
import { useNavigate } from 'react-router-dom';

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentReel, setCurrentReel] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReels = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPosts();
        // Filter for video posts or posts with video content
        const videoPosts = res.data.filter((p) => 
          p.video || 
          (p.image && p.image.includes('video')) ||
          p.caption?.toLowerCase().includes('video')
        );
        setReels(videoPosts);
      } catch (err) {
        console.error('Reels error:', err);
        setReels([]);
        setError('Failed to load reels.');
      } finally {
        setLoading(false);
      }
    };
    loadReels();
  }, []);

  const nextReel = () => {
    if (currentReel < reels.length - 1) {
      setCurrentReel(currentReel + 1);
    }
  };

  const prevReel = () => {
    if (currentReel > 0) {
      setCurrentReel(currentReel - 1);
    }
  };

  const handleReelClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x < width / 2) {
      prevReel();
    } else {
      nextReel();
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-primary text-2xl font-bold mb-4">Reels</h1>
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-200 h-96 w-full rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-primary text-2xl font-bold mb-4">Reels</h1>
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-primary text-2xl font-bold mb-4">Reels</h1>
        <div className="text-center text-gray-500 py-8">
          <div className="text-lg mb-2">No reels available</div>
          <div className="text-sm">Upload video posts to see them here</div>
        </div>
      </div>
    );
  }

  const currentReelData = reels[currentReel];

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-primary text-2xl font-bold mb-4">Reels</h1>
      
      {/* Reel Counter */}
      <div className="text-center text-sm text-gray-500 mb-4">
        {currentReel + 1} of {reels.length}
      </div>

      {/* Current Reel */}
      <div 
        className="bg-black rounded-lg overflow-hidden cursor-pointer"
        onClick={handleReelClick}
      >
        {currentReelData.video ? (
          <video 
            src={currentReelData.video} 
            controls 
            className="w-full h-96 object-cover" 
            autoPlay
            muted
          />
        ) : currentReelData.image ? (
          <img 
            src={currentReelData.image} 
            alt={currentReelData.caption || 'reel'} 
            className="w-full h-96 object-cover" 
          />
        ) : (
          <div className="w-full h-96 bg-gray-800 flex items-center justify-center">
            <span className="text-white">No media</span>
          </div>
        )}
        
        {/* Reel Info */}
        <div className="p-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            {currentReelData.user?.avatar ? (
              <img 
                src={currentReelData.user.avatar} 
                alt="avatar" 
                className="w-8 h-8 rounded-full object-cover" 
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {currentReelData.user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="font-semibold">{currentReelData.user?.username}</span>
          </div>
          {currentReelData.caption && (
            <p className="text-sm">{currentReelData.caption}</p>
          )}
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <span>❤️ {currentReelData.likes?.length || 0}</span>
            <span>💬 {currentReelData.comments?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={prevReel}
          disabled={currentReel === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={nextReel}
          disabled={currentReel === reels.length - 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Reels; 