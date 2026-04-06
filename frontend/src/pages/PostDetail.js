import React, { useRef, useState } from 'react';
import './PostDetail.css';

const PostDetail = ({ post, onBack, onShare }) => {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const [swipeAction, setSwipeAction] = useState(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dy > 30) return; // vertical scroll, ignore
    if (dx > 30) setSwipeAction('back');
    else if (dx < -30) setSwipeAction('share');
    else setSwipeAction(null);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (dy < 30) {
      if (dx > 80) onBack();
      else if (dx < -80) onShare(post);
    }
    touchStartX.current = null;
    setSwipeAction(null);
  };

  const handleDesktopBack = () => onBack();
  const handleDesktopShare = () => onShare(post);

  if (!post) return null;

  return (
    <div
      className={`post-detail ${swipeAction ? `swipe-${swipeAction}` : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe indicators */}
      <div className="swipe-indicator back">← Back</div>
      <div className="swipe-indicator share">Share →</div>

      {/* Desktop nav */}
      <div className="detail-topbar">
        <button className="back-btn" onClick={handleDesktopBack}>
          ← Back to posts
        </button>
        <button className="share-btn" onClick={handleDesktopShare}>
          Share ↗
        </button>
      </div>

      {/* Cover */}
      {post.coverImage && (
        <div className="detail-cover">
          <img src={post.coverImage} alt={post.title} />
          <div className="cover-gradient" />
        </div>
      )}

      {/* Content */}
      <article className="detail-article">
        <div className="detail-topic-badge" style={{ background: post.topic?.color }}>
          {post.topic?.emoji} {post.topic?.name}
        </div>

        <h1 className="detail-title">{post.title}</h1>

        <div className="detail-meta">
          <div className="detail-author">
            <div className="detail-avatar">
              {post.author?.avatar
                ? <img src={post.author.avatar} alt={post.author?.name} />
                : <span>{post.author?.name?.[0]?.toUpperCase()}</span>
              }
            </div>
            <div>
              <p className="author-name">{post.author?.name}</p>
              <p className="author-date">
                {new Date(post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}{post.readTime} min read
                {' · '}{post.views} views
              </p>
            </div>
          </div>
        </div>

        {post.author?.bio && (
          <p className="author-bio">"{post.author.bio}"</p>
        )}

        <div className="detail-divider" />

        <div
          className="detail-content"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
        />

        {post.tags?.length > 0 && (
          <div className="detail-tags">
            {post.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        {/* Mobile swipe hint */}
        <div className="mobile-swipe-hint">
          <span>← Swipe right to go back</span>
          <span>Swipe left to share →</span>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
