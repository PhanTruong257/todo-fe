import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  KOREAN_VOCAB_LIST,
  KOREAN_TOPICS,
  speakKorean,
} from '../../../constants/koreanData';
import { DAILY_VOCAB_PLAN } from '../../../constants/dailyVocabPlan';
import type { KoreanVocabWord, ReviewLog, DailyVocabLesson } from '../../../types/korean';

const STORAGE_KEY = 'korean_vocab_cards';
const ROMAN_KEY = 'korean_hide_romanization';
const LOGS_STORAGE_KEY = 'korean_review_logs';
const DAILY_GOAL_TARGET = 10;

export type StudyMode = 'ko-to-vi' | 'vi-to-ko' | 'listen-to-ko' | 'type-in';

export interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

/**
 * Thuật toán SuperMemo-2 (SM-2 / Anki Variant)
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
            const existingMap = new Map<string, KoreanVocabWord>(
              parsed.map((item: KoreanVocabWord) => [item.id, item])
            );
            return KOREAN_VOCAB_LIST.map((seed) => {
              const existing = existingMap.get(seed.id);
              if (existing) {
                return {
                  ...seed,
                  repetition: existing.repetition ?? 0,
                  intervalDays: existing.intervalDays ?? 0,
                  easeFactor: existing.easeFactor ?? 2.5,
                  nextReviewDate: existing.nextReviewDate,
                  status: existing.status ?? 'new',
                  leechCount: existing.leechCount ?? 0,
                };
              }
              return {
                ...seed,
                repetition: 0,
                intervalDays: 0,
                easeFactor: 2.5,
                status: 'new' as const,
                nextReviewDate: new Date().toISOString().split('T')[0],
                leechCount: 0,
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
      leechCount: 0,
    }));
  });

  const PLAN_DAY_KEY = 'korean_current_plan_day';
  const COMPLETED_PLAN_DAYS_KEY = 'korean_completed_plan_days';

  const [activeSubTab, setActiveSubTab] = useState<'roadmap' | 'study' | 'sino' | 'library'>('roadmap');
  const [currentPlanDay, setCurrentPlanDay] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const val = localStorage.getItem(PLAN_DAY_KEY);
      return val ? parseInt(val, 10) || 1 : 1;
    }
    return 1;
  });

  const [completedPlanDays, setCompletedPlanDays] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(COMPLETED_PLAN_DAYS_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          // ignore
        }
      }
    }
    return [];
  });

  const [selectedPlanWeek, setSelectedPlanWeek] = useState<number>(0); // 0 = All

  const selectPlanDay = useCallback((day: number) => {
    setCurrentPlanDay(day);
    if (typeof window !== 'undefined') {
      localStorage.setItem(PLAN_DAY_KEY, String(day));
    }
  }, []);

  const toggleCompletePlanDay = useCallback((day: number) => {
    setCompletedPlanDays((prev) => {
      const exists = prev.includes(day);
      const next = exists ? prev.filter((d) => d !== day) : [...prev, day];
      if (typeof window !== 'undefined') {
        localStorage.setItem(COMPLETED_PLAN_DAYS_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const [selectedTopic, setSelectedTopic] = useState('all');
  const [search, setSearch] = useState('');

  // Chế độ ôn tập
  const [studyMode, setStudyMode] = useState<StudyMode>('ko-to-vi');

  // Toggle ẩn phiên âm Latin
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

  // Mục tiêu học hàng ngày
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [dailyReviewedCount, setDailyReviewedCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const val = localStorage.getItem(`korean_daily_reviews_${new Date().toISOString().split('T')[0]}`);
      return val ? parseInt(val, 10) || 0 : 0;
    }
    return 0;
  });

  // Hàng đợi học trong cùng phiên (In-session Queue with Learning Steps)
  const [sessionQueue, setSessionQueue] = useState<KoreanVocabWord[]>([]);
  const [studyIndex, setStudyIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyCompleted, setStudyCompleted] = useState(false);

  // Active Recall Quiz Options
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizStatus, setQuizStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Type-In Recall State
  const [typeInAnswer, setTypeInAnswer] = useState<string>('');
  const [typeInChecked, setTypeInChecked] = useState<boolean>(false);
  const [isTypeInCorrect, setIsTypeInCorrect] = useState<boolean>(false);

  // Thời gian bắt đầu xem thẻ để đo responseMs
  const cardStartTimeRef = useRef<number>(Date.now());

  // Lưu cards vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  // Khởi tạo hàng đợi hôm nay khi đổi chủ đề hoặc bắt đầu
  useEffect(() => {
    const due = cards.filter((c) => {
      const matchTopic = selectedTopic === 'all' || c.topic === selectedTopic;
      const isDue = !c.nextReviewDate || c.nextReviewDate <= todayStr;
      return matchTopic && isDue;
    });
    const batch = due.slice(0, 15);
    setSessionQueue(batch);
    setStudyIndex(0);
    setIsFlipped(false);
    setSelectedQuizOption(null);
    setQuizStatus('idle');
    setStudyCompleted(batch.length === 0);
  }, [selectedTopic, todayStr, cards.length]);

  const currentCard = useMemo(() => {
    if (sessionQueue.length === 0) return null;
    return sessionQueue[studyIndex] || null;
  }, [sessionQueue, studyIndex]);

  // Đặt lại thời gian xem thẻ
  useEffect(() => {
    cardStartTimeRef.current = Date.now();
  }, [currentCard]);

  // Sinh 4 đáp án trắc nghiệm khách quan
  const quizOptions = useMemo<QuizOption[]>(() => {
    if (!currentCard) return [];

    const otherCards = cards.filter((c) => c.id !== currentCard.id);
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

  // Reset quiz/flip khi đổi studyIndex hoặc mode
  useEffect(() => {
    setSelectedQuizOption(null);
    setQuizStatus('idle');
    setIsFlipped(false);
    setTypeInAnswer('');
    setTypeInChecked(false);
    setIsTypeInCorrect(false);
  }, [studyIndex, studyMode, selectedTopic]);

  // Tự động phát âm ở chế độ nghe
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

  // Hàm ghi log lượt ôn
  const logReview = useCallback(
    (cardId: string, correct: boolean, rating: 'again' | 'hard' | 'good' | 'easy') => {
      if (typeof window === 'undefined') return;
      try {
        const responseMs = Date.now() - cardStartTimeRef.current;
        const newLog: ReviewLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          cardId,
          timestamp: new Date().toISOString(),
          mode: studyMode,
          correct,
          rating,
          responseMs,
        };
        const raw = localStorage.getItem(LOGS_STORAGE_KEY);
        const existingLogs: ReviewLog[] = raw ? JSON.parse(raw) : [];
        existingLogs.push(newLog);
        // Giới hạn lưu 500 logs gần nhất trong localStorage
        if (existingLogs.length > 500) existingLogs.shift();
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(existingLogs));
      } catch (e) {
        console.warn('Không thể lưu review log:', e);
      }
    },
    [studyMode]
  );

  // Xử lý chọn đáp án trắc nghiệm
  const handleSelectQuizOption = useCallback(
    (opt: QuizOption) => {
      if (quizStatus !== 'idle' || !currentCard) return;
      setSelectedQuizOption(opt.id);

      if (opt.isCorrect) {
        setQuizStatus('correct');
        logReview(currentCard.id, true, 'good');
        setTimeout(() => setIsFlipped(true), 400);
      } else {
        setQuizStatus('wrong');
        logReview(currentCard.id, false, 'again');
        // Tăng leechCount và re-queue vào hàng đợi trong cùng phiên sau 3 thẻ
        setCards((prev) =>
          prev.map((c) =>
            c.id === currentCard.id ? { ...c, leechCount: (c.leechCount || 0) + 1 } : c
          )
        );
        setSessionQueue((prev) => {
          const updated = [...prev];
          const insertIdx = Math.min(studyIndex + 4, updated.length);
          updated.splice(insertIdx, 0, {
            ...currentCard,
            leechCount: (currentCard.leechCount || 0) + 1,
          });
          return updated;
        });
        setTimeout(() => setIsFlipped(true), 600);
      }
    },
    [quizStatus, currentCard, logReview, studyIndex]
  );

  // Xử lý Type-In Recall (Gõ chữ Hàn tự chấm)
  const handleCheckTypeIn = useCallback(() => {
    if (!currentCard || typeInChecked) return;
    const cleanTyped = typeInAnswer.trim();
    const cleanTarget = currentCard.hangeul.trim();
    const matched = cleanTyped === cleanTarget;
    setIsTypeInCorrect(matched);
    setTypeInChecked(true);

    if (matched) {
      logReview(currentCard.id, true, 'good');
      speakKorean(currentCard.hangeul);
      setTimeout(() => setIsFlipped(true), 500);
    } else {
      logReview(currentCard.id, false, 'again');
      // Re-queue card
      setCards((prev) =>
        prev.map((c) =>
          c.id === currentCard.id ? { ...c, leechCount: (c.leechCount || 0) + 1 } : c
        )
      );
      setSessionQueue((prev) => {
        const updated = [...prev];
        const insertIdx = Math.min(studyIndex + 4, updated.length);
        updated.splice(insertIdx, 0, {
          ...currentCard,
          leechCount: (currentCard.leechCount || 0) + 1,
        });
        return updated;
      });
      setTimeout(() => setIsFlipped(true), 700);
    }
  }, [currentCard, typeInAnswer, typeInChecked, logReview, studyIndex]);

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
      setTypeInAnswer('');
      setTypeInChecked(false);

      const isSuccess = rating !== 'again';
      logReview(currentCard.id, isSuccess, rating);

      // Nếu chọn Again -> Đưa thẻ quay lại sau 3 thẻ nữa trong phiên
      if (rating === 'again') {
        setCards((prev) =>
          prev.map((c) =>
            c.id === currentCard.id ? { ...c, leechCount: (c.leechCount || 0) + 1 } : c
          )
        );
        setSessionQueue((prev) => {
          const updated = [...prev];
          const insertIdx = Math.min(studyIndex + 4, updated.length);
          updated.splice(insertIdx, 0, {
            ...currentCard,
            leechCount: (currentCard.leechCount || 0) + 1,
          });
          return updated;
        });
      } else {
        // Cập nhật khoảng cách SM-2 lịch trình ngày tiếp theo
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

        // Tăng daily count khi hoàn thành 1 thẻ tốt
        setDailyReviewedCount((prev) => {
          const nextCount = prev + 1;
          if (typeof window !== 'undefined') {
            localStorage.setItem(`korean_daily_reviews_${todayStr}`, String(nextCount));
          }
          return nextCount;
        });
      }

      if (studyIndex + 1 < sessionQueue.length) {
        setStudyIndex((prev) => prev + 1);
      } else {
        setStudyCompleted(true);
      }
    },
    [currentCard, sessionQueue.length, studyIndex, todayStr, logReview]
  );

  const restartStudy = useCallback(() => {
    const due = cards.filter((c) => {
      const matchTopic = selectedTopic === 'all' || c.topic === selectedTopic;
      const isDue = !c.nextReviewDate || c.nextReviewDate <= todayStr;
      return matchTopic && isDue;
    });
    const batch = due.slice(0, 15);
    setSessionQueue(batch);
    setStudyIndex(0);
    setIsFlipped(false);
    setSelectedQuizOption(null);
    setQuizStatus('idle');
    setStudyCompleted(batch.length === 0);
  }, [cards, selectedTopic, todayStr]);

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
    const total = cards.length;
    const mastered = cards.filter((c) => c.status === 'mastered').length;
    const learning = cards.filter((c) => c.status === 'learning').length;
    const newCount = cards.filter((c) => c.status === 'new' || !c.status).length;
    const leeches = cards.filter((c) => (c.leechCount || 0) >= 4).length;
    return { total, mastered, learning, newCount, leeches };
  }, [cards]);

  const startStudyDay = useCallback((day: number) => {
    const lesson = DAILY_VOCAB_PLAN.find((d) => d.day === day);
    if (!lesson) return;
    setSessionQueue(lesson.words);
    setStudyIndex(0);
    setIsFlipped(false);
    setSelectedQuizOption(null);
    setQuizStatus('idle');
    setTypeInAnswer('');
    setTypeInChecked(false);
    setStudyCompleted(false);
    setActiveSubTab('study');
  }, []);

  const currentDayLesson: DailyVocabLesson = useMemo(() => {
    return DAILY_VOCAB_PLAN.find((d) => d.day === currentPlanDay) || DAILY_VOCAB_PLAN[0];
  }, [currentPlanDay]);

  const nextDayLesson: DailyVocabLesson | null = useMemo(() => {
    return DAILY_VOCAB_PLAN.find((d) => d.day === currentPlanDay + 1) || null;
  }, [currentPlanDay]);

  return {
    stats,
    activeSubTab,
    setActiveSubTab,
    selectedTopic,
    setSelectedTopic,
    search,
    setSearch,
    // 30-Day Daily Roadmap
    dailyPlan: DAILY_VOCAB_PLAN,
    currentPlanDay,
    selectPlanDay,
    completedPlanDays,
    toggleCompletePlanDay,
    selectedPlanWeek,
    setSelectedPlanWeek,
    startStudyDay,
    currentDayLesson,
    nextDayLesson,
    // Modes
    studyMode,
    setStudyMode,
    hideRomanization,
    toggleHideRomanization,
    dailyReviewedCount,
    dailyGoalTarget: DAILY_GOAL_TARGET,
    // Study
    dueQueue: sessionQueue,
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
    // Type-In Recall
    typeInAnswer,
    setTypeInAnswer,
    typeInChecked,
    isTypeInCorrect,
    handleCheckTypeIn,
    // Library
    filteredLibrary,
    topics: KOREAN_TOPICS,
    speakKorean,
  };
}
