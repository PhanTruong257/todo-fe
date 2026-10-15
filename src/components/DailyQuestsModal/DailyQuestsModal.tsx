import React, { useState, useEffect } from 'react';
import {
  X,
  Flame,
  Award,
  CheckCircle2,
  Sparkles,
  Calendar,
} from 'lucide-react';
import type { DailyQuest } from '../../types/korean';
import './DailyQuestsModal.css';

interface DailyQuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays?: number;
}

const STORAGE_QUESTS_KEY = 'korean_daily_quests_data';

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({
  isOpen,
  onClose,
  streakDays = 3,
}) => {
  const [quests] = useState<DailyQuest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_QUESTS_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
    }
    return [
      {
        id: 'q1',
        title: 'Học & Ôn 10 Thẻ Flashcard SRS',
        description: 'Tập trung ôn từ vựng TOPIK 1 theo thuật toán SM-2',
        icon: '🎴',
        current: 6,
        target: 10,
        isCompleted: false,
        xpReward: 50,
      },
      {
        id: 'q2',
        title: 'Lắp Ráp 1 Câu SOV Hoặc Chia Động Từ',
        description: 'Thực hành xếp đúng trật tự câu Chủ - Tân - Động',
        icon: '🧩',
        current: 1,
        target: 1,
        isCompleted: true,
        xpReward: 30,
      },
      {
        id: 'q3',
        title: 'Luyện Nói 1 Câu Bằng Micro',
        description: 'Bấm biểu tượng Mic 🎙️ và phát âm thử tiếng Hàn',
        icon: '🎙️',
        current: 1,
        target: 1,
        isCompleted: true,
        xpReward: 40,
      },
    ];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_QUESTS_KEY, JSON.stringify(quests));
    }
  }, [quests]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Tính 14 ngày gần nhất cho Heatmap
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dayStr = `${d.getDate()}/${d.getMonth() + 1}`;
    // Giả lập ngày đã học: 10 ngày gần đây
    const hasStudied = i >= 4;
    const isToday = i === 13;
    return { dayStr, hasStudied, isToday };
  });

  const totalXP = quests.filter((q) => q.isCompleted).reduce((sum, q) => sum + q.xpReward, 0);

  return (
    <div className="daily-quests-overlay" onClick={onClose}>
      <div
        className="daily-quests-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="quests-sheet-header">
          <div className="quests-title-group">
            <span style={{ fontSize: 22 }}>🔥</span>
            <div>
              <div className="quests-sheet-title">Chuỗi Chăm Chỉ & Nhiệm Vụ</div>
              <div className="quests-sheet-sub">Mỗi ngày tiến bộ 1% để chinh phục tiếng Hàn</div>
            </div>
          </div>
          <button type="button" className="quests-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Streak & XP Card */}
        <div className="quests-summary-banner">
          <div className="summary-streak-box">
            <div className="streak-fire-wrap">
              <Flame size={28} color="#f97316" className="fire-animated" />
              <span className="streak-num">{streakDays}</span>
            </div>
            <div className="streak-text-info">
              <span className="streak-title">Ngày liên tục</span>
              <span className="streak-desc">Giữ vững ngọn lửa học tập!</span>
            </div>
          </div>

          <div className="summary-xp-box">
            <Award size={24} color="#fbbf24" />
            <div className="xp-text-info">
              <span className="xp-value">+{totalXP} EXP</span>
              <span className="xp-desc">Hôm nay</span>
            </div>
          </div>
        </div>

        {/* Ma trận chăm chỉ (14-Day Heatmap) */}
        <div className="quests-heatmap-section">
          <div className="heatmap-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={13} color="#94a3b8" />
              <span className="heatmap-title">Ma trận chăm chỉ 14 ngày</span>
            </div>
            <span className="heatmap-legend">🟩 Đã học</span>
          </div>

          <div className="heatmap-grid">
            {days.map((item, idx) => (
              <div
                key={idx}
                className={`heatmap-cell ${item.hasStudied ? 'studied' : 'rest'} ${
                  item.isToday ? 'today' : ''
                }`}
                title={`${item.dayStr}: ${item.hasStudied ? 'Đã hoàn thành buổi học' : 'Nghỉ'}`}
              >
                <span className="cell-day">{item.dayStr.split('/')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danh Sách 3 Nhiệm Vụ Hàng Ngày */}
        <div className="quests-list-section">
          <div className="quests-list-title">Nhiệm Vụ Hàng Ngày ({quests.filter(q => q.isCompleted).length}/3)</div>

          <div className="quests-items-wrap">
            {quests.map((q) => {
              const progressPercent = Math.min(100, Math.round((q.current / q.target) * 100));
              return (
                <div key={q.id} className={`quest-card ${q.isCompleted ? 'completed' : ''}`}>
                  <div className="quest-icon-badge">{q.icon}</div>
                  <div className="quest-info">
                    <div className="quest-title-row">
                      <span className="quest-title">{q.title}</span>
                      <span className="quest-xp">+{q.xpReward} EXP</span>
                    </div>
                    <div className="quest-desc">{q.description}</div>
                    <div className="quest-progress-track">
                      <div
                        className="quest-progress-fill"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="quest-status-row">
                      <span>{q.current} / {q.target}</span>
                      {q.isCompleted ? (
                        <span className="status-done-badge">
                          <CheckCircle2 size={12} /> Đã đạt
                        </span>
                      ) : (
                        <span className="status-doing-badge">Đang tiến hành</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Châm ngôn cổ vũ */}
        <div className="quests-quote-box">
          <Sparkles size={14} color="#fbbf24" />
          <span>
            <em>"천 리 길도 한 걸음부터"</em> (Hành trình ngàn dặm bắt đầu từ một bước chân).
          </span>
        </div>
      </div>
    </div>
  );
};
