import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  KOREAN_VOCAB_LIST,
  KOREAN_TOPICS,
  speakKorean,
} from '../../../constants/koreanData';
import type { KoreanVocabWord } from '../../../types/korean';

const STORAGE_KEY = 'korean_vocab_cards';
const ROMAN_KEY = 'korean_hide_romanization';
const DAILY_GOAL_TARGET = 10;

export type StudyMode = 'ko-to-vi' | 'vi-to-ko' | 'listen-to-ko';

export interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

/**
 * Thuật toán SuperMemo-2 (SM-2) chuẩn
 */
function calculateSM2(
  currentRep: number,
  currentInterval: number,
  currentEF: number,
  rating: 'again' | 'hard' | 'good' | 'easy'
) {
  let newEF = currentEF || 2.5;
  let newRep = currentRep || 0;
  let newInterval = 1;

  if (rating === 'again') {
    newRep = 0;
    newInterval = 1;
    newEF = Math.max(1.3, newEF - 0.2);
  } else if (rating === 'hard') {
    newRep += 1;
    newInterval = Math.max(1, Math.round((currentInterval || 1) * 1.2));
    newEF = Math.max(1.3, newEF - 0.15);
  } else if (rating === 'good') {
    newRep += 1;
    if (newRep === 1) newInterval = 1;
    else if (newRep === 2) newInterval = 3;
    else newInterval = Math.round((currentInterval || 1) * newEF);
  } else if (rating === 'easy') {
    newRep += 1;
    if (newRep === 1) newInterval = 2;
    else if (newRep === 2) newInterval = 5;
    else newInterval = Math.round((currentInterval || 1) * newEF * 1.3);
    newEF = Math.min(3.0, newEF + 0.15);
  }

  return {
    repetition: newRep,
    intervalDays: newInterval,
    easeFactor: Number(newEF.toFixed(2)),
  };
}

export function useKoreanVocab() {
  const [cards, setCards] = useState<KoreanVocabWord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Đồng bộ thêm actualPronunciation từ seed nếu thiếu
            return parsed.map((item: KoreanVocabWord) => {
              const seedMatch = KOREAN_VOCAB_LIST.find((s) => s.id === item.id);
              return {
                ...item,
                actualPronunciation: item.actualPronunciation || seedMatch?.actualPronunciation,
              };
            });
          }
        } catch {
          // fallback
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

  // Chế độ ôn tập: Hàn -> Việt, Việt -> Hàn, Nghe -> Hàn
  const [studyMode, setStudyMode] = useState<StudyMode>('ko-to-vi');

  // Toggle ẩn phiên âm Latin (Romanization)
  const [hideRomanization, setHideRomanization] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ROMAN_KEY) === 'true';
    }
    return false;
  });

  const toggleHideRomanization = useCallback(() => {
    setHideRomanization((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(ROMAN_KEY, String(next));
      }
      return next;
    });
  }, []);

  // Mục tiêu học hàng ngày (Daily Goal - 10 thẻ/ngày)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [dailyReviewedCount, setDailyReviewedCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const val = localStorage.getItem(`korean_daily_reviews_${new Date().toISOString().split('T')[0]}`);
      return val ? parseInt(val, 10) || 0 : 0;
    }
    return 0;
  });

  // Study State
  const [studyIndex, setStudyIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyCompleted, setStudyCompleted] = useState(false);

  // Active Recall Quiz Options
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizStatus, setQuizStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Lưu cards vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  // Danh sách các từ cần ôn hôm nay theo chủ đề đã chọn
  const dueQueue = useMemo(() => {
    const due = cards.filter((c) => {
      const matchTopic = selectedTopic === 'all' || c.topic === selectedTopic;
      const isDue = !c.nextReviewDate || c.nextReviewDate <= todayStr;
      return matchTopic && isDue;
    });
    return due.slice(0, 15); // Mỗi lượt học tối đa 15 từ
  }, [cards, selectedTopic, todayStr]);

  const currentCard = useMemo(() => {
    if (dueQueue.length === 0) return null;
    return dueQueue[studyIndex] || null;
  }, [dueQueue, studyIndex]);

  // Sinh 4 đáp án trắc nghiệm khách quan (1 đúng + 3 gây nhiễu) cho thẻ hiện tại
  const quizOptions = useMemo<QuizOption[]>(() => {
    if (!currentCard) return [];

    const otherCards = cards.filter((c) => c.id !== currentCard.id);
    // Shuffle ngẫu nhiên lấy 3 distractors
    const shuffledOthers = [...otherCards].sort(() => Math.random() - 0.5).slice(0, 3);

    const isKoPrompt = studyMode === 'ko-to-vi';

    const correctOpt: QuizOption = {
      id: currentCard.id,
      label: isKoPrompt ? currentCard.meaningVi : currentCard.hangeul,
      isCorrect: true,
    };

    const wrongOpts: QuizOption[] = shuffledOthers.map((item) => ({
      id: item.id,
      label: isKoPrompt ? item.meaningVi : item.hangeul,
      isCorrect: false,
    }));

    return [correctOpt, ...wrongOpts].sort(() => Math.random() - 0.5);
  }, [currentCard, cards, studyMode]);

  // Khi chuyển thẻ hoặc chuyển chế độ -> reset quiz
  useEffect(() => {
    setSelectedQuizOption(null);
    setQuizStatus('idle');
    setIsFlipped(false);
  }, [studyIndex, studyMode, selectedTopic]);

  // Khi vào thẻ ở chế độ nghe, tự động phát âm thanh sau 300ms
  useEffect(() => {
    if (studyMode === 'listen-to-ko' && currentCard && !isFlipped && quizStatus === 'idle') {
      const timer = setTimeout(() => {
        speakKorean(currentCard.hangeul);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [studyMode, currentCard, isFlipped, quizStatus]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Xử lý chọn đáp án trắc nghiệm khách quan
  const handleSelectQuizOption = useCallback(
    (opt: QuizOption) => {
      if (quizStatus !== 'idle') return; // đã chọn rồi thì không chọn lại
      setSelectedQuizOption(opt.id);

      if (opt.isCorrect) {
        setQuizStatus('correct');
        // Tự động lật thẻ sau 400ms để hiển thị chi tiết
        setTimeout(() => {
          setIsFlipped(true);
        }, 400);
      } else {
        setQuizStatus('wrong');
        // Lật thẻ sau 600ms để học viên xem ngay đáp án đúng và phân tích
        setTimeout(() => {
          setIsFlipped(true);
        }, 600);
      }
    },
    [quizStatus]
  );

  // Bỏ qua trắc nghiệm để tự lật thẻ trực tiếp
  const skipQuizAndFlip = useCallback(() => {
    setIsFlipped(true);
  }, []);

  // Đánh giá SM-2 sau khi đã xem thẻ
  const handleReview = useCallback(
    (rating: 'again' | 'hard' | 'good' | 'easy') => {
      if (!currentCard) return;

      setIsFlipped(false);
      setSelectedQuizOption(null);
      setQuizStatus('idle');

      const currentRep = currentCard.repetition || 0;
      const currentInterval = currentCard.intervalDays || 0;
      const currentEF = currentCard.easeFactor || 2.5;

      const sm2Result = calculateSM2(currentRep, currentInterval, currentEF, rating);

      const nextD = new Date();
      nextD.setDate(nextD.getDate() + sm2Result.intervalDays);
      const nextDateStr = nextD.toISOString().split('T')[0];

      setCards((prev) =>
        prev.map((c) => {
          if (c.id === currentCard.id) {
            return {
              ...c,
              repetition: sm2Result.repetition,
              intervalDays: sm2Result.intervalDays,
              easeFactor: sm2Result.easeFactor,
              nextReviewDate: nextDateStr,
              status: sm2Result.repetition >= 3 ? 'mastered' : 'learning',
            };
          }
          return c;
        })
      );

      // Tăng số lượng thẻ đã học hôm nay
      setDailyReviewedCount((prev) => {
        const nextCount = prev + 1;
        if (typeof window !== 'undefined') {
          localStorage.setItem(`korean_daily_reviews_${todayStr}`, String(nextCount));
        }
        return nextCount;
      });

      if (studyIndex + 1 < dueQueue.length) {
        setStudyIndex((prev) => prev + 1);
      } else {
        setStudyCompleted(true);
      }
    },
    [currentCard, dueQueue.length, studyIndex, todayStr]
  );

  const restartStudy = useCallback(() => {
    setStudyIndex(0);
    setIsFlipped(false);
    setSelectedQuizOption(null);
    setQuizStatus('idle');
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
        (c.hanjaVi && c.hanjaVi.toLowerCase().includes(search.toLowerCase())) ||
        (c.actualPronunciation && c.actualPronunciation.toLowerCase().includes(search.toLowerCase()));
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
    // Study Modes & Settings
    studyMode,
    setStudyMode,
    hideRomanization,
    toggleHideRomanization,
    dailyReviewedCount,
    dailyGoalTarget: DAILY_GOAL_TARGET,
    // Study
    dueQueue,
    currentCard,
    studyIndex,
    isFlipped,
    toggleFlip,
    handleReview,
    studyCompleted,
    restartStudy,
    // Active Recall Quiz
    quizOptions,
    selectedQuizOption,
    quizStatus,
    handleSelectQuizOption,
    skipQuizAndFlip,
    // Library
    filteredLibrary,
    topics: KOREAN_TOPICS,
    speakKorean,
  };
}
