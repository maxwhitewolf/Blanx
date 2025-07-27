import React, { useState } from 'react';

const CommentBox = ({ onAdd }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onAdd(comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mt-2">
      <input
        className="flex-1 px-3 py-2 border border-border rounded-l outline-none"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <button type="submit" className="bg-primary text-white px-4 rounded-r">Post</button>
    </form>
  );
};

export default CommentBox; 