import React, { useEffect, useState } from 'react';
import socket from '../api/socket';
import { useSelector } from 'react-redux';
import ChatBox from '../components/ChatBox';
import ChatList from '../components/ChatList';
import MessageBubble from '../components/MessageBubble';
import api from '../api/axios';

const Messages = () => {
  const [connected, setConnected] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('dm/conversations/').then((res) => {
        setConversations(res.data);
        if (res.data.length > 0) setSelectedId(res.data[0].id);
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && selectedId) {
      socket.connect();
      setConnected(true);
      socket.emit('join', { conversationId: selectedId });
      setMessages([]); // Clear messages on conversation change
      socket.on('chat_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
      socket.on('typing', () => {
        setTyping(true);
        setTimeout(() => setTyping(false), 1500);
      });
    }
    return () => {
      socket.off('chat_message');
      socket.off('typing');
      socket.disconnect();
      setConnected(false);
    };
  }, [isAuthenticated, selectedId]);

  const handleSend = (message) => {
    socket.emit('chat_message', { conversationId: selectedId, message });
    setMessages((prev) => [...prev, { message, sender: user?.username }]);
  };

  const handleTyping = () => {
    socket.emit('typing', { conversationId: selectedId });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex">
      <ChatList
        conversations={conversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <div className="flex-1 flex flex-col ml-4">
        <h1 className="text-primary text-2xl font-bold mb-4">Messages</h1>
        <div className="mb-2 text-sm text-gray-500">
          Real-time connection: {connected ? <span className="text-green-600">Connected</span> : <span className="text-danger">Disconnected</span>}
        </div>
        <div className="flex-1 overflow-y-auto mb-2">
          {messages.length === 0 && <div className="text-gray-500 text-center">No messages yet.</div>}
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg.message} isOwn={msg.sender === user?.username} />
          ))}
          {typing && <div className="text-xs text-gray-400 italic">Someone is typing...</div>}
        </div>
        <ChatBox onSend={handleSend} messages={[]} onTyping={handleTyping} />
      </div>
    </div>
  );
};

export default Messages; 