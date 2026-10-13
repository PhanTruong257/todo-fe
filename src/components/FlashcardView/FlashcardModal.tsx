import React, { useState } from 'react';
import { X, Search, Sparkles, Loader2 } from 'lucide-react';
import type { CreateFlashcardPayload } from '../../types/flashcard';
import { api } from '../../services/api';
import { TOPIC_DEFINITIONS } from '../../constants/topics';
import './FlashcardModal.css';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateFlashcardPayload) => Promise<void>;
  currentStudent: string;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentStudent,
}) => {
  const [word, setWord] = useState('');
  const [ipa, setIpa] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('noun');
  const [meaningVi, setMeaningVi] = useState('');
  const [meaningEn, setMeaningEn] = useState('');
  const [exampleEn, setExampleEn] = useState('');
  const [exampleVi, setExampleVi] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [topic, setTopic] = useState(TOPIC_DEFINITIONS[0].key);
  const [level, setLevel] = useState('B2');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleLookup = async () => {
    if (!word.trim()) return;
    setIsLookingUp(true);
    try {
      const data = await api.lookupWord(word.trim());
      if (data) {
        if (data.ipa) setIpa(data.ipa);
        if (data.partOfSpeech) setPartOfSpeech(data.partOfSpeech);
        if (data.meaningEn) setMeaningEn(data.meaningEn);
        if (data.exampleEn) setExampleEn(data.exampleEn);
        if (data.audioUrl) setAudioUrl(data.audioUrl);
      }
    } catch (err) {
      console.warn('Tra từ tự động thất bại:', err);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !meaningVi.trim()) return;

    setIsSaving(true);
    try {
      await onSave({
        word: word.trim().toLowerCase(),
        ipa: ipa.trim(),
        partOfSpeech,
        meaningVi: meaningVi.trim(),
        meaningEn: meaningEn.trim(),
        exampleEn: exampleEn.trim(),
        exampleVi: exampleVi.trim(),
        audioUrl: audioUrl.trim(),
        topic,
        level,
        studentName: currentStudent || 'all',
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flashcard-modal-backdrop" onClick={onClose}>
      <div className="flashcard-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="fc-modal-header">
          <h3>
            <Sparkles size={18} color="#818cf8" />
            Thêm Thẻ Từ Vựng Mới
          </h3>
          <button className="btn-close-modal" onClick={onClose} type="button">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Ô nhập từ vựng + Nút Tra từ tự động */}
          <div className="fc-form-group">
            <label className="fc-label">Từ vựng tiếng Anh *</label>
            <div className="fc-input-row">
              <input
                className="fc-input"
                placeholder="Nhập từ vựng (ví dụ: resilient)..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
                autoFocus
                required
              />
              <button
                type="button"
                className="btn-auto-lookup"
                onClick={handleLookup}
                disabled={isLookingUp || !word.trim()}
              >
                {isLookingUp ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                Tra từ
              </button>
            </div>
          </div>

          {/* Phiên âm IPA & Loại từ */}
          <div className="fc-row-2col" style={{ marginTop: 12 }}>
            <div className="fc-form-group">
              <label className="fc-label">Phiên âm IPA</label>
              <input
                className="fc-input"
                placeholder="/rɪˈzɪl.jənt/"
                value={ipa}
                onChange={(e) => setIpa(e.target.value)}
              />
            </div>
            <div className="fc-form-group">
              <label className="fc-label">Loại từ</label>
              <select
                className="fc-select"
                value={partOfSpeech}
                onChange={(e) => setPartOfSpeech(e.target.value)}
              >
                <option value="noun">Danh từ (n)</option>
                <option value="verb">Động từ (v)</option>
                <option value="adjective">Tính từ (adj)</option>
                <option value="adverb">Trạng từ (adv)</option>
                <option value="idiom">Thành ngữ (idiom)</option>
                <option value="phrase">Cụm từ (phrase)</option>
              </select>
            </div>
          </div>

          {/* Nghĩa tiếng Việt (Bắt buộc) */}
          <div className="fc-form-group" style={{ marginTop: 12 }}>
            <label className="fc-label">Nghĩa tiếng Việt *</label>
            <input
              className="fc-input"
              placeholder="Kiên cường, mau hồi phục..."
              value={meaningVi}
              onChange={(e) => setMeaningVi(e.target.value)}
              required
            />
          </div>

          {/* Định nghĩa tiếng Anh (Tùy chọn) */}
          <div className="fc-form-group" style={{ marginTop: 12 }}>
            <label className="fc-label">Định nghĩa tiếng Anh (tùy chọn)</label>
            <input
              className="fc-input"
              placeholder="Able to recover quickly from difficult conditions..."
              value={meaningEn}
              onChange={(e) => setMeaningEn(e.target.value)}
            />
          </div>

          {/* Câu ví dụ Anh & Việt */}
          <div className="fc-form-group" style={{ marginTop: 12 }}>
            <label className="fc-label">Câu ví dụ tiếng Anh</label>
            <input
              className="fc-input"
              placeholder="She is a resilient girl..."
              value={exampleEn}
              onChange={(e) => setExampleEn(e.target.value)}
            />
          </div>
          <div className="fc-form-group" style={{ marginTop: 12 }}>
            <label className="fc-label">Dịch câu ví dụ tiếng Việt</label>
            <input
              className="fc-input"
              placeholder="Cô ấy là một cô gái rất kiên cường..."
              value={exampleVi}
              onChange={(e) => setExampleVi(e.target.value)}
            />
          </div>

          {/* Chủ đề & Level */}
          <div className="fc-row-2col" style={{ marginTop: 12 }}>
            <div className="fc-form-group">
              <label className="fc-label">Chủ đề (Topic)</label>
              <select
                className="fc-select"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {TOPIC_DEFINITIONS.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.icon} {t.nameVi} ({t.nameEn})
                  </option>
                ))}
              </select>
            </div>
            <div className="fc-form-group">
              <label className="fc-label">Cấp độ (CEFR)</label>
              <select
                className="fc-select"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="A1">A1 - Căn bản</option>
                <option value="A2">A2 - Sơ cấp</option>
                <option value="B1">B1 - Trung cấp</option>
                <option value="B2">B2 - Khá</option>
                <option value="C1">C1 - Nâng cao</option>
                <option value="C2">C2 - Thành thạo</option>
              </select>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="fc-modal-actions">
            <button
              type="button"
              className="btn-fc-cancel"
              onClick={onClose}
              disabled={isSaving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-fc-save"
              disabled={isSaving || !word.trim() || !meaningVi.trim()}
            >
              {isSaving ? 'Đang lưu...' : 'Thêm Thẻ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
