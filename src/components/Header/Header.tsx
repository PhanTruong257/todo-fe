import React, { useState, useRef, useEffect } from 'react';
import { Layers, ChevronDown, Check, Sparkles, Lightbulb } from 'lucide-react';
import './Header.css';

export type KoreanStage = 'hangeul' | 'vocab' | 'grammar' | 'dialogue';

export interface StageInfo {
  id: KoreanStage;
  stageNum: number;
  icon: string;
  shortTitle: string;
  fullTitle: string;
  badge: string;
  desc: string;
}

export const KOREAN_STAGES: StageInfo[] = [
  {
    id: 'hangeul',
    stageNum: 1,
    icon: '🔤',
    shortTitle: 'GĐ 1: Bảng Chữ Cái',
    fullTitle: 'Giai Đoạn 1: Bảng Chữ Cái Hangeul',
    badge: 'Lộ trình 5 ngày • 40 chữ',
    desc: 'Lộ trình 5 ngày, viết tên tiếng Việt, bộ gõ IME & quiz phản xạ',
  },
  {
    id: 'vocab',
    stageNum: 2,
    icon: '🎴',
    shortTitle: 'GĐ 2: Từ Vựng TOPIK 1',
    fullTitle: 'Giai Đoạn 2: Từ Vựng TOPIK 1 SRS',
    badge: '124 từ Hán-Hàn',
    desc: 'Flashcard 3D, thuật toán SuperMemo-2, truy xuất chủ động & gõ từ vựng',
  },
  {
    id: 'grammar',
    stageNum: 3,
    icon: '📐',
    shortTitle: 'GĐ 3: Sổ Tay Ngữ Pháp',
    fullTitle: 'Giai Đoạn 3: Sổ Tay Ngữ Pháp',
    badge: '16 bài học trọng điểm',
    desc: 'Cấu trúc câu SOV, trợ từ, đuôi câu kính ngữ & bài tập trắc nghiệm',
  },
  {
    id: 'dialogue',
    stageNum: 4,
    icon: '💬',
    shortTitle: 'GĐ 4: Hội Thoại & Dịch',
    fullTitle: 'Giai Đoạn 4: Hội Thoại & Dịch Thuật',
    badge: 'Dịch 2 chiều',
    desc: '60+ câu giao tiếp tình huống, công cụ dịch 2 chiều & 1-chạm tạo flashcard',
  },
];

interface HeaderProps {
  activeTab: 'korean' | 'flashcards';
  onTabChange: (tab: 'korean' | 'flashcards') => void;
  koreanStage?: KoreanStage;
  onKoreanStageChange?: (stage: KoreanStage) => void;
  onOpenQuests?: () => void;
  onOpenAdvice?: () => void;
  streakDays?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  koreanStage = 'hangeul',
  onKoreanStageChange,
  onOpenQuests,
  onOpenAdvice,
  streakDays = 3,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentStageInfo =
    KOREAN_STAGES.find((s) => s.id === koreanStage) || KOREAN_STAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  return (
    <header className="app-top-header">
      {/* 1. Brand Logo */}
      <div className="header-brand-group">
        <div className="header-brand-logo">
          <span style={{ fontSize: 20 }}>🇰🇷</span>
        </div>
        <div className="header-brand-titles">
          <h2>
            <span>TaskFlow</span> <span className="header-brand-tag">Korean</span>
          </h2>
          <span className="header-brand-sub">Lộ trình học tiếng Hàn từ con số 0</span>
        </div>
      </div>

      {/* 2. Menu Ngoài Chọn Giai Đoạn & Điều Hướng Tabs */}
      <div className="header-nav-wrap">
        {/* Nút Dropdown Chọn Giai Đoạn Tiếng Hàn (Menu Ngoài Tối Ưu Diện Tích) */}
        {activeTab === 'korean' && (
          <div className="header-stage-selector" ref={dropdownRef}>
            <button
              type="button"
              className={`header-stage-trigger-btn ${isDropdownOpen ? 'open' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title="Click để đổi Giai đoạn học tiếng Hàn"
            >
              <span className="stage-trigger-icon">{currentStageInfo.icon}</span>
              <span className="stage-trigger-label">{currentStageInfo.shortTitle}</span>
              <span className="stage-trigger-badge">
                {currentStageInfo.badge.split('•')[0].trim()}
              </span>
              <ChevronDown
                size={14}
                className={`stage-chevron ${isDropdownOpen ? 'rotated' : ''}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="header-stage-dropdown-menu">
                <div className="stage-menu-header">
                  <Sparkles size={14} color="#f43f5e" />
                  <span>Chọn Giai Đoạn Học Tiếng Hàn</span>
                </div>
                <div className="stage-menu-list">
                  {KOREAN_STAGES.map((s) => {
                    const isSelected = s.id === koreanStage;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={`stage-menu-item ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          onKoreanStageChange?.(s.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className="menu-item-icon">{s.icon}</span>
                        <div className="menu-item-info">
                          <div className="menu-item-top">
                            <span className="menu-item-title">{s.fullTitle}</span>
                            <span className="menu-item-badge">{s.badge}</span>
                          </div>
                          <span className="menu-item-desc">{s.desc}</span>
                        </div>
                        {isSelected && <Check size={16} className="menu-item-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Nút Bí Quyết & Lời Khuyên Học Tập (Động Lực) */}
        <button
          type="button"
          className="header-advice-pill"
          onClick={onOpenAdvice}
          title="Bí Quyết Sư Phạm & Lời Khuyên Học Tốt (Động Lực)"
        >
          <Lightbulb size={13} className="advice-pill-icon" />
          <span className="advice-pill-text">Lời Khuyên</span>
        </button>

        {/* Nút Streak & Nhiệm Vụ Hàng Ngày */}
        <button
          type="button"
          className="header-streak-pill"
          onClick={onOpenQuests}
          title="Xem Chuỗi Ngày & Nhiệm Vụ Hàng Ngày"
        >
          <span style={{ fontSize: 13 }}>🔥</span>
          <span>{streakDays} ngày</span>
        </button>

        {/* Tab chuyển đổi Tiếng Hàn / Flashcard Tiếng Anh */}
        <nav className="header-nav-tabs">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'korean' ? 'active' : ''}`}
            onClick={() => onTabChange('korean')}
            title="Học Tiếng Hàn"
          >
            <span style={{ fontSize: 14 }}>🇰🇷</span>
            <span className="nav-tab-text">Tiếng Hàn</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
            onClick={() => onTabChange('flashcards')}
            title="Từ Vựng Tiếng Anh"
          >
            <Layers size={14} />
            <span className="nav-tab-text">Tiếng Anh 🎴</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
