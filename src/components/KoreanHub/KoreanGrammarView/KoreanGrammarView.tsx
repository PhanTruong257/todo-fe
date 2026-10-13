import React, { useState, useMemo } from 'react';
import {
  Volume2,
  BookMarked,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { KOREAN_GRAMMAR_LIST, speakKorean } from '../../../constants/koreanData';
import type { GrammarExercise } from '../../../types/korean';
import './KoreanGrammarView.css';

export const KoreanGrammarView: React.FC = () => {
  // Mặc định mở 2 bài đầu
  const [expandedIds, setExpandedIds] = useState<string[]>(['g-1', 'g-2']);
  const [searchQuery, setSearchQuery] = useState('');

  // Trạng thái làm bài tập tương tác
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setExpandedIds(KOREAN_GRAMMAR_LIST.map((g) => g.id));
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  // Lọc bài ngữ pháp theo tìm kiếm
  const filteredGrammar = useMemo(() => {
    if (!searchQuery.trim()) return KOREAN_GRAMMAR_LIST;
    const q = searchQuery.toLowerCase();
    return KOREAN_GRAMMAR_LIST.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.formula.toLowerCase().includes(q) ||
        g.explanation.toLowerCase().includes(q) ||
        g.examples.some((ex) => ex.korean.includes(q) || ex.vietnamese.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleSelectExerciseOption = (exerciseId: string, option: string) => {
    setExerciseAnswers((prev) => ({
      ...prev,
      [exerciseId]: option,
    }));
  };

  return (
    <div className="kr-grammar-container">
      {/* Header */}
      <div className="kr-grammar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookMarked size={20} color="#f43f5e" />
          <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
            Sổ Tay 16 Chủ Điểm Ngữ Pháp Sơ Cấp & Bài Tập
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            className="kr-grammar-action-btn"
            onClick={expandAll}
          >
            Mở tất cả
          </button>
          <button
            type="button"
            className="kr-grammar-action-btn"
            onClick={collapseAll}
          >
            Thu gọn
          </button>
        </div>
      </div>

      {/* Ô tìm kiếm ngữ pháp */}
      <div className="kr-grammar-search-wrap">
        <Search size={15} color="#94a3b8" />
        <input
          type="text"
          placeholder="Tìm chủ điểm: 이다, 있다/없다, 은/는, 이/가, quá khứ, phủ định..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="kr-grammar-search-input"
        />
        {searchQuery && (
          <button
            type="button"
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            onClick={() => setSearchQuery('')}
          >
            ✕
          </button>
        )}
      </div>

      {/* Danh sách 16 bài ngữ pháp */}
      <div className="kr-grammar-list">
        {filteredGrammar.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
            <HelpCircle size={24} style={{ display: 'block', margin: '0 auto 8px auto' }} />
            Không tìm thấy chủ điểm ngữ pháp phù hợp với từ khóa "{searchQuery}".
          </div>
        ) : (
          filteredGrammar.map((item, idx) => {
            const isExpanded = expandedIds.includes(item.id);
            return (
              <div key={item.id} className="kr-grammar-card">
                <div className="kr-grammar-top-row" onClick={() => toggleExpand(item.id)}>
                  <div className="kr-grammar-title">
                    <span style={{ color: '#f43f5e' }}>#{idx + 1}</span>
                    {item.title}
                  </div>
                  <button
                    type="button"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                <div className="kr-formula-badge">
                  Công thức: {item.formula}
                </div>

                {isExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                    <div className="kr-explanation-text">
                      {item.explanation}
                    </div>

                    {item.tips && (
                      <div className="kr-tips-box">
                        <Lightbulb size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        {item.tips}
                      </div>
                    )}

                    {/* Bảng ví dụ */}
                    <div className="kr-examples-table">
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
                        Câu ví dụ minh họa:
                      </span>
                      {item.examples.map((ex, exIdx) => (
                        <div key={exIdx} className="kr-example-item">
                          <div>
                            <div className="kr-ex-ko">{ex.korean}</div>
                            <div className="kr-ex-vi">{ex.vietnamese}</div>
                            {ex.breakdown && (
                              <div className="kr-ex-breakdown">Phân tích: {ex.breakdown}</div>
                            )}
                          </div>
                          <button
                            type="button"
                            className="kr-ex-speak-btn"
                            title="Nghe phát âm"
                            onClick={() => speakKorean(ex.korean)}
                          >
                            <Volume2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Vùng Bài Tập Tự Động / Active Practice Exercises */}
                    {item.exercises && item.exercises.length > 0 && (
                      <div className="kr-grammar-exercises-box">
                        <div className="kr-exercises-header">
                          <Sparkles size={14} color="#f43f5e" />
                          <span>Luyện tập thực hành nhanh ({item.exercises.length} câu):</span>
                        </div>
                        {item.exercises.map((ex: GrammarExercise) => {
                          const chosen = exerciseAnswers[ex.id];
                          const isDone = !!chosen;
                          const isCorrect = chosen === ex.correctAnswer;

                          return (
                            <div key={ex.id} className="kr-single-exercise-card">
                              <div className="kr-exercise-q">{ex.questionKo}</div>
                              <div className="kr-exercise-options-row">
                                {ex.options.map((opt) => {
                                  let optClass = 'kr-ex-opt-btn';
                                  if (isDone) {
                                    if (opt === ex.correctAnswer) optClass += ' correct';
                                    else if (chosen === opt) optClass += ' wrong';
                                    else optClass += ' dimmed';
                                  }
                                  return (
                                    <button
                                      key={opt}
                                      type="button"
                                      className={optClass}
                                      onClick={() => handleSelectExerciseOption(ex.id, opt)}
                                      disabled={isDone}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {isDone && (
                                <div className={`kr-exercise-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
                                  {isCorrect ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <CheckCircle2 size={15} color="#10b981" />
                                      <span><strong>Chính xác!</strong> {ex.explanation}</span>
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <XCircle size={15} color="#f43f5e" />
                                      <span>
                                        <strong>Chưa đúng!</strong> {ex.ruleHint} (Đáp án đúng: <strong>{ex.correctAnswer}</strong>)
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
