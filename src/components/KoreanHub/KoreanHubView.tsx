import React, { useState } from 'react';
import { HangeulView } from './HangeulView/HangeulView';
import { KoreanVocabView } from './KoreanVocabView/KoreanVocabView';
import { KoreanGrammarView } from './KoreanGrammarView/KoreanGrammarView';
import { KoreanDialogueView } from './KoreanDialogueView/KoreanDialogueView';
import './KoreanHubView.css';

export type KoreanStage = 'hangeul' | 'vocab' | 'grammar' | 'dialogue';

export const KoreanHubView: React.FC = () => {
  const [activeStage, setActiveStage] = useState<KoreanStage>('hangeul');

  return (
    <div className="korean-hub-container">
      {/* 1. Header Banner & Thông Tin Trung Tâm */}
      <div className="kr-hub-header-banner">
        <div className="kr-hub-brand">
          <span className="kr-hub-flag">🇰🇷</span>
          <div className="kr-hub-title-text">
            <h2>Lộ Trình Học Tiếng Hàn Toàn Diện (Zero to Hero)</h2>
            <p>Học từ bảng chữ cái Hangeul, từ vựng TOPIK 1, ngữ pháp tới đàm thoại thực tế</p>
          </div>
        </div>
      </div>

      {/* 2. Thanh Điều Hướng 4 Giai Đoạn Học Tập */}
      <div className="kr-stage-tabs-row">
        <button
          type="button"
          className={`kr-stage-tab-btn ${activeStage === 'hangeul' ? 'active' : ''}`}
          onClick={() => setActiveStage('hangeul')}
        >
          <span>🔤 Giai Đoạn 1</span>
          <span>Bảng Chữ Cái Hangeul</span>
          <span className="kr-stage-badge">40 chữ</span>
        </button>

        <button
          type="button"
          className={`kr-stage-tab-btn ${activeStage === 'vocab' ? 'active' : ''}`}
          onClick={() => setActiveStage('vocab')}
        >
          <span>🎴 Giai Đoạn 2</span>
          <span>Từ Vựng TOPIK 1 SRS</span>
          <span className="kr-stage-badge">Hán-Hàn</span>
        </button>

        <button
          type="button"
          className={`kr-stage-tab-btn ${activeStage === 'grammar' ? 'active' : ''}`}
          onClick={() => setActiveStage('grammar')}
        >
          <span>📐 Giai Đoạn 3</span>
          <span>Sổ Tay Ngữ Pháp</span>
          <span className="kr-stage-badge">8 bài</span>
        </button>

        <button
          type="button"
          className={`kr-stage-tab-btn ${activeStage === 'dialogue' ? 'active' : ''}`}
          onClick={() => setActiveStage('dialogue')}
        >
          <span>💬 Giai Đoạn 4</span>
          <span>Hội Thoại & Dịch Thuật</span>
          <span className="kr-stage-badge">Dịch 2 chiều</span>
        </button>
      </div>

      {/* 3. Nội Dung Phân Hệ Tương Ứng */}
      <div className="kr-stage-content-wrap">
        {activeStage === 'hangeul' && <HangeulView />}
        {activeStage === 'vocab' && <KoreanVocabView />}
        {activeStage === 'grammar' && <KoreanGrammarView />}
        {activeStage === 'dialogue' && <KoreanDialogueView />}
      </div>
    </div>
  );
};
