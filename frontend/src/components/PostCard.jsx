import React, { useState } from 'react';
import Comments from './Comments';
import CommentBox from './CommentBox';
import { likePost, unlikePost, addComment } from '../api/posts';

const PostCard = ({ id, user, image, caption, comments = [], likes = [] }) => {
  const [allComments, setAllComments] = useState(comments);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const handleAddComment = async (comment) => {
    setCommentLoading(true);
    try {
      const res = await addComment(id, { content: comment });
      setAllComments((prev) => [...prev, res.data]);
    } catch {
      // Optionally show error
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLike = async () => {
    setLikeLoading(true);
    try {
      if (liked) {
        await unlikePost(id);
        setLikeCount((c) => c - 1);
      } else {
        await likePost(id);
        setLikeCount((c) => c + 1);
      }
      setLiked((v) => !v);
    } catch {
      // Optionally show error
    } finally {
      setLikeLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Post link copied!');
  };

  // Handle missing user data
  const username = user?.username || 'Unknown User';
  const userAvatar = user?.avatar;

  return (
    <div className="bg-white rounded shadow mb-4">
      <div className="p-4 border-b border-gray-200 flex items-center">
        {userAvatar ? (
          <img 
            src={userAvatar} 
            alt="avatar" 
            className="w-10 h-10 rounded-full mr-3 object-cover" 
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
            <span className="text-gray-600 font-semibold text-sm">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="font-semibold text-gray-800">{username}</span>
      </div>
      
      {image && (
        <img 
          src={image} 
          alt={caption || 'post'} 
          className="w-full object-cover" 
        />
      )}
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="font-semibold text-gray-800 mr-2">{username}</span>
          {caption && (
            <span className="text-gray-700">{caption}</span>
          )}
        </div>
        
        <Comments comments={allComments} />
        <CommentBox onAdd={handleAddComment} />
        
        <div className="flex space-x-4 mt-3 pt-3 border-t border-gray-100">
          <button 
            className={`text-blue-500 hover:text-blue-700 transition-colors ${liked ? 'font-bold' : ''}`} 
            onClick={handleLike} 
            disabled={likeLoading}
          >
            {liked ? 'Unlike' : 'Like'} ({likeCount})
          </button>
          <button className="text-blue-500 hover:text-blue-700 transition-colors">
            Comment
          </button>
          <button 
            className="text-blue-500 hover:text-blue-700 transition-colors" 
            onClick={handleShare}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 