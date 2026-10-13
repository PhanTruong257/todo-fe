import React from 'react';
import { Layers } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  activeTab: 'korean' | 'flashcards';
  onTabChange: (tab: 'korean' | 'flashcards') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="app-top-header">
      {/* 1. Brand Logo */}
      <div className="header-brand-group">
        <div className="header-brand-logo">
          <span style={{ fontSize: 20 }}>🇰🇷</span>
        </div>
        <div className="header-brand-titles">
          <h2>TaskFlow Korean</h2>
          <span className="header-brand-sub">Lộ trình học tiếng Hàn từ con số 0</span>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <nav className="header-nav-tabs">
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'korean' ? 'active' : ''}`}
          onClick={() => onTabChange('korean')}
        >
          <span style={{ fontSize: 15 }}>🇰🇷</span>
          <span>Học Tiếng Hàn</span>
        </button>

        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
          onClick={() => onTabChange('flashcards')}
        >
          <Layers size={15} />
          <span>Từ Vựng Tiếng Anh 🎴</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
