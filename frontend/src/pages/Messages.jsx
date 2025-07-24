import React, { useEffect, useState } from 'react';
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
  const [socket, setSocket] = useState(null);
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
    if (socket) {
      return () => socket.close();
    }
  }, [socket]);

  useEffect(() => {
    if (isAuthenticated && selectedId) {
      (async () => {
        try {
          const res = await api.get(`dm/conversations/${selectedId}/messages/`);
          const msgs = res.data.results || res.data;
          setMessages(msgs.map((m) => ({ message: m.content, sender: m.sender })));
        } catch (e) {
          setMessages([]);
        }
      })();

      const base = (process.env.REACT_APP_SOCKET_URL || 'ws://localhost:8001').replace(/\/$/, '');
      const ws = new WebSocket(`${base}/ws/chat/${selectedId}/`);
      ws.onopen = () => setConnected(true);
      ws.onclose = () => setConnected(false);
      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setMessages((prev) => [...prev, { message: data.message, sender_id: data.user_id }]);
      };
      setSocket(ws);
    }
  }, [isAuthenticated, selectedId]);

  const handleSend = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message }));
      setMessages((prev) => [...prev, { message, sender: user?.username }]);
    }
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
            <MessageBubble
              key={idx}
              message={msg.message}
              isOwn={msg.sender === user?.username || msg.sender_id === user?.id}
            />
          ))}
        </div>
        <ChatBox onSend={handleSend} messages={[]} />
      </div>
    </div>
  );
};

export default Messages; 