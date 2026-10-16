import React from 'react';
import {
  Zap,
  Timer,
  Flame,
  Trophy,
  Play,
  Volume2,
  RotateCcw,
  Share2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useSpeedRush } from './useSpeedRush';
import './SpeedRushGame.css';

interface SpeedRushGameProps {
  onOpenCardModal?: (score: number) => void;
}

export const SpeedRushGame: React.FC<SpeedRushGameProps> = ({ onOpenCardModal }) => {
  const {
    gameState,
    timeLeft,
    score,
    combo,
    correctCount,
    totalAnswered,
    bestScore,
    currentQuestion,
    selectedAnswer,
    isAnswerLocked,
    resultRecord,
    confettiCanvasRef,
    startGame,
    handleSelectAnswer,
    handleSpeakCurrent,
  } = useSpeedRush(onOpenCardModal);

  const timerRatio = (timeLeft / 60) * 100;
  const isWarningTime = timeLeft <= 10;

  return (
    <div className="speed-rush-arena">
      {/* 1. Header Banner */}
      <div className="sr-header-banner">
        <div className="sr-banner-info">
          <div className="sr-banner-title">
            <span>Đấu Trường Phản Xạ 60 Giây</span>
            <span className="sr-banner-badge">
              <Zap size={11} /> Speed Rush
            </span>
          </div>
          <p className="sr-banner-desc">
            Trả lời nhanh các câu hỏi bảng chữ cái & từ vựng trong 60 giây. Duy trì streak để nhân bội điểm số!
          </p>
        </div>
        <div className="sr-best-score-chip">
          <span className="sr-best-label">Kỷ Lục Cao Nhất</span>
          <span className="sr-best-val">
            <Trophy size={14} style={{ display: 'inline', marginRight: 4 }} />
            {bestScore} pts
          </span>
        </div>
      </div>

      {/* 2. Màn Hình Lobby Chờ Bắt Đầu */}
      {gameState === 'lobby' && (
        <div className="sr-lobby-card">
          <div className="sr-lobby-visual">⚡</div>
          <h3 className="sr-lobby-title">Bạn đã sẵn sàng bứt phá phản xạ?</h3>
          <div className="sr-lobby-rules">
            <div className="sr-rule-item">
              <span className="sr-rule-icon">⏱️</span>
              <span className="sr-rule-title">60 Giây Rực Lửa</span>
              <span className="sr-rule-desc">Thời gian đếm ngược liên tục không ngừng</span>
            </div>
            <div className="sr-rule-item">
              <span className="sr-rule-icon">🔥</span>
              <span className="sr-rule-title">Chuỗi Combo x2 ~ x5</span>
              <span className="sr-rule-desc">Đúng liên tiếp nhân số điểm chóng mặt</span>
            </div>
            <div className="sr-rule-item">
              <span className="sr-rule-icon">🏆</span>
              <span className="sr-rule-title">Hạng S Vinh Quang</span>
              <span className="sr-rule-desc">Đạt trên 350 điểm để mở thẻ K-Card độc quyền</span>
            </div>
          </div>

          <button type="button" className="btn-start-rush" onClick={startGame}>
            <Play size={18} />
            <span>Bắt Đầu Thử Thách Ngay!</span>
          </button>
        </div>
      )}

      {/* 3. Bàn Chơi Khi Đang Chạy 60s */}
      {gameState === 'playing' && (
        <div className="sr-active-game-board">
          <div className="sr-hud-row">
            <div className="sr-hud-timer">
              <Timer size={18} className={isWarningTime ? 'sr-timer-badge warning' : ''} />
              <span className={`sr-timer-badge ${isWarningTime ? 'warning' : ''}`}>{timeLeft}s</span>
              <div className="sr-timer-bar-wrap">
                <div
                  className={`sr-timer-bar-fill ${isWarningTime ? 'warning' : ''}`}
                  style={{ width: `${timerRatio}%` }}
                />
              </div>
            </div>

            <div className="sr-hud-stats">
              {combo >= 2 && (
                <div className="sr-combo-badge">
                  <Flame size={13} />
                  <span>Combo x{combo >= 10 ? '5' : combo >= 6 ? '3' : '2'}</span>
                </div>
              )}
              <div className="sr-hud-stat-item">
                <span className="sr-stat-label">Điểm Số</span>
                <span className="sr-stat-val score">{score}</span>
              </div>
            </div>
          </div>

          {/* Card Câu Hỏi */}
          <div className="sr-question-card">
            <span className="sr-q-category-tag">
              {currentQuestion.category === 'hangeul' && '🔤 Chữ Cái Hangeul'}
              {currentQuestion.category === 'vocab' && '🎴 Từ Vựng Nhanh'}
              {currentQuestion.category === 'culture' && '🇰🇷 Văn Hóa Hàn'}
              {currentQuestion.category === 'numbers' && '🔢 Chữ Số Hàn'}
              {currentQuestion.category === 'quick_reply' && '💬 Phản Xạ Giao Tiếp'}
            </span>

            <div className="sr-q-prompt-box">
              <h3 className="sr-q-prompt-text">{currentQuestion.prompt}</h3>
              <button
                type="button"
                className="btn-speak-q"
                onClick={handleSpeakCurrent}
                title="Nghe phát âm"
              >
                <Volume2 size={18} />
              </button>
            </div>

            <div className="sr-options-grid">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQuestion.correctIndex;

                let optClass = 'sr-option-btn';
                if (isAnswerLocked) {
                  if (isSelected && isCorrect) optClass += ' correct';
                  else if (isSelected && !isCorrect) optClass += ' wrong';
                  else if (isCorrect) optClass += ' correct';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={optClass}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={isAnswerLocked}
                  >
                    <span className="sr-option-key">{String.fromCharCode(65 + idx)}</span>
                    <span className="sr-option-text">{opt}</span>
                    {isAnswerLocked && isSelected && isCorrect && (
                      <CheckCircle2 size={16} style={{ marginLeft: 'auto', color: '#10b981' }} />
                    )}
                    {isAnswerLocked && isSelected && !isCorrect && (
                      <XCircle size={16} style={{ marginLeft: 'auto', color: '#ef4444' }} />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswerLocked && currentQuestion.explanation && (
              <div className="sr-explanation-banner">
                <span>💡 {currentQuestion.explanation}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Màn Hình Kết Thúc Game */}
      {gameState === 'ended' && resultRecord && (
        <div className="sr-game-over-modal">
          <canvas ref={confettiCanvasRef} className="sr-confetti-canvas" />

          <div className={`sr-result-rank-badge rank-${resultRecord.rank.toLowerCase()}`}>
            {resultRecord.rank}
          </div>

          <h3 className="sr-lobby-title">
            {resultRecord.rank === 'S' && 'Tuyệt Đỉnh Cao Thủ! Phản Xạ Thần Sầu ⚡'}
            {resultRecord.rank === 'A' && 'Xuất Sắc! Tốc Độ Đáng Kinh Ngạc 🌸'}
            {resultRecord.rank === 'B' && 'Khá Lắm! Bạn Đang Tiến Bộ Rất Nhanh 🎯'}
            {resultRecord.rank === 'C' && 'Cố Gắng Lên! Luyện Tập Đều Tay Nhé 💪'}
          </h3>

          <div className="sr-result-stats-grid">
            <div className="sr-result-stat-card">
              <span className="sr-stat-label">Tổng Điểm</span>
              <span className="sr-stat-val score">{resultRecord.score}</span>
            </div>
            <div className="sr-result-stat-card">
              <span className="sr-stat-label">Max Combo</span>
              <span className="sr-stat-val" style={{ color: '#f97316' }}>
                x{resultRecord.maxCombo}
              </span>
            </div>
            <div className="sr-result-stat-card">
              <span className="sr-stat-label">Độ Chuẩn Xác</span>
              <span className="sr-stat-val" style={{ color: '#10b981' }}>
                {resultRecord.accuracy}%
              </span>
            </div>
            <div className="sr-result-stat-card">
              <span className="sr-stat-label">Số Câu Đúng</span>
              <span className="sr-stat-val">
                {correctCount}/{totalAnswered}
              </span>
            </div>
          </div>

          <div className="sr-action-buttons">
            <button type="button" className="btn-start-rush" onClick={startGame}>
              <RotateCcw size={18} />
              <span>Thử Thách Lại</span>
            </button>
            {onOpenCardModal && (
              <button
                type="button"
                className="btn-secondary-game"
                onClick={() => onOpenCardModal(resultRecord.score)}
              >
                <Share2 size={16} />
                <span>Xuất Thẻ Khoe Thành Tích</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
