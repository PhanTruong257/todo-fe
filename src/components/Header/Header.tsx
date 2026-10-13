import React from 'react';
import {
  BookOpen,
  BarChart3,
  UserCheck,
  Heart,
  Users,
  Layers,
} from 'lucide-react';
import type { Todo } from '../../types/todo';
import { DatePicker } from '../DatePicker/DatePicker';
import './Header.css';

interface HeaderProps {
  activeTab: 'reports' | 'stats' | 'flashcards' | 'korean';
  onTabChange: (tab: 'reports' | 'stats' | 'flashcards' | 'korean') => void;
  activeStudent: string;
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  todos?: Todo[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  activeStudent,
  selectedDate,
  onSelectDate,
  todos = [],
}) => {
  const isTruong = activeStudent === 'Trường';
  const isNguyet = activeStudent === 'Nguyệt';
  const isAll = activeStudent === 'all';

  return (
    <header className="app-top-header">
      {/* 1. Brand Logo & Ngữ cảnh thành viên */}
      <div className="header-left-cluster">
        <div className="header-brand-group">
          <div className="header-brand-logo">
            <BookOpen size={20} />
          </div>
          <div className="header-brand-titles">
            <h2>English Tracker</h2>
            <span className="header-brand-sub">Nhật ký học mỗi ngày</span>
          </div>
        </div>

        <div className="header-divider-v" />

        <div className="header-context-info">
          <div
            className={`context-avatar ${
              isTruong ? 'avatar-truong' : isNguyet ? 'avatar-nguyet' : 'avatar-all'
            }`}
          >
            {isTruong ? (
              <UserCheck size={18} />
            ) : isNguyet ? (
              <Heart size={18} />
            ) : (
              <Users size={18} />
            )}
          </div>
          <div>
            <span className="context-sublabel">Đang xem:</span>
            <h2 className="context-student-title">
              {isAll ? 'Tất Cả' : activeStudent}
            </h2>
          </div>
        </div>
      </div>

      {/* 2. Ô Chọn Ngày Pop-up Tùy Biến */}
      <DatePicker
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        todos={todos}
        activeStudent={activeStudent}
      />

      {/* 3. Tabs Chức Năng: Nhật Ký, Thống Kê, Từ Vựng Flashcards */}
      <nav className="header-nav-tabs">
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => onTabChange('reports')}
        >
          <BookOpen size={15} />
          <span>Nhật Ký</span>
        </button>

        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
          onClick={() => onTabChange('flashcards')}
        >
          <Layers size={15} />
          <span>Từ Vựng 🎴</span>
        </button>

        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'korean' ? 'active' : ''}`}
          onClick={() => onTabChange('korean')}
        >
          <span style={{ fontSize: 14 }}>🇰🇷</span>
          <span>Tiếng Hàn</span>
        </button>

        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => onTabChange('stats')}
        >
          <BarChart3 size={15} />
          <span>Thống Kê</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
