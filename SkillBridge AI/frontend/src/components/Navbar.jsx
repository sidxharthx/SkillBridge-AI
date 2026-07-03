import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">◆</span>
          <span className="brand-text">SkillBridge</span>
        </Link>

        {/* Hamburger toggle */}
        <button
          className={`navbar-toggle ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          id="navbar-hamburger"
        >
          <span className="toggle-bar" />
          <span className="toggle-bar" />
          <span className="toggle-bar" />
        </button>

        {user ? (
          <div className={`navbar-links ${menuOpen ? 'is-open' : ''}`}>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={closeMenu}>
              Dashboard
            </Link>
            <Link to="/upload" className={`nav-link ${isActive('/upload') ? 'active' : ''}`} onClick={closeMenu}>
              Resume
            </Link>
            <Link to="/analyze" className={`nav-link ${isActive('/analyze') ? 'active' : ''}`} onClick={closeMenu}>
              Analyze
            </Link>
            <Link to="/roadmap" className={`nav-link ${isActive('/roadmap') ? 'active' : ''}`} onClick={closeMenu}>
              Roadmap
            </Link>
            <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`} onClick={closeMenu}>
              History
            </Link>
            <div className="nav-divider" />
            <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`} onClick={closeMenu}>
              {user.name?.split(' ')[0]}
            </Link>
            <button className="btn btn-sm btn-secondary" onClick={handleLogout} id="logout-btn">
              Log out
            </button>
          </div>
        ) : (
          <div className={`navbar-links ${menuOpen ? 'is-open' : ''}`}>
            <Link to="/login" className="nav-link" onClick={closeMenu}>Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
