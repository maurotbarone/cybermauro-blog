import React, { useState, useRef, useCallback } from 'react';
import { useTopics, usePosts } from '../hooks/useApi';
import PostCard from '../components/PostCard';
import './MobileView.css';

const MobileView = ({ onPostClick }) => {
  const { topics, loading: topicsLoading } = useTopics();
  const [topicIndex, setTopicIndex] = useState(0);

  const activeSlug = topics[topicIndex]?.slug;
  const { data, loading: postsLoading } = usePosts(activeSlug);

  // Horizontal swipe for topics
  const topicSwipeRef = useRef(null);
  const topicStartX = useRef(null);

  const onTopicTouchStart = (e) => { topicStartX.current = e.touches[0].clientX; };
  const onTopicTouchEnd = (e) => {
    if (topicStartX.current === null) return;
    const dx = topicStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) {
      if (dx > 0 && topicIndex < topics.length - 1) setTopicIndex(i => i + 1);
      if (dx < 0 && topicIndex > 0) setTopicIndex(i => i - 1);
    }
    topicStartX.current = null;
  };

  const topic = topics[topicIndex];

  return (
    <div className="mobile-view">
      {/* Header */}
      <header className="mobile-header">
        <h1>The Blog</h1>
        <button className="mobile-menu-btn">☰</button>
      </header>

      {/* Topic indicator - swipe hint */}
      <div
        className="topic-strip"
        onTouchStart={onTopicTouchStart}
        onTouchEnd={onTopicTouchEnd}
        ref={topicSwipeRef}
      >
        {topics.map((t, i) => (
          <button
            key={t._id}
            className={`topic-chip ${i === topicIndex ? 'active' : ''}`}
            style={i === topicIndex ? { background: t.color } : {}}
            onClick={() => setTopicIndex(i)}
          >
            {t.emoji} {t.name}
          </button>
        ))}
      </div>

      {/* Topic header with swipe zone */}
      <div
        className="mobile-topic-header"
        style={{ '--color': topic?.color || 'var(--accent)' }}
        onTouchStart={onTopicTouchStart}
        onTouchEnd={onTopicTouchEnd}
      >
        <div className="topic-header-content">
          <span className="topic-emoji-lg">{topic?.emoji}</span>
          <div>
            <h2>{topic?.name || 'Loading...'}</h2>
            <p>{topic?.description}</p>
          </div>
        </div>
        <div className="swipe-hint">
          {topicIndex > 0 && <span className="swipe-arrow left">‹</span>}
          <span className="topic-dots">
            {topics.map((_, i) => (
              <span key={i} className={`dot ${i === topicIndex ? 'active' : ''}`} />
            ))}
          </span>
          {topicIndex < topics.length - 1 && <span className="swipe-arrow right">›</span>}
        </div>
      </div>

      {/* Posts - vertical scroll */}
      <div
        className="mobile-posts"
        onTouchStart={onTopicTouchStart}
        onTouchEnd={onTopicTouchEnd}
      >
        {postsLoading ? (
          <div className="mobile-loading">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="mobile-skeleton" />
            ))}
          </div>
        ) : (
          data?.posts?.map(post => (
            <div key={post._id} className="mobile-card-wrap">
              <PostCard post={post} onClick={onPostClick} isMobile={true} />
            </div>
          ))
        )}
        {!postsLoading && (!data?.posts?.length) && (
          <div className="mobile-empty">
            <span>{topic?.emoji}</span>
            <p>No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileView;
