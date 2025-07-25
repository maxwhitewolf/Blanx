import React, { useState, useEffect } from 'react';
import { createPost } from '../api/posts';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  // Clean up object URL when changed or component unmounts
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file.');
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', caption);
      await createPost(formData);
      setSuccess(true);
      setFile(null);
      setPreview(null);
      setCaption('');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-primary text-2xl font-bold mb-4">Upload Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded shadow p-4">
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        {preview && (
          preview.match(/\.mp4|\.webm|\.ogg|\.mov$/i) ? (
            <video src={preview} controls className="w-full rounded" />
          ) : (
            <img src={preview} alt="preview" className="w-full rounded" />
          )
        )}
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border border-border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        {error && <div className="text-danger text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">Upload successful!</div>}
      </form>
    </div>
  );
};

export default Upload; 
