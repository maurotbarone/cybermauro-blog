import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { postsAPI, topicsAPI } from '../utils/api';
import './HomePage.css';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

// ─── DESKTOP VIEW ───────────────────────────────────────────────────────────
const DesktopView = ({ categories, posts, activeCategory, setActiveCategory, loading }) => {
  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter(p => p.topic?._id === activeCategory || p.topic?.slug === activeCategory);

  return (
    <div className="desktop-view">
      <div className="desktop-hero">
        <p className="hero-eyebrow">✦ A curated collection of stories</p>
        <h1 className="hero-title">Inkwell</h1>
        <p className="hero-sub">Tourism · Coding · Cooking · Lifestyle</p>
      </div>

      <div className="desktop-filter-bar">
        <button
          className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat._id}
            className={`filter-btn ${activeCategory === cat._id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat._id)}
            style={{ '--cat-color': cat.color }}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="desktop-grid">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <span>📭</span>
          <p>No posts yet in this category</p>
        </div>
      ) : (
        <div className="desktop-grid">
          {filteredPosts.map(post => (
            <PostCard key={post._id} post={post} mobile={false} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── MOBILE VIEW ────────────────────────────────────────────────────────────
const MobileView = ({ categories, posts, loading }) => {
  const [catIndex, setCatIndex] = useState(0);
  const [postIndex, setPostIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const containerRef = useRef(null);

  const currentCategory = categories[catIndex] || null;
  const currentPosts = currentCategory
    ? posts.filter(p => p.topic?._id === currentCategory._id || p.topic?.slug === currentCategory.slug)
    : posts;

  useEffect(() => { setPostIndex(0); }, [catIndex]);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setIsDragging(false);
  };

  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < 30 && absDy < 30) return; // tap

    if (absDx > absDy) {
      // Horizontal swipe → change category
      if (dx < -50 && catIndex < categories.length - 1) {
        setCatIndex(i => i + 1);
      } else if (dx > 50 && catIndex > 0) {
        setCatIndex(i => i - 1);
      }
    } else {
      // Vertical swipe → change post
      if (dy < -50 && postIndex < currentPosts.length - 1) {
        setPostIndex(i => i + 1);
      } else if (dy > 50 && postIndex > 0) {
        setPostIndex(i => i - 1);
      }
    }
  };

  const currentPost = currentPosts[postIndex] || null;

  return (
    <div
      className="mobile-view"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Category tabs */}
      <div className="mobile-cat-bar">
        {categories.map((cat, i) => (
          <button
            key={cat._id}
            className={`mobile-cat-btn ${i === catIndex ? 'active' : ''}`}
            style={{ '--cat-color': cat.color }}
            onClick={() => setCatIndex(i)}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Post card area */}
      <div className="mobile-card-area">
        {loading ? (
          <div className="skeleton-card-mobile" />
        ) : !currentPost ? (
          <div className="mobile-empty">
            <span>📭</span>
            <p>No posts in this category yet</p>
          </div>
        ) : (
          <div className="mobile-card-container" style={{ transform: `translateY(${-postIndex * 0}px)` }}>
            <PostCard key={currentPost._id} post={currentPost} mobile={true} />
          </div>
        )}
      </div>

      {/* Post pagination dots */}
      {currentPosts.length > 1 && (
        <div className="mobile-post-dots">
          {currentPosts.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === postIndex ? 'active' : ''}`}
              onClick={() => setPostIndex(i)}
            />
          ))}
        </div>
      )}

      {/* Swipe hint overlay (first time) */}
      <div className="mobile-swipe-hints">
        <span>← swipe categories →</span>
        <span>↕ swipe posts</span>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
const HomePage = () => {
  const isMobile = useIsMobile();
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, postRes] = await Promise.all([
          topicsAPI.getAll(),
          postsAPI.getAll({ limit: 30 })
        ]);
        setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);
        setPosts(postRes.data.posts || []);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      <Navbar />
      {isMobile ? (
        <MobileView categories={categories} posts={posts} loading={loading} />
      ) : (
        <DesktopView
          categories={categories}
          posts={posts}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          loading={loading}
        />
      )}
    </div>
  );
};

export default HomePage;
