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

  return (
    <div className="bg-white rounded shadow mb-4">
      <div className="p-4 border-b border-border flex items-center">
        <div className="w-10 h-10 bg-lightgray rounded-full mr-2" />
        <span className="font-semibold">{user?.username || 'username'}</span>
      </div>
      {image && <img src={image} alt="post" className="w-full object-cover" />}
      <div className="p-4">
        <div className="font-bold">{user?.username || 'username'}</div>
        <div className="text-sm text-text mb-2">{caption}</div>
        <Comments comments={allComments} />
        <CommentBox onAdd={handleAddComment} />
        <div className="flex space-x-4 mt-2">
          <button className={`text-primary ${liked ? 'font-bold' : ''}`} onClick={handleLike} disabled={likeLoading}>
            {liked ? 'Unlike' : 'Like'} ({likeCount})
          </button>
          <button className="text-primary">Comment</button>
          <button className="text-primary" onClick={handleShare}>Share</button>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 