import React from 'react';
import { Volume2, Sparkles, Layers, RotateCw, Trophy, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
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
            className={`hangeul-tab-btn ${subTab === 'builder' ? 'active' : ''}`}
            onClick={() => setSubTab('builder')}
          >
            <Sparkles size={14} />
            Bộ Ghép Vần Khối
          </button>
          <button
            type="button"
            className={`hangeul-tab-btn ${subTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setSubTab('quiz')}
          >
            <HelpCircle size={14} />
            Mini Quiz Phản Xạ
          </button>
        </div>
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
                <div className="hangeul-roman-tag">[{letter.romanization}]</div>
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

          {/* Modal popup chi tiết khi click vào 1 chữ cái */}
          {selectedLetter && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99999,
                padding: 16,
              }}
              onClick={() => setSelectedLetter(null)}
            >
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1.5px solid rgba(244, 63, 94, 0.4)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 24,
                  maxWidth: 380,
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ fontSize: 56, fontWeight: 900, color: '#fff', textShadow: '0 0 15px rgba(244, 63, 94, 0.5)' }}>
                  {selectedLetter.char}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fb7185', marginTop: 4 }}>
                  Tên chữ: {selectedLetter.name} [{selectedLetter.romanization}]
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 10, lineHeight: 1.5 }}>
                  💡 {selectedLetter.vietnameseGuide}
                </p>

                {selectedLetter.sampleWord && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 14px',
                      marginTop: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8' }}>
                        {selectedLetter.sampleWord}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Nghĩa: {selectedLetter.sampleMeaning}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-speak-char"
                      onClick={() => speakKorean(selectedLetter.sampleWord!)}
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                      border: 'none',
                      color: '#fff',
                      borderRadius: 'var(--radius-full)',
                      padding: '8px 16px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    onClick={() => speakKorean(selectedLetter.char)}
                  >
                    Nghe Lại 🔊
                  </button>
                  <button
                    type="button"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-full)',
                      padding: '8px 16px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedLetter(null)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 3. CHẾ ĐỘ 2: BỘ MÔ PHỎNG GHÉP VẦN KHỐI (SYLLABLE BUILDER) */}
      {subTab === 'builder' && (
        <div className="syllable-builder-wrap">
          {/* Khung hiển thị khối chữ kết quả */}
          <div className="syllable-preview-box">
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>
              Khối chữ tiếng Hàn được tạo thành:
            </span>
            <div className="composed-hangeul-big">{composedChar}</div>
            <div style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 600 }}>
              [{initialConsonant}] + [{medialVowel}] {finalConsonant ? `+ [${finalConsonant}]` : ''}
            </div>
            <button
              type="button"
              className="btn-speak-block"
              onClick={() => speakKorean(composedChar)}
            >
              <Volume2 size={16} />
              Nghe Phát Âm Khối Chữ
            </button>
          </div>

          {/* 3 Cột chọn: Phụ âm đầu + Nguyên âm + Patchim */}
          <div className="syllable-builder-grid">
            {/* Cột 1: Phụ âm đầu */}
            <div className="builder-column">
              <div className="builder-col-title">
                <span>1. Phụ âm đầu ({INITIAL_CONSONANTS.length})</span>
                <span style={{ color: '#fff' }}>[{initialConsonant}]</span>
              </div>
              <div className="builder-char-pills">
                {INITIAL_CONSONANTS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`builder-char-btn ${initialConsonant === c ? 'active' : ''}`}
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
            <div className="builder-column">
              <div className="builder-col-title">
                <span>2. Nguyên âm giữa ({MEDIAL_VOWELS.length})</span>
                <span style={{ color: '#fff' }}>[{medialVowel}]</span>
              </div>
              <div className="builder-char-pills">
                {MEDIAL_VOWELS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`builder-char-btn ${medialVowel === v ? 'active' : ''}`}
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

            {/* Cột 3: Phụ âm cuối Patchim (tùy chọn) */}
            <div className="builder-column">
              <div className="builder-col-title">
                <span>3. Phụ âm cuối Patchim</span>
                <span style={{ color: '#fff' }}>{finalConsonant ? `[${finalConsonant}]` : '(Không có)'}</span>
              </div>
              <div className="builder-char-pills">
                <button
                  type="button"
                  className={`builder-char-btn ${!finalConsonant ? 'active' : ''}`}
                  onClick={() => setFinalConsonant('')}
                  style={{ width: 'auto', padding: '0 8px', fontSize: 12 }}
                >
                  Không có
                </button>
                {FINAL_CONSONANTS.filter(Boolean).map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`builder-char-btn ${finalConsonant === f ? 'active' : ''}`}
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

      {/* 4. CHẾ ĐỘ 3: MINI QUIZ PHẢN XẠ */}
      {subTab === 'quiz' && (
        <div>
          {quizCompleted ? (
            <div className="hangeul-quiz-card animate-fade-in">
              <Trophy size={48} color="#f43f5e" />
              <h3 style={{ fontSize: 20, color: '#fff', fontWeight: 800 }}>Hoàn thành Quiz!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                Bạn đạt được <strong>{score} / {totalQuiz}</strong> điểm phản xạ chữ cái Hangeul!
              </p>
              <button
                type="button"
                className="btn-quiz-next"
                onClick={restartQuiz}
              >
                <RotateCw size={14} style={{ display: 'inline', marginRight: 6 }} />
                Chơi Lại Lượt Mới
              </button>
            </div>
          ) : currentQuiz ? (
            <div className="hangeul-quiz-card">
              <div className="quiz-progress-pill">
                Câu {quizIndex + 1} / {totalQuiz} • Điểm: {score}
              </div>

              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Chữ cái dưới đây phát âm phiên âm La-tinh là gì?
              </div>

              <div
                className="quiz-char-display"
                onClick={() => speakKorean(currentQuiz.questionChar)}
                style={{ cursor: 'pointer' }}
                title="Bấm để nghe âm thanh"
              >
                {currentQuiz.questionChar}
              </div>

              <button
                type="button"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  color: '#a5b4fc',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 14px',
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                onClick={() => speakKorean(currentQuiz.questionChar)}
              >
                <Volume2 size={13} />
                Nghe phát âm
              </button>

              <div className="quiz-options-grid">
                {currentQuiz.options.map((opt) => {
                  let statusClass = '';
                  if (isAnswerChecked) {
                    if (opt === currentQuiz.correctAnswer) {
                      statusClass = 'correct';
                    } else if (opt === selectedAnswer) {
                      statusClass = 'wrong';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`btn-quiz-option ${statusClass}`}
                      onClick={() => handleSelectAnswer(opt)}
                      disabled={isAnswerChecked}
                    >
                      {opt}
                      {isAnswerChecked && opt === currentQuiz.correctAnswer && (
                        <CheckCircle2 size={16} style={{ display: 'inline', marginLeft: 6, verticalAlign: 'middle' }} />
                      )}
                      {isAnswerChecked && opt === selectedAnswer && opt !== currentQuiz.correctAnswer && (
                        <XCircle size={16} style={{ display: 'inline', marginLeft: 6, verticalAlign: 'middle' }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswerChecked && (
                <button
                  type="button"
                  className="btn-quiz-next animate-slide-up"
                  onClick={handleNextQuiz}
                >
                  {quizIndex + 1 < totalQuiz ? 'Câu Tiếp Theo ➔' : 'Xem Kết Quả 🎉'}
                </button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
