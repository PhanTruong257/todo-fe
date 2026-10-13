import React from 'react';
import {
  Volume2,
  RotateCw,
  Layers,
  Search,
  Trophy,
  Sparkles,
  Eye,
  EyeOff,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Headphones,
} from 'lucide-react';
import { useKoreanVocab } from './useKoreanVocab';
import './KoreanVocabView.css';

export const KoreanVocabView: React.FC = () => {
  const {
    stats,
    activeSubTab,
    setActiveSubTab,
    selectedTopic,
    setSelectedTopic,
    search,
    setSearch,
    // Study Modes & Settings
    studyMode,
    setStudyMode,
    hideRomanization,
    toggleHideRomanization,
    dailyReviewedCount,
    dailyGoalTarget,
    // Study
    dueQueue,
    currentCard,
    studyIndex,
    isFlipped,
    toggleFlip,
    handleReview,
    studyCompleted,
    restartStudy,
    // Active Recall Quiz
    quizOptions,
    selectedQuizOption,
    quizStatus,
    handleSelectQuizOption,
    skipQuizAndFlip,
    // Library
    filteredLibrary,
    topics,
    speakKorean,
  } = useKoreanVocab();

  return (
    <div className="kr-vocab-container">
      {/* 1. THANH ĐIỀU HƯỚNG TỔNG QUAN */}
      <div className="kr-vocab-toolbar">
        <div className="kr-mode-tabs">
          <button
            type="button"
            className={`kr-mode-btn ${activeSubTab === 'study' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('study')}
          >
            <RotateCw size={14} />
            Ôn Flashcard SRS
            {dueQueue.length > 0 && (
              <span className="kr-badge-count">{dueQueue.length}</span>
            )}
          </button>
          <button
            type="button"
            className={`kr-mode-btn ${activeSubTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('library')}
          >
            <Layers size={14} />
            Kho Từ Vựng ({stats.total})
          </button>
        </div>

        {/* Cụm công cụ phụ: Toggle Romanization + Mục tiêu ngày + Huy hiệu đã thuộc */}
        <div className="kr-toolbar-right">
          <button
            type="button"
            className={`kr-roman-toggle-btn ${hideRomanization ? 'hidden-mode' : ''}`}
            onClick={toggleHideRomanization}
            title={hideRomanization ? 'Đang ẩn phiên âm Latin (Buộc đọc mặt chữ Hangul)' : 'Đang hiện phiên âm Latin'}
          >
            {hideRomanization ? <EyeOff size={13} color="#f43f5e" /> : <Eye size={13} color="#38bdf8" />}
            <span>{hideRomanization ? 'Ẩn Phiên Âm' : 'Hiện Phiên Âm'}</span>
          </button>

          <div className={`kr-daily-goal-pill ${dailyReviewedCount >= dailyGoalTarget ? 'goal-achieved' : ''}`}>
            <Flame size={13} color={dailyReviewedCount >= dailyGoalTarget ? '#fbbf24' : '#f97316'} />
            <span>
              Hôm nay: <strong>{dailyReviewedCount}</strong>/{dailyGoalTarget}
            </span>
          </div>

          <div className="kr-stats-pill">
            <Trophy size={13} color="#10b981" />
            <span>Đã thuộc: <strong>{stats.mastered}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. CHẾ ĐỘ 1: ÔN TẬP SRS (STUDY) */}
      {activeSubTab === 'study' && (
        <div className="kr-study-stage">
          {/* Hàng điều khiển: Chế độ ôn (Hàn->Việt, Việt->Hàn, Nghe->Hàn) & Chọn chủ đề */}
          <div className="kr-study-controls-bar">
            {/* 3 Chế độ ôn tập Active Recall */}
            <div className="kr-sub-modes-pill">
              <button
                type="button"
                className={`kr-sub-mode-btn ${studyMode === 'ko-to-vi' ? 'active' : ''}`}
                onClick={() => setStudyMode('ko-to-vi')}
                title="Hàn ➔ Việt: Đọc chữ Hàn và chọn nghĩa tiếng Việt"
              >
                🇰🇷 ➔ 🇻🇳 Nhận diện
              </button>
              <button
                type="button"
                className={`kr-sub-mode-btn ${studyMode === 'vi-to-ko' ? 'active' : ''}`}
                onClick={() => setStudyMode('vi-to-ko')}
                title="Việt ➔ Hàn: Đọc nghĩa tiếng Việt và chọn chữ Hangeul đúng"
              >
                🇻🇳 ➔ 🇰🇷 Phản xạ
              </button>
              <button
                type="button"
                className={`kr-sub-mode-btn ${studyMode === 'listen-to-ko' ? 'active' : ''}`}
                onClick={() => setStudyMode('listen-to-ko')}
                title="Nghe ➔ Hàn: Nghe phát âm và chọn chữ Hangeul đúng"
              >
                <Headphones size={12} /> Nghe ➔ Chọn
              </button>
            </div>

            {/* Chọn chủ đề ôn */}
            <div className="kr-topic-selector-wrap">
              <span className="kr-selector-label">Chủ đề:</span>
              <select
                className="kr-topic-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option value="all">🌟 Tất cả ({stats.total})</option>
                {topics.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.icon} {t.nameVi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {studyCompleted || !currentCard ? (
            <div className="kr-study-completed-card">
              <div className="kr-completed-icon">🎉</div>
              <h3 className="kr-completed-title">Hoàn thành lượt ôn tiếng Hàn!</h3>
              <p className="kr-completed-desc">
                Bạn đã hoàn thành các thẻ từ vựng cần ôn theo thuật toán <strong>SuperMemo-2 (SM-2)</strong>. Các khoảng cách ôn tập tiếp theo đã được lập lịch tự động dựa trên độ ghi nhớ của bạn!
              </p>
              <div className="kr-completed-stats">
                <span>🔥 Hôm nay đã ôn: <strong>{dailyReviewedCount}</strong> thẻ</span>
                <span>🏆 Từ vựng đã thuần thục: <strong>{stats.mastered}</strong> từ</span>
              </div>
              <button
                type="button"
                className="btn-restart-study"
                onClick={restartStudy}
              >
                <RotateCw size={14} />
                Ôn Lại Lượt Này
              </button>
            </div>
          ) : (
            <>
              {/* Tiến độ bài ôn & SM-2 Info */}
              <div className="kr-study-progress-row">
                <span className="kr-progress-text">
                  Từ <strong>{studyIndex + 1}</strong> / {dueQueue.length}
                </span>
                <span className="kr-card-meta-pill">
                  {currentCard.level} • {currentCard.topic} • EF: {currentCard.easeFactor || 2.5}
                </span>
              </div>

              {/* Thẻ 3D Flashcard */}
              <div
                className={`kr-card-stage ${isFlipped ? 'flipped' : ''}`}
                onClick={quizStatus !== 'idle' ? toggleFlip : undefined}
              >
                <div className={`kr-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                  {/* Mặt Trước (Front) */}
                  <div className="kr-card-face kr-card-front">
                    <div className="kr-card-top-tags">
                      <span className="kr-topic-tag">{currentCard.topic}</span>
                      <span className="kr-level-tag">{currentCard.level}</span>
                    </div>

                    <div className="kr-front-center">
                      {/* Chế độ 1: Hàn -> Việt */}
                      {studyMode === 'ko-to-vi' && (
                        <>
                          <div className="kr-hangeul-title">{currentCard.hangeul}</div>
                          {!hideRomanization ? (
                            <div className="kr-roman-text">[{currentCard.romanization}]</div>
                          ) : (
                            <div className="kr-roman-hidden">[Phiên âm đã ẩn • Tập đọc Hangeul]</div>
                          )}
                          <button
                            type="button"
                            className="btn-speak-vocab"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakKorean(currentCard.hangeul);
                            }}
                            title="Nghe phát âm"
                          >
                            <Volume2 size={20} />
                          </button>
                        </>
                      )}

                      {/* Chế độ 2: Việt -> Hàn */}
                      {studyMode === 'vi-to-ko' && (
                        <>
                          <div className="kr-meaning-prompt-title">{currentCard.meaningVi}</div>
                          {currentCard.hanjaVi && (
                            <div className="kr-hanja-hint">💡 Gợi ý Hán-Hàn: {currentCard.hanjaVi}</div>
                          )}
                          <div className="kr-recall-sub">Hãy nhớ và chọn chữ Hangeul đúng bên dưới 👇</div>
                        </>
                      )}

                      {/* Chế độ 3: Nghe -> Hàn */}
                      {studyMode === 'listen-to-ko' && (
                        <>
                          <div className="kr-listening-prompt-box">
                            <button
                              type="button"
                              className="btn-big-listen-audio"
                              onClick={(e) => {
                                e.stopPropagation();
                                speakKorean(currentCard.hangeul);
                              }}
                            >
                              <Volume2 size={36} />
                              <span>Bấm để nghe lại âm thanh</span>
                            </button>
                            <div className="kr-recall-sub">Nghe kỹ và chọn từ Hangeul chính xác 👇</div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Vùng Trắc Nghiệm Chủ Động (Active Recall 4 Options) */}
                    <div className="kr-quiz-section" onClick={(e) => e.stopPropagation()}>
                      <div className="kr-quiz-grid">
                        {quizOptions.map((opt) => {
                          let btnClass = 'kr-quiz-opt-btn';
                          if (selectedQuizOption) {
                            if (opt.isCorrect) btnClass += ' opt-correct';
                            else if (selectedQuizOption === opt.id) btnClass += ' opt-wrong';
                            else btnClass += ' opt-dimmed';
                          }
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              className={btnClass}
                              onClick={() => handleSelectQuizOption(opt)}
                              disabled={quizStatus !== 'idle'}
                            >
                              <span className="kr-opt-label">{opt.label}</span>
                              {selectedQuizOption && opt.isCorrect && (
                                <CheckCircle2 size={16} color="#10b981" />
                              )}
                              {selectedQuizOption === opt.id && !opt.isCorrect && (
                                <XCircle size={16} color="#f43f5e" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Nút bỏ qua trắc nghiệm để tự lật thẻ */}
                      {quizStatus === 'idle' && (
                        <button
                          type="button"
                          className="kr-skip-quiz-btn"
                          onClick={skipQuizAndFlip}
                        >
                          <HelpCircle size={13} />
                          Tôi muốn tự lật thẻ không cần trắc nghiệm
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mặt Sau (Back) */}
                  <div className="kr-card-face kr-card-back">
                    <div className="kr-card-back-header">
                      <div className="kr-card-back-word">
                        <span className="kr-back-hangeul">{currentCard.hangeul}</span>
                        {!hideRomanization && (
                          <span className="kr-back-rom">[{currentCard.romanization}]</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn-speak-vocab small"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakKorean(currentCard.hangeul);
                        }}
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>

                    {/* Huy hiệu phát âm thực tế nếu có */}
                    {currentCard.actualPronunciation && (
                      <div className="kr-actual-pronounce-badge">
                        <span className="badge-tag">Phát âm thực tế:</span>
                        <strong className="badge-val">{currentCard.actualPronunciation}</strong>
                        <button
                          type="button"
                          className="btn-mini-sound"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakKorean(currentCard.hangeul);
                          }}
                          title="Nghe phát âm chuẩn"
                        >
                          <Volume2 size={13} />
                        </button>
                      </div>
                    )}

                    <div className="kr-card-back-body">
                      <div className="kr-meaning-vi">{currentCard.meaningVi}</div>

                      {currentCard.hanjaVi && (
                        <div className="kr-hanja-badge">
                          💡 Gốc Hán-Hàn: <strong>{currentCard.hanjaVi}</strong>
                        </div>
                      )}

                      {currentCard.exampleKo && (
                        <div className="kr-example-box">
                          <div className="kr-example-ko">
                            "{currentCard.exampleKo}"
                            <button
                              type="button"
                              className="btn-mini-sound"
                              onClick={(e) => {
                                e.stopPropagation();
                                speakKorean(currentCard.exampleKo);
                              }}
                            >
                              <Volume2 size={12} />
                            </button>
                          </div>
                          <div className="kr-example-vi">{currentCard.exampleVi}</div>
                        </div>
                      )}
                    </div>

                    <div className="kr-card-back-footer">
                      <Sparkles size={13} color="#f43f5e" />
                      <span>Đánh giá mức độ ghi nhớ theo thuật toán SM-2 👇</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hàng 4 nút đánh giá chuẩn SuperMemo-2 (SM-2) */}
              <div className="kr-rating-row">
                <button
                  type="button"
                  className={`btn-kr-rating again ${quizStatus === 'wrong' ? 'recommended-action' : ''}`}
                  onClick={() => handleReview('again')}
                >
                  <span className="rating-title">Quên</span>
                  <span className="rating-desc">Reset • +1 ngày</span>
                </button>
                <button
                  type="button"
                  className="btn-kr-rating hard"
                  onClick={() => handleReview('hard')}
                >
                  <span className="rating-title">Hơi khó</span>
                  <span className="rating-desc">+1-2 ngày</span>
                </button>
                <button
                  type="button"
                  className={`btn-kr-rating good ${quizStatus === 'correct' ? 'recommended-action' : ''}`}
                  onClick={() => handleReview('good')}
                >
                  <span className="rating-title">Nhớ tốt</span>
                  <span className="rating-desc">+3-4 ngày</span>
                </button>
                <button
                  type="button"
                  className="btn-kr-rating easy"
                  onClick={() => handleReview('easy')}
                >
                  <span className="rating-title">Quá dễ</span>
                  <span className="rating-desc">+5-7 ngày</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 3. CHẾ ĐỘ 2: THƯ VIỆN TỪ VỰNG (LIBRARY) */}
      {activeSubTab === 'library' && (
        <div className="kr-library-stage">
          {/* Thanh lướt chọn chủ đề */}
          <div className="kr-chips-bar">
            <button
              type="button"
              className={`kr-chip-btn ${selectedTopic === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTopic('all')}
            >
              🌟 Tất cả ({stats.total})
            </button>
            {topics.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`kr-chip-btn ${selectedTopic === t.key ? 'active' : ''}`}
                onClick={() => setSelectedTopic(t.key)}
              >
                {t.icon} {t.nameVi}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm từ vựng */}
          <div className="kr-search-input-wrap">
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Tìm theo chữ Hangeul, phiên âm, nghĩa tiếng Việt, âm Hán-Hàn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="kr-search-input"
            />
            {search && (
              <button
                type="button"
                className="kr-clear-search-btn"
                onClick={() => setSearch('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Grid danh sách từ vựng */}
          <div className="kr-words-grid">
            {filteredLibrary.length === 0 ? (
              <div className="kr-empty-library">
                <HelpCircle size={28} color="#94a3b8" />
                <p>Không tìm thấy từ vựng nào phù hợp với từ khóa.</p>
              </div>
            ) : (
              filteredLibrary.map((w) => (
                <div key={w.id} className="kr-word-card">
                  <div className="kr-word-header">
                    <div className="kr-word-hangeul-wrap">
                      <span className="kr-lib-hangeul">{w.hangeul}</span>
                      {!hideRomanization ? (
                        <span className="kr-lib-rom">[{w.romanization}]</span>
                      ) : (
                        <span className="kr-lib-rom-hidden">👁️</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn-speak-vocab tiny"
                      onClick={() => speakKorean(w.hangeul)}
                      title="Phát âm"
                    >
                      <Volume2 size={13} />
                    </button>
                  </div>

                  {w.actualPronunciation && (
                    <div className="kr-word-spoken-pill">
                      Đọc: <strong>{w.actualPronunciation}</strong>
                    </div>
                  )}

                  <div className="kr-word-meaning">{w.meaningVi}</div>

                  {w.hanjaVi && (
                    <div className="kr-word-hanja">
                      💡 Hán-Hàn: <strong>{w.hanjaVi}</strong>
                    </div>
                  )}

                  {w.exampleKo && (
                    <div className="kr-word-example">
                      <div className="ex-ko">"{w.exampleKo}"</div>
                      <div className="ex-vi">{w.exampleVi}</div>
                    </div>
                  )}

                  <div className="kr-word-footer">
                    <span className="kr-lib-tag">{w.level}</span>
                    <span className="kr-lib-tag">{w.topic}</span>
                    {w.intervalDays ? (
                      <span className="kr-lib-srs-pill">Ôn lại: {w.intervalDays} ngày</span>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
