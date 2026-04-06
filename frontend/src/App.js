import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import DesktopView from './pages/DesktopView';
import MobileView from './pages/MobileView';
import PostDetail from './pages/PostDetail';
import ShareModal from './components/ShareModal';
import './App.css';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

function App() {
  const isMobile = useIsMobile();
  const [selectedPost, setSelectedPost] = useState(null);
  const [sharePost, setSharePost] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'detail'

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setView('detail');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedPost(null);
    setView('list');
  };

  const handleShare = (post) => {
    setSharePost(post);
  };

  return (
    <AuthProvider>
      <div className={`app ${isMobile ? 'is-mobile' : 'is-desktop'}`}>
        {view === 'list' && (
          isMobile
            ? <MobileView onPostClick={handlePostClick} />
            : <DesktopView onPostClick={handlePostClick} />
        )}
        {view === 'detail' && selectedPost && (
          <PostDetail
            post={selectedPost}
            onBack={handleBack}
            onShare={handleShare}
          />
        )}
        {sharePost && (
          <ShareModal
            post={sharePost}
            onClose={() => setSharePost(null)}
          />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
