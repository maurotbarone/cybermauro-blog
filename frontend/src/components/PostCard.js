import React from 'react';
import './PostCard.css';

const PostCard = ({ post, onClick, isMobile }) => {
  return (
    <>
      <div
        className={`post-card ${isMobile ? 'mobile' : 'desktop'}`}
        onClick={() => onClick(post)}
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

    </>
  );
};

export default PostCard;
