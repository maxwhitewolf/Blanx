import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuthenticated, setUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api/auth';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && !user) {
        try {
          // Replace 'me' with actual username if needed
          const res = await getProfile('me');
          dispatch(setUser(res.data));
        } catch (err) {
          // ignore
        }
      }
    };
    fetchProfile();
  }, [isAuthenticated, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-primary font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>Instagram</span>
      </div>
      <div className="flex items-center space-x-4">
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
    </nav>
  );
};

export default Navbar; 