import React from 'react';
import { ArrowUp, BookOpen, Layers, Sparkles, CheckCircle2, Heart, Lightbulb } from 'lucide-react';
import { KOREAN_STAGES } from '../Header/Header';
import type { KoreanStage } from '../Header/Header';
import './Footer.css';

interface FooterProps {
  currentStage?: KoreanStage;
  onSelectStage?: (stage: KoreanStage) => void;
  activeTab?: 'korean' | 'flashcards';
  onTabChange?: (tab: 'korean' | 'flashcards') => void;
  onOpenAdvice?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentStage = 'hangeul',
  onSelectStage,
  activeTab = 'korean',
  onTabChange,
  onOpenAdvice,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStageClick = (stageId: KoreanStage) => {
    if (onSelectStage) {
      onSelectStage(stageId);
    }
    if (onTabChange && activeTab !== 'korean') {
      onTabChange('korean');
    }
    scrollToTop();
  };

  return (
    <footer className="taskflow-footer">
      {/* 1. Phần Đầu Footer: Thương Hiệu & Nút Cuộn Lên */}
      <div className="footer-top-row">
        <div className="footer-brand">
          <div className="footer-logo-badge">
            <span className="footer-logo-han">한</span>
          </div>
          <div className="footer-brand-info">
            <div className="footer-brand-title">
              <strong>TaskFlow Korean</strong>
              <span className="footer-version-tag">v1.0.18 • TOPIK 1</span>
            </div>
            <p className="footer-brand-desc">
              Hệ thống tự học tiếng Hàn thông minh từ con số 0 dành riêng cho người Việt.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-footer-scroll-top"
          onClick={scrollToTop}
          title="Cuộn lên đầu trang"
        >
          <ArrowUp size={15} />
          <span>Lên đầu trang</span>
        </button>
      </div>

      {/* 2. Phần Thân Footer: 3 Cột Thông Tin Đẹp Mắt */}
      <div className="footer-grid">
        {/* Cột 1: 4 Giai Đoạn Học Tập */}
        <div className="footer-col">
          <h4 className="footer-col-title">
            <Layers size={15} className="col-icon" />
            <span>4 Giai Đoạn Luyện Tập</span>
          </h4>
          <ul className="footer-stages-list">
            {KOREAN_STAGES.map((s) => {
              const isActive = activeTab === 'korean' && currentStage === s.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`footer-stage-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleStageClick(s.id)}
                  >
                    <span className="stage-link-icon">{s.icon}</span>
                    <span className="stage-link-title">{s.fullTitle}</span>
                    {isActive && (
                      <span className="stage-active-badge">
                        <CheckCircle2 size={11} /> Đang học
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Cột 2: Tính Năng Cốt Lõi */}
        <div className="footer-col">
          <h4 className="footer-col-title">
            <Sparkles size={15} className="col-icon" />
            <span>Tính Năng Trọng Tâm</span>
          </h4>
          <div className="footer-feature-chips">
            <span className="footer-chip">🌸 Giao diện tone hồng K-Pastel</span>
            <span className="footer-chip">🎵 Lời bài hát K-Pop & K-Drama</span>
            <span className="footer-chip">👅 Thử thách uốn lưỡi (잰말놀이)</span>
            <span className="footer-chip">📅 Lộ trình 30 ngày (240 từ TOPIK 1)</span>
            <span className="footer-chip">⚡ Thuật toán SM-2 Active Recall</span>
            <span className="footer-chip">⌨️ Trình giả lập gõ 2-Set (두벌식)</span>
            <span className="footer-chip">🔊 Phát âm giọng đọc chuẩn bản xứ</span>
            <span className="footer-chip">👁️ Toggle ẩn/hiện phiên âm Latin</span>
            <span className="footer-chip">✍️ Viết tên bạn bằng chữ Hangeul</span>
          </div>
        </div>

        {/* Cột 3: Châm Ngôn & Động Lực */}
        <div className="footer-col">
          <h4 className="footer-col-title">
            <BookOpen size={15} className="col-icon" />
            <span>Châm Ngôn Học Tập</span>
          </h4>
          <div className="footer-quote-box">
            <div className="quote-korean">"천 리 길도 한 걸음부터"</div>
            <div className="quote-vietnamese">
              (Hành trình vạn dặm bắt đầu từ một bước chân đầu tiên)
            </div>
            <div className="quote-sub">
              Mỗi ngày 15 phút kiên trì tích lũy từng âm tiết Hangeul và từ vựng TOPIK 1 để tạo nền móng vững chắc nhất.
            </div>
            {onOpenAdvice && (
              <button
                type="button"
                className="btn-footer-open-advice"
                onClick={onOpenAdvice}
                title="Mở Cẩm Nang Bí Quyết & Lời Khuyên Học Tốt"
              >
                <Lightbulb size={13} color="#fbbf24" />
                <span>16 Bí Quyết & Động Lực Học</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Phần Đáy Footer: Bản Quyền & Trạng Thái */}
      <div className="footer-bottom-bar">
        <div className="footer-copyright">
          <span>© 2026 TaskFlow Korean</span>
          <span className="footer-dot">•</span>
          <span>Dành cho người Việt tự học tiếng Hàn</span>
          <span className="footer-dot">•</span>
          <span className="footer-status-pill">
            <span className="status-indicator"></span> 100% Mobile Responsive
          </span>
        </div>

        <div className="footer-made-with">
          <span>Được tối ưu với</span>
          <Heart size={13} className="heart-icon" />
          <span>Local First & AWS CloudFront Live</span>
        </div>
      </div>
    </footer>
  );
};
