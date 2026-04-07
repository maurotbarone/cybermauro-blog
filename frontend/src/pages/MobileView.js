import React, { useState, useEffect, useRef } from 'react';
import { useTopics, usePosts } from '../hooks/useApi';
import PostCard from '../components/PostCard';
import './MobileView.css';

const MobileView = ({ onPostClick, returnToTopicSlug }) => {
  const { topics } = useTopics();
  // Initialize directly from returnToTopicSlug if available, so the first fetch is always correct
  const [activeTopicSlug, setActiveTopicSlug] = useState(returnToTopicSlug || undefined);

  // Once topics load, default to first topic if no slug is set yet
  useEffect(() => {
    if (topics.length > 0 && !activeTopicSlug) {
      setActiveTopicSlug(topics[0].slug);
    }
  }, [topics, activeTopicSlug]);

  const { data, loading: postsLoading } = usePosts(activeTopicSlug);
  const topic = topics.find(t => t.slug === activeTopicSlug);
  const topicIndex = topics.findIndex(t => t.slug === activeTopicSlug);

  // Swipe to navigate between topics
  const swipeStartX = useRef(null);
  const onTouchStart = (e) => { swipeStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (swipeStartX.current === null || topics.length === 0) return;
    const dx = swipeStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) {
      const nextIndex = dx > 0 ? topicIndex + 1 : topicIndex - 1;
      if (nextIndex >= 0 && nextIndex < topics.length) {
        setActiveTopicSlug(topics[nextIndex].slug);
      }
    }
    swipeStartX.current = null;
  };

  return (
    <div className="mobile-view">
      {/* Header */}
      <header className="mobile-header">
        <h1>The Blog</h1>
        <button className="mobile-menu-btn">☰</button>
      </header>

      {/* Topic chips */}
      <div className="topic-strip">
        {topics.map(t => (
          <button
            key={t._id}
            className={`topic-chip ${t.slug === activeTopicSlug ? 'active' : ''}`}
            style={{ '--chip-color': t.color, ...(t.slug === activeTopicSlug ? { background: t.color } : {}) }}
            onClick={() => setActiveTopicSlug(t.slug)}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Posts - vertical scroll, swipe left/right to change topic */}
      <div className="mobile-posts" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {postsLoading ? (
          <div className="mobile-loading">
            {Array(4).fill(0).map((_, i) => (
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
