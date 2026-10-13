import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  KOREAN_VOCAB_LIST,
  KOREAN_TOPICS,
  speakKorean,
} from '../../../constants/koreanData';
import type { KoreanVocabWord } from '../../../types/korean';

const STORAGE_KEY = 'korean_vocab_cards';

export function useKoreanVocab() {
  const [cards, setCards] = useState<KoreanVocabWord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fallback
        }
      }
    }
    return KOREAN_VOCAB_LIST.map((w) => ({
      ...w,
      repetition: 0,
      intervalDays: 0,
      easeFactor: 2.5,
      status: 'new' as const,
      nextReviewDate: new Date().toISOString().split('T')[0],
    }));
  });

  const [activeSubTab, setActiveSubTab] = useState<'study' | 'library'>('study');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [search, setSearch] = useState('');

  // Study State
  const [studyIndex, setStudyIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyCompleted, setStudyCompleted] = useState(false);

  // Lưu cards vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  // Danh sách các từ cần ôn hôm nay theo chủ đề đã chọn
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const dueQueue = useMemo(() => {
    const due = cards.filter((c) => {
      const matchTopic = selectedTopic === 'all' || c.topic === selectedTopic;
      const isDue = !c.nextReviewDate || c.nextReviewDate <= todayStr;
      return matchTopic && isDue;
    });
    return due.slice(0, 15); // Mỗi lượt học 15 từ
  }, [cards, selectedTopic, todayStr]);

  const currentCard = useMemo(() => {
    if (dueQueue.length === 0) return null;
    return dueQueue[studyIndex] || null;
  }, [dueQueue, studyIndex]);

  // Đổi chủ đề ôn -> reset study
  useEffect(() => {
    setStudyIndex(0);
    setIsFlipped(false);
    setStudyCompleted(false);
  }, [selectedTopic]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleReview = useCallback((rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    setIsFlipped(false);

    setCards((prev) =>
      prev.map((c) => {
        if (c.id === currentCard.id) {
          const rep = rating === 'again' ? 0 : (c.repetition || 0) + 1;
          const nextDays = rating === 'again' ? 1 : rating === 'hard' ? 2 : rating === 'good' ? 4 : 7;
          const nextD = new Date();
          nextD.setDate(nextD.getDate() + nextDays);
          return {
            ...c,
            repetition: rep,
            nextReviewDate: nextD.toISOString().split('T')[0],
            status: rep >= 3 ? 'mastered' : 'learning',
          };
        }
        return c;
      }),
    );

    if (studyIndex + 1 < dueQueue.length) {
      setStudyIndex((prev) => prev + 1);
    } else {
      setStudyCompleted(true);
    }
  }, [currentCard, dueQueue.length, studyIndex]);

  const restartStudy = useCallback(() => {
    setStudyIndex(0);
    setIsFlipped(false);
    setStudyCompleted(false);
  }, []);

  // Lọc thư viện từ vựng
  const filteredLibrary = useMemo(() => {
    return cards.filter((c) => {
      const matchTopic = selectedTopic === 'all' || c.topic === selectedTopic;
      const matchSearch =
        !search.trim() ||
        c.hangeul.toLowerCase().includes(search.toLowerCase()) ||
        c.romanization.toLowerCase().includes(search.toLowerCase()) ||
        c.meaningVi.toLowerCase().includes(search.toLowerCase()) ||
        (c.hanjaVi && c.hanjaVi.toLowerCase().includes(search.toLowerCase()));
      return matchTopic && matchSearch;
    });
  }, [cards, selectedTopic, search]);

  const stats = useMemo(() => {
    const mastered = cards.filter((c) => c.status === 'mastered').length;
    const learning = cards.filter((c) => c.status === 'learning').length;
    return {
      total: cards.length,
      mastered,
      learning,
    };
  }, [cards]);

  return {
    cards,
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
    topics: KOREAN_TOPICS,
    speakKorean,
  };
}
