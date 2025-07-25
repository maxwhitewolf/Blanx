import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken, setLoading, setError } from '../store/slices/authSlice';
import { login as loginApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: '', password: '' });

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
      // Optionally fetch user profile here
      navigate('/');
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || 'Login failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-xs p-8 bg-white rounded shadow">
        <h2 className="text-primary text-2xl font-bold mb-6 text-center">Instagram Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
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