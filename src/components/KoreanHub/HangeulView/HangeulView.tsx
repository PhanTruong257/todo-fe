import React from 'react';
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
} from 'lucide-react';
import { useHangeulView } from './useHangeulView';
import type { KoreanLetterType } from '../../../types/korean';
import './HangeulView.css';

export const HangeulView: React.FC = () => {
  const {
    subTab,
    setSubTab,
    selectedFilter,
    setSelectedFilter,
    selectedLetter,
    setSelectedLetter,
    filteredLetters,
    hideRomanization,
    toggleHideRomanization,
    // Patchim & Pronunciation
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

  return (
    <div className="hangeul-container">
      {/* 1. THANH CHUYỂN ĐỔI CHẾ ĐỘ HANGEUL */}
      <div className="hangeul-nav-bar">
        <div className="hangeul-subtabs">
          <button
            type="button"
            className={`hangeul-tab-btn ${subTab === 'chart' ? 'active' : ''}`}
            onClick={() => setSubTab('chart')}
          >
            <Layers size={14} />
            Bảng Chữ Cái (40)
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

      {/* 2. CHẾ ĐỘ 1: BẢNG CHỮ CÁI HANGEUL (CHART) */}
      {subTab === 'chart' && (
        <>
          {/* Hàng bộ lọc nhóm chữ cái */}
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

          {/* Lưới các thẻ chữ cái */}
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

          {/* Modal / Card chi tiết ký tự đang chọn */}
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

      {/* 3. CHẾ ĐỘ 2: PATCHIM & BIẾN ÂM (PATCHIM) */}
      {subTab === 'patchim' && (
        <div className="hangeul-patchim-stage">
          {/* Header Giới thiệu Patchim */}
          <div className="patchim-intro-box">
            <h3 className="patchim-intro-title">7 Nhóm Phát Âm Đại Diện Của Patchim (Phụ Âm Cuối)</h3>
            <p className="patchim-intro-desc">
              Tiếng Việt có lợi thế lớn: <strong>-c, -t, -p, -m, -n, -ng</strong> gần như tương đương 6/7 âm đại diện của tiếng Hàn! Chỉ duy nhất <strong>ㄹ</strong> cần uốn lưỡi đặc trưng.
            </p>
          </div>

          {/* Hàng chọn 7 âm đại diện */}
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

          {/* Chi tiết nhóm Patchim đang chọn */}
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

              {/* Các từ ví dụ thực tế */}
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

          {/* Sổ tay 4 Quy tắc Biến Âm Sống Còn */}
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

      {/* 4. CHẾ ĐỘ MỚI: CẶP ÂM TỐI THIỂU (MINIMAL PAIRS) */}
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

      {/* 5. CHẾ ĐỘ 3: GHÉP VẦN KHỐI (BUILDER) */}
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

          {/* 3 Cột chọn ký tự */}
          <div className="builder-columns-grid">
            {/* Cột 1: Phụ âm đầu */}
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

            {/* Cột 2: Nguyên âm giữa */}
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

            {/* Cột 3: Phụ âm cuối (Patchim) */}
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

      {/* 6. CHẾ ĐỘ 4: BỘ GÕ IME 2-SET TRAINER (KEYBOARD) */}
      {subTab === 'keyboard' && (
        <div className="hangeul-keyboard-stage">
          {/* Card từ luyện tập */}
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

            {/* Khu vực kết quả đã gõ (Âm tiết khối thực tế) */}
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

          {/* Mô phỏng Bàn Phím Ảo 2-Set (Dubeolsik) */}
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

            {/* Gợi ý điện thoại */}
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

      {/* 7. CHẾ ĐỘ 5: MINI QUIZ (QUIZ) */}
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
