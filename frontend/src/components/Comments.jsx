import React from 'react';

const Comments = ({ comments }) => (
  <div className="mt-2 space-y-1">
    {comments.length === 0 && <div className="text-gray-500 text-sm">No comments yet.</div>}
    {comments.map((c, idx) => (
      <div key={idx} className="text-sm">
        <span className="font-semibold mr-2">{c.user?.username || c.user || 'User'}</span>
        {c.content}
      </div>
    ))}
  </div>
);

export default Comments; 