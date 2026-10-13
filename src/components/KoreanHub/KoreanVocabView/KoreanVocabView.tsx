import React from 'react';
import { Volume2, RotateCw, Layers, Search, Trophy, Sparkles, BookOpen } from 'lucide-react';
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
    // Study
    dueQueue,
    currentCard,
    studyIndex,
    isFlipped,
    toggleFlip,
    handleReview,
    studyCompleted,
    restartStudy,
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
              <span style={{ background: '#f43f5e', color: '#fff', borderRadius: 999, fontSize: 10, padding: '1px 6px', marginLeft: 2 }}>
                {dueQueue.length}
              </span>
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

        <div className="kr-stats-pill">
          <Trophy size={13} color="#10b981" />
          Đã thuộc: <strong>{stats.mastered}</strong> từ
        </div>
      </div>

      {/* 2. CHẾ ĐỘ 1: ÔN TẬP SRS (STUDY) */}
      {activeSubTab === 'study' && (
        <div className="kr-study-stage">
          {/* Hàng chọn chủ đề ôn */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Chủ đề ôn:</span>
            <select
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-main)',
                fontSize: 12,
                padding: '4px 10px',
                outline: 'none',
              }}
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              <option value="all">🌟 Tất cả chủ đề ({stats.total})</option>
              {topics.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.icon} {t.nameVi}
                </option>
              ))}
            </select>
          </div>

          {studyCompleted || !currentCard ? (
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 20px',
                textAlign: 'center',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 48 }}>🎉</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Hoàn thành lượt ôn tiếng Hàn!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, maxWidth: 360, lineHeight: 1.5 }}>
                Bạn đã ôn xong các thẻ từ vựng cần ôn hôm nay theo thuật toán SRS. Rất xuất sắc!
              </p>
              <button
                type="button"
                style={{
                  background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: 'var(--radius-full)',
                  padding: '9px 20px',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  marginTop: 6,
                }}
                onClick={restartStudy}
              >
                <RotateCw size={13} style={{ display: 'inline', marginRight: 6 }} />
                Ôn Lại Lượt Này
              </button>
            </div>
          ) : (
            <>
              {/* Tiến độ bài ôn */}
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>
                <span>Từ {studyIndex + 1} / {dueQueue.length}</span>
                <span>TOPIK 1 • {currentCard.topic}</span>
              </div>

              {/* Thẻ 3D Flip Card */}
              <div className="kr-card-stage" onClick={toggleFlip}>
                <div className={`kr-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                  {/* Mặt Trước (Front) */}
                  <div className="kr-card-face kr-card-front">
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', borderRadius: 999, fontSize: 11, padding: '2px 8px', fontWeight: 700 }}>
                        {currentCard.topic}
                      </span>
                      <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', borderRadius: 999, fontSize: 11, padding: '2px 8px', fontWeight: 800 }}>
                        {currentCard.level}
                      </span>
                    </div>

                    <div className="kr-front-center">
                      <div className="kr-hangeul-title">{currentCard.hangeul}</div>
                      <div className="kr-roman-text">[{currentCard.romanization}]</div>

                      <button
                        type="button"
                        className="btn-speak-vocab"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakKorean(currentCard.hangeul);
                        }}
                      >
                        <Volume2 size={20} />
                      </button>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                      <Sparkles size={13} color="#f43f5e" />
                      Chạm vào thẻ để lật xem nghĩa & âm Hán-Hàn
                    </div>
                  </div>

                  {/* Mặt Sau (Back) */}
                  <div className="kr-card-face kr-card-back">
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{currentCard.hangeul}</span>
                      <button
                        type="button"
                        className="btn-speak-vocab"
                        style={{ width: 30, height: 30 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          speakKorean(currentCard.hangeul);
                        }}
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto 0' }}>
                      <div className="kr-meaning-vi">{currentCard.meaningVi}</div>

                      {currentCard.hanjaVi && (
                        <div className="kr-hanja-badge">
                          💡 Gốc Hán-Hàn: {currentCard.hanjaVi}
                        </div>
                      )}

                      {currentCard.exampleKo && (
                        <div className="kr-example-box">
                          <div className="kr-example-ko">"{currentCard.exampleKo}"</div>
                          <div className="kr-example-vi">{currentCard.exampleVi}</div>
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--text-subtle)' }}>
                      Đánh giá độ nhớ của bạn bên dưới 👇
                    </div>
                  </div>
                </div>
              </div>

              {/* Hàng 4 nút đánh giá SRS */}
              <div className="kr-rating-row">
                <button
                  type="button"
                  className="btn-kr-rating again"
                  onClick={() => handleReview('again')}
                >
                  <span style={{ fontSize: 13, fontWeight: 800 }}>Quên</span>
                  <span style={{ fontSize: 10.5, opacity: 0.85 }}>+1 ngày</span>
                </button>
                <button
                  type="button"
                  className="btn-kr-rating hard"
                  onClick={() => handleReview('hard')}
                >
                  <span style={{ fontSize: 13, fontWeight: 800 }}>Hơi khó</span>
                  <span style={{ fontSize: 10.5, opacity: 0.85 }}>+2 ngày</span>
                </button>
                <button
                  type="button"
                  className="btn-kr-rating good"
                  onClick={() => handleReview('good')}
                >
                  <span style={{ fontSize: 13, fontWeight: 800 }}>Nhớ tốt</span>
                  <span style={{ fontSize: 10.5, opacity: 0.85 }}>+4 ngày</span>
                </button>
                <button
                  type="button"
                  className="btn-kr-rating easy"
                  onClick={() => handleReview('easy')}
                >
                  <span style={{ fontSize: 13, fontWeight: 800 }}>Quá dễ</span>
                  <span style={{ fontSize: 10.5, opacity: 0.85 }}>+7 ngày</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 3. CHẾ ĐỘ 2: THƯ VIỆN TỪ VỰNG (LIBRARY) */}
      {activeSubTab === 'library' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
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

          {/* Ô tìm kiếm */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              padding: '7px 14px',
            }}
          >
            <Search size={15} color="#94a3b8" />
            <input
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: 13,
                width: '100%',
              }}
              placeholder="Tìm từ vựng tiếng Hàn, phiên âm hoặc nghĩa tiếng Việt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Lưới danh sách từ */}
          {filteredLibrary.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
              <BookOpen size={40} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
              <div>Không tìm thấy từ vựng nào phù hợp</div>
            </div>
          ) : (
            <div className="kr-vocab-grid">
              {filteredLibrary.map((w) => (
                <div key={w.id} className="kr-vocab-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="kr-card-hangeul">
                      {w.hangeul}
                      <span style={{ fontSize: 12, color: '#fb7185', fontWeight: 500 }}>
                        [{w.romanization}]
                      </span>
                    </div>
                    <button
                      type="button"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                      title="Nghe phát âm"
                      onClick={() => speakKorean(w.hangeul)}
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>

                  <div className="kr-card-vi">{w.meaningVi}</div>

                  {w.hanjaVi && (
                    <div style={{ fontSize: 11, color: '#fcd34d', fontWeight: 600 }}>
                      Gốc Hán-Hàn: {w.hanjaVi}
                    </div>
                  )}

                  {w.exampleKo && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', borderLeft: '2px solid rgba(255, 255, 255, 0.15)', paddingLeft: 8, marginTop: 4 }}>
                      <div>"{w.exampleKo}"</div>
                      <div style={{ color: 'var(--text-subtle)', fontSize: 11 }}>{w.exampleVi}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
