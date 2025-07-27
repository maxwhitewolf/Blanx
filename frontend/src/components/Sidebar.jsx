import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaCompass, FaVideo, FaEnvelope, FaHeart, FaPlusSquare, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser, selectIsAuthenticated } from '../store/slices/authSlice';
import { getProfile } from '../api/auth';

const Sidebar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && !user) {
        try {
          const res = await getProfile('me');
          dispatch(setUser(res.data));
        } catch (err) {}
      }
    };
    fetchProfile();
  }, [isAuthenticated, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Home', icon: <FaHome /> },
    { to: '/search', label: 'Search', icon: <FaSearch /> },
    { to: '/explore', label: 'Explore', icon: <FaCompass /> },
    { to: '/reels', label: 'Reels', icon: <FaVideo /> },
    { to: '/messages', label: 'Messages', icon: <FaEnvelope /> },
    { to: '/notifications', label: 'Notifications', icon: <FaHeart /> },
    { to: '/upload', label: 'Create', icon: <FaPlusSquare /> },
    { to: `/profile/${user?.username || ''}`, label: 'Profile', icon: <FaUser /> },
  ];

  return (
    <aside className="h-screen w-64 bg-card text-text flex flex-col py-8 px-4 border-r border-border min-w-[64px] transition-colors">
      {/* Instagram Logo */}
      <div className="mb-8 flex items-center justify-center">
        <span className="text-3xl font-bold font-logo cursor-pointer" onClick={() => navigate('/')}>Instagram</span>
      </div>
      <nav className="flex flex-col space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors ${
              location.pathname === item.to ? 'bg-gray-900' : ''
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        ))}
      </nav>
      {/* User/Profile/Logout or Auth Buttons */}
      <div className="mt-8 flex flex-col items-center space-y-2">
        {isAuthenticated ? (
          <>
            {user && (
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate(`/profile/${user.username}`)}>
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-lightgray" />
                )}
                <span className="font-semibold">{user.username}</span>
              </div>
            )}
            <button className="text-danger font-semibold" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="text-primary font-semibold" onClick={() => navigate('/login')}>Login</button>
            <button className="text-primary font-semibold" onClick={() => navigate('/signup')}>Sign Up</button>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 