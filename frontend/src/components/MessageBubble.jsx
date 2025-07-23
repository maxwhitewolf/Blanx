import React from 'react';

const MessageBubble = ({ message, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
    <div className={`rounded px-3 py-2 mb-1 max-w-xs ${isOwn ? 'bg-primary text-white' : 'bg-background text-text'}`}>
      {message}
    </div>
  </div>
);

export default MessageBubble; 