import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchStories, uploadStory, fetchStoryViewers, reactToStory, commentOnStory } from '../api/stories';

const StoryView = () => {
  const [stories, setStories] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [viewers, setViewers] = useState([]);
  const [showViewers, setShowViewers] = useState(false);
  const [viewersLoading, setViewersLoading] = useState(false);
  const fileInputRef = useRef();
  const [reactionLoading, setReactionLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchStories();
        setStories(res.data);
      } catch (err) {
        setStories([]);
        setError('Failed to load stories.');
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('media', file);
      await uploadStory(formData);
      // Refresh stories
      const res = await fetchStories();
      setStories(res.data);
      setCurrent(res.data.length - 1);
    } catch (err) {
      setUploadError('Upload failed.');
    } finally {
      setUploading(false);
      fileInputRef.current.value = '';
    }
  };

  const handleShowViewers = async () => {
    setViewersLoading(true);
    setShowViewers(true);
    try {
      const res = await fetchStoryViewers(stories[current].id);
      setViewers(res.data);
    } catch {
      setViewers([]);
    } finally {
      setViewersLoading(false);
    }
  };

  const handleReact = async (emoji) => {
    setReactionLoading(true);
    try {
      await reactToStory(stories[current].id, emoji);
      // Refresh stories to update reactions
      const res = await fetchStories();
      setStories(res.data);
    } finally {
      setReactionLoading(false);
    }
  };
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommentLoading(true);
    try {
      await commentOnStory(stories[current].id, comment);
      setComment("");
      // Refresh stories to update comments
      const res = await fetchStories();
      setStories(res.data);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8 animate-pulse">Loading stories...</div>;
  if (error) return <div className="text-center p-8 text-danger">{error}</div>;
  if (!stories.length) return <div className="text-center p-8">No stories available.</div>;

  const story = stories[current];
  const nextStory = React.useCallback(() => {
    setCurrent((c) => (c + 1 < stories.length ? c + 1 : c));
  }, [stories.length]);
  const prevStory = React.useCallback(() => {
    setCurrent((c) => (c - 1 >= 0 ? c - 1 : c));
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') nextStory();
      if (e.key === 'ArrowLeft') prevStory();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextStory, prevStory]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded shadow flex flex-col items-center transition-all duration-500 ease-in-out animate-fadein">
        <div className="flex items-center space-x-2 mb-4 w-full justify-between">
          <button onClick={prevStory} disabled={current === 0} className="text-primary">Prev</button>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-lightgray rounded-full" />
            <span className="font-semibold">{story.user?.username || 'User'}</span>
            <span className="text-xs text-gray-400">{new Date(story.created_at).toLocaleString()}</span>
          </div>
          <button onClick={nextStory} disabled={current === stories.length - 1} className="text-primary">Next</button>
        </div>
        {/* Add Another Story button for current user */}
        {story.user?.username === user?.username && (
          <button
            className="mb-4 px-3 py-1 bg-primary text-white rounded"
            onClick={() => navigate('/stories/add')}
          >
            Add Another Story
          </button>
        )}
        {story.media ? (
          <img src={story.media} alt="story" className="w-full max-w-xs h-80 sm:h-96 object-cover rounded" />
        ) : (
          <div className="w-full max-w-xs h-80 sm:h-96 bg-lightgray rounded flex items-center justify-center">No media</div>
        )}
        <div className="mt-4 w-full flex flex-col items-center">
          <input
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            onChange={handleUpload}
            className="mb-2"
            disabled={uploading}
          />
          {uploading && <div className="text-primary">Uploading...</div>}
          {uploadError && <div className="text-danger">{uploadError}</div>}
          <button
            className="mt-2 px-3 py-1 bg-primary text-white rounded"
            onClick={handleShowViewers}
            disabled={viewersLoading}
          >
            {viewersLoading ? 'Loading viewers...' : 'Show Viewers'}
          </button>
        </div>
        <div className="flex space-x-2 mt-4">
          {["❤️", "😂", "😮", "🔥", "👍"].map((emoji) => (
            <button
              key={emoji}
              className="text-2xl focus:outline-none"
              onClick={() => handleReact(emoji)}
              disabled={reactionLoading}
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <form onSubmit={handleComment} className="flex mt-2 w-full max-w-xs">
          <input
            className="flex-1 px-3 py-2 border border-border rounded-l outline-none"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a comment..."
            disabled={commentLoading}
          />
          <button type="submit" className="bg-primary text-white px-4 rounded-r" disabled={commentLoading}>Post</button>
        </form>
        <div className="w-full max-w-xs mt-2">
          <div className="font-bold mb-1">Reactions:</div>
          <div className="flex flex-wrap gap-2">
            {story.reactions && story.reactions.length > 0 ? (
              story.reactions.map((r, i) => (
                <span key={i} className="text-xl" title={r.user}>{r.emoji}</span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No reactions yet.</span>
            )}
          </div>
          <div className="font-bold mt-3 mb-1">Comments:</div>
          <div className="space-y-1">
            {story.comments && story.comments.length > 0 ? (
              story.comments.map((c, i) => (
                <div key={i} className="text-sm"><span className="font-semibold mr-2">{c.user}</span>{c.content}</div>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No comments yet.</span>
            )}
          </div>
        </div>
      </div>
      {showViewers && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={() => setShowViewers(false)}>
          <div className="bg-white rounded shadow p-4 w-64" onClick={e => e.stopPropagation()} tabIndex={0} aria-modal="true" role="dialog">
            <h2 className="text-primary font-bold mb-2">Viewers</h2>
            {viewersLoading ? (
              <div className="animate-pulse">Loading...</div>
            ) : viewers.length > 0 ? (
              <ul className="space-y-1">
                {viewers.map((v, i) => (
                  <li key={i} className="text-sm">{v.username || v}</li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">No viewers yet.</div>
            )}
            <button className="mt-4 w-full bg-primary text-white py-1 rounded" onClick={() => setShowViewers(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryView; 