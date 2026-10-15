import React, { useEffect, useRef } from 'react';
import {
  Lightbulb,
  X,
  Sparkles,
  Volume2,
  Copy,
  Check,
  Search,
  Shuffle,
  CheckCircle2,
  Bookmark,
  Share2,
} from 'lucide-react';
import { useStudyAdvice } from './useStudyAdvice';
import type { StudyAdviceCategory } from '../../types/korean';
import './StudyAdviceModal.css';

interface StudyAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_TABS: { id: StudyAdviceCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'Tất Cả', icon: '🌟' },
  { id: 'mindset', label: 'Tâm Lý & Động Lực', icon: '🔥' },
  { id: 'pronunciation', label: 'Chữ Cái & Phát Âm', icon: '🔤' },
  { id: 'vocab', label: 'Gốc Hán & Từ Vựng', icon: '🌳' },
  { id: 'grammar', label: 'Ngữ Pháp & Phản Xạ', icon: '💬' },
];

export const StudyAdviceModal: React.FC<StudyAdviceModalProps> = ({ isOpen, onClose }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    appliedAdviceIds,
    toggleApplyAdvice,
    spotlightItem,
    rollRandomAdvice,
    filteredList,
    copyAdvice,
    copiedId,
    speakKorean,
    totalCount,
    appliedCount,
    progressPercent,
  } = useStudyAdvice();

  const modalRef = useRef<HTMLDivElement>(null);

  // Đóng khi ấn Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Khóa scroll body khi mở modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isSpotlightApplied = appliedAdviceIds.includes(spotlightItem.id);

  return (
    <div className="advice-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="advice-modal-container"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. HEADER MODAL */}
        <div className="advice-modal-header">
          <div className="advice-header-left">
            <div className="advice-header-icon-glow">
              <Lightbulb size={22} className="bulb-icon" />
            </div>
            <div>
              <h2 className="advice-modal-title">Bí Quyết & Động Lực Học Tiếng Hàn</h2>
              <p className="advice-modal-subtitle">
                Cẩm nang sư phạm thực chiến & truyền cảm hứng giúp bạn học nhanh, nhớ lâu
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-advice-close"
            onClick={onClose}
            aria-label="Đóng popup"
            title="Đóng (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* 2. BODY CUỘN MƯỢT MÀ */}
        <div className="advice-modal-body">
          {/* Thanh Tiến Độ Thói Quen Học Tập Thông Minh */}
          <div className="advice-progress-card">
            <div className="advice-progress-top">
              <div className="advice-progress-label">
                <Bookmark size={15} color="#fbbf24" />
                <span>Tiến Độ Làm Chủ Thói Quen Học:</span>
                <strong>
                  {appliedCount}/{totalCount} bí quyết ({progressPercent}%)
                </strong>
              </div>
              <span className="advice-progress-status-badge">
                {progressPercent === 100
                  ? '🏆 Xuất sắc!'
                  : progressPercent >= 50
                  ? '🚀 Đang bứt phá'
                  : '🌱 Khởi đầu tốt'}
              </span>
            </div>
            <div className="advice-progress-track">
              <div
                className="advice-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* SPOTLIGHT: LỜI KHUYÊN NỔI BẬT HÔM NAY */}
          {spotlightItem && (
            <div className="advice-spotlight-card">
              <div className="spotlight-top-bar">
                <div className="spotlight-badge">
                  <Sparkles size={14} />
                  <span>Lời Khuyên Truyền Cảm Hứng Hôm Nay</span>
                </div>
                <button
                  type="button"
                  className="btn-spotlight-roll"
                  onClick={rollRandomAdvice}
                  title="Đổi lời khuyên ngẫu nhiên khác"
                >
                  <Shuffle size={14} />
                  <span>Đổi ngẫu nhiên 🎲</span>
                </button>
              </div>

              {spotlightItem.proverbKo && (
                <div className="spotlight-proverb-box">
                  <div className="proverb-ko-row">
                    <span className="proverb-text-ko">"{spotlightItem.proverbKo}"</span>
                    <button
                      type="button"
                      className="btn-mini-audio"
                      onClick={() => speakKorean(spotlightItem.audioText || spotlightItem.proverbKo!)}
                      title="Nghe phát âm chuẩn tiếng Hàn"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                  <div className="proverb-text-vi">({spotlightItem.proverbVi})</div>
                </div>
              )}

              <h3 className="spotlight-title">
                {spotlightItem.icon} {spotlightItem.title}
              </h3>
              <p className="spotlight-core-desc">{spotlightItem.coreAdvice}</p>

              <div className="spotlight-action-box">
                <div className="action-tag">🎯 Hành Động Ngay:</div>
                <div className="action-content">{spotlightItem.actionItem}</div>
              </div>

              <div className="spotlight-footer-actions">
                <button
                  type="button"
                  className={`btn-apply-advice ${isSpotlightApplied ? 'applied' : ''}`}
                  onClick={() => toggleApplyAdvice(spotlightItem.id)}
                >
                  {isSpotlightApplied ? (
                    <>
                      <CheckCircle2 size={16} color="#10b981" />
                      <span>Đã Áp Dụng Thói Quen Này</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Đánh Dấu Sẽ Áp Dụng</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-copy-advice"
                  onClick={() => copyAdvice(spotlightItem)}
                  title="Sao chép lời khuyên để lưu lại hoặc chia sẻ"
                >
                  {copiedId === spotlightItem.id ? (
                    <>
                      <Check size={15} color="#10b981" />
                      <span style={{ color: '#10b981' }}>Đã Chép!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={15} />
                      <span>Chia Sẻ / Lưu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* THANH ĐIỀU HƯỚNG TABS THEO CHỦ ĐỀ */}
          <div className="advice-tabs-nav-bar">
            <div className="advice-category-chips">
              {CATEGORY_TABS.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`advice-chip-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(tab.id)}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Ô tìm kiếm từ khóa */}
            <div className="advice-search-wrap">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                className="advice-search-input"
                placeholder="Tìm bí quyết, từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* DANH SÁCH THẺ LỜI KHUYÊN (ADVICE CARDS GRID) */}
          <div className="advice-cards-grid">
            {filteredList.map((item) => {
              const isApplied = appliedAdviceIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`advice-card-item ${isApplied ? 'is-applied' : ''}`}
                >
                  {/* Card Header */}
                  <div className="advice-card-top">
                    <div className="card-badge-group">
                      <span className="card-item-icon">{item.icon}</span>
                      <span className="card-category-badge">{item.categoryLabel}</span>
                      <span className="card-tag-badge">{item.badge}</span>
                    </div>

                    <div className="card-actions-right">
                      {item.proverbKo && (
                        <button
                          type="button"
                          className="btn-mini-sound-icon"
                          onClick={() => speakKorean(item.audioText || item.proverbKo!)}
                          title="Nghe câu tiếng Hàn"
                        >
                          <Volume2 size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-mini-copy-icon"
                        onClick={() => copyAdvice(item)}
                        title="Sao chép lời khuyên này"
                      >
                        {copiedId === item.id ? (
                          <Check size={14} color="#10b981" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Châm ngôn tiếng Hàn nếu có */}
                  {item.proverbKo && (
                    <div className="card-proverb-pill">
                      <span className="pill-ko">"{item.proverbKo}"</span>
                      <span className="pill-vi">— {item.proverbVi}</span>
                    </div>
                  )}

                  {/* Tiêu đề & Nội dung */}
                  <h4 className="advice-card-title">{item.title}</h4>
                  <p className="advice-card-core-text">{item.coreAdvice}</p>

                  {/* Hộp hành động */}
                  <div className="advice-action-mini-box">
                    <strong>🎯 Hành động:</strong>
                    <span>{item.actionItem}</span>
                  </div>

                  {/* Nút Toggle Đã Áp Dụng */}
                  <div className="advice-card-footer">
                    <button
                      type="button"
                      className={`btn-card-toggle-applied ${isApplied ? 'applied' : ''}`}
                      onClick={() => toggleApplyAdvice(item.id)}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 size={15} color="#10b981" />
                          <span>Đã Áp Dụng Thói Quen</span>
                        </>
                      ) : (
                        <>
                          <Check size={15} />
                          <span>Áp Dụng Bí Quyết Này</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredList.length === 0 && (
            <div className="advice-empty-state">
              <div style={{ fontSize: 32 }}>🔍</div>
              <p>Không tìm thấy lời khuyên phù hợp với từ khóa "{searchQuery}".</p>
              <button
                type="button"
                className="btn-reset-filters"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyAdviceModal;
