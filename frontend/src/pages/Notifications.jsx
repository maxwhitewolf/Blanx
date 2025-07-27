import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { createWebSocket } from '../api/socket';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Polling fallback
  useEffect(() => {
    let interval;
    const loadNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('notifications/');
        setNotifications(res.data);
      } catch (err) {
        setNotifications([]);
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
    interval = setInterval(loadNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Real-time via WebSocket
  useEffect(() => {
    const ws = createWebSocket('/ws/notifications/');
    ws.onmessage = (e) => {
      const notif = JSON.parse(e.data);
      setNotifications((prev) => [notif, ...prev]);
    };
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-primary text-2xl font-bold mb-4">Notifications</h1>
      {loading ? (
        <div className="space-y-2 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-lightgray h-8 w-full rounded" />
          ))}
        </div>
      ) : error ? (
        <div className="text-danger text-center">{error}</div>
      ) : notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notif, idx) => (
            <div key={idx} className="bg-white rounded shadow p-2 text-sm transition-all duration-300">
              {notif.verb} {notif.sender?.username} {notif.target_post ? `on post ${notif.target_post}` : ''}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No notifications yet.</div>
      )}
    </div>
  );
};

export default Notifications; 
