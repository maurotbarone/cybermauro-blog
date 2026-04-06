import React from 'react';
import './ShareModal.css';

const ShareModal = ({ post, onClose }) => {
  if (!post) return null;

  const url = window.location.href;
  const text = `${post.title} - Check out this article!`;

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
    },
    {
      name: 'Email',
      icon: '✉️',
      color: '#6c63ff',
      action: () => window.open(`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`)
    },
    {
      name: 'Twitter/X',
      icon: '🐦',
      color: '#1DA1F2',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: '#0088cc',
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: '#0077b5',
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
    },
    {
      name: 'Copy Link',
      icon: '🔗',
      color: '#8888aa',
      action: () => { navigator.clipboard.writeText(url); onClose(); }
    }
  ];

  return (
    <div className="share-backdrop" onClick={onClose}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>
        <div className="share-handle" />
        <h3>Share this article</h3>
        <p className="share-title">{post.title}</p>
        <div className="share-grid">
          {shareOptions.map(opt => (
            <button
              key={opt.name}
              className="share-option"
              onClick={() => { opt.action(); }}
              style={{ '--color': opt.color }}
            >
              <span className="share-icon">{opt.icon}</span>
              <span>{opt.name}</span>
            </button>
          ))}
        </div>
        <button className="share-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ShareModal;
