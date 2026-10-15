import React, { useState, useMemo } from 'react';
import {
  Volume2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Trophy,
  Zap,
} from 'lucide-react';
import { SENTENCE_BUILDER_DATA } from '../../../../constants/sentenceBuilderData';
import type { SentenceWordToken } from '../../../../types/korean';
import { speakKorean } from '../../../../constants/koreanData';
import './SentenceBuilderView.css';

export const SentenceBuilderView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState<SentenceWordToken[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [levelFilter, setLevelFilter] = useState<'all' | 'level1' | 'level2'>('all');

  const filteredSentences = useMemo(() => {
    if (levelFilter === 'all') return SENTENCE_BUILDER_DATA;
    return SENTENCE_BUILDER_DATA.filter((s) => s.level === levelFilter);
  }, [levelFilter]);

  const currentSentence = filteredSentences[currentIndex] || filteredSentences[0];

  // Các token còn lại trong pool (chưa được chọn)
  const availableTokens = useMemo(() => {
    const selectedIds = new Set(selectedTokens.map((t) => t.id));
    return currentSentence.tokens.filter((t) => !selectedIds.has(t.id));
  }, [currentSentence, selectedTokens]);

  const handleSelectToken = (token: SentenceWordToken) => {
    if (isChecked) return;
    setSelectedTokens((prev) => [...prev, token]);
  };

  const handleRemoveToken = (token: SentenceWordToken) => {
    if (isChecked) return;
    setSelectedTokens((prev) => prev.filter((t) => t.id !== token.id));
  };

  const handleReset = () => {
    setSelectedTokens([]);
    setIsChecked(false);
    setIsCorrect(false);
  };

  const handleCheck = () => {
    if (selectedTokens.length === 0) return;
    const selectedIds = selectedTokens.map((t) => t.id);
    const targetIds = currentSentence.targetTokens;

    const matches =
      selectedIds.length === targetIds.length &&
      selectedIds.every((id, idx) => id === targetIds[idx]);

    setIsChecked(true);
    setIsCorrect(matches);
    if (matches) {
      setScore((prev) => prev + 10);
      speakKorean(currentSentence.targetKorean);
    }
  };

  const handleNext = () => {
    handleReset();
    if (currentIndex < filteredSentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="sentence-builder-container">
      {/* 1. Header & Tiến độ */}
      <div className="sb-header-card">
        <div className="sb-header-left">
          <div className="sb-title-row">
            <span style={{ fontSize: 20 }}>🧩</span>
            <div>
              <div className="sb-main-title">Trình Lắp Ráp Câu SOV & Trợ Từ</div>
              <div className="sb-sub-title">Chủ ngữ ➔ Nơi chốn ➔ Tân ngữ ➔ Động từ (Động từ luôn ở cuối câu)</div>
            </div>
          </div>
        </div>

        <div className="sb-header-right">
          <div className="sb-level-filter-bar">
            {(['all', 'level1', 'level2'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`sb-lvl-chip ${levelFilter === lvl ? 'active' : ''}`}
                onClick={() => {
                  setLevelFilter(lvl);
                  setCurrentIndex(0);
                  handleReset();
                }}
              >
                {lvl === 'all' && 'Tất cả'}
                {lvl === 'level1' && 'Sơ cấp 1'}
                {lvl === 'level2' && 'Sơ cấp 2'}
              </button>
            ))}
          </div>

          <div className="sb-score-badge">
            <Trophy size={14} color="#fbbf24" />
            <span>Điểm: {score}</span>
          </div>
          <div className="sb-progress-badge">
            Câu {currentIndex + 1}/{filteredSentences.length}
          </div>
        </div>
      </div>

      {/* 2. Thẻ Đề Bài (Câu Tiếng Việt Mẫu) */}
      <div className="sb-prompt-card">
        <div className="sb-prompt-label">Dịch câu sau sang tiếng Hàn:</div>
        <div className="sb-prompt-vietnamese">"{currentSentence.vietnamese}"</div>
        <div className="sb-grammar-point-pill">
          <span>🎯 Điểm ngữ pháp: {currentSentence.grammarPoint}</span>
        </div>
      </div>

      {/* 3. Vùng Lắp Ráp Câu (Target Slots) */}
      <div className={`sb-slots-board ${isChecked ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
        <div className="sb-slots-label">
          <span>Câu tiếng Hàn bạn đã ghép ({selectedTokens.length}/{currentSentence.tokens.length}):</span>
          {selectedTokens.length > 0 && !isChecked && (
            <button type="button" className="sb-clear-btn" onClick={handleReset}>
              <RotateCcw size={12} /> Xóa làm lại
            </button>
          )}
        </div>

        <div className="sb-slots-content">
          {selectedTokens.length === 0 ? (
            <div className="sb-slots-placeholder">
              Bấm vào các khối từ bên dưới để đưa vào câu theo đúng trật tự...
            </div>
          ) : (
            selectedTokens.map((token) => (
              <button
                key={token.id}
                type="button"
                className="sb-placed-chip"
                style={{ borderColor: token.colorTag || '#f43f5e' }}
                onClick={() => handleRemoveToken(token)}
                title="Bấm để gỡ từ này"
              >
                <span className="chip-text">{token.text}</span>
                {token.rom && <span className="chip-rom">[{token.rom}]</span>}
              </button>
            ))
          )}
        </div>

        {/* Nút Nghe Câu Đầy Đủ khi đã đúng */}
        {isChecked && isCorrect && (
          <div className="sb-correct-banner">
            <div className="banner-left">
              <CheckCircle2 size={18} color="#10b981" />
              <span className="banner-text">Chính xác tuyệt đối! 🎉</span>
            </div>
            <button
              type="button"
              className="sb-listen-btn"
              onClick={() => speakKorean(currentSentence.targetKorean)}
            >
              <Volume2 size={14} /> Nghe phát âm chuẩn
            </button>
          </div>
        )}

        {/* Cảnh báo khi làm sai */}
        {isChecked && !isCorrect && (
          <div className="sb-incorrect-banner">
            <XCircle size={18} color="#ef4444" />
            <span className="banner-text">
              Chưa chính xác! Nhớ quy tắc: <strong>Động từ tiếng Hàn luôn đứng ở CUỐI CÙNG</strong>.
            </span>
          </div>
        )}
      </div>

      {/* 4. Kho Khối Từ (Available Word Blocks Pool) */}
      <div className="sb-pool-section">
        <div className="sb-pool-title">Các khối từ có sẵn (bấm để chọn):</div>
        <div className="sb-pool-grid">
          {availableTokens.map((token) => (
            <button
              key={token.id}
              type="button"
              className="sb-source-chip"
              style={{
                borderColor: token.colorTag || '#f43f5e',
                background: token.colorTag ? `${token.colorTag}15` : undefined,
              }}
              onClick={() => handleSelectToken(token)}
            >
              <span className="source-chip-text">{token.text}</span>
              {token.rom && <span className="source-chip-rom">{token.rom}</span>}
            </button>
          ))}
          {availableTokens.length === 0 && (
            <div className="sb-pool-empty-text">Đã chọn hết các khối từ! Hãy bấm "Kiểm Tra" bên dưới.</div>
          )}
        </div>
      </div>

      {/* 5. Nút Thao Tác (Kiểm Tra / Câu Tiếp Theo) */}
      <div className="sb-actions-row">
        {!isChecked ? (
          <button
            type="button"
            className="sb-btn-check"
            disabled={selectedTokens.length === 0}
            onClick={handleCheck}
          >
            <Zap size={16} />
            <span>Kiểm Tra Trật Tự Câu</span>
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            {!isCorrect && (
              <button type="button" className="sb-btn-retry" onClick={handleReset}>
                <RotateCcw size={15} />
                <span>Thử Xếp Lại</span>
              </button>
            )}
            <button type="button" className="sb-btn-next" onClick={handleNext}>
              <span>{currentIndex < filteredSentences.length - 1 ? 'Câu Tiếp Theo' : 'Hoàn Thành! Luyện Lại'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* 6. Hộp Giải Thích Sư Phạm Chi Tiết */}
      {isChecked && (
        <div className="sb-explanation-card">
          <div className="exp-title-row">
            <HelpCircle size={16} color="#fbbf24" />
            <span className="exp-title">Phân tích cú pháp & Trợ từ:</span>
          </div>
          <div className="exp-content-text">{currentSentence.explanation}</div>
          <div className="exp-formula-box">
            <strong>Câu chuẩn:</strong> {currentSentence.targetKorean}
          </div>
        </div>
      )}
    </div>
  );
};
