import React, { useState } from 'react';
import {
  Volume2,
  Languages,
  MessageSquare,
  ArrowRightLeft,
  Copy,
  Check,
  Plus,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { KOREAN_DIALOGUES, speakKorean } from '../../../constants/koreanData';
import type { KoreanVocabWord } from '../../../types/korean';
import './KoreanDialogueView.css';

const CATEGORIES = [
  { key: 'all', label: '🌟 Tất cả (15+ câu)' },
  { key: 'chao_hoi', label: '🙋 Chào hỏi & Làm quen' },
  { key: 'nha_hang', label: '🍜 Gọi món quán ăn' },
  { key: 'mua_sam', label: '🛍️ Mua sắm & Hỏi giá' },
  { key: 'di_lai', label: '🚇 Hỏi đường & Đi lại' },
  { key: 'khan_cap', label: '🚨 Khẩn cấp & Cần giúp' },
];

export const KoreanDialogueView: React.FC = () => {
  const [subTab, setSubTab] = useState<'dialogue' | 'translator'>('dialogue');
  const [selectedCat, setSelectedCat] = useState('all');

  // Translator State
  const [direction, setDirection] = useState<'vi-to-ko' | 'ko-to-vi'>('vi-to-ko');
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Lọc mẫu câu
  const filteredDialogues = KOREAN_DIALOGUES.filter(
    (d) => selectedCat === 'all' || d.category === selectedCat,
  );

  // Xử lý Dịch thuật 2 chiều qua Google GTX API miễn phí
  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setIsSaved(false);

    const fromLang = direction === 'vi-to-ko' ? 'vi' : 'ko';
    const toLang = direction === 'vi-to-ko' ? 'ko' : 'vi';

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(
        inputText.trim(),
      )}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Dịch thất bại');
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => item[0]).join('');
        setResultText(translated);
      }
    } catch (err) {
      console.warn('Lỗi dịch:', err);
      setResultText('Không thể kết nối dịch vụ dịch. Vui lòng thử lại sau.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveToFlashcard = () => {
    if (!resultText) return;
    try {
      const savedCards: KoreanVocabWord[] = JSON.parse(
        localStorage.getItem('korean_vocab_cards') || '[]',
      );
      const isViToKo = direction === 'vi-to-ko';
      const newCard: KoreanVocabWord = {
        id: `custom-ko-${Date.now()}`,
        hangeul: isViToKo ? resultText : inputText,
        romanization: '',
        meaningVi: isViToKo ? inputText : resultText,
        partOfSpeech: 'phrase',
        topic: 'daily',
        level: 'Custom',
        exampleKo: isViToKo ? resultText : inputText,
        exampleVi: isViToKo ? inputText : resultText,
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        status: 'new',
        nextReviewDate: new Date().toISOString().split('T')[0],
      };

      savedCards.unshift(newCard);
      localStorage.setItem('korean_vocab_cards', JSON.stringify(savedCards));
      setIsSaved(true);
    } catch (err) {
      console.warn('Lỗi lưu flashcard:', err);
    }
  };

  return (
    <div className="kr-dialogue-container">
      {/* 1. THANH CHUYỂN CHẾ ĐỘ */}
      <div className="kr-dl-toolbar">
        <div className="kr-dl-subtabs">
          <button
            type="button"
            className={`kr-dl-tab-btn ${subTab === 'dialogue' ? 'active' : ''}`}
            onClick={() => setSubTab('dialogue')}
          >
            <MessageSquare size={14} />
            Mẫu Câu Sống Còn ({KOREAN_DIALOGUES.length})
          </button>
          <button
            type="button"
            className={`kr-dl-tab-btn ${subTab === 'translator' ? 'active' : ''}`}
            onClick={() => setSubTab('translator')}
          >
            <Languages size={14} />
            Công Cụ Dịch Hàn ⇄ Việt
          </button>
        </div>
      </div>

      {/* 2. CHẾ ĐỘ 1: MẪU CÂU GIAO TIẾP SỐNG CÒN */}
      {subTab === 'dialogue' && (
        <>
          {/* Thanh phân loại tình huống */}
          <div className="kr-categories-bar">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`kr-cat-pill ${selectedCat === c.key ? 'active' : ''}`}
                onClick={() => setSelectedCat(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Lưới danh sách câu */}
          <div className="kr-dialogue-grid">
            {filteredDialogues.map((item) => (
              <div key={item.id} className="kr-dialogue-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="kr-dl-korean">{item.korean}</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      type="button"
                      style={{
                        background: 'rgba(244, 63, 94, 0.15)',
                        border: 'none',
                        color: '#fb7185',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      title="Nghe tốc độ bình thường"
                      onClick={() => speakKorean(item.korean, 0.9)}
                    >
                      <Volume2 size={14} />
                    </button>
                    <button
                      type="button"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: 'none',
                        color: 'var(--text-muted)',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: 12,
                      }}
                      title="Nghe đọc chậm (0.65x)"
                      onClick={() => speakKorean(item.korean, 0.65)}
                    >
                      🐢
                    </button>
                  </div>
                </div>

                <div className="kr-dl-roman">[{item.romanization}]</div>
                <div className="kr-dl-vi">{item.vietnamese}</div>
                <div className="kr-dl-situation">💡 {item.situation}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 3. CHẾ ĐỘ 2: CÔNG CỤ DỊCH THUẬT HÀN ⇄ VIỆT */}
      {subTab === 'translator' && (
        <div className="kr-translator-box">
          <div className="kr-trans-direction">
            <div className="kr-lang-pill">
              {direction === 'vi-to-ko' ? '🇻🇳 Tiếng Việt' : '🇰🇷 Tiếng Hàn'}
            </div>
            <button
              type="button"
              className="btn-swap-lang"
              onClick={() => {
                setDirection((prev) => (prev === 'vi-to-ko' ? 'ko-to-vi' : 'vi-to-ko'));
                setInputText(resultText);
                setResultText('');
              }}
            >
              <ArrowRightLeft size={13} />
              Đổi chiều dịch
            </button>
            <div className="kr-lang-pill">
              {direction === 'vi-to-ko' ? '🇰🇷 Tiếng Hàn' : '🇻🇳 Tiếng Việt'}
            </div>
          </div>

          {/* Ô nhập văn bản cần dịch */}
          <textarea
            className="kr-trans-input"
            placeholder={
              direction === 'vi-to-ko'
                ? 'Nhập từ hoặc câu tiếng Việt cần dịch (ví dụ: Xin lỗi, cho tôi hỏi đường đi ga tàu)...'
                : 'Nhập câu tiếng Hàn cần dịch (ví dụ: 안녕하세요, 반갑습니다)...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button
            type="button"
            className="btn-do-translate"
            onClick={handleTranslate}
            disabled={isTranslating || !inputText.trim()}
          >
            {isTranslating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            {isTranslating ? 'Đang dịch...' : 'Dịch Ngay ➔'}
          </button>

          {/* Khung kết quả dịch */}
          {resultText && (
            <div className="kr-trans-result-box animate-fade-in">
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>
                Bản dịch kết quả:
              </span>
              <div className="kr-trans-result-text">{resultText}</div>

              <div className="kr-trans-result-actions">
                {/* Phát âm nếu kết quả là tiếng Hàn */}
                {direction === 'vi-to-ko' && (
                  <button
                    type="button"
                    className="btn-trans-act"
                    onClick={() => speakKorean(resultText)}
                  >
                    <Volume2 size={13} />
                    Nghe phát âm
                  </button>
                )}

                <button
                  type="button"
                  className="btn-trans-act"
                  onClick={handleCopy}
                >
                  {isCopied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  {isCopied ? 'Đã copy' : 'Copy'}
                </button>

                <button
                  type="button"
                  className="btn-trans-act"
                  onClick={handleSaveToFlashcard}
                  disabled={isSaved}
                >
                  {isSaved ? <Check size={13} color="#10b981" /> : <Plus size={13} />}
                  {isSaved ? 'Đã lưu vào Flashcard' : 'Lưu Flashcard'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
