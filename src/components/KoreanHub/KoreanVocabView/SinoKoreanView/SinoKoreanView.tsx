import React, { useState, useMemo } from 'react';
import {
  Search,
  Volume2,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  Trophy,
} from 'lucide-react';
import { SINO_KOREAN_ROOTS } from '../../../../constants/sinoKoreanData';
import { speakKorean } from '../../../../constants/koreanData';
import './SinoKoreanView.css';

const CATEGORIES = [
  { key: 'all', label: 'Tất cả gốc (12+)' },
  { key: 'core', label: '🌟 Cốt lõi' },
  { key: 'people', label: '👤 Con người' },
  { key: 'places', label: '🏫 Địa điểm' },
  { key: 'actions', label: '🏃 Hành động' },
  { key: 'objects', label: '💡 Thiết bị' },
];

export const SinoKoreanView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tree' | 'quiz'>('tree');
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRootId, setSelectedRootId] = useState<string>('sino-hak');

  // Mini quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // Lọc danh sách gốc chữ
  const filteredRoots = useMemo(() => {
    let list = SINO_KOREAN_ROOTS;
    if (selectedCat !== 'all') {
      list = list.filter((r) => r.category === selectedCat);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.root.includes(q) ||
          r.hanjaVi.toLowerCase().includes(q) ||
          r.meaningVi.toLowerCase().includes(q) ||
          r.compounds.some(
            (c) =>
              c.word.includes(q) ||
              c.meaningVi.toLowerCase().includes(q) ||
              c.hanja.includes(q),
          ),
      );
    }
    return list;
  }, [selectedCat, search]);

  const activeRoot =
    filteredRoots.find((r) => r.id === selectedRootId) || filteredRoots[0] || SINO_KOREAN_ROOTS[0];

  // Danh sách câu đố ghép chữ
  const quizList = useMemo(() => {
    return [
      {
        question: 'Gốc "학" (Học) ghép với gốc "생" (Sinh) tạo thành từ gì?',
        formula: '학 [Học] + 생 [Sinh] = ?',
        options: ['학생 (Học sinh)', '학교 (Trường học)', '선생님 (Thầy giáo)', '동생 (Em)'],
        correct: '학생 (Học sinh)',
        explanation: '학 (Học) + 생 (Sinh) = 학생 nghĩa là người học, học sinh.',
      },
      {
        question: 'Gốc "전" (Điện) ghép với gốc "화" (Thoại) tạo thành từ gì?',
        formula: '전 [Điện] + 화 [Thoại] = ?',
        options: ['전화 (Điện thoại)', '전철 (Tàu điện)', '대화 (Đối thoại)', '전기 (Điện)'],
        correct: '전화 (Điện thoại)',
        explanation: '전 (Điện) + 화 (Thoại/Lời nói) = 전화 nghĩa là thiết bị truyền giọng nói bằng điện (Điện thoại).',
      },
      {
        question: 'Gốc "병" (Bệnh) ghép với gốc "원" (Viện) tạo thành nơi nào?',
        formula: '병 [Bệnh] + 원 [Viện] = ?',
        options: ['병원 (Bệnh viện)', '학원 (Trung tâm)', '법원 (Tòa án)', '교실 (Lớp học)'],
        correct: '병원 (Bệnh viện)',
        explanation: '병 (Bệnh) + 원 (Viện/Tòa nhà) = 병원 nghĩa là nơi khám chữa bệnh (Bệnh viện).',
      },
      {
        question: 'Gốc "운" (Vận) ghép với gốc "동" (Động) tạo thành từ gì?',
        formula: '운 [Vận] + 동 [Động] = ?',
        options: ['운동 (Tập thể dục/Vận động)', '동작 (Động tác)', '자동차 (Ô tô)', '활동 (Hoạt động)'],
        correct: '운동 (Tập thể dục/Vận động)',
        explanation: '운 (Vận/Chuyển dịch) + 동 (Động/Di chuyển) = 운동 nghĩa là thể dục thể thao, vận động.',
      },
    ];
  }, []);

  const handleSelectQuiz = (opt: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(opt);
    setIsAnswerChecked(true);
    if (opt === quizList[quizIndex].correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    if (quizIndex < quizList.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizIndex(0);
    }
  };

  return (
    <div className="sino-container">
      {/* 1. THANH CÔNG CỤ & TÌM KIẾM */}
      <div className="sino-toolbar">
        <div className="sino-tabs-pill">
          <button
            type="button"
            className={`sino-tab-btn ${activeTab === 'tree' ? 'active' : ''}`}
            onClick={() => setActiveTab('tree')}
          >
            <BookOpen size={14} />
            Cây Gia Phả Hán-Hàn 🌳
          </button>
          <button
            type="button"
            className={`sino-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <Sparkles size={14} />
            Mini Game Ghép Gốc Chữ 🎮
          </button>
        </div>

        {activeTab === 'tree' && (
          <div className="sino-search-wrap">
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Tìm theo gốc: 학, sinh, nhân, viện, thực..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sino-search-input"
            />
          </div>
        )}
      </div>

      {activeTab === 'tree' ? (
        <div className="sino-tree-layout">
          {/* Cột 1: Danh sách các gốc Hán-Hàn */}
          <div className="sino-roots-sidebar">
            {/* Phân loại nhanh */}
            <div className="sino-cat-bar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`sino-cat-chip ${selectedCat === cat.key ? 'active' : ''}`}
                  onClick={() => setSelectedCat(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Danh sách chip các gốc */}
            <div className="sino-roots-grid">
              {filteredRoots.map((r) => {
                const isSelected = r.id === activeRoot?.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    className={`sino-root-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedRootId(r.id)}
                  >
                    <div className="chip-root-char">{r.root}</div>
                    <div className="chip-info">
                      <span className="chip-hanja-vi">[{r.hanjaVi}]</span>
                      <span className="chip-count">{r.compounds.length} từ</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cột 2: Cây Phả Hệ Chi Tiết Của Gốc Được Chọn */}
          {activeRoot && (
            <div className="sino-detail-panel">
              {/* Header Gốc Trung Tâm */}
              <div className="sino-hub-center-card">
                <div className="hub-center-glyph-wrap">
                  <span className="hub-center-hanja">{activeRoot.hanja}</span>
                  <span className="hub-center-hangeul">{activeRoot.root}</span>
                </div>

                <div className="hub-center-meta">
                  <div className="hub-center-title-row">
                    <span className="hub-vi-name">Âm Hán-Việt: <strong>{activeRoot.hanjaVi}</strong></span>
                    <button
                      type="button"
                      className="hub-audio-btn"
                      onClick={() => speakKorean(activeRoot.root)}
                      title="Phát âm gốc chữ"
                    >
                      <Volume2 size={16} />
                      Nghe âm
                    </button>
                  </div>
                  <div className="hub-meaning-text">Ý nghĩa: {activeRoot.meaningVi}</div>
                  <div className="hub-pedagogical-desc">{activeRoot.description}</div>
                </div>
              </div>

              {/* Mạng lưới các từ phái sinh (Compounds) */}
              <div className="sino-compounds-section">
                <div className="compounds-section-title">
                  <span>Mạng lưới từ vựng ghép từ gốc <strong>"{activeRoot.root}"</strong> ({activeRoot.compounds.length} từ)</span>
                  <span className="compounds-badge-tip">Học 1 gốc nhớ 10 từ</span>
                </div>

                <div className="sino-compounds-grid">
                  {activeRoot.compounds.map((comp, idx) => (
                    <div key={idx} className="sino-compound-card">
                      <div className="compound-top-row">
                        <div className="compound-word-group">
                          <span className="compound-hangeul">{comp.word}</span>
                          <span className="compound-hanja">[{comp.hanja}]</span>
                        </div>
                        <button
                          type="button"
                          className="compound-audio-btn"
                          onClick={() => speakKorean(comp.word)}
                          title="Nghe phát âm"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>

                      <div className="compound-meaning-vi">{comp.meaningVi}</div>

                      {comp.exampleKo && (
                        <div className="compound-example-box">
                          <div className="example-ko-text">
                            <span
                              style={{ cursor: 'pointer' }}
                              onClick={() => speakKorean(comp.exampleKo!)}
                            >
                              🔊 {comp.exampleKo}
                            </span>
                          </div>
                          <div className="example-vi-text">{comp.exampleVi}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: MINI GAME GHÉP GỐC CHỮ */
        <div className="sino-quiz-card">
          <div className="quiz-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trophy size={20} color="#fbbf24" />
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
                Thử Thách Ghép Gốc Chữ Hán-Hàn (Câu {quizIndex + 1}/{quizList.length})
              </span>
            </div>
            <span className="quiz-score-pill">Điểm: {quizScore}</span>
          </div>

          <div className="quiz-question-box">
            <div className="quiz-question-text">{quizList[quizIndex].question}</div>
            <div className="quiz-formula-badge">{quizList[quizIndex].formula}</div>
          </div>

          <div className="quiz-options-grid">
            {quizList[quizIndex].options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === quizList[quizIndex].correct;
              let btnClass = 'quiz-option-btn';

              if (isAnswerChecked) {
                if (isCorrect) btnClass += ' correct';
                else if (isSelected) btnClass += ' incorrect';
              }

              return (
                <button
                  key={i}
                  type="button"
                  className={btnClass}
                  onClick={() => handleSelectQuiz(opt)}
                >
                  <span>{opt}</span>
                  {isAnswerChecked && isCorrect && <CheckCircle2 size={16} color="#10b981" />}
                  {isAnswerChecked && isSelected && !isCorrect && (
                    <XCircle size={16} color="#ef4444" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswerChecked && (
            <div className="quiz-feedback-box">
              <div className="feedback-explanation">
                <strong>💡 Giải thích:</strong> {quizList[quizIndex].explanation}
              </div>
              <button
                type="button"
                className="quiz-next-btn"
                onClick={handleNextQuiz}
              >
                <span>{quizIndex < quizList.length - 1 ? 'Câu tiếp theo' : 'Làm lại thử thách'}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
