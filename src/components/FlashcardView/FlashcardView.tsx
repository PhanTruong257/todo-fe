import React from 'react';
import {
  Volume2,
  Plus,
  RotateCw,
  Search,
  Trash2,
  BookOpen,
  Sparkles,
  Trophy,
  Layers,
} from 'lucide-react';
import { useFlashcardView } from './useFlashcardView';
import { FlashcardModal } from './FlashcardModal';
import { TOPIC_DEFINITIONS, getTopicMeta } from '../../constants/topics';
import './FlashcardView.css';

interface FlashcardViewProps {
  currentStudent: string;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ currentStudent }) => {
  const {
    stats,
    activeSubTab,
    setActiveSubTab,
    dueQueue,
    currentCard,
    studyIndex,
    isFlipped,
    toggleFlip,
    speakWord,
    handleReview,
    studyCompleted,
    restartStudy,
    studyLevel,
    setStudyLevel,
    studyTopic,
    setStudyTopic,
    topicCounts,
    filteredLibraryCards,
    displayedLibraryCards,
    visibleCount,
    loadMore,
    search,
    setSearch,
    selectedTopic,
    setSelectedTopic,
    selectedLevel,
    setSelectedLevel,
    handleDeleteCard,
    isAddOpen,
    setIsAddOpen,
    handleAddCard,
  } = useFlashcardView(currentStudent);

  return (
    <div className="flashcard-container">
      {/* 1. THANH ĐIỀU HƯỚNG TỔNG QUAN */}
      <div className="fc-toolbar">
        <div className="fc-mode-tabs">
          <button
            type="button"
            className={`fc-mode-btn ${activeSubTab === 'study' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('study')}
          >
            <RotateCw size={14} />
            Ôn Tập SRS
            {dueQueue.length > 0 && (
              <span className="fc-badge-due">{dueQueue.length}</span>
            )}
          </button>
          <button
            type="button"
            className={`fc-mode-btn ${activeSubTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('library')}
          >
            <Layers size={14} />
            Kho Từ Vựng ({stats.totalCards})
          </button>
        </div>

        <div className="fc-toolbar-right">
          <div className="fc-stats-pill">
            <Trophy size={13} color="#10b981" />
            Đã thuộc: <strong>{stats.mastered}</strong>
          </div>
          <button
            type="button"
            className="btn-add-word-main"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={15} />
            Thêm từ mới
          </button>
        </div>
      </div>

      {/* 2. CHẾ ĐỘ 1: ÔN TẬP LẶP LẠI NGẮT QUÃNG (STUDY MODE) */}
      {activeSubTab === 'study' && (
        <div className="fc-study-wrapper">
          {/* Thanh chọn chủ đề & cấp độ ôn */}
          <div className="fc-study-filters-container">
            <div className="fc-study-filter-group">
              <span className="fc-study-level-label">Chủ đề:</span>
              <select
                className="fc-study-topic-select"
                value={studyTopic}
                onChange={(e) => setStudyTopic(e.target.value)}
              >
                <option value="all">🌟 Tất cả chủ đề ({stats.totalCards})</option>
                {TOPIC_DEFINITIONS.map((t) => {
                  const count = topicCounts[t.key] || 0;
                  return (
                    <option key={t.key} value={t.key}>
                      {t.icon} {t.nameVi} ({count} từ)
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="fc-study-filter-group">
              <span className="fc-study-level-label">Cấp độ:</span>
              <div className="fc-study-level-pills">
                {['all', 'A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`fc-study-level-pill ${studyLevel === lvl ? 'active' : ''}`}
                    onClick={() => setStudyLevel(lvl)}
                  >
                    {lvl === 'all' ? 'Tất cả' : lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {studyCompleted || !currentCard ? (
            /* Trạng thái hoàn thành bài ôn hôm nay */
            <div className="fc-completed-state animate-fade-in">
              <div className="fc-celebrate-icon">🎉</div>
              <h3>Tuyệt vời! Đã hoàn thành bài ôn hôm nay!</h3>
              <p>
                Bạn đã hoàn thành các thẻ từ vựng cần ôn theo thuật toán SRS.
                Bộ não của bạn đang củng cố trí nhớ dài hạn rất tốt!
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn-restart-study"
                  onClick={restartStudy}
                >
                  <RotateCw size={14} style={{ display: 'inline', marginRight: 6 }} />
                  Ôn Lại Lượt Này
                </button>
                <button
                  type="button"
                  className="btn-add-word-main"
                  onClick={() => setIsAddOpen(true)}
                >
                  <Plus size={14} style={{ display: 'inline', marginRight: 4 }} />
                  Học Thêm Từ Mới
                </button>
              </div>
            </div>
          ) : (
            /* Giao diện lật thẻ 3D */
            <>
              {/* Thanh tiến độ bài ôn */}
              <div className="fc-progress-header">
                <div className="fc-progress-info">
                  <span>
                    Từ {studyIndex + 1} / {dueQueue.length}
                  </span>
                  <span>
                    {getTopicMeta(currentCard.topic).icon} {getTopicMeta(currentCard.topic).nameVi}
                  </span>
                </div>
                <div className="fc-progress-bar-track">
                  <div
                    className="fc-progress-bar-fill"
                    style={{
                      width: `${((studyIndex + 1) / dueQueue.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Thẻ 3D Flip Card */}
              <div className="fc-3d-card-stage" onClick={toggleFlip}>
                <div className={`fc-3d-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                  {/* Mặt Trước (Front) */}
                  <div className="fc-card-face fc-card-front">
                    <div className="fc-front-meta-top">
                      <span className="fc-topic-tag">
                        {getTopicMeta(currentCard.topic).icon} {getTopicMeta(currentCard.topic).nameVi}
                      </span>
                      <span className="fc-level-tag">{currentCard.level || 'B2'}</span>
                    </div>

                    <div className="fc-front-center">
                      <h2 className="fc-word-title">{currentCard.word}</h2>
                      <div className="fc-word-details">
                        {currentCard.ipa && (
                          <span className="fc-ipa-text">{currentCard.ipa}</span>
                        )}
                        {currentCard.partOfSpeech && (
                          <span className="fc-pos-badge">{currentCard.partOfSpeech}</span>
                        )}
                      </div>

                      <button
                        type="button"
                        className="btn-speak-audio"
                        title="Nghe phát âm"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakWord(currentCard.word, currentCard.audioUrl);
                        }}
                      >
                        <Volume2 size={20} />
                      </button>
                    </div>

                    <div className="fc-tap-hint">
                      <Sparkles size={13} color="#818cf8" />
                      Chạm vào thẻ để lật xem nghĩa & ví dụ
                    </div>
                  </div>

                  {/* Mặt Sau (Back) */}
                  <div className="fc-card-face fc-card-back">
                    <div className="fc-front-meta-top">
                      <span className="fc-topic-tag">
                        {getTopicMeta(currentCard.topic).icon} {getTopicMeta(currentCard.topic).nameVi}
                      </span>
                      <button
                        type="button"
                        className="btn-speak-audio"
                        style={{ width: 32, height: 32 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          speakWord(currentCard.word, currentCard.audioUrl);
                        }}
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>

                    <div className="fc-back-content">
                      <div className="fc-meaning-vi">{currentCard.meaningVi}</div>
                      {currentCard.meaningEn && (
                        <div className="fc-meaning-en">{currentCard.meaningEn}</div>
                      )}

                      {currentCard.exampleEn && (
                        <div className="fc-example-box">
                          <div className="fc-example-en">"{currentCard.exampleEn}"</div>
                          {currentCard.exampleVi && (
                            <div className="fc-example-vi">{currentCard.exampleVi}</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="fc-tap-hint">
                      Đánh giá độ nhớ của bạn bên dưới 👇
                    </div>
                  </div>
                </div>
              </div>

              {/* Hàng 4 nút đánh giá SRS */}
              <div className="fc-rating-actions">
                <button
                  type="button"
                  className="btn-fc-rating rating-again"
                  onClick={() => handleReview('again')}
                >
                  <span className="rating-name">Quên</span>
                  <span className="rating-time">+1 ngày</span>
                </button>
                <button
                  type="button"
                  className="btn-fc-rating rating-hard"
                  onClick={() => handleReview('hard')}
                >
                  <span className="rating-name">Hơi khó</span>
                  <span className="rating-time">+2 ngày</span>
                </button>
                <button
                  type="button"
                  className="btn-fc-rating rating-good"
                  onClick={() => handleReview('good')}
                >
                  <span className="rating-name">Nhớ tốt</span>
                  <span className="rating-time">+4 ngày</span>
                </button>
                <button
                  type="button"
                  className="btn-fc-rating rating-easy"
                  onClick={() => handleReview('easy')}
                >
                  <span className="rating-name">Quá dễ</span>
                  <span className="rating-time">+7 ngày</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 3. CHẾ ĐỘ 2: THƯ VIỆN TỪ VỰNG (LIBRARY MODE) */}
      {activeSubTab === 'library' && (
        <div className="fc-library-wrapper">
          {/* Thanh lướt chọn chủ đề trực quan */}
          <div className="fc-topic-chips-bar">
            <button
              type="button"
              className={`fc-topic-chip ${selectedTopic === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTopic('all')}
            >
              <span className="fc-chip-icon">🌟</span>
              <span className="fc-chip-name">Tất cả chủ đề</span>
              <span className="fc-chip-count">{stats.totalCards}</span>
            </button>
            {TOPIC_DEFINITIONS.map((t) => {
              const count = topicCounts[t.key] || 0;
              return (
                <button
                  key={t.key}
                  type="button"
                  className={`fc-topic-chip ${selectedTopic === t.key ? 'active' : ''}`}
                  onClick={() => setSelectedTopic(t.key)}
                >
                  <span className="fc-chip-icon">{t.icon}</span>
                  <span className="fc-chip-name">{t.nameVi}</span>
                  <span className="fc-chip-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Thanh lọc & Tìm kiếm */}
          <div className="fc-library-filter-row">
            <div className="fc-search-wrap">
              <Search size={15} color="#94a3b8" />
              <input
                className="fc-search-input"
                placeholder="Tìm từ vựng, nghĩa tiếng Việt hoặc câu ví dụ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="fc-filter-select"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              <option value="all">🌟 Tất cả chủ đề ({stats.totalCards})</option>
              {TOPIC_DEFINITIONS.map((t) => {
                const count = topicCounts[t.key] || 0;
                return (
                  <option key={t.key} value={t.key}>
                    {t.icon} {t.nameVi} ({count})
                  </option>
                );
              })}
            </select>

            <select
              className="fc-filter-select"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="all">Tất cả level</option>
              <option value="A1">A1 - Căn bản</option>
              <option value="A2">A2 - Sơ cấp</option>
              <option value="B1">B1 - Trung cấp</option>
              <option value="B2">B2 - Khá</option>
              <option value="C1">C1 - Nâng cao</option>
            </select>
          </div>

          {/* Lưới danh sách thẻ */}
          {displayedLibraryCards.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={48} className="empty-state-icon" />
              <h3>Không tìm thấy từ vựng nào</h3>
              <p>Hãy thử tìm từ khóa khác hoặc bấm nút thêm từ mới ở trên!</p>
            </div>
          ) : (
            <>
              <div className="fc-words-grid">
                {displayedLibraryCards.map((card) => (
                  <div key={card.id} className="fc-word-card">
                    <div className="fc-card-top-row">
                      <span className="fc-card-word-title">
                        {card.word}
                        {card.ipa && (
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>
                            {card.ipa}
                          </span>
                        )}
                      </span>
                      <div className="fc-card-actions">
                        <button
                          type="button"
                          className="btn-fc-card-icon"
                          title="Nghe phát âm"
                          onClick={() => speakWord(card.word, card.audioUrl)}
                        >
                          <Volume2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-fc-card-icon delete"
                          title="Xóa thẻ"
                          onClick={() => handleDeleteCard(card.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="fc-card-meaning">{card.meaningVi}</div>

                    {card.exampleEn && (
                      <div className="fc-card-example">
                        <div>"{card.exampleEn}"</div>
                      </div>
                    )}

                    <div className="fc-card-bottom-row">
                      <span
                        className="fc-card-topic-badge"
                        onClick={() => setSelectedTopic(card.topic || 'all')}
                        style={{ cursor: 'pointer' }}
                        title="Bấm để lọc theo chủ đề này"
                      >
                        {card.level ? (
                          <strong style={{ color: '#6ee7b7', marginRight: 4 }}>{card.level}</strong>
                        ) : null}
                        <span>
                          {getTopicMeta(card.topic).icon} {getTopicMeta(card.topic).nameVi}
                        </span>
                      </span>
                      <span
                        className={`fc-srs-status-tag ${
                          card.status === 'mastered'
                            ? 'mastered'
                            : card.status === 'learning'
                            ? 'learning'
                            : 'new'
                        }`}
                      >
                        {card.status === 'mastered'
                          ? 'Đã thuộc 🎯'
                          : card.status === 'learning'
                          ? 'Đang ôn ⏳'
                          : 'Mới 🆕'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {visibleCount < filteredLibraryCards.length && (
                <div style={{ textAlign: 'center', marginTop: 14 }}>
                  <button
                    type="button"
                    className="btn-load-more-fc"
                    onClick={loadMore}
                  >
                    Xem thêm 60 từ (Còn {filteredLibraryCards.length - visibleCount} từ)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Modal thêm từ mới */}
      <FlashcardModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddCard}
        currentStudent={currentStudent}
      />
    </div>
  );
};
