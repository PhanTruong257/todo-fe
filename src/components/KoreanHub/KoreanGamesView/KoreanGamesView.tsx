import React from 'react';
import { Share2 } from 'lucide-react';
import { SpeedRushGame } from './SpeedRushGame/SpeedRushGame';
import { StrokeCanvasGame } from './StrokeCanvasGame/StrokeCanvasGame';
import { KChatGame } from './KChatGame/KChatGame';
import { SeoulMetroGame } from './SeoulMetroGame/SeoulMetroGame';
import { AestheticStoryCardModal } from './AestheticStoryCardModal/AestheticStoryCardModal';
import { useKoreanGames } from './useKoreanGames';
import './KoreanGamesView.css';

export const KoreanGamesView: React.FC = () => {
  const {
    activeGameTab,
    setActiveGameTab,
    isCardModalOpen,
    speedRushScore,
    metroStampsCount,
    handleOpenCardModal,
    handleCloseCardModal,
  } = useKoreanGames();

  return (
    <div className="korean-games-view">
      {/* 1. Thanh Subtabs Chọn Mini-Game & Nút Xuất K-Card */}
      <div className="kr-games-subnav-wrap">
        <div className="kr-games-tabs-list">
          <button
            type="button"
            className={`kr-game-tab-btn ${activeGameTab === 'speed_rush' ? 'active' : ''}`}
            onClick={() => setActiveGameTab('speed_rush')}
          >
            <span className="kr-game-tab-icon">⚡</span>
            <span>Đấu Trường 60s</span>
          </button>

          <button
            type="button"
            className={`kr-game-tab-btn ${activeGameTab === 'stroke_canvas' ? 'active' : ''}`}
            onClick={() => setActiveGameTab('stroke_canvas')}
          >
            <span className="kr-game-tab-icon">🖌️</span>
            <span>Đồ Nét Thư Pháp</span>
          </button>

          <button
            type="button"
            className={`kr-game-tab-btn ${activeGameTab === 'kchat' ? 'active' : ''}`}
            onClick={() => setActiveGameTab('kchat')}
          >
            <span className="kr-game-tab-icon">💬</span>
            <span>Mô Phỏng K-Chat</span>
          </button>

          <button
            type="button"
            className={`kr-game-tab-btn ${activeGameTab === 'seoul_metro' ? 'active' : ''}`}
            onClick={() => setActiveGameTab('seoul_metro')}
          >
            <span className="kr-game-tab-icon">🚇</span>
            <span>Tuyến 2 Seoul Metro</span>
          </button>
        </div>

        <button
          type="button"
          className="btn-open-kcard-story"
          onClick={() => handleOpenCardModal()}
          title="Tạo thẻ Instagram Story khoe thành tích"
        >
          <Share2 size={15} />
          <span>Xuất Thẻ K-Card Story 📸</span>
        </button>
      </div>

      {/* 2. Vùng Hiển Thị Nội Dung Game Được Chọn */}
      <div className="kr-game-content-panel">
        {activeGameTab === 'speed_rush' && (
          <SpeedRushGame onOpenCardModal={handleOpenCardModal} />
        )}
        {activeGameTab === 'stroke_canvas' && <StrokeCanvasGame />}
        {activeGameTab === 'kchat' && <KChatGame />}
        {activeGameTab === 'seoul_metro' && <SeoulMetroGame />}
      </div>

      {/* 3. Modal Xuất Thẻ K-Card Story */}
      <AestheticStoryCardModal
        isOpen={isCardModalOpen}
        onClose={handleCloseCardModal}
        speedRushScore={speedRushScore}
        metroStampsCount={metroStampsCount}
      />
    </div>
  );
};
