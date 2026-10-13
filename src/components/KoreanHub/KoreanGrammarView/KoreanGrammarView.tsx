import React, { useState } from 'react';
import { Volume2, BookMarked, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { KOREAN_GRAMMAR_LIST, speakKorean } from '../../../constants/koreanData';
import './KoreanGrammarView.css';

export const KoreanGrammarView: React.FC = () => {
  // Mặc định mở bài đầu tiên
  const [expandedIds, setExpandedIds] = useState<string[]>(['g-1', 'g-2']);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const expandAll = () => {
    setExpandedIds(KOREAN_GRAMMAR_LIST.map((g) => g.id));
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  return (
    <div className="kr-grammar-container">
      {/* Header */}
      <div className="kr-grammar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookMarked size={20} color="#f43f5e" />
          <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
            Sổ Tay 8 Chủ Điểm Ngữ Pháp Sơ Cấp
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={expandAll}
          >
            Mở tất cả
          </button>
          <button
            type="button"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={collapseAll}
          >
            Thu gọn
          </button>
        </div>
      </div>

      {/* Danh sách 8 bài ngữ pháp */}
      <div className="kr-grammar-list">
        {KOREAN_GRAMMAR_LIST.map((item, idx) => {
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
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
                          style={{
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: 'none',
                            color: '#a5b4fc',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                          title="Nghe phát âm"
                          onClick={() => speakKorean(ex.korean)}
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
