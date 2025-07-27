import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const StorySlider = ({ stories = [] }) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  
  // Remove duplicates and separate user's story from other stories
  const uniqueStories = stories.filter((story, index, self) => 
    index === self.findIndex(s => s.id === story.id)
  );
  
  const userStory = uniqueStories.find(s => s.user?.username === user?.username);
  const otherStories = uniqueStories.filter(s => s.user?.username !== user?.username);
  
  
  const handleUserStoryClick = () => {
    if (!userStory) {
      navigate('/add-story');
    } else {
      // Navigate to story viewer starting with user's story
      navigate('/stories', { state: { startIndex: 0 } });
    }
  };

  const handleOtherStoryClick = (storyIndex) => {
    // Navigate to story viewer starting with the clicked story
    const actualIndex = userStory ? storyIndex + 1 : storyIndex; // +1 because user's story is at index 0
    navigate('/stories', { state: { startIndex: actualIndex } });
  };

  return (
    <div className="flex space-x-4 overflow-x-auto py-4 mb-6 px-4">
      {/* User's own story circle - always first */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center border-2 cursor-pointer transition-all duration-200 ${
            userStory 
              ? 'border-green-500 bg-gradient-to-r from-purple-500 to-pink-500' 
              : 'border-gray-300 bg-gray-100 hover:border-gray-400'
          }`}
          onClick={handleUserStoryClick}
        >
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt="avatar" 
              className="w-14 h-14 rounded-full object-cover border-2 border-white" 
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
              {!userStory && (
                <span className="text-2xl font-bold text-gray-600">+</span>
              )}
            </div>
          )}
        </div>
        <span className="text-xs mt-1 text-gray-600">Your Story</span>
      </div>

      {/* Other users' stories */}
      {otherStories.map((story, index) => (
        <div key={story.id} className="flex flex-col items-center flex-shrink-0">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center border-2 cursor-pointer transition-all duration-200 ${
              story.viewers?.some(v => v.id === user?.id)
                ? 'border-gray-300 bg-gray-100' // Viewed story
                : 'border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-r from-purple-500 to-pink-500' // Unviewed story
            }`}
            onClick={() => handleOtherStoryClick(index)}
          >
            {story.user?.avatar ? (
              <img 
                src={story.user.avatar} 
                alt="avatar" 
                className="w-14 h-14 rounded-full object-cover border-2 border-white" 
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-600">
                  {story.user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs mt-1 text-gray-600 truncate max-w-16">
            {story.user?.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StorySlider; 