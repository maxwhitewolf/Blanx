import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, setLoading, setError } from '../store/slices/postSlice';
import { fetchFeed } from '../api/posts';
import { fetchStories } from '../api/stories';
import PostCard from '../components/PostCard';
import StorySlider from '../components/StorySlider';
import SuggestedUsers from '../components/SuggestedUsers';

const TrendingStories = () => {
  const [stories, setStories] = React.useState([]);
  useEffect(() => {
    fetchStories().then(res => {
      setStories(res.data.sort((a, b) => (b.viewers?.length || 0) - (a.viewers?.length || 0)).slice(0, 5));
    });
  }, []);
  return (
    <section className="mb-4" aria-label="Trending Stories">
      <h2 className="text-primary font-bold mb-2 text-lg sm:text-xl">Trending Stories</h2>
      <div className="flex space-x-2 overflow-x-auto">
        {stories.map(story => (
          <button
            key={story.id}
            className="w-16 h-16 bg-lightgray rounded-full flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary"
            title={story.user?.username}
            tabIndex={0}
            aria-label={`Story by ${story.user?.username}`}
          />
        ))}
      </div>
    </section>
  );
};

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const loadFeed = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const res = await fetchFeed();
        dispatch(setPosts(res.data));
      } catch (err) {
        dispatch(setError('Failed to load feed.'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    loadFeed();
  }, [dispatch]);

  useEffect(() => {
    fetchStories().then(res => setStories(res.data)).catch(() => setStories([]));
  }, []);

  return (
    <main className="max-w-xl mx-auto p-4">
      <StorySlider stories={stories} />
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-lightgray h-64 w-full rounded" />
          ))}
        </div>
      ) : error ? (
        <div className="text-danger text-center">{error}</div>
      ) : posts && posts.length > 0 ? (
        posts.map((post, idx) => <PostCard key={post.id || idx} {...post} />)
      ) : (
        <div className="text-center text-gray-500">No posts yet.</div>
      )}
    </main>
  );
};

export default Feed; 