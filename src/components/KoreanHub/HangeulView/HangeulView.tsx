import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  Layers,
  RotateCw,
  Trophy,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Keyboard as KeyboardIcon,
  BookOpen,
  Eye,
  EyeOff,
  ArrowRight,
  Delete,
  RefreshCw,
  Sliders,
  Check,
  Compass,
  Award,
  Copy,
  Search,
  Lightbulb,
} from 'lucide-react';
import { useHangeulView } from './useHangeulView';
import type { KoreanLetterType } from '../../../types/korean';
import './HangeulView.css';

export const HangeulView: React.FC = () => {
  const {
    subTab,
    setSubTab,
    hideRomanization,
    toggleHideRomanization,
    // 1. Lộ trình 5 ngày
    journeyDays,
    currentDay,
    selectJourneyDay,
    journeyStage,
    setJourneyStage,
    completedDays,
    activeDayLesson,
    journeyQuizAnswers,
    journeyQuizChecked,
    handleSelectQuizAnswer,
    checkJourneyQuiz,
    finishCurrentDay,
    // 2. Viết tên tiếng Việt
    nameSearch,
    setNameSearch,
    filteredNames,
    selectedNameGuide,
    setSelectedNameGuide,
    // 3. Bảng chữ cái tra cứu
    selectedFilter,
    setSelectedFilter,
    selectedLetter,
    setSelectedLetter,
    filteredLetters,
    // 4. Patchim & Pronunciation
    patchimRules,
    selectedPatchim,
    setSelectedPatchim,
    pronunciationRules,
    // Minimal Pairs
    pairCategory,
    setPairCategory,
    filteredMinimalPairs,
    // Syllable Builder
    initialConsonant,
    setInitialConsonant,
    medialVowel,
    setMedialVowel,
    finalConsonant,
    setFinalConsonant,
    composedChar,
    INITIAL_CONSONANTS,
    MEDIAL_VOWELS,
    FINAL_CONSONANTS,
    speakKorean,
    // Keyboard Trainer
    keyboardLayout,
    practiceWords,
    currentPracticeWord,
    practiceWordIndex,
    setPracticeWordIndex,
    typedText,
    activeKey,
    isShiftActive,
    setIsShiftActive,
    isWordMatched,
    handleInputKoChar,
    handleBackspace,
    handleClearTyped,
    // Quiz
    currentQuiz,
    quizIndex,
    totalQuiz,
    score,
    selectedAnswer,
    isAnswerChecked,
    quizCompleted,
    handleSelectAnswer,
    handleNextQuiz,
    restartQuiz,
  } = useHangeulView();

  const [copiedName, setCopiedName] = useState(false);

  const handleCopyName = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedName(true);
      setTimeout(() => setCopiedName(false), 2000);
    }
  };

  return (
    <div className="hangeul-container">
      {/* 1. THANH CHUYỂN ĐỔI CHẾ ĐỘ HANGEUL */}
      <div className="hangeul-nav-bar">
        <div className="hangeul-subtabs">
          <button
            type="button"
            className={`hangeul-tab-btn ${subTab === 'journey' ? 'active' : ''}`}
            onClick={() => setSubTab('journey')}
          >
            <Compass size={14} />
            Lộ Trình 5 Ngày (Vỡ Lòng) 🚀
          </button>
          <button
            type="button"
            className={`hangeul-tab-btn ${subTab === 'name_card' ? 'active' : ''}`}
            onClick={() => setSubTab('name_card')}
          >
            <Award size={14} />
            Tên Bạn Bằng Hangeul ✍️
          </button>
          <button
            type="button"
            className={`hangeul-tab-btn ${subTab === 'chart' ? 'active' : ''}`}
            onClick={() => setSubTab('chart')}
          >
            <Layers size={14} />
            Bảng Tra Cứu (40)
          </button>
          <button
            type="button"
            className={`hangeul-tab-btn ${subTab === 'patchim' ? 'active' : ''}`}
            onClick={() => setSubTab('patchim')}
          >
            <BookOpen size={14} />
            Patchim & Biến Âm
          </button>
          <button
            type="button"
            className={`hangeul-tab-btn ${subTab === 'minimal_pairs' ? 'active' : ''}`}
            onClick={() => setSubTab('minimal_pairs')}
          >
            <Sliders size={14} />
            Cặp Âm Tối Thiểu 🎯
          </button>
          <button
            type="button"
            className={`hangeul-tab-btn ${subTab === 'builder' ? 'active' : ''}`}
            onClick={() => setSubTab('builder')}
          >
            <Sparkles size={14} />
            Ghép Vần Khối
          </button>
          <button
            type="button"
            className={`hangeul-tab-btn ${subTab === 'keyboard' ? 'active' : ''}`}
            onClick={() => setSubTab('keyboard')}
          >
            <KeyboardIcon size={14} />
            Bộ Gõ IME 2-Set ⌨️
          </button>
          <button
            type="button"
            className={`hangeul-tab-btn ${subTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setSubTab('quiz')}
          >
            <HelpCircle size={14} />
            Quiz Phản Xạ
          </button>
        </div>

        {/* Nút Toggle Phiên Âm */}
        <button
          type="button"
          className={`hangeul-roman-toggle-btn ${hideRomanization ? 'hidden-mode' : ''}`}
          onClick={toggleHideRomanization}
          title={hideRomanization ? 'Đang ẩn phiên âm Latin' : 'Đang hiện phiên âm Latin'}
        >
          {hideRomanization ? <EyeOff size={13} color="#f43f5e" /> : <Eye size={13} color="#38bdf8" />}
          <span>{hideRomanization ? 'Ẩn Phiên Âm' : 'Hiện Phiên Âm'}</span>
        </button>
      </div>

      {/* ==========================================
          CHẾ ĐỘ MỚI CỐT LÕI: LỘ TRÌNH 5 NGÀY VỠ LÒNG
          ========================================== */}
      {subTab === 'journey' && (
        <div className="hangeul-journey-stage">
          {/* Thanh chọn 5 ngày học */}
          <div className="journey-days-selector-bar">
            {journeyDays.map((l) => {
              const isCurrent = l.day === currentDay;
              const isDone = completedDays.includes(l.day);
              return (
                <button
                  key={l.day}
                  type="button"
                  className={`journey-day-pill ${isCurrent ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                  onClick={() => selectJourneyDay(l.day)}
                >
                  <div className="day-number-tag">
                    {isDone ? <Check size={12} color="#10b981" /> : `Ngày ${l.day}`}
                  </div>
                  <div className="day-pill-title">{l.title.split(':')[1]?.trim() || l.title}</div>
                </button>
              );
            })}
          </div>

          {/* Header ngày học hiện tại */}
          <div className="journey-current-header-card">
            <div className="journey-header-top">
              <span className="journey-badge-pill">
                ⭐ {activeDayLesson.title} • Thời lượng: {activeDayLesson.timeEstimate}
              </span>
              <div className="journey-substage-tabs">
                <button
                  type="button"
                  className={`substage-btn ${journeyStage === 'letters' ? 'active' : ''}`}
                  onClick={() => setJourneyStage('letters')}
                >
                  1. Học chữ ({activeDayLesson.letters.length})
                </button>
                <button
                  type="button"
                  className={`substage-btn ${journeyStage === 'words' ? 'active' : ''}`}
                  onClick={() => setJourneyStage('words')}
                >
                  2. Đọc từ thật ({activeDayLesson.realWords.length})
                </button>
                <button
                  type="button"
                  className={`substage-btn ${journeyStage === 'quiz' ? 'active' : ''}`}
                  onClick={() => setJourneyStage('quiz')}
                >
                  3. Thử thách nhanh ⚡
                </button>
              </div>
            </div>
            <p className="journey-lesson-desc">{activeDayLesson.subtitle}</p>
          </div>

          {/* GIAI ĐOẠN 1: HỌC CHỮ CÁI & MẸO NHỚ HÌNH */}
          {journeyStage === 'letters' && (
            <div className="journey-letters-section">
              <div className="journey-letters-grid">
                {activeDayLesson.letters.map((letItem) => (
                  <div
                    key={letItem.char}
                    className="journey-letter-card"
                    onClick={() => speakKorean(letItem.audioPrompt || letItem.char)}
                  >
                    <div className="journey-letter-char">{letItem.char}</div>
                    <div className="journey-letter-anchor">
                      Âm tiếng Việt: <strong>{letItem.vietnameseAnchor}</strong>
                    </div>
                    <div className="journey-letter-hint">💡 {letItem.mnemonicHint}</div>
                    <button
                      type="button"
                      className="journey-speak-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakKorean(letItem.audioPrompt || letItem.char);
                      }}
                      title="Nghe phát âm chuẩn"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Mẹo ngữ âm chuyên sâu cho người Việt */}
              {activeDayLesson.phoneticTips && (
                <div className="journey-phonetic-banner">
                  <Lightbulb size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>Bí quyết sư phạm cho người Việt:</strong>
                    <div style={{ marginTop: 4, lineHeight: 1.5 }}>{activeDayLesson.phoneticTips}</div>
                  </div>
                </div>
              )}

              {/* Nút chuyển tiếp */}
              <div className="journey-next-stage-wrap">
                <button
                  type="button"
                  className="btn-journey-primary"
                  onClick={() => setJourneyStage('words')}
                >
                  Đọc Thử Từ Vựng Thật Ngay (Bước 2) <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* GIAI ĐOẠN 2: ĐỌC TỪ THẬT & CẢM GIÁC "ĐỌC ĐƯỢC RỒI!" */}
          {journeyStage === 'words' && (
            <div className="journey-words-section">
              <div className="journey-words-intro">
                ✨ <strong>Không học lý thuyết suông!</strong> Đây là những từ tiếng Hàn có nghĩa thật sự ngoài đời, được ghép từ chính các chữ cái bạn vừa học:
              </div>

              <div className="journey-words-grid">
                {activeDayLesson.realWords.map((w, idx) => (
                  <div
                    key={idx}
                    className="journey-word-card"
                    onClick={() => speakKorean(w.word)}
                  >
                    <div className="word-card-top">
                      <span className="word-icon">{w.icon || '📌'}</span>
                      <button
                        type="button"
                        className="journey-speak-btn small"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakKorean(w.word);
                        }}
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>
                    <div className="word-hangeul-text">{w.word}</div>
                    {!hideRomanization && w.rom && (
                      <div className="word-rom-text">[{w.rom}]</div>
                    )}
                    <div className="word-meaning-text">{w.meaningVi}</div>
                    {w.breakdownHint && (
                      <div className="word-breakdown-tag">Cấu tạo: {w.breakdownHint}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Nút chuyển sang thử thách quiz */}
              <div className="journey-next-stage-wrap">
                <button
                  type="button"
                  className="btn-journey-primary"
                  onClick={() => setJourneyStage('quiz')}
                >
                  Tham Gia Thử Thách 3 Phút (Bước 3) ⚡
                </button>
              </div>
            </div>
          )}

          {/* GIAI ĐOẠN 3: THỬ THÁCH PHẢN XẠ NHANH */}
          {journeyStage === 'quiz' && (
            <div className="journey-quiz-section">
              <div className="journey-quiz-card">
                <div className="journey-quiz-title">
                  ⚡ Thử thách phản xạ Ngày {currentDay} ({activeDayLesson.quickQuiz.length} câu)
                </div>

                <div className="journey-quiz-list">
                  {activeDayLesson.quickQuiz.map((q, qIdx) => {
                    const chosen = journeyQuizAnswers[qIdx];
                    const isCorrect = chosen === q.correctAnswer;
                    return (
                      <div key={qIdx} className="journey-quiz-item">
                        <div className="quiz-q-prompt">
                          <span>Câu {qIdx + 1}: {q.question}</span>
                          <button
                            type="button"
                            className="btn-mini-sound"
                            onClick={() => speakKorean(q.targetAudio)}
                            title="Nghe gợi ý âm thanh"
                          >
                            <Volume2 size={14} />
                          </button>
                        </div>

                        <div className="quiz-opts-row">
                          {q.options.map((opt) => {
                            const isSelected = chosen === opt;
                            let btnClass = 'journey-quiz-opt';
                            if (journeyQuizChecked) {
                              if (opt === q.correctAnswer) btnClass += ' correct';
                              else if (isSelected) btnClass += ' wrong';
                              else btnClass += ' dimmed';
                            } else if (isSelected) {
                              btnClass += ' selected';
                            }
                            return (
                              <button
                                key={opt}
                                type="button"
                                className={btnClass}
                                onClick={() => handleSelectQuizAnswer(qIdx, opt)}
                                disabled={journeyQuizChecked}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {journeyQuizChecked && (
                          <div className={`quiz-feedback-box ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
                            {isCorrect ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <CheckCircle2 size={15} color="#10b981" />
                                <span>{q.explanation}</span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <XCircle size={15} color="#f43f5e" />
                                <span>{q.explanation}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="journey-quiz-actions">
                  {!journeyQuizChecked ? (
                    <button
                      type="button"
                      className="btn-journey-primary"
                      onClick={checkJourneyQuiz}
                      disabled={Object.keys(journeyQuizAnswers).length < activeDayLesson.quickQuiz.length}
                    >
                      Kiểm Tra Kết Quả 🎯
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-journey-primary"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      onClick={finishCurrentDay}
                    >
                      Nhận Huy Hiệu Chiến Thắng 🎉
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* GIAI ĐOẠN 4: MÀN HÌNH CHIẾN THẮNG (VICTORY) */}
          {journeyStage === 'victory' && (
            <div className="journey-victory-section">
              <div className="journey-victory-card">
                <Trophy size={54} color="#fbbf24" />
                <h3 className="victory-title">🎉 XUẤT SẮC HOÀN THÀNH NGÀY {currentDay}!</h3>
                <p className="victory-badge-text">{activeDayLesson.victoryRewardBadge}</p>

                <div className="victory-summary-box">
                  <div className="victory-metric">
                    <span className="metric-num">+{activeDayLesson.letters.length}</span>
                    <span className="metric-label">Chữ cái đã thuộc</span>
                  </div>
                  <div className="victory-metric">
                    <span className="metric-num">+{activeDayLesson.realWords.length}</span>
                    <span className="metric-label">Từ vựng tự đọc được</span>
                  </div>
                </div>

                <div className="victory-actions-row">
                  {currentDay < 5 ? (
                    <button
                      type="button"
                      className="btn-journey-primary"
                      onClick={() => selectJourneyDay(currentDay + 1)}
                    >
                      Tiến Vào Ngày {currentDay + 1} ➔
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-journey-primary"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      onClick={() => setSubTab('name_card')}
                    >
                      Thử Thách: Viết Tên Bạn Bằng Hangeul ✍️
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          CHẾ ĐỘ MỚI: TÊN BẠN BẰNG HANGEUL (NAME CARD)
          ========================================== */}
      {subTab === 'name_card' && (
        <div className="hangeul-name-stage">
          <div className="name-intro-card">
            <h3 className="name-intro-title">✍️ Khám Phá & Tự Viết Tên Bạn Bằng Chữ Hangeul</h3>
            <p className="name-intro-desc">
              Tên người Việt khi phiên âm sang tiếng Hàn đều có cách viết chuẩn hóa dựa trên âm Hán-Hàn và ngữ âm tương đương. Tìm tên bạn bên dưới, nghe phát âm và sao chép thiệp tên để chia sẻ!
            </p>

            <div className="name-search-box">
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Gõ tên tiếng Việt của bạn (ví dụ: Trường, Nguyệt, Linh, Minh...)"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="name-search-input"
              />
            </div>
          </div>

          {/* Thẻ Name Card nổi bật */}
          {selectedNameGuide && (
            <div className="featured-name-card">
              <div className="featured-name-left">
                <div className="featured-badge-label">Tên của bạn bằng tiếng Hàn:</div>
                <div className="featured-name-ko">{selectedNameGuide.ko}</div>
                <div className="featured-name-vi">
                  Tên tiếng Việt: <strong>{selectedNameGuide.vi}</strong> ({selectedNameGuide.hanjaVi})
                </div>
                {selectedNameGuide.meaning && (
                  <div className="featured-name-meaning">Ý nghĩa: {selectedNameGuide.meaning}</div>
                )}
              </div>

              <div className="featured-name-actions">
                <button
                  type="button"
                  className="btn-speak-name"
                  onClick={() => speakKorean(selectedNameGuide.ko)}
                  title="Nghe phát âm tên"
                >
                  <Volume2 size={20} /> Nghe phát âm
                </button>
                <button
                  type="button"
                  className={`btn-copy-name ${copiedName ? 'copied' : ''}`}
                  onClick={() => handleCopyName(selectedNameGuide.ko)}
                >
                  {copiedName ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedName ? 'Đã sao chép!' : 'Sao chép chữ'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Danh bạ các tên tiếng Việt thông dụng */}
          <div className="names-directory-title">
            Danh mục tên phổ biến ({filteredNames.length} tên):
          </div>
          <div className="names-grid">
            {filteredNames.map((item) => {
              const isSelected = selectedNameGuide?.vi === item.vi;
              return (
                <div
                  key={item.vi}
                  className={`name-chip-item ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedNameGuide(item);
                    speakKorean(item.ko);
                  }}
                >
                  <div className="name-chip-vi">{item.vi}</div>
                  <div className="name-chip-ko">{item.ko}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==========================================
          CHẾ ĐỘ TRA CỨU: BẢNG CHỮ CÁI HANGEUL (CHART)
          ========================================== */}
      {subTab === 'chart' && (
        <>
          <div className="hangeul-filters-row">
            {[
              { key: 'all', label: 'Tất cả (40 chữ)' },
              { key: 'basic_vowel', label: '10 Nguyên âm cơ bản' },
              { key: 'complex_vowel', label: '11 Nguyên âm ghép' },
              { key: 'basic_consonant', label: '14 Phụ âm cơ bản' },
              { key: 'tense_consonant', label: '5 Phụ âm căng' },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                className={`hangeul-filter-pill ${selectedFilter === f.key ? 'active' : ''}`}
                onClick={() => setSelectedFilter(f.key as 'all' | KoreanLetterType)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="hangeul-letters-grid">
            {filteredLetters.map((letter) => (
              <div
                key={letter.char}
                className="hangeul-letter-card"
                onClick={() => {
                  setSelectedLetter(letter);
                  speakKorean(letter.char);
                }}
              >
                <div className="hangeul-char-big">{letter.char}</div>
                {!hideRomanization ? (
                  <div className="hangeul-roman-tag">[{letter.romanization}]</div>
                ) : (
                  <div className="hangeul-roman-tag-hidden">👁️</div>
                )}
                <div className="hangeul-vi-hint">{letter.vietnameseGuide}</div>
                <button
                  type="button"
                  className="btn-speak-char"
                  title="Nghe phát âm"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakKorean(letter.char);
                  }}
                >
                  <Volume2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {selectedLetter && (
            <div className="hangeul-detail-drawer" onClick={() => setSelectedLetter(null)}>
              <div className="hangeul-detail-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 44, fontWeight: 900, color: '#f43f5e' }}>{selectedLetter.char}</div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Tên chữ: {selectedLetter.name}</div>
                      {!hideRomanization && (
                        <div style={{ fontSize: 13, color: '#38bdf8', fontWeight: 600 }}>Phiên âm: [{selectedLetter.romanization}]</div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
                    onClick={() => setSelectedLetter(null)}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.25)', padding: 12, borderRadius: 12, fontSize: 13, color: 'var(--text-main)', lineHeight: 1.5 }}>
                  💡 <strong>Hướng dẫn phát âm:</strong> {selectedLetter.vietnameseGuide}
                </div>

                {selectedLetter.sampleWord && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.25)', padding: '10px 14px', borderRadius: 12 }}>
                    <div>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginRight: 8 }}>{selectedLetter.sampleWord}</span>
                      <span style={{ fontSize: 12.5, color: '#fca5a5' }}>({selectedLetter.sampleMeaning})</span>
                    </div>
                    <button
                      type="button"
                      className="btn-speak-char"
                      onClick={() => speakKorean(selectedLetter.sampleWord || '')}
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ==========================================
          CHẾ ĐỘ: PATCHIM & BIẾN ÂM (PATCHIM)
          ========================================== */}
      {subTab === 'patchim' && (
        <div className="hangeul-patchim-stage">
          <div className="patchim-intro-box">
            <h3 className="patchim-intro-title">7 Nhóm Phát Âm Đại Diện Của Patchim (Phụ Âm Cuối)</h3>
            <p className="patchim-intro-desc">
              Tiếng Việt có lợi thế lớn: <strong>-c, -t, -p, -m, -n, -ng</strong> gần như tương đương 6/7 âm đại diện của tiếng Hàn! Chỉ duy nhất <strong>ㄹ</strong> cần uốn lưỡi đặc trưng.
            </p>
          </div>

          <div className="patchim-selector-row">
            {patchimRules.map((rule) => {
              const isSelected = selectedPatchim?.id === rule.id;
              return (
                <button
                  key={rule.id}
                  type="button"
                  className={`patchim-rule-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedPatchim(rule)}
                >
                  <span className="rep-char">[{rule.representativeSound}]</span>
                  <span className="rep-sound">{rule.soundLabel.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {selectedPatchim && (
            <div className="patchim-card-detail">
              <div className="patchim-card-header">
                <div>
                  <div className="patchim-main-sound">
                    Nhóm âm đại diện: <strong>[{selectedPatchim.representativeSound}]</strong> - {selectedPatchim.soundLabel}
                  </div>
                  <div className="patchim-letters-included">
                    Bao gồm các phụ âm viết: {selectedPatchim.letters.map((l) => (
                      <span key={l} className="letter-badge">{l}</span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-speak-vocab small"
                  onClick={() => speakKorean(selectedPatchim.representativeSound)}
                  title="Nghe âm đại diện"
                >
                  <Volume2 size={16} />
                </button>
              </div>

              {selectedPatchim.vietnameseAnalogy && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '10px 14px',
                  borderRadius: 10,
                  fontSize: 13,
                  color: '#6ee7b7',
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{ fontSize: 16 }}>🇻🇳</span>
                  <span><strong>Lợi thế người Việt:</strong> {selectedPatchim.vietnameseAnalogy}</span>
                </div>
              )}

              <p className="patchim-explanation-text">{selectedPatchim.explanation}</p>

              <div className="patchim-examples-grid">
                {selectedPatchim.examples.map((ex, idx) => (
                  <div key={idx} className="patchim-example-card">
                    <div className="ex-word-row">
                      <span className="ex-word">{ex.word}</span>
                      <ArrowRight size={13} color="#94a3b8" />
                      <span className="ex-reading">{ex.reading}</span>
                      <button
                        type="button"
                        className="btn-mini-sound"
                        onClick={() => speakKorean(ex.word)}
                        title="Nghe phát âm"
                      >
                        <Volume2 size={13} />
                      </button>
                    </div>
                    <div className="ex-vi">{ex.meaningVi}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="sound-rules-section">
            <h3 className="sound-rules-title">⚡ 4 Quy Tắc Biến Âm Thiết Yếu Người Mới Phải Biết</h3>
            <div className="sound-rules-grid">
              {pronunciationRules.map((pRule) => (
                <div key={pRule.id} className="sound-rule-card">
                  <div className="sound-rule-header">
                    <div>
                      <span className="sound-rule-name">{pRule.title}</span>
                      <span className="sound-rule-ko">({pRule.koreanName})</span>
                    </div>
                    <span className="sound-rule-formula">{pRule.formula}</span>
                  </div>
                  <p className="sound-rule-explain">{pRule.explanation}</p>
                  <div className="sound-rule-examples">
                    {pRule.examples.map((ex, i) => (
                      <div key={i} className="sound-ex-item">
                        <span className="ex-orig">{ex.original}</span>
                        <ArrowRight size={11} color="#f43f5e" />
                        <span className="ex-spoken">{ex.spoken}</span>
                        <span className="ex-desc">{ex.meaningVi}</span>
                        <button
                          type="button"
                          className="btn-mini-sound"
                          onClick={() => speakKorean(ex.original)}
                          title="Nghe đọc chuẩn"
                        >
                          <Volume2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          CHẾ ĐỘ: CẶP ÂM TỐI THIỂU (MINIMAL PAIRS)
          ========================================== */}
      {subTab === 'minimal_pairs' && (
        <div className="hangeul-patchim-stage">
          <div className="patchim-intro-box">
            <h3 className="patchim-intro-title">🎯 Luyện Phản Xạ Cặp Âm Tối Thiểu (Minimal Pairs)</h3>
            <p className="patchim-intro-desc">
              Tiếng Việt không phân biệt âm bật hơi, dẫn đến điểm khó nhất là bộ ba <strong>Thường - Bật hơi - Căng</strong> (ㅂ/ㅍ/ㅃ, ㅈ/ㅊ/ㅉ, ㄱ/ㅋ/ㄲ, ㄷ/ㅌ/ㄸ) và các nguyên âm dễ nhầm như <strong>ㅓ/ㅗ</strong>, <strong>ㅡ/ㅜ</strong>. Bấm vào từng từ để nghe và cảm nhận sự khác biệt!
            </p>
          </div>

          <div className="hangeul-filters-row">
            <button
              type="button"
              className={`hangeul-filter-pill ${pairCategory === 'all' ? 'active' : ''}`}
              onClick={() => setPairCategory('all')}
            >
              Tất cả các cặp âm ({filteredMinimalPairs.length})
            </button>
            <button
              type="button"
              className={`hangeul-filter-pill ${pairCategory === 'consonant_trio' ? 'active' : ''}`}
              onClick={() => setPairCategory('consonant_trio')}
            >
              Bộ ba phụ âm (Thường / Bật hơi / Căng)
            </button>
            <button
              type="button"
              className={`hangeul-filter-pill ${pairCategory === 'vowel_confusion' ? 'active' : ''}`}
              onClick={() => setPairCategory('vowel_confusion')}
            >
              Cặp nguyên âm dễ nhầm (ㅓ/ㅗ, ㅡ/ㅜ)
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredMinimalPairs.map((pair) => (
              <div key={pair.id} className="patchim-card-detail" style={{ marginBottom: 0 }}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{pair.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{pair.description}</div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 12,
                  marginTop: 12,
                }}>
                  {pair.pairs.map((pItem, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 12,
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => speakKorean(pItem.word)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 24, fontWeight: 900, color: '#f43f5e' }}>{pItem.word}</span>
                        <button
                          type="button"
                          className="btn-mini-sound"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakKorean(pItem.word);
                          }}
                        >
                          <Volume2 size={15} />
                        </button>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>{pItem.soundType}</div>
                      {!hideRomanization && (
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>[{pItem.rom}]</div>
                      )}
                      <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>Nghĩa: {pItem.meaningVi}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          CHẾ ĐỘ: GHÉP VẦN KHỐI (BUILDER)
          ========================================== */}
      {subTab === 'builder' && (
        <div className="hangeul-builder-stage">
          <div className="builder-display-card">
            <div className="builder-char-result">{composedChar || '가'}</div>
            <button
              type="button"
              className="btn-speak-builder"
              onClick={() => speakKorean(composedChar)}
            >
              <Volume2 size={18} />
              Nghe âm tiết ghép
            </button>
            <div className="builder-formula-row">
              <span className="formula-item">Phụ âm đầu: <strong>{initialConsonant}</strong></span>
              <span>+</span>
              <span className="formula-item">Nguyên âm: <strong>{medialVowel}</strong></span>
              <span>+</span>
              <span className="formula-item">Patchim: <strong>{finalConsonant || '(không có)'}</strong></span>
            </div>
          </div>

          <div className="builder-columns-grid">
            <div className="builder-col">
              <div className="builder-col-header">1. Phụ âm đầu (초성)</div>
              <div className="builder-keys-list">
                {INITIAL_CONSONANTS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`builder-key-btn ${initialConsonant === c ? 'active' : ''}`}
                    onClick={() => {
                      setInitialConsonant(c);
                      speakKorean(c);
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="builder-col">
              <div className="builder-col-header">2. Nguyên âm giữa (중성)</div>
              <div className="builder-keys-list">
                {MEDIAL_VOWELS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`builder-key-btn ${medialVowel === v ? 'active' : ''}`}
                    onClick={() => {
                      setMedialVowel(v);
                      speakKorean(v);
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="builder-col">
              <div className="builder-col-header">3. Patchim (종성)</div>
              <div className="builder-keys-list">
                <button
                  type="button"
                  className={`builder-key-btn ${finalConsonant === '' ? 'active' : ''}`}
                  onClick={() => setFinalConsonant('')}
                >
                  (Không)
                </button>
                {FINAL_CONSONANTS.filter(Boolean).map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`builder-key-btn ${finalConsonant === f ? 'active' : ''}`}
                    onClick={() => {
                      setFinalConsonant(f);
                      speakKorean(f);
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          CHẾ ĐỘ: BỘ GÕ IME 2-SET (KEYBOARD)
          ========================================== */}
      {subTab === 'keyboard' && (
        <div className="hangeul-keyboard-stage">
          <div className="keyboard-practice-card">
            <div className="kb-card-top">
              <span className="kb-pill-badge">Bài tập gõ {practiceWordIndex + 1}/{practiceWords.length} (Chuẩn IME Khối)</span>
              <button
                type="button"
                className="btn-next-practice"
                onClick={() => {
                  handleClearTyped();
                  setPracticeWordIndex((prev) => (prev + 1) % practiceWords.length);
                }}
              >
                Đổi từ tiếp theo <ArrowRight size={13} />
              </button>
            </div>

            <div className="kb-target-row">
              <span className="kb-target-word">{currentPracticeWord.word}</span>
              {!hideRomanization && (
                <span className="kb-target-rom">[{currentPracticeWord.rom}]</span>
              )}
              <button
                type="button"
                className="btn-speak-vocab small"
                onClick={() => speakKorean(currentPracticeWord.word)}
                title="Nghe phát âm"
              >
                <Volume2 size={16} />
              </button>
            </div>

            <div className="kb-hint-text">💡 Cách gõ: {currentPracticeWord.hint}</div>

            <div className="kb-typed-display">
              <div className="kb-typed-content">
                {typedText.length === 0 ? (
                  <span className="kb-placeholder">Gõ trên bàn phím máy tính hoặc bấm các phím bên dưới...</span>
                ) : (
                  <span style={{ fontSize: 26, fontWeight: 900, color: isWordMatched ? '#10b981' : '#fff' }}>
                    {typedText}
                  </span>
                )}
                {isWordMatched && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#6ee7b7',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: 12,
                    marginLeft: 10,
                  }}>
                    <Check size={14} /> Chính xác!
                  </span>
                )}
              </div>
              <div className="kb-typed-actions">
                <button
                  type="button"
                  className="btn-kb-action"
                  onClick={handleBackspace}
                  title="Xóa 1 nét Jamo"
                >
                  <Delete size={15} /> Xóa nét
                </button>
                <button
                  type="button"
                  className="btn-kb-action"
                  onClick={handleClearTyped}
                  title="Xóa trắng"
                >
                  <RefreshCw size={13} /> Làm mới
                </button>
              </div>
            </div>
          </div>

          <div className="virtual-keyboard-wrap">
            <div className="keyboard-legend">
              <span className="legend-item cons">👈 Tay Trái: Phụ Âm (ㅁㄴㅇㄹ...)</span>
              <button
                type="button"
                className={`btn-shift-toggle ${isShiftActive ? 'shift-on' : ''}`}
                onClick={() => setIsShiftActive(!isShiftActive)}
              >
                ⇧ Shift (Chữ căng: ㅃ, ㅉ, ㄸ, ㄲ, ㅆ)
              </button>
              <span className="legend-item vowel">Tay Phải: Nguyên Âm (ㅗㅓㅏㅣ...) 👉</span>
            </div>

            <div className="virtual-keyboard-board">
              {keyboardLayout.map((row, rIdx) => (
                <div key={rIdx} className="virtual-kb-row">
                  {row.map((k) => {
                    const displayKo = isShiftActive && k.shiftKo ? k.shiftKo : k.normalKo;
                    const isKeyActive = activeKey === k.key;
                    return (
                      <button
                        key={k.key}
                        type="button"
                        className={`virtual-key ${k.type} ${isKeyActive ? 'key-active' : ''}`}
                        onClick={() => handleInputKoChar(displayKo, k.key)}
                      >
                        <span className="key-ko">{displayKo}</span>
                        <span className="key-latin">{k.key.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 12,
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.03)',
              fontSize: 12,
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}>
              📱 <em>Gợi ý trên điện thoại: Bạn có thể cài đặt thêm Bàn phím tiếng Hàn chuẩn (2-Bulsik hoặc 10-key) trong Gboard / Bàn phím iOS để luyện tập thực tế!</em>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          CHẾ ĐỘ: MINI QUIZ (QUIZ)
          ========================================== */}
      {subTab === 'quiz' && (
        <div className="hangeul-quiz-stage">
          {quizCompleted || !currentQuiz ? (
            <div className="quiz-completed-box">
              <Trophy size={48} color="#fbbf24" />
              <h3>Hoàn thành bài kiểm tra phản xạ!</h3>
              <p>
                Bạn đạt <strong>{score} / {totalQuiz}</strong> điểm ({Math.round((score / totalQuiz) * 100)}%).
              </p>
              <button type="button" className="btn-restart-quiz" onClick={restartQuiz}>
                <RotateCw size={14} /> Làm Lại Bài Quiz
              </button>
            </div>
          ) : (
            <div className="quiz-card">
              <div className="quiz-header">
                <span>Câu {quizIndex + 1} / {totalQuiz}</span>
                <span>Điểm: <strong>{score}</strong></span>
              </div>

              <div className="quiz-question-box">
                <div className="quiz-char-big">{currentQuiz.questionChar}</div>
                <div className="quiz-prompt">Chữ cái này đọc phiên âm là gì?</div>
                <button
                  type="button"
                  className="btn-speak-char"
                  onClick={() => speakKorean(currentQuiz.questionChar)}
                >
                  <Volume2 size={16} />
                </button>
              </div>

              <div className="quiz-options-grid">
                {currentQuiz.options.map((opt) => {
                  let optClass = 'quiz-opt-btn';
                  if (isAnswerChecked) {
                    if (opt === currentQuiz.correctAnswer) optClass += ' correct';
                    else if (selectedAnswer === opt) optClass += ' wrong';
                    else optClass += ' dimmed';
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={optClass}
                      onClick={() => handleSelectAnswer(opt)}
                      disabled={isAnswerChecked}
                    >
                      <span>[{opt}]</span>
                      {isAnswerChecked && opt === currentQuiz.correctAnswer && (
                        <CheckCircle2 size={16} color="#10b981" />
                      )}
                      {isAnswerChecked && selectedAnswer === opt && opt !== currentQuiz.correctAnswer && (
                        <XCircle size={16} color="#f43f5e" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswerChecked && (
                <button type="button" className="btn-next-quiz" onClick={handleNextQuiz}>
                  {quizIndex + 1 < totalQuiz ? 'Câu Tiếp Theo ➔' : 'Xem Kết Quả 🎉'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
