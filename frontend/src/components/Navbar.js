import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-icon">✦</span>
        <span className="logo-text">Inkwell</span>
      </Link>

      <div className="navbar-actions">
        {user ? (
          <>
            {(user.role === 'author' || user.role === 'admin') && (
              <Link to="/write" className="btn btn-primary nav-write-btn">
                + Write
              </Link>
            )}
            <div className="nav-user" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
              {menuOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-name">{user.name}</div>
                  <div className="nav-dropdown-role">{user.role}</div>
                  <hr />
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost nav-btn">Sign In</Link>
            <Link to="/register" className="btn btn-primary nav-btn">Join</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
