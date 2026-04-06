import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI, categoriesAPI, uploadAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import './WritePage.css';

const WritePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft',
    image: { url: '', alt: '' }
  });

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'author' && user.role !== 'admin'))) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    categoriesAPI.getAll().then(res => setCategories(res.data.categories || []));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadAPI.uploadImage(formData);
      setForm(f => ({ ...f, image: { url: res.data.url, alt: f.title } }));
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (status) => {
    setError('');
    setSaving(true);
    try {
      const data = {
        ...form,
        status,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      await postsAPI.create(data);
      setSuccess(`Post ${status === 'published' ? 'published' : 'saved as draft'}!`);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div className="write-loading">Loading...</div>;

  return (
    <div className="write-page">
      <Navbar />
      <div className="write-container">
        <div className="write-header">
          <h1 className="write-title">New Article</h1>
          <div className="write-actions">
            <button className="btn btn-ghost" onClick={() => handleSubmit('draft')} disabled={saving}>
              Save Draft
            </button>
            <button className="btn btn-primary" onClick={() => handleSubmit('published')} disabled={saving}>
              {saving ? 'Publishing...' : 'Publish →'}
            </button>
          </div>
        </div>

        {error && <div className="write-error">{error}</div>}
        {success && <div className="write-success">{success}</div>}

        <div className="write-form">
          {/* Image upload */}
          <div className="write-image-upload">
            {form.image.url ? (
              <div className="image-preview">
                <img src={form.image.url} alt="Preview" />
                <button onClick={() => setForm(f => ({ ...f, image: { url: '', alt: '' } }))}>
                  ✕ Remove
                </button>
              </div>
            ) : (
              <label className="image-upload-label">
                {uploading ? '⏳ Uploading...' : '📷 Add Cover Image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
              </label>
            )}
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              required
            >
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="An amazing story title..."
              required
            />
          </div>

          {/* Summary */}
          <div className="form-group">
            <label>Summary</label>
            <textarea
              value={form.summary}
              onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
              placeholder="A brief description of your article (shown on cards)..."
              rows={3}
              required
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label>Content (HTML supported)</label>
            <textarea
              className="write-content-area"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="<h2>Your content here...</h2><p>Write your article...</p>"
              rows={20}
              required
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="travel, italy, food"
            />
          </div>
        </div>

        {/* Bottom actions */}
        <div className="write-bottom-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/')}>Cancel</button>
          <button className="btn btn-ghost" onClick={() => handleSubmit('draft')} disabled={saving}>
            Save Draft
          </button>
          <button className="btn btn-primary" onClick={() => handleSubmit('published')} disabled={saving}>
            {saving ? 'Publishing...' : 'Publish →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritePage;
