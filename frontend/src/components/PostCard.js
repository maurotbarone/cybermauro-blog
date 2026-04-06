import React, { useState } from 'react';
import './PostCard.css';

const PostCard = ({ post, onClick, isMobile }) => {
  const [flipped, setFlipped] = useState(false);
  const [flipStartX, setFlipStartX] = useState(null);

  const handleClick = () => {
    if (isMobile) {
      setFlipped(true);
      setTimeout(() => {
        setFlipped(false);
        onClick(post);
      }, 400);
    } else {
      onClick(post);
    }
  };

  return (
    <div
      className={`post-card ${flipped ? 'flipping' : ''} ${isMobile ? 'mobile' : 'desktop'}`}
      onClick={handleClick}
    >
      <div className="card-inner">
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
        <div className="card-back">
          <div className="card-back-content">
            <span className="card-back-icon">✨</span>
            <p>Opening article...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
