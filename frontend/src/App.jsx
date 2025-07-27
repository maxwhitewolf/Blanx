import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './store/slices/authSlice';
import { getCurrentUser } from './api/auth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Upload from './pages/Upload';
import AddStory from './pages/AddStory';
import StoryView from './pages/StoryView';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Reels from './pages/Reels';

const App = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token && !user) {
        try {
          const res = await getCurrentUser();
          dispatch(setUser(res.data));
        } catch (err) {
          console.error('Failed to restore user session:', err);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('refresh');
        }
      }
    };
    checkAuth();
  }, [token, user, dispatch]);

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/add-story" element={<AddStory />} />
            <Route path="/stories/add" element={<AddStory />} />
            <Route path="/stories" element={<StoryView />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/search" element={<Search />} />
            <Route path="/reels" element={<Reels />} />
            {/* fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App; 