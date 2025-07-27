import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchStories, deleteStory, markStoryAsViewed } from '../api/stories';
import { FaTimes, FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';

const StoryView = () => {
  const [stories, setStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const progressInterval = useRef(null);
  const storyDuration = 5000; // 5 seconds per story

  // Get start index from navigation state
  const startIndex = location.state?.startIndex || 0;

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchStories();
        setStories(res.data);
        setCurrentStoryIndex(startIndex);
      } catch (err) {
        setStories([]);
        setError('Failed to load stories.');
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, [startIndex]);

  // Progress bar logic
  useEffect(() => {
    if (loading || !stories.length || isPaused) return;

    const startTime = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / storyDuration) * 100;
      
      if (newProgress >= 100) {
        nextStory();
      } else {
        setProgress(newProgress);
      }
    }, 50);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentStoryIndex, loading, isPaused, stories.length]);

  // Mark story as viewed when it's displayed
  useEffect(() => {
    if (stories.length > 0 && currentStoryIndex < stories.length) {
      const currentStory = stories[currentStoryIndex];
      if (currentStory.user?.username !== user?.username) {
        markStoryAsViewed(currentStory.id).catch(console.error);
      }
    }
  }, [currentStoryIndex, stories, user]);

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else {
      navigate('/');
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleStoryClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x < width / 2) {
      prevStory();
    } else {
      nextStory();
    }
  };

  const handleDeleteStory = async () => {
    if (!stories[currentStoryIndex]) return;
    
    try {
      await deleteStory(stories[currentStoryIndex].id);
      const updatedStories = stories.filter((_, index) => index !== currentStoryIndex);
      setStories(updatedStories);
      
      if (updatedStories.length === 0) {
        navigate('/');
      } else if (currentStoryIndex >= updatedStories.length) {
        setCurrentStoryIndex(updatedStories.length - 1);
      }
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Failed to delete story:', err);
    }
  };

  const handleAddStory = () => {
    navigate('/add-story');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading stories...</div>
      </div>
    );
  }

  if (error || !stories.length) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-xl mb-4">{error || 'No stories available'}</div>
          <button 
            onClick={() => navigate('/')}
            className="bg-white text-black px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentStory = stories[currentStoryIndex];
  const isOwnStory = currentStory.user?.username === user?.username;

  return (
    <div className="fixed inset-0 bg-black">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex space-x-1">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-100 ${
                  index < currentStoryIndex 
                    ? 'bg-white' 
                    : index === currentStoryIndex 
                    ? 'bg-white' 
                    : 'bg-gray-600'
                }`}
                style={{
                  width: index === currentStoryIndex ? `${progress}%` : 
                         index < currentStoryIndex ? '100%' : '0%'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/')}
              className="text-white hover:text-gray-300"
            >
              <FaTimes size={24} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                {currentStory.user?.avatar ? (
                  <img 
                    src={currentStory.user.avatar} 
                    alt="avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {currentStory.user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-white font-semibold">
                {currentStory.user?.username}
              </span>
              <span className="text-gray-300 text-sm">
                {new Date(currentStory.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          {isOwnStory && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddStory}
                className="text-white hover:text-gray-300"
              >
                <span className="text-lg">+</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-white hover:text-red-400"
              >
                <FaTrash size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Story content */}
      <div 
        className="w-full h-full flex items-center justify-center cursor-pointer"
        onClick={handleStoryClick}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {currentStory.media ? (
          <img 
            src={currentStory.media} 
            alt="story" 
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-white text-center">
            <div className="text-xl mb-4">No media content</div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevStory}
        disabled={currentStoryIndex === 0}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50"
      >
        <FaChevronLeft size={24} />
      </button>
      
      <button
        onClick={nextStory}
        disabled={currentStoryIndex === stories.length - 1}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50"
      >
        <FaChevronRight size={24} />
      </button>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Story?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStory}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryView; 