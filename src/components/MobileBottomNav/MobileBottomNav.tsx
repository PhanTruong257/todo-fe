import React from 'react';
import type { KoreanStage } from '../Header/Header';
import { KOREAN_STAGES } from '../Header/Header';
import './MobileBottomNav.css';

interface MobileBottomNavProps {
  currentStage: KoreanStage;
  onSelectStage: (stage: KoreanStage) => void;
  activeTab: 'korean' | 'flashcards';
  onTabChange: (tab: 'korean' | 'flashcards') => void;
  onOpenQuests?: () => void;
  streakDays?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentStage,
  onSelectStage,
  activeTab,
  onTabChange,
  onOpenQuests,
  streakDays = 3,
}) => {
  return (
    <nav className="mobile-bottom-nav" aria-label="Điều hướng chính trên di động">
      <div className="mobile-bottom-nav-inner">
        {KOREAN_STAGES.map((stage) => {
          const isActive = activeTab === 'korean' && currentStage === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              className={`mob-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                onTabChange('korean');
                onSelectStage(stage.id);
              }}
              title={stage.fullTitle}
            >
              <div className="mob-nav-icon-wrap">
                <span className="mob-nav-icon">{stage.icon}</span>
                {isActive && <div className="mob-nav-glow" />}
              </div>
              <span className="mob-nav-label">
                {stage.id === 'hangeul' && 'Chữ Cái'}
                {stage.id === 'vocab' && 'Từ Vựng'}
                {stage.id === 'grammar' && 'Ngữ Pháp'}
                {stage.id === 'dialogue' && 'Hội Thoại'}
                {stage.id === 'games' && 'Trò Chơi'}
              </span>
            </button>
          );
        })}

        {/* Nút Nhiệm Vụ & Streak trên thanh điều hướng di động */}
        <button
          type="button"
          className="mob-nav-btn quest-btn"
          onClick={onOpenQuests}
          title="Mở Nhiệm Vụ Hàng Ngày & Chuỗi Học Tập"
        >
          <div className="mob-nav-icon-wrap">
            <span className="mob-nav-icon">🔥</span>
            <span className="mob-nav-streak-badge">{streakDays}</span>
          </div>
          <span className="mob-nav-label">Nhiệm Vụ</span>
        </button>
      </div>
    </nav>
  );
};
