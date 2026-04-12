import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import { postsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './PostPage.css';

const SharePanel = ({ post, onClose }) => {
  const url = window.location.href;
  const text = `${post.title} - ${post.summary}`;

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: '#25d366',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`)
    },
    {
      name: 'Email',
      icon: '✉️',
      color: '#6366f1',
      action: () => window.open(`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`)
    },
    {
      name: 'Twitter / X',
      icon: '𝕏',
      color: '#000',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: '#2ca5e0',
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`)
    },
    {
      name: 'Copy Link',
      icon: '🔗',
      color: '#888',
      action: () => {
        navigator.clipboard.writeText(url);
        alert('Link copied!');
      }
    }
  ];

  return (
    <div className="share-panel">
      <div className="share-panel-header">
        <h3>Share this article</h3>
        <button className="share-close" onClick={onClose}>✕</button>
      </div>
      <div className="share-options">
        {shareOptions.map(opt => (
          <button
            key={opt.name}
            className="share-option"
            onClick={() => { opt.action(); onClose(); }}
            style={{ '--opt-color': opt.color }}
          >
            <span className="share-icon">{opt.icon}</span>
            <span>{opt.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const PostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const startX = useRef(0);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    postsAPI.getBySlug(slug)
      .then(res => {
        setPost(res.data.post);
        setLikeCount(res.data.post.likes?.length || 0);
        if (user) {
          setLiked(res.data.post.likes?.includes(user._id) || false);
        }
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [slug, navigate, user]);

  const handleLike = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const res = await postsAPI.like(post._id);
      setLiked(res.data.liked);
      setLikeCount(res.data.likes);
    } catch (err) { console.error(err); }
  };

  // Touch gestures: swipe left = back, swipe right = share
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (showShare) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx > 80) navigate(-1);         // swipe right → back
    else if (dx < -80) setShowShare(true); // swipe left → share
  };

  if (loading) return (
    <div className="post-page">
      <Navbar />
      <div className="post-loading"><div className="post-skeleton" /></div>
    </div>
  );
  if (!post) return null;

  return (
    <div
      className="post-page"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Navbar />

      {/* Desktop back button */}
      <button className="post-back-btn desktop-only" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Mobile swipe hints */}
      {isMobile && (
        <div className="mobile-article-hints">
          <span>→ back</span>
          <span>share ←</span>
        </div>
      )}

      <article className="post-article">
        {/* Hero image */}
        {post.image?.url && (
          <div className="post-hero-image">
            <img src={post.image.url} alt={post.image.alt || post.title} />
            <div className="post-hero-overlay" />
          </div>
        )}

        <div className="post-content-wrap">
          {/* Category */}
          <div className="post-category" style={{ color: post.category?.color }}>
            {post.category?.icon} {post.category?.name}
          </div>

          {/* Title */}
          <h1 className="post-title">{post.title}</h1>

          {/* Meta */}
          <div className="post-meta">
            <div className="post-author-info">
              <div className="post-avatar">{post.author?.name?.[0]?.toUpperCase()}</div>
              <div>
                <div className="post-author-name">{post.author?.name}</div>
                <div className="post-author-bio">{post.author?.bio}</div>
              </div>
            </div>
            <div className="post-meta-right">
              <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
              <span>⏱ {post.readTime} min read</span>
              <span>👁 {post.views} views</span>
            </div>
          </div>

          {/* Summary callout */}
          <blockquote className="post-summary-callout">{post.summary}</blockquote>

          {/* Body */}
          <div
            className="post-body"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          {/* Footer actions */}
          <div className="post-footer-actions">
            <button
              className={`post-like-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {liked ? '❤️' : '🤍'} {likeCount} {likeCount === 1 ? 'like' : 'likes'}
            </button>
            <button
              className="post-share-btn"
              onClick={() => setShowShare(true)}
            >
              ↗ Share
            </button>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="post-tags">
              {post.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Share panel */}
      {showShare && (
        <div className="share-overlay" onClick={() => setShowShare(false)}>
          <div onClick={e => e.stopPropagation()}>
            <SharePanel post={post} onClose={() => setShowShare(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
