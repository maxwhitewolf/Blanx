import React from 'react';

const ChatList = ({ conversations, selectedId, onSelect }) => (
  <div className="w-64 border-r bg-white h-96 overflow-y-auto">
    <h2 className="text-primary font-bold p-4 border-b">Chats</h2>
    {conversations.length === 0 && <div className="p-4 text-gray-500">No conversations</div>}
    {conversations.map((conv) => (
      <div
        key={conv.id}
        className={`p-4 cursor-pointer hover:bg-background ${selectedId === conv.id ? 'bg-background' : ''}`}
        onClick={() => onSelect(conv.id)}
      >
        <div className="font-semibold">{conv.participants?.join(', ') || 'Chat'}</div>
      </div>
    ))}
  </div>
);

export default ChatList; 