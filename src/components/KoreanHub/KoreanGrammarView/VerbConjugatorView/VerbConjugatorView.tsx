import React, { useState, useMemo } from 'react';
import {
  Search,
  Volume2,
  Zap,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { VERB_CONJUGATION_DATABASE } from '../../../../utils/koreanConjugator';
import type { VerbConjugation } from '../../../../types/korean';
import { speakKorean } from '../../../../constants/koreanData';
import './VerbConjugatorView.css';

const FILTER_TABS = [
  { key: 'all', label: 'Tất cả (18+)' },
  { key: 'irregular_b', label: 'Bất quy tắc ㅂ (춥다, 덥다)' },
  { key: 'irregular_d', label: 'Bất quy tắc ㄷ (듣다, 걷다)' },
  { key: 'irregular_eu', label: 'Bất quy tắc ㅡ/르 (예쁘다, 빠르다)' },
  { key: 'regular', label: 'Động từ quy tắc (가다, 먹다)' },
];

export const VerbConjugatorView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'lookup' | 'drill'>('lookup');
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedVerb, setSelectedVerb] = useState<VerbConjugation>(
    VERB_CONJUGATION_DATABASE[0],
  );

  // Drill state
  const [drillIndex, setDrillIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [drillChecked, setDrillChecked] = useState(false);
  const [drillScore, setDrillScore] = useState(0);

  // Lọc động từ
  const filteredVerbs = useMemo(() => {
    let list = VERB_CONJUGATION_DATABASE;
    if (selectedType !== 'all') {
      if (selectedType === 'irregular_eu') {
        list = list.filter((v) => v.type === 'irregular_eu' || v.type === 'irregular_reu');
      } else {
        list = list.filter((v) => v.type === selectedType);
      }
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (v) =>
          v.root.includes(q) ||
          v.presentCasual.includes(q) ||
          v.meaningVi.toLowerCase().includes(q),
      );
    }
    return list;
  }, [selectedType, search]);

  // Bộ câu hỏi luyện tập chia nhanh
  const drillQuestions = useMemo(() => {
    return [
      {
        verb: '듣다 (Nghe)',
        prompt: 'Chia động từ "듣다" sang thì hiện tại thân mật (-아요/어요):',
        options: ['들어요', '듣어요', '듣아요', '들아요'],
        correct: '들어요',
        explanation: 'Bất quy tắc ㄷ: ㄷ biến thành ㄹ khi gặp nguyên âm ➔ 듣 + 어요 = 들어요.',
      },
      {
        verb: '춥다 (Lạnh)',
        prompt: 'Chia tính từ "춥다" sang thì hiện tại thân mật (-아요/어요):',
        options: ['추워요', '춥어요', '춥아요', '추와요'],
        correct: '추워요',
        explanation: 'Bất quy tắc ㅂ: ㅂ rụng và biến thành 워 khi gặp nguyên âm ➔ 추 + 워요 = 추워요.',
      },
      {
        verb: '가다 (Đi)',
        prompt: 'Chia động từ "가다" sang thì quá khứ (-았/었어요):',
        options: ['갔어요', '가았어요', '가었어요', '가했어요'],
        correct: '갔어요',
        explanation: 'Quy tắc nguyên âm sáng: 가 + 았어요 gộp chữ thành 갔어요.',
      },
      {
        verb: '빠르다 (Nhanh)',
        prompt: 'Chia tính từ "빠르다" sang thì hiện tại thân mật (-아요/어요):',
        options: ['빨라요', '빠러요', '빠라요', '빨러요'],
        correct: '빨라요',
        explanation: 'Bất quy tắc 르: Thêm patchim ㄹ cho âm trước và biến 르 thành 라 ➔ 빠 + ㄹ + 라요 = 빨라요.',
      },
      {
        verb: '먹다 (Ăn)',
        prompt: 'Chia động từ "먹다" sang thì tương lai (-(으)ㄹ 거예요):',
        options: ['먹을 거예요', '먹ㄹ 거예요', '먹을게요', '먹겠어요'],
        correct: '먹을 거예요',
        explanation: 'Động từ 먹- có patchim nên gắn -을 거예요 ➔ 먹을 거예요 (phát âm: [머글 거예요]).',
      },
    ];
  }, []);

  const handleSelectDrill = (opt: string) => {
    if (drillChecked) return;
    setSelectedAnswer(opt);
    setDrillChecked(true);
    if (opt === drillQuestions[drillIndex].correct) {
      setDrillScore((prev) => prev + 1);
      speakKorean(opt);
    }
  };

  const handleNextDrill = () => {
    setSelectedAnswer(null);
    setDrillChecked(false);
    if (drillIndex < drillQuestions.length - 1) {
      setDrillIndex((prev) => prev + 1);
    } else {
      setDrillIndex(0);
    }
  };

  return (
    <div className="verb-conj-container">
      {/* 1. Header Toolbar */}
      <div className="verb-conj-toolbar">
        <div className="verb-tabs-pill">
          <button
            type="button"
            className={`verb-tab-btn ${activeSubTab === 'lookup' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('lookup')}
          >
            <BookOpen size={14} />
            Bảng Tra Cứu Chia Động Từ
          </button>
          <button
            type="button"
            className={`verb-tab-btn ${activeSubTab === 'drill' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('drill')}
          >
            <Zap size={14} />
            Luyện Chia Động Từ Nhanh ⚡
          </button>
        </div>

        {activeSubTab === 'lookup' && (
          <div className="verb-search-wrap">
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Tìm động từ: 가다, 먹다, 듣다, lạnh, ăn, nghe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="verb-search-input"
            />
          </div>
        )}
      </div>

      {activeSubTab === 'lookup' ? (
        <div className="verb-lookup-layout">
          {/* Cột Trái: Danh sách động từ */}
          <div className="verb-list-panel">
            <div className="verb-filter-tabs">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`verb-filter-chip ${selectedType === tab.key ? 'active' : ''}`}
                  onClick={() => setSelectedType(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="verbs-scroll-grid">
              {filteredVerbs.map((v) => {
                const isSelected = v.root === selectedVerb.root;
                return (
                  <button
                    key={v.root}
                    type="button"
                    className={`verb-select-card ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedVerb(v)}
                  >
                    <div className="card-top-row">
                      <span className="verb-root-text">{v.root}</span>
                      <span className="verb-meaning-text">{v.meaningVi}</span>
                    </div>
                    <div className="card-type-label">{v.typeLabel}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cột Phải: Bảng 7 Thể Chia Chi Tiết */}
          <div className="verb-detail-panel">
            {/* Header Động Từ */}
            <div className="verb-hero-card">
              <div className="hero-left">
                <div className="hero-root-badge">
                  <span className="hero-root-korean">{selectedVerb.root}</span>
                  <button
                    type="button"
                    className="hero-audio-btn"
                    onClick={() => speakKorean(selectedVerb.root)}
                    title="Nghe nguyên thể"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <div className="hero-meta">
                  <div className="hero-meaning">Nghĩa: <strong>{selectedVerb.meaningVi}</strong></div>
                  <div className="hero-rule-tag">{selectedVerb.typeLabel}</div>
                </div>
              </div>
            </div>

            {/* Bảng 7 Thể Chia Câu */}
            <div className="conjugation-forms-grid">
              {/* 1. Hiện tại thân mật */}
              <div className="form-card highlight">
                <div className="form-card-header">
                  <span className="form-name">Hiện tại thân mật</span>
                  <span className="form-grammar-tag">-아요/어요</span>
                </div>
                <div className="form-result-row">
                  <span className="form-korean">{selectedVerb.presentCasual}</span>
                  <button
                    type="button"
                    className="form-audio-btn"
                    onClick={() => speakKorean(selectedVerb.presentCasual)}
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
                <div className="form-usage-hint">Hay dùng nhất trong đời sống hàng ngày</div>
              </div>

              {/* 2. Hiện tại kính ngữ */}
              <div className="form-card">
                <div className="form-card-header">
                  <span className="form-name">Trang trọng / Kính ngữ</span>
                  <span className="form-grammar-tag">-습니다/ㅂ니다</span>
                </div>
                <div className="form-result-row">
                  <span className="form-korean">{selectedVerb.presentFormal}</span>
                  <button
                    type="button"
                    className="form-audio-btn"
                    onClick={() => speakKorean(selectedVerb.presentFormal)}
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
                <div className="form-usage-hint">Dùng cho bài phát biểu, phỏng vấn, người lớn tuổi</div>
              </div>

              {/* 3. Thì Quá khứ */}
              <div className="form-card">
                <div className="form-card-header">
                  <span className="form-name">Thì Quá khứ</span>
                  <span className="form-grammar-tag">-았/었어요</span>
                </div>
                <div className="form-result-row">
                  <span className="form-korean">{selectedVerb.pastCasual}</span>
                  <button
                    type="button"
                    className="form-audio-btn"
                    onClick={() => speakKorean(selectedVerb.pastCasual)}
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
                <div className="form-usage-hint">Đã diễn ra trong quá khứ</div>
              </div>

              {/* 4. Thì Tương lai */}
              <div className="form-card">
                <div className="form-card-header">
                  <span className="form-name">Thì Tương lai / Dự định</span>
                  <span className="form-grammar-tag">-(으)ㄹ 거예요</span>
                </div>
                <div className="form-result-row">
                  <span className="form-korean">{selectedVerb.futureCasual}</span>
                  <button
                    type="button"
                    className="form-audio-btn"
                    onClick={() => speakKorean(selectedVerb.futureCasual)}
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
                <div className="form-usage-hint">Sẽ làm gì đó trong tương lai</div>
              </div>

              {/* 5. Phủ định ngắn */}
              <div className="form-card">
                <div className="form-card-header">
                  <span className="form-name">Dạng Phủ định</span>
                  <span className="form-grammar-tag">안 ~</span>
                </div>
                <div className="form-result-row">
                  <span className="form-korean">{selectedVerb.negativeCasual}</span>
                  <button
                    type="button"
                    className="form-audio-btn"
                    onClick={() => speakKorean(selectedVerb.negativeCasual)}
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
                <div className="form-usage-hint">Không làm / Không thực hiện</div>
              </div>

              {/* 6. Mong muốn */}
              <div className="form-card">
                <div className="form-card-header">
                  <span className="form-name">Nguyện vọng / Mong muốn</span>
                  <span className="form-grammar-tag">-고 싶어요</span>
                </div>
                <div className="form-result-row">
                  <span className="form-korean">{selectedVerb.wantCasual}</span>
                  <button
                    type="button"
                    className="form-audio-btn"
                    onClick={() => speakKorean(selectedVerb.wantCasual)}
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
                <div className="form-usage-hint">Tôi muốn làm điều này</div>
              </div>
            </div>

            {/* Mẹo Quy Tắc Sư Phạm */}
            <div className="verb-rule-explanation-box">
              <div className="rule-title-row">
                <HelpCircle size={16} color="#fbbf24" />
                <span className="rule-title">Quy tắc biến đổi chi tiết:</span>
              </div>
              <div className="rule-desc-text">{selectedVerb.explanation}</div>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: DRILL LUYỆN CHIA NHANH */
        <div className="drill-card-wrap">
          <div className="drill-header">
            <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
              Thử Thách Chia Động Từ (Câu {drillIndex + 1}/{drillQuestions.length})
            </span>
            <span className="drill-score-badge">Điểm: {drillScore}</span>
          </div>

          <div className="drill-question-box">
            <div className="drill-verb-badge">{drillQuestions[drillIndex].verb}</div>
            <div className="drill-prompt-text">{drillQuestions[drillIndex].prompt}</div>
          </div>

          <div className="drill-options-grid">
            {drillQuestions[drillIndex].options.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === drillQuestions[drillIndex].correct;
              let btnClass = 'drill-opt-btn';

              if (drillChecked) {
                if (isCorrect) btnClass += ' correct';
                else if (isSelected) btnClass += ' incorrect';
              }

              return (
                <button
                  key={i}
                  type="button"
                  className={btnClass}
                  onClick={() => handleSelectDrill(opt)}
                >
                  <span className="opt-hangeul">{opt}</span>
                  {drillChecked && isCorrect && <CheckCircle2 size={16} color="#10b981" />}
                  {drillChecked && isSelected && !isCorrect && (
                    <XCircle size={16} color="#ef4444" />
                  )}
                </button>
              );
            })}
          </div>

          {drillChecked && (
            <div className="drill-feedback-box">
              <div className="drill-exp-text">
                <strong>💡 Giải thích:</strong> {drillQuestions[drillIndex].explanation}
              </div>
              <button type="button" className="drill-next-btn" onClick={handleNextDrill}>
                <span>{drillIndex < drillQuestions.length - 1 ? 'Câu tiếp theo' : 'Luyện lại từ đầu'}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
