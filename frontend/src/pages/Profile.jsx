import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile, followUser, unfollowUser } from '../api/auth';
import { fetchUserPosts } from '../api/posts';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tab, setTab] = useState('posts');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProfile(username);
        setProfile(res.data);
        setBio(res.data.bio || '');
        setIsFollowing(res.data.is_following || false);
      } catch (err) {
        setProfile(null);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [username]);

  useEffect(() => {
    if (tab === 'posts') {
      fetchUserPosts(username).then(res => setPosts(res.data)).catch(() => setPosts([]));
    }
    // TODO: fetch liked posts for 'liked' tab
  }, [tab, username]);

  const handleEdit = () => navigate('/settings');
  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await updateProfile(profile.username, { bio });
      setProfile((p) => ({ ...p, bio }));
      setEditing(false);
    } catch (err) {
      setSaveError('Failed to save bio.');
    } finally {
      setSaving(false);
    }
  };

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(profile.id);
        setIsFollowing(false);
      } else {
        await followUser(profile.id);
        setIsFollowing(true);
      }
    } catch {}
    setFollowLoading(false);
  };

  if (loading) return <div className="text-center p-8 animate-pulse">Loading profile...</div>;
  if (error) return <div className="text-center p-8 text-danger">{error}</div>;
  if (!profile) return <div className="text-center p-8">Profile not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded shadow p-4 flex items-center space-x-4">
        {profile.avatar ? (
          <img src={profile.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-lightgray" />
        )}
        <div className="flex-1">
          <div className="font-bold text-xl">{profile.username}</div>
          <div className="flex space-x-6 mt-2">
            <div><b>{profile.posts_count || 0}</b> posts</div>
            <div><b>{profile.followers_count || 0}</b> followers</div>
            <div><b>{profile.following_count || 0}</b> following</div>
          </div>
          <div className="text-sm text-text mt-2">{profile.bio}</div>
          <div className="flex space-x-2 mt-2">
            {currentUser && currentUser.username === profile.username ? (
              <button className="text-primary border border-primary rounded px-3 py-1" onClick={handleEdit}>
                Edit Profile
              </button>
            ) : (
              <button
                className={`px-3 py-1 rounded ${isFollowing ? 'bg-danger text-white' : 'bg-primary text-white'}`}
                onClick={handleFollow}
                disabled={followLoading}
              >
                {followLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex justify-center space-x-8 mt-6 border-b">
        <button onClick={() => setTab('posts')} className={tab === 'posts' ? 'font-bold border-b-2 border-primary' : ''}>Posts</button>
        <button onClick={() => setTab('liked')} className={tab === 'liked' ? 'font-bold border-b-2 border-primary' : ''}>Liked</button>
      </div>
      {/* Posts grid */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {tab === 'posts' && posts.length > 0 ? (
          posts.map(post => (
            <img key={post.id} src={post.image} alt="" className="w-full h-40 object-cover rounded" />
          ))
        ) : tab === 'posts' ? (
          <div className="col-span-3 text-center text-gray-500">No posts yet.</div>
        ) : (
          <div className="col-span-3 text-center text-gray-500">Liked posts coming soon.</div>
        )}
      </div>
    </div>
  );
};

export default Profile; 
