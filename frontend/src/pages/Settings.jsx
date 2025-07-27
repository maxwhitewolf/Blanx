import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../api/auth';
import { useSelector } from 'react-redux';

const Settings = () => {
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({ username: '', email: '', bio: '', avatar: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProfile(user.username);
        setForm({
          username: res.data.username || '',
          email: res.data.email || '',
          bio: res.data.bio || '',
          avatar: null,
        });
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.username) loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setForm((f) => ({ ...f, avatar: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('bio', form.bio);
      if (form.avatar) formData.append('avatar', form.avatar);
      await updateProfile(user.username, formData);
      setSuccess(true);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-8 animate-pulse">Loading settings...</div>;
  if (error) return <div className="text-center p-8 text-danger">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-primary text-2xl font-bold mb-4">Profile Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded shadow p-4">
        <div>
          <label className="block font-semibold mb-1">Avatar</label>
          <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded font-semibold"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {success && <div className="text-green-600 text-center">Profile updated!</div>}
        {error && <div className="text-danger text-center">{error}</div>}
      </form>
    </div>
  );
};

export default Settings; 