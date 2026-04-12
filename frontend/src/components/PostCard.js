import React, { useState, useRef } from 'react';
import './PostCard.css';

const PostCard = ({ post, onClick, isMobile }) => {
  const [expanding, setExpanding] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [rect, setRect] = useState(null);
  const cardRef = useRef(null);

  const handleClick = () => {
    if (isMobile) {
      const r = cardRef.current.getBoundingClientRect();
      setRect(r);
      setExpanding(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setExpanded(true));
      });
      setTimeout(() => onClick(post), 420);
    } else {
      onClick(post);
    }
  };

  const coverBg = post.coverImage
    ? `url(${post.coverImage})`
    : post.topic?.color || '#6c63ff';

  return (
    <>
      <div
        ref={cardRef}
        className={`post-card ${isMobile ? 'mobile' : 'desktop'}`}
        onClick={handleClick}
      >
        <div className="card-front">
          <div className="card-image">
            {post.coverImage
              ? <img src={post.coverImage} alt={post.title} loading="lazy" />
              : <div className="card-image-placeholder" style={{ background: post.topic?.color || '#6c63ff' }}>
                  <span>{post.topic?.emoji || '📝'}</span>
                </div>
            }
            <div className="card-topic-badge" style={{ background: post.topic?.color }}>
              {post.topic?.emoji} {post.topic?.name}
            </div>
          </div>
          <div className="card-body">
            <h2 className="card-title">{post.title}</h2>
            <div className="card-meta">
              <div className="card-author">
                <div className="author-avatar">
                  {post.author?.avatar
                    ? <img src={post.author.avatar} alt={post.author?.name} />
                    : <span>{post.author?.name?.[0]?.toUpperCase() || '?'}</span>
                  }
                </div>
                <span>{post.author?.name}</span>
              </div>
              <span className="card-readtime">{post.readTime || 1} min read</span>
            </div>
            <p className="card-summary">{post.summary}</p>
            <div className="card-footer">
              <span className="card-date">
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="card-cta">Read more →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expansion overlay */}
      {expanding && rect && (
        <div
          className={`card-expand-overlay ${expanded ? 'expanded' : ''}`}
          style={{
            '--start-top': `${rect.top}px`,
            '--start-left': `${rect.left}px`,
            '--start-width': `${rect.width}px`,
            '--start-height': `${rect.height}px`,
            '--start-radius': '16px',
            backgroundImage: post.coverImage ? `url(${post.coverImage})` : undefined,
            backgroundColor: !post.coverImage ? (post.topic?.color || '#6c63ff') : undefined,
          }}
        >
          <div className={`card-expand-text ${expanded ? 'visible' : ''}`}>
            <div className="card-expand-badge" style={{ background: post.topic?.color }}>
              {post.topic?.emoji} {post.topic?.name}
            </div>
            <h2 className="card-expand-title">{post.title}</h2>
            <p className="card-expand-summary">{post.summary}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
