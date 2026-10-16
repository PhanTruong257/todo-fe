import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Trophy,
  Sparkles,
  Zap,
  CheckCircle2,
  Flame,
  Award,
} from 'lucide-react';
import { TONGUE_TWISTERS } from '../../../../constants/tongueTwisterData';
import type { TongueTwisterItem } from '../../../../constants/tongueTwisterData';
import { speakKorean } from '../../../../constants/koreanData';
import { useKoreanSpeech } from '../../../../hooks/useKoreanSpeech';
import { playChimeSound } from '../../../../utils/audio';
import './TongueTwisterView.css';

interface TongueTwisterViewProps {
  hideRomanization?: boolean;
}

const STORAGE_KEY_CONQUERED = 'korean_conquered_twisters';

export const TongueTwisterView: React.FC<TongueTwisterViewProps> = ({
  hideRomanization = false,
}) => {
  const [selectedId, setSelectedId] = useState<string>(TONGUE_TWISTERS[0].id);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [conqueredIds, setConqueredIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_CONQUERED) || '[]');
      } catch {
        return [];
      }
    }
    return [];
  });

  const {
    isListening,
    transcript,
    accuracyScore,
    feedbackMessage,
    error: speechError,
    startListening,
    stopListening,
  } = useKoreanSpeech();

  const currentTwister: TongueTwisterItem =
    TONGUE_TWISTERS.find((t) => t.id === selectedId) || TONGUE_TWISTERS[0];

  const isCurrentConquered = conqueredIds.includes(currentTwister.id);

  // Xử lý khi bắt đầu thử thách giọng nói
  const handleStartChallenge = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(currentTwister.korean);
    }
  };

  // Đánh dấu hoàn thành khi đạt điểm cao (>= 75%)
  React.useEffect(() => {
    if (accuracyScore !== null && accuracyScore >= 75 && !conqueredIds.includes(currentTwister.id)) {
      const updated = [...conqueredIds, currentTwister.id];
      setConqueredIds(updated);
      localStorage.setItem(STORAGE_KEY_CONQUERED, JSON.stringify(updated));
      playChimeSound();
    }
  }, [accuracyScore, currentTwister.id, conqueredIds]);

  return (
    <div className="tongue-twister-container">
      {/* 1. HERO BANNER */}
      <div className="tt-hero-card">
        <div className="tt-hero-left">
          <div className="tt-hero-badge">
            <Zap size={13} color="#f59e0b" />
            <span>Thử Thách Cơ Miệng Siêu Tốc</span>
          </div>
          <h3 className="tt-hero-title">
            Uốn Lưỡi Tiếng Hàn - 잰말놀이 Challenge 👅⚡
          </h3>
          <p className="tt-hero-desc">
            Bí quyết luyện phát âm đanh chắc, dẻo lưỡi và chuẩn xác như phát thanh viên đài truyền hình Seoul.
          </p>
        </div>

        {/* Thống kê tiến độ */}
        <div className="tt-progress-pill">
          <Trophy size={14} color="#f59e0b" />
          <span>
            Đã Chinh Phục: <strong>{conqueredIds.length}</strong> / {TONGUE_TWISTERS.length} Câu
          </span>
        </div>
      </div>

      {/* 2. THANH CHỌN CÂU THỬ THÁCH */}
      <div className="tt-selector-bar">
        {TONGUE_TWISTERS.map((t) => {
          const isSelected = t.id === currentTwister.id;
          const isDone = conqueredIds.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              className={`tt-selector-btn ${isSelected ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => {
                setSelectedId(t.id);
                stopListening();
              }}
            >
              <span className="tt-btn-level">Cấp {t.levelNumber}</span>
              <span className="tt-btn-title">{t.title.split('(')[0].trim()}</span>
              {isDone && <CheckCircle2 size={13} className="tt-btn-check" />}
            </button>
          );
        })}
      </div>

      {/* 3. THẺ THỬ THÁCH CHÍNH */}
      <div className="tt-main-card">
        {/* Header thẻ: Cấp độ + Huy hiệu */}
        <div className="tt-card-header">
          <div className="tt-level-pill" style={{ borderColor: currentTwister.levelColor, color: currentTwister.levelColor }}>
            <Flame size={13} />
            <span>{currentTwister.levelName}</span>
          </div>

          <div className="tt-reward-badge">
            <Award size={13} color="#f59e0b" />
            <span>
              {isCurrentConquered
                ? `✅ Đã Chinh Phục: ${currentTwister.rewardBadge}`
                : currentTwister.rewardBadge}
            </span>
          </div>
        </div>

        {/* Câu tiếng Hàn lớn */}
        <div className="tt-korean-box">
          <div className="tt-korean-text">{currentTwister.korean}</div>

          {!hideRomanization && (
            <div className="tt-roman-text">{currentTwister.romanization}</div>
          )}

          <div className="tt-vietnamese-text">"{currentTwister.vietnamese}"</div>
        </div>

        {/* Phân tích khẩu hình & Âm dễ nhầm */}
        <div className="tt-phonetic-analysis-row">
          <div className="tt-phonetic-tip">
            <div className="tt-tip-header">
              <Sparkles size={12} color="#f43f5e" />
              <span>Mẹo Đặt Khẩu Hình:</span>
            </div>
            <p>{currentTwister.pronunciationTip}</p>
          </div>

          <div className="tt-target-sounds">
            <span className="sounds-label">Cụm Âm Luyện Tập:</span>
            <div className="sounds-chips">
              {currentTwister.targetSounds.map((snd, idx) => (
                <span key={idx} className="sound-chip">
                  {snd}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4. ĐIỀU KHIỂN PHÁT ÂM MẪU (3 TỐC ĐỘ) */}
        <div className="tt-audio-control-bar">
          <span className="audio-control-label">Nghe Người Bản Xứ Đọc:</span>

          <div className="tt-speed-buttons">
            <button
              type="button"
              className={`btn-speed ${playbackSpeed === 0.75 ? 'active' : ''}`}
              onClick={() => {
                setPlaybackSpeed(0.75);
                speakKorean(currentTwister.korean, 0.75);
              }}
              title="Tốc độ chậm để nắm rõ khẩu hình"
            >
              🐢 0.75x (Chậm)
            </button>
            <button
              type="button"
              className={`btn-speed ${playbackSpeed === 1.0 ? 'active' : ''}`}
              onClick={() => {
                setPlaybackSpeed(1.0);
                speakKorean(currentTwister.korean, 1.0);
              }}
              title="Tốc độ chuẩn người Hàn"
            >
              🐇 1.0x (Chuẩn)
            </button>
            <button
              type="button"
              className={`btn-speed fast ${playbackSpeed === 1.35 ? 'active' : ''}`}
              onClick={() => {
                setPlaybackSpeed(1.35);
                speakKorean(currentTwister.korean, 1.35);
              }}
              title="Tốc độ thách thức cực nhanh"
            >
              🐆 1.35x (Siêu Tốc)
            </button>
          </div>

          <button
            type="button"
            className="btn-replay-audio"
            onClick={() => speakKorean(currentTwister.korean, playbackSpeed)}
            title="Nghe lại"
          >
            <Volume2 size={16} />
            <span>Nghe Lại</span>
          </button>
        </div>

        {/* 5. THỬ THÁCH GIỌNG NÓI MICROPHONE */}
        <div className="tt-challenge-mic-section">
          <div className="tt-mic-top">
            <div className="mic-instructions">
              <strong>🎙️ Thử Thách Phát Âm Vào Micro:</strong>
              <p>Bấm nút bên dưới và đọc to câu líu lưỡi trên. AI sẽ chấm điểm độ chính xác cho bạn!</p>
            </div>

            <button
              type="button"
              className={`btn-challenge-mic ${isListening ? 'listening' : ''}`}
              onClick={handleStartChallenge}
              title={isListening ? 'Đang nghe... bấm để dừng' : 'Bắt đầu đọc thử thách'}
            >
              {isListening ? (
                <>
                  <MicOff size={18} />
                  <span>Đang Nghe... (Bấm Dừng)</span>
                </>
              ) : (
                <>
                  <Mic size={18} />
                  <span>Bắt Đầu Thử Thách 🎙️</span>
                </>
              )}
            </button>
          </div>

          {/* Trạng thái & Kết quả nhận diện */}
          {transcript && (
            <div className="tt-speech-result-box">
              <div className="speech-result-top">
                <span className="result-label">Giọng nói bạn vừa đọc:</span>
                {accuracyScore !== null && (
                  <span
                    className={`accuracy-score-badge ${
                      accuracyScore >= 75 ? 'high' : accuracyScore >= 50 ? 'med' : 'low'
                    }`}
                  >
                    Độ Chính Xác: {accuracyScore}%
                  </span>
                )}
              </div>
              <div className="spoken-transcript">"{transcript}"</div>

              {feedbackMessage && (
                <div
                  className={`feedback-msg ${
                    accuracyScore !== null && accuracyScore >= 75 ? 'success' : 'encourage'
                  }`}
                >
                  {accuracyScore !== null && accuracyScore >= 75 ? '🎉 ' : '💪 '}
                  {feedbackMessage}
                </div>
              )}

              {accuracyScore !== null && accuracyScore >= 75 && (
                <div className="conquer-banner">
                  <Trophy size={18} color="#f59e0b" />
                  <span>
                    Chúc mừng! Bạn đã chinh phục thành công <strong>{currentTwister.title}</strong>!
                  </span>
                </div>
              )}
            </div>
          )}

          {speechError && (
            <div className="tt-speech-error-box">
              <p>{speechError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
