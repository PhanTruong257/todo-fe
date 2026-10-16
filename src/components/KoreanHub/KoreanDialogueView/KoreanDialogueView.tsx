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
  AlertTriangle,
  Eye,
  EyeOff,
  Music,
  Zap,
} from 'lucide-react';
import { KOREAN_DIALOGUES, speakKorean } from '../../../constants/koreanData';
import type { KoreanVocabWord } from '../../../types/korean';
import { RoleplayView } from './RoleplayView/RoleplayView';
import { KDramaQuotesView } from './KDramaQuotesView/KDramaQuotesView';
import { TongueTwisterView } from './TongueTwisterView/TongueTwisterView';
import './KoreanDialogueView.css';

const ROMAN_KEY = 'korean_hide_romanization';

const CATEGORIES = [
  { key: 'all', label: '🌟 Tất cả (15+ câu)' },
  { key: 'chao_hoi', label: '🙋 Chào hỏi & Làm quen' },
  { key: 'nha_hang', label: '🍜 Gọi món quán ăn' },
  { key: 'mua_sam', label: '🛍️ Mua sắm & Hỏi giá' },
  { key: 'di_lai', label: '🚇 Hỏi đường & Đi lại' },
  { key: 'khan_cap', label: '🚨 Khẩn cấp & Cần giúp' },
];

export const KoreanDialogueView: React.FC = () => {
  const [subTab, setSubTab] = useState<
    'dialogue' | 'roleplay' | 'kdrama' | 'tonguetwister' | 'translator'
  >('dialogue');
  const [selectedCat, setSelectedCat] = useState('all');

  // Romanization Toggle
  const [hideRomanization, setHideRomanization] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ROMAN_KEY) === 'true';
    }
    return false;
  });

  const toggleHideRomanization = () => {
    setHideRomanization((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(ROMAN_KEY, String(next));
      }
      return next;
    });
  };

  // Translator State
  const [direction, setDirection] = useState<'vi-to-ko' | 'ko-to-vi'>('vi-to-ko');
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Modal xác nhận lưu Machine Translation vào Flashcard
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [modalKo, setModalKo] = useState('');
  const [modalVi, setModalVi] = useState('');

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

  // Mở modal xác nhận & cho phép chỉnh sửa trước khi lưu
  const openSaveModal = () => {
    if (!resultText) return;
    const isViToKo = direction === 'vi-to-ko';
    setModalKo(isViToKo ? resultText : inputText);
    setModalVi(isViToKo ? inputText : resultText);
    setShowSaveModal(true);
  };

  const confirmSaveToFlashcard = () => {
    try {
      const savedCards: KoreanVocabWord[] = JSON.parse(
        localStorage.getItem('korean_vocab_cards') || '[]',
      );
      const newCard: KoreanVocabWord = {
        id: `custom-ko-${Date.now()}`,
        hangeul: modalKo.trim(),
        romanization: '',
        meaningVi: modalVi.trim(),
        partOfSpeech: 'phrase',
        topic: 'daily',
        level: 'Custom',
        exampleKo: modalKo.trim(),
        exampleVi: modalVi.trim(),
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        status: 'new',
        isMachineTranslated: true,
        nextReviewDate: new Date().toISOString().split('T')[0],
      };

      savedCards.unshift(newCard);
      localStorage.setItem('korean_vocab_cards', JSON.stringify(savedCards));
      setIsSaved(true);
      setShowSaveModal(false);
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
            className={`kr-dl-tab-btn ${subTab === 'roleplay' ? 'active' : ''}`}
            onClick={() => setSubTab('roleplay')}
          >
            <Sparkles size={14} />
            Nhập Vai Tình Huống 🎭
          </button>
          <button
            type="button"
            className={`kr-dl-tab-btn ${subTab === 'kdrama' ? 'active' : ''}`}
            onClick={() => setSubTab('kdrama')}
          >
            <Music size={14} />
            K-Drama & K-Pop 🎵
          </button>
          <button
            type="button"
            className={`kr-dl-tab-btn ${subTab === 'tonguetwister' ? 'active' : ''}`}
            onClick={() => setSubTab('tonguetwister')}
          >
            <Zap size={14} />
            Uốn Lưỡi Siêu Tốc 👅
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

        {/* Nút Toggle Phiên Âm */}
        <button
          type="button"
          className={`kr-dl-roman-btn ${hideRomanization ? 'hidden-mode' : ''}`}
          onClick={toggleHideRomanization}
          title={hideRomanization ? 'Đang ẩn phiên âm' : 'Đang hiện phiên âm'}
        >
          {hideRomanization ? <EyeOff size={13} color="#f43f5e" /> : <Eye size={13} color="#38bdf8" />}
          <span>{hideRomanization ? 'Ẩn Phiên Âm' : 'Hiện Phiên Âm'}</span>
        </button>
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

                {!hideRomanization ? (
                  <div className="kr-dl-roman">[{item.romanization}]</div>
                ) : (
                  <div className="kr-dl-roman-hidden">👁️</div>
                )}
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
                  onClick={openSaveModal}
                  disabled={isSaved}
                >
                  {isSaved ? <Check size={13} color="#10b981" /> : <Plus size={13} />}
                  {isSaved ? 'Đã lưu Flashcard' : 'Lưu Flashcard ⚠️'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CHẾ ĐỘ 2: NHẬP VAI TÌNH HUỐNG THỰC CHIẾN */}
      {subTab === 'roleplay' && <RoleplayView hideRomanization={hideRomanization} />}

      {/* 4. CHẾ ĐỘ 3: GIẢI MÃ LỜI BÀI HÁT K-POP & CÂU THOẠI K-DRAMA */}
      {subTab === 'kdrama' && <KDramaQuotesView hideRomanization={hideRomanization} />}

      {/* 5. CHẾ ĐỘ 4: THỬ THÁCH UỐN LƯỠI SIÊU TỐC */}
      {subTab === 'tonguetwister' && <TongueTwisterView hideRomanization={hideRomanization} />}

      {/* 4. MODAL XÁC NHẬN LƯU VÀO FLASHCARD [BẢN DỊCH MÁY ⚠️] */}
      {showSaveModal && (
        <div className="kr-modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="kr-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="kr-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={18} color="#f59e0b" />
                <h3 style={{ margin: 0, fontSize: 16, color: '#fff' }}>Lưu Vào Flashcard</h3>
              </div>
              <button
                type="button"
                className="kr-modal-close"
                onClick={() => setShowSaveModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="kr-modal-warning-box">
              ⚠️ <strong>Lưu ý:</strong> Đây là bản dịch máy tự động, có thể chưa chuẩn sắc thái kính ngữ hoặc ngữ cảnh. Vui lòng rà soát hoặc sửa lại bên dưới trước khi lưu!
            </div>

            <div className="kr-modal-form">
              <div className="kr-form-group">
                <label>Câu tiếng Hàn (Hangeul):</label>
                <input
                  type="text"
                  value={modalKo}
                  onChange={(e) => setModalKo(e.target.value)}
                  className="kr-form-input"
                />
              </div>

              <div className="kr-form-group">
                <label>Nghĩa tiếng Việt:</label>
                <input
                  type="text"
                  value={modalVi}
                  onChange={(e) => setModalVi(e.target.value)}
                  className="kr-form-input"
                />
              </div>

              <div className="kr-form-badge-preview">
                Thẻ sẽ được tự động gắn nhãn: <span className="machine-tag">Bản dịch máy ⚠️</span>
              </div>
            </div>

            <div className="kr-modal-footer">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setShowSaveModal(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn-modal-save"
                onClick={confirmSaveToFlashcard}
                disabled={!modalKo.trim() || !modalVi.trim()}
              >
                Xác Nhận & Lưu Thẻ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
