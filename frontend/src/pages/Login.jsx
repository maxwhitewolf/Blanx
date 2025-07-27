import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken, setLoading, setError } from '../store/slices/authSlice';
import { login as loginApi, getCurrentUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ login: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const res = await loginApi(form);
      dispatch(setToken(res.data.access));
      localStorage.setItem('token', res.data.access);
      if (res.data.refresh) {
        localStorage.setItem('refresh', res.data.refresh);
      }
      
      // Fetch current user profile after successful login
      try {
        const userRes = await getCurrentUser();
        dispatch(setUser(userRes.data));
      } catch (profileErr) {
        console.error('Failed to fetch user profile:', profileErr);
      }
      
      navigate('/');
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || 'Login failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-xs p-8 bg-card rounded shadow border border-border transition-colors">
        <h2 className="text-primary text-2xl font-bold mb-6 text-center">Instagram Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="login"
            placeholder="Username or Email"
            value={form.login}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <div className="text-danger text-center mt-2">{error}</div>}
        <div className="text-center mt-4">
          <a href="/signup" className="text-primary">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login; 