import React, { useEffect, useState } from 'react';
import { getProfile, followUser, unfollowUser } from '../api/auth';
import { fetchUserPosts } from '../api/posts';
import { createConversation } from '../api/dm';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tab, setTab] = useState('posts');
  const [posts, setPosts] = useState([]);

  // If no username in URL, use current user's username
  const targetUsername = username || (currentUser ? currentUser.username : null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!targetUsername) {
        setError('No username provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      console.log('Loading profile for username:', targetUsername);
      console.log('Current user:', currentUser);
      try {
        const res = await getProfile(targetUsername);
        console.log('Profile response:', res.data);
        setProfile(res.data);
        setIsFollowing(res.data.is_following || false);
      } catch (err) {
        console.error('Profile loading error:', err);
        console.error('Error response:', err.response);
        console.error('Error status:', err.response?.status);
        console.error('Error data:', err.response?.data);
        setProfile(null);
        setError(`Failed to load profile: ${err.response?.data?.detail || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [targetUsername, currentUser]);

  useEffect(() => {
    if (tab === 'posts' && targetUsername) {
      console.log('Fetching posts for username:', targetUsername);
      fetchUserPosts(targetUsername).then(res => {
        console.log('Posts response:', res.data);
        setPosts(res.data);
      }).catch(err => {
        console.error('Posts loading error:', err);
        console.error('Posts error response:', err.response);
        setPosts([]);
      });
    }
    // TODO: fetch liked posts for 'liked' tab
  }, [tab, targetUsername]);

  const handleEdit = () => navigate('/settings');

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

  const handleMessage = async () => {
    if (!profile || !currentUser) return;
    
    setMessageLoading(true);
    try {
      const res = await createConversation(profile.id);
      // Navigate to messages page with the conversation
      navigate('/messages', { state: { conversationId: res.data.conversation_id } });
    } catch (err) {
      console.error('Failed to create conversation:', err);
      // Still navigate to messages page
      navigate('/messages');
    } finally {
      setMessageLoading(false);
    }
  };

  console.log('Profile component state:', { loading, error, profile, posts, targetUsername, currentUser });

  // Show debug info
  if (!currentUser) {
    return <div className="text-center p-8">Please log in to view profiles.</div>;
  }

  if (loading) return <div className="text-center p-8 animate-pulse">Loading profile...</div>;
  if (error) return (
    <div className="text-center p-8 text-danger">
      <div>{error}</div>
      <div className="mt-2 text-sm">
        <div>Target Username: {targetUsername}</div>
        <div>Current User: {currentUser?.username}</div>
        <div>URL Username: {username}</div>
      </div>
    </div>
  );
  if (!profile) return <div className="text-center p-8">Profile not found.</div>;

  const isOwnProfile = currentUser && currentUser.username === profile.username;

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
            {isOwnProfile ? (
              <button className="text-primary border border-primary rounded px-3 py-1" onClick={handleEdit}>Edit Profile</button>
            ) : (
              <>
                <button
                  className={`px-3 py-1 rounded ${isFollowing ? 'bg-danger text-white' : 'bg-primary text-white'}`}
                  onClick={handleFollow}
                  disabled={followLoading}
                >
                  {followLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                  onClick={handleMessage}
                  disabled={messageLoading}
                >
                  {messageLoading ? '...' : 'Message'}
                </button>
              </>
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