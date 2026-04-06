import React, { useState } from 'react';
import { useTopics, usePosts } from '../hooks/useApi';
import PostCard from '../components/PostCard';
import './DesktopView.css';

const DesktopView = ({ onPostClick }) => {
  const { topics } = useTopics();
  const [activeTopicSlug, setActiveTopicSlug] = useState(null);
  const [page, setPage] = useState(1);
  const { data, loading } = usePosts(activeTopicSlug, page);

  const activeTopic = topics.find(t => t.slug === activeTopicSlug);

  const handleTopicChange = (slug) => {
    setActiveTopicSlug(slug === activeTopicSlug ? null : slug);
    setPage(1);
  };

  return (
    <div className="desktop-view">
      {/* Header */}
      <header className="desktop-header">
        <div className="header-brand">
          <span className="brand-dot" />
          <h1>The Blog</h1>
        </div>
        <nav className="topic-nav">
          <button
            className={`topic-btn ${!activeTopicSlug ? 'active' : ''}`}
            onClick={() => handleTopicChange(null)}
          >
            All
          </button>
          {topics.map(topic => (
            <button
              key={topic._id}
              className={`topic-btn ${activeTopicSlug === topic.slug ? 'active' : ''}`}
              onClick={() => handleTopicChange(topic.slug)}
              style={activeTopicSlug === topic.slug ? { '--topic-color': topic.color } : {}}
            >
              {topic.emoji} {topic.name}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="btn-ghost">Sign In</button>
          <button className="btn-primary">Write</button>
        </div>
      </header>

      {/* Hero */}
      {!activeTopicSlug && (
        <div className="desktop-hero">
          <div className="hero-text">
            <h2>Stories worth reading.</h2>
            <p>Explore tourism adventures, coding tutorials, culinary arts, and more.</p>
          </div>
          <div className="hero-decoration">
            {topics.map((t, i) => (
              <div key={t._id} className="deco-pill" style={{ '--color': t.color, '--delay': `${i * 0.1}s` }}>
                {t.emoji} {t.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic hero */}
      {activeTopic && (
        <div className="topic-hero" style={{ '--color': activeTopic.color }}>
          <span className="topic-hero-emoji">{activeTopic.emoji}</span>
          <div>
            <h2>{activeTopic.name}</h2>
            <p>{activeTopic.description}</p>
          </div>
        </div>
      )}

      {/* Grid */}
      <main className="desktop-grid-wrap">
        {loading ? (
          <div className="loading-grid">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                  <div className="skeleton-line" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="posts-grid">
              {data?.posts?.map(post => (
                <PostCard key={post._id} post={post} onClick={onPostClick} isMobile={false} />
              ))}
              {data?.posts?.length === 0 && (
                <div className="empty-state">
                  <p>No posts yet in this topic.</p>
                </div>
              )}
            </div>
            {data?.pages > 1 && (
              <div className="pagination">
                {Array(data.pages).fill(0).map((_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default DesktopView;
