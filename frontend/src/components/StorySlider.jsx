import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const StorySlider = ({ stories = [] }) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  // Check if user has a story
  const userStory = stories.find(s => s.user?.username === user?.username);
  const handleUserStoryClick = () => {
    if (!userStory) {
      navigate('/stories/add');
    } else {
      // Optionally: view your own story
      navigate(`/stories/${userStory.id}`);
    }
  };
  return (
    <div className="flex space-x-2 overflow-x-auto py-2 mb-4">
      {/* User's own story circle */}
      <div className="flex flex-col items-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center bg-lightgray border-2 border-primary relative cursor-pointer"
          onClick={handleUserStoryClick}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            !userStory && (
              <span className="text-3xl font-bold text-primary absolute inset-0 flex items-center justify-center">+</span>
            )
          )}
        </div>
        <span className="text-xs mt-1">Your Story</span>
      </div>
      {/* Other stories */}
      {stories.filter(s => s.user?.username !== user?.username).map((story) => (
        <div key={story.id} className="flex flex-col items-center">
          <div className="w-16 h-16 bg-lightgray rounded-full flex-shrink-0 border-2 border-primary" />
          <span className="text-xs mt-1">{story.user?.username}</span>
        </div>
      ))}
    </div>
  );
};

export default StorySlider; 