import React, { useState } from 'react';
import { uploadStory } from '../api/stories';
import { useNavigate } from 'react-router-dom';

const AddStory = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file.');
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('media', file);
      await uploadStory(formData);
      setSuccess(true);
      setPreview(null);
      setFile(null);
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-primary text-2xl font-bold mb-4">Add Story</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded shadow p-4">
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        {preview && (
          preview.match(/\.mp4|\.webm|\.ogg|\.mov$/i) ? (
            <video src={preview} controls className="w-full rounded" />
          ) : (
            <img src={preview} alt="preview" className="w-full rounded" />
          )
        )}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Story'}
        </button>
        {error && <div className="text-danger text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">Upload successful!</div>}
      </form>
    </div>
  );
};

export default AddStory; 