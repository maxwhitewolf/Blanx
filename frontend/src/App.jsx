import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Reels from './pages/Reels';
import Explore from './pages/Explore';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import StoryView from './pages/StoryView';
import Upload from './pages/Upload';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SuggestedUsers from './components/SuggestedUsers';
import AddStory from './pages/AddStory';
import { selectIsAuthenticated, setUser, setLoading } from './store/slices/authSlice';
import { getProfile } from './api/auth';

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  if (!user) return <div className="text-center p-8">Loading profile...</div>;

  return children;
};

function AuthBootstrap() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      dispatch(setLoading(true));
      getProfile('me')
        .then(res => {
          dispatch(setUser(res.data));
        })
        .catch(() => {
          dispatch(setUser(null));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  }, [dispatch, user]);

  return null;
}

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  return (
    <Router>
      <AuthBootstrap />
      <div className="flex min-h-screen">
        <Sidebar user={user} />
        <div className="flex flex-1">
          <main className="flex-1 bg-background">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<Search />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  loading
                    ? <div className="text-center p-8">Loading...</div>
                    : user
                      ? <Navigate to={`/profile/${user.username}`} />
                      : <Navigate to="/login" />
                }
              />
              <Route
                path="/profile/:username"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reels"
                element={
                  <ProtectedRoute>
                    <Reels />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <Explore />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stories/:id"
                element={
                  <ProtectedRoute>
                    <StoryView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stories/add"
                element={
                  <ProtectedRoute>
                    <AddStory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          {/* Right sidebar: only show on main pages, not login/signup */}
          <aside className="hidden lg:block w-80 p-4 bg-background border-l border-border">
            <Routes>
              <Route path="/" element={<SuggestedUsers />} />
              <Route path="/explore" element={<SuggestedUsers />} />
              <Route path="/profile/:username" element={<SuggestedUsers />} />
              <Route path="/reels" element={<SuggestedUsers />} />
              <Route path="/upload" element={<SuggestedUsers />} />
            </Routes>
          </aside>
        </div>
      </div>
    </Router>
  );
};

export default App; 