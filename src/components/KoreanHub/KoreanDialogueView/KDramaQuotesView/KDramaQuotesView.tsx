import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  Music,
  Film,
  Search,
  Copy,
  Check,
  Plus,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Heart,
} from 'lucide-react';
import { KDRAMA_QUOTES } from '../../../../constants/kdramaQuotesData';
import type { KDramaQuoteItem } from '../../../../constants/kdramaQuotesData';
import { speakKorean } from '../../../../constants/koreanData';
import type { KoreanVocabWord } from '../../../../types/korean';
import './KDramaQuotesView.css';

interface KDramaQuotesViewProps {
  hideRomanization?: boolean;
}

export const KDramaQuotesView: React.FC<KDramaQuotesViewProps> = ({
  hideRomanization = false,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'kpop' | 'kdrama'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCopy = (item: KDramaQuoteItem) => {
    const textToCopy = `${item.korean}\n(${item.vietnamese})\n— ${item.sourceTitle} (${item.artistOrActor})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToFlashcards = (item: KDramaQuoteItem) => {
    try {
      const savedCards: KoreanVocabWord[] = JSON.parse(
        localStorage.getItem('korean_vocab_cards') || '[]',
      );
      // Kiểm tra trùng
      const exists = savedCards.some((c) => c.hangeul === item.korean);
      if (!exists) {
        const newCard: KoreanVocabWord = {
          id: `kdrama-${item.id}-${Date.now()}`,
          hangeul: item.korean,
          romanization: item.romanization,
          meaningVi: item.vietnamese,
          partOfSpeech: 'phrase',
          topic: 'daily',
          level: 'Custom',
          exampleKo: item.korean,
          exampleVi: item.vietnamese,
          repetition: 0,
          intervalDays: 0,
          easeFactor: 2.5,
          status: 'new',
          isMachineTranslated: false,
          nextReviewDate: new Date().toISOString().split('T')[0],
        };
        savedCards.unshift(newCard);
        localStorage.setItem('korean_vocab_cards', JSON.stringify(savedCards));
      }
      setSavedId(item.id);
      setTimeout(() => setSavedId(null), 2000);
    } catch (err) {
      console.warn('Lỗi lưu thẻ Flashcard:', err);
    }
  };

  const filteredQuotes = KDRAMA_QUOTES.filter((q) => {
    const matchesCategory = filterCategory === 'all' || q.category === filterCategory;
    const matchesSearch =
      q.sourceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.artistOrActor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.korean.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.vietnamese.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="kdrama-quotes-container">
      {/* 1. Header Banner Giới Thiệu */}
      <div className="kdrama-hero-card">
        <div className="kdrama-hero-left">
          <div className="kdrama-hero-badge">
            <Sparkles size={13} color="#f43f5e" />
            <span>Học Tiếng Hàn Cảm Xúc</span>
          </div>
          <h3 className="kdrama-hero-title">
            Giải Mã Lời Bài Hát K-Pop & Câu Thoại K-Drama 🌸🎬
          </h3>
          <p className="kdrama-hero-desc">
            Bóc tách từng từ vựng và ngữ pháp ẩn sau các bản hit và phân cảnh phim Hàn kinh điển bạn yêu thích.
          </p>
        </div>

        {/* Thanh tìm kiếm & lọc */}
        <div className="kdrama-hero-controls">
          <div className="kdrama-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Tìm bài hát, phim, ca sĩ, lời thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="kdrama-search-input"
            />
          </div>

          <div className="kdrama-filter-tabs">
            <button
              type="button"
              className={`kdrama-filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              🌟 Tất Cả ({KDRAMA_QUOTES.length})
            </button>
            <button
              type="button"
              className={`kdrama-filter-btn ${filterCategory === 'kpop' ? 'active' : ''}`}
              onClick={() => setFilterCategory('kpop')}
            >
              <Music size={13} />
              K-Pop Hits
            </button>
            <button
              type="button"
              className={`kdrama-filter-btn ${filterCategory === 'kdrama' ? 'active' : ''}`}
              onClick={() => setFilterCategory('kdrama')}
            >
              <Film size={13} />
              K-Drama Phim
            </button>
          </div>
        </div>
      </div>

      {/* 2. Danh Sách Các Câu Trích Dẫn */}
      <div className="kdrama-quotes-grid">
        {filteredQuotes.map((item) => {
          const isExpanded = expandedId === item.id;
          const isCopied = copiedId === item.id;
          const isSaved = savedId === item.id;

          return (
            <div key={item.id} className="kdrama-quote-card">
              {/* Header của thẻ */}
              <div className="quote-card-header">
                <div className="quote-card-source">
                  <span className="source-badge-icon">{item.badgeIcon}</span>
                  <div className="source-titles">
                    <span className="source-title-main">{item.sourceTitle}</span>
                    <span className="source-artist">
                      {item.artistOrActor} {item.year ? `• ${item.year}` : ''}
                    </span>
                  </div>
                </div>

                <span className={`quote-category-tag ${item.category}`}>
                  {item.category === 'kpop' ? '🎵 K-Pop' : '🎬 K-Drama'}
                </span>
              </div>

              {/* Nội dung câu tiếng Hàn */}
              <div className="quote-body">
                <div className="quote-korean-row">
                  <div className="quote-korean-text">{item.korean}</div>
                  <button
                    type="button"
                    className="btn-quote-speak"
                    onClick={() => speakKorean(item.audioText || item.korean)}
                    title="Nghe phát âm chuẩn bản xứ"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>

                {!hideRomanization && (
                  <div className="quote-roman-text">{item.romanization}</div>
                )}

                <div className="quote-vietnamese-text">
                  "{item.vietnamese}"
                </div>

                {/* Hoàn cảnh cảm xúc */}
                <div className="quote-context-box">
                  <Heart size={12} className="heart-icon" />
                  <span>{item.emotionalContext}</span>
                </div>
              </div>

              {/* Vùng Bóc Tách Từng Từ & Ngữ Pháp (Accordion) */}
              <div className="quote-breakdown-section">
                <button
                  type="button"
                  className="btn-toggle-breakdown"
                  onClick={() => toggleExpand(item.id)}
                >
                  <BookOpen size={13} />
                  <span>
                    {isExpanded ? 'Thu gọn phân tích' : '🔍 Bóc tách từng từ & ngữ pháp'}
                  </span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {isExpanded && (
                  <div className="quote-breakdown-content">
                    {/* Danh sách từ vựng trong câu */}
                    <div className="breakdown-words-grid">
                      {item.breakdown.map((w, idx) => (
                        <div key={idx} className="breakdown-word-chip">
                          <div className="chip-top">
                            <span className="chip-word">{w.word}</span>
                            <button
                              type="button"
                              className="btn-chip-audio"
                              onClick={() => speakKorean(w.word)}
                              title={`Nghe "${w.word}"`}
                            >
                              <Volume2 size={11} />
                            </button>
                          </div>
                          <span className="chip-meaning">{w.meaning}</span>
                          {w.role && <span className="chip-role">{w.role}</span>}
                        </div>
                      ))}
                    </div>

                    {/* Mẹo ngữ pháp */}
                    <div className="breakdown-grammar-tip">
                      <div className="grammar-tip-title">
                        <Sparkles size={12} color="#f43f5e" />
                        <span>Ngữ Pháp Trọng Tâm:</span>
                      </div>
                      <p className="grammar-tip-text">{item.grammarTip}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Thẻ: Nút Sao Chép & Lưu Flashcard */}
              <div className="quote-card-footer">
                <button
                  type="button"
                  className={`btn-quote-action ${isCopied ? 'copied' : ''}`}
                  onClick={() => handleCopy(item)}
                  title="Sao chép câu tiếng Hàn & dịch nghĩa"
                >
                  {isCopied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  <span>{isCopied ? 'Đã chép' : 'Sao chép'}</span>
                </button>

                <button
                  type="button"
                  className={`btn-quote-action save-card ${isSaved ? 'saved' : ''}`}
                  onClick={() => handleSaveToFlashcards(item)}
                  title="Lưu câu này vào kho Flashcard SRS để ôn tập"
                >
                  {isSaved ? <Check size={13} color="#10b981" /> : <Plus size={13} />}
                  <span>{isSaved ? 'Đã lưu Flashcard' : 'Lưu Flashcard'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="kdrama-empty-state">
          <span>🌸</span>
          <p>Không tìm thấy bài hát hay câu thoại nào phù hợp với "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};
