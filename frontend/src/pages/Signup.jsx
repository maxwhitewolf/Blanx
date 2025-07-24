import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setError } from '../store/slices/authSlice';
import { signup as signupApi } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      dispatch(setError('Passwords do not match'));
      return;
    }
    dispatch(setLoading(true));
    try {
      const { username, email, password } = form;
      await signupApi({ username, email, password });
      navigate('/login');
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || 'Signup failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-xs p-8 bg-white rounded shadow">
        <h2 className="text-primary text-2xl font-bold mb-6 text-center">Sign Up</h2>
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
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
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
          <input
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        {error && <div className="text-danger text-center mt-2">{error}</div>}
        <div className="text-center mt-4">
          <Link to="/login" className="text-primary">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup; 