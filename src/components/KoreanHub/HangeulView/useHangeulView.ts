import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  HANGEUL_LETTERS,
  INITIAL_CONSONANTS,
  MEDIAL_VOWELS,
  FINAL_CONSONANTS,
  composeHangeul,
  speakKorean,
  PATCHIM_RULES,
  ESSENTIAL_PRONUNCIATION_RULES,
  KEYBOARD_2SET_LAYOUT,
  KEYBOARD_PRACTICE_WORDS,
  MINIMAL_PAIRS,
} from '../../../constants/koreanData';
import {
  HANGEUL_5DAY_JOURNEY,
  VIETNAMESE_NAMES_KOREAN,
} from '../../../constants/hangeulJourneyData';
import { HangulImeAutomata, PHYSICAL_KEY_MAP } from '../../../utils/hangulIme';
import type {
  HangeulLetter,
  KoreanLetterType,
  PatchimRule,
  MinimalPair,
  HangeulDayLesson,
  VietnameseNameGuide,
} from '../../../types/korean';

const ROMAN_KEY = 'korean_hide_romanization';
const JOURNEY_COMPLETED_KEY = 'korean_journey_completed_days';
const CURRENT_DAY_KEY = 'korean_journey_current_day';

export type HangeulSubTab =
  | 'journey'
  | 'chart'
  | 'patchim'
  | 'minimal_pairs'
  | 'name_card'
  | 'builder'
  | 'keyboard'
  | 'quiz';

export type JourneyStage = 'letters' | 'words' | 'quiz' | 'victory';

export function useHangeulView() {
  // Mặc định mở Lộ trình 5 ngày cho người mới bắt đầu
  const [subTab, setSubTab] = useState<HangeulSubTab>('journey');

  // Romanization Toggle
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

  // ==========================================
  // 1. STATE LỘ TRÌNH 5 NGÀY VỠ LÒNG (JOURNEY)
  // ==========================================
  const [currentDay, setCurrentDay] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CURRENT_DAY_KEY);
      return saved ? parseInt(saved, 10) || 1 : 1;
    }
    return 1;
  });

  const [journeyStage, setJourneyStage] = useState<JourneyStage>('letters');

  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(JOURNEY_COMPLETED_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Quiz của ngày
  const [journeyQuizAnswers, setJourneyQuizAnswers] = useState<Record<number, string>>({});
  const [journeyQuizChecked, setJourneyQuizChecked] = useState<boolean>(false);

  const activeDayLesson = useMemo<HangeulDayLesson>(() => {
    return (
      HANGEUL_5DAY_JOURNEY.find((l) => l.day === currentDay) ||
      HANGEUL_5DAY_JOURNEY[0]
    );
  }, [currentDay]);

  const selectJourneyDay = useCallback((day: number) => {
    setCurrentDay(day);
    setJourneyStage('letters');
    setJourneyQuizAnswers({});
    setJourneyQuizChecked(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_DAY_KEY, String(day));
    }
  }, []);

  const handleSelectQuizAnswer = useCallback((qIndex: number, option: string) => {
    setJourneyQuizAnswers((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
  }, []);

  const checkJourneyQuiz = useCallback(() => {
    setJourneyQuizChecked(true);
  }, []);

  const finishCurrentDay = useCallback(() => {
    setCompletedDays((prev) => {
      const next = prev.includes(currentDay) ? prev : [...prev, currentDay];
      if (typeof window !== 'undefined') {
        localStorage.setItem(JOURNEY_COMPLETED_KEY, JSON.stringify(next));
      }
      return next;
    });
    setJourneyStage('victory');
  }, [currentDay]);

  // ==========================================
  // 2. STATE VIẾT TÊN TIẾNG VIỆT (NAME CARD)
  // ==========================================
  const [nameSearch, setNameSearch] = useState<string>('');
  const [selectedNameGuide, setSelectedNameGuide] = useState<VietnameseNameGuide | null>(
    VIETNAMESE_NAMES_KOREAN[0]
  );
  const [customNameInput, setCustomNameInput] = useState<string>('');

  const filteredNames = useMemo<VietnameseNameGuide[]>(() => {
    if (!nameSearch.trim()) return VIETNAMESE_NAMES_KOREAN.slice(0, 24);
    const q = nameSearch.toLowerCase().trim();
    return VIETNAMESE_NAMES_KOREAN.filter(
      (n) => n.vi.toLowerCase().includes(q) || n.ko.includes(q)
    );
  }, [nameSearch]);

  // ==========================================
  // 3. STATE BẢNG TRA CỨU 40 CHỮ CÁI (CHART)
  // ==========================================
  const [selectedFilter, setSelectedFilter] = useState<'all' | KoreanLetterType>('all');
  const [selectedLetter, setSelectedLetter] = useState<HangeulLetter | null>(null);

  const filteredLetters = useMemo(() => {
    if (selectedFilter === 'all') return HANGEUL_LETTERS;
    return HANGEUL_LETTERS.filter((l) => l.type === selectedFilter);
  }, [selectedFilter]);

  // ==========================================
  // 4. STATE PATCHIM & CẶP ÂM TỐI THIỂU
  // ==========================================
  const [selectedPatchim, setSelectedPatchim] = useState<PatchimRule | null>(PATCHIM_RULES[0]);
  const [pairCategory, setPairCategory] = useState<'all' | 'consonant_trio' | 'vowel_confusion'>('all');

  const filteredMinimalPairs = useMemo<MinimalPair[]>(() => {
    if (pairCategory === 'all') return MINIMAL_PAIRS;
    return MINIMAL_PAIRS.filter((p) => p.category === pairCategory);
  }, [pairCategory]);

  // ==========================================
  // 5. STATE GHÉP VẦN KHỐI (BUILDER)
  // ==========================================
  const [initialConsonant, setInitialConsonant] = useState('ㄱ');
  const [medialVowel, setMedialVowel] = useState('ㅏ');
  const [finalConsonant, setFinalConsonant] = useState('');

  const composedChar = useMemo(() => {
    return composeHangeul(initialConsonant, medialVowel, finalConsonant);
  }, [initialConsonant, medialVowel, finalConsonant]);

  // ==========================================
  // 6. STATE BỘ GÕ IME 2-SET (KEYBOARD)
  // ==========================================
  const imeRef = useRef<HangulImeAutomata>(new HangulImeAutomata());
  const [typedText, setTypedText] = useState<string>('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isShiftActive, setIsShiftActive] = useState<boolean>(false);
  const [practiceWordIndex, setPracticeWordIndex] = useState<number>(0);
  const [isWordMatched, setIsWordMatched] = useState<boolean>(false);

  const currentPracticeWord = KEYBOARD_PRACTICE_WORDS[practiceWordIndex] || KEYBOARD_PRACTICE_WORDS[0];

  const handleInputKoChar = useCallback((char: string, keyName?: string) => {
    const updated = imeRef.current.input(char);
    setTypedText(updated);
    if (keyName) {
      setActiveKey(keyName.toLowerCase());
      setTimeout(() => setActiveKey(null), 180);
    }
  }, []);

  const handleBackspace = useCallback(() => {
    const updated = imeRef.current.backspace();
    setTypedText(updated);
  }, []);

  const handleClearTyped = useCallback(() => {
    imeRef.current.clear();
    setTypedText('');
    setIsWordMatched(false);
  }, []);

  useEffect(() => {
    if (typedText && currentPracticeWord && typedText.trim() === currentPracticeWord.word.trim()) {
      setIsWordMatched(true);
      speakKorean(currentPracticeWord.word);
      const timer = setTimeout(() => {
        setIsWordMatched(false);
        imeRef.current.clear();
        setTypedText('');
        setPracticeWordIndex((prev) => (prev + 1) % KEYBOARD_PRACTICE_WORDS.length);
      }, 900);
      return () => clearTimeout(timer);
    } else {
      setIsWordMatched(false);
    }
  }, [typedText, currentPracticeWord]);

  // Bắt phím vật lý
  useEffect(() => {
    if (subTab !== 'keyboard') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleInputKoChar(' ', 'space');
        return;
      }

      if (e.key === 'Shift') {
        setIsShiftActive(true);
        return;
      }

      const map = PHYSICAL_KEY_MAP[e.code];
      if (map) {
        e.preventDefault();
        const char = e.shiftKey && map.shift ? map.shift : map.normal;
        const keyChar = e.code.replace('Key', '').toLowerCase();
        handleInputKoChar(char, keyChar);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [subTab, handleBackspace, handleInputKoChar]);

  // ==========================================
  // 7. STATE QUIZ PHẢN XẠ CHỮ CÁI
  // ==========================================
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const quizQuestions = useMemo(() => {
    const shuffled = [...HANGEUL_LETTERS].sort(() => Math.random() - 0.5).slice(0, 10);
    return shuffled.map((item) => {
      const wrong = HANGEUL_LETTERS.filter((l) => l.char !== item.char)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((l) => l.romanization);
      const options = [...wrong, item.romanization].sort(() => Math.random() - 0.5);
      return {
        questionChar: item.char,
        name: item.name,
        correctAnswer: item.romanization,
        options,
      };
    });
  }, []);

  const currentQuiz = quizQuestions[quizIndex] || null;

  const handleSelectAnswer = useCallback(
    (ans: string) => {
      if (isAnswerChecked) return;
      setSelectedAnswer(ans);
      setIsAnswerChecked(true);
      if (currentQuiz && ans === currentQuiz.correctAnswer) {
        setScore((prev) => prev + 1);
      }
    },
    [isAnswerChecked, currentQuiz]
  );

  const handleNextQuiz = useCallback(() => {
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  }, [quizIndex, quizQuestions.length]);

  const restartQuiz = useCallback(() => {
    setQuizIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setQuizCompleted(false);
  }, []);

  return {
    subTab,
    setSubTab,
    hideRomanization,
    toggleHideRomanization,
    // 1. Lộ trình 5 ngày
    journeyDays: HANGEUL_5DAY_JOURNEY,
    currentDay,
    selectJourneyDay,
    journeyStage,
    setJourneyStage,
    completedDays,
    activeDayLesson,
    journeyQuizAnswers,
    journeyQuizChecked,
    handleSelectQuizAnswer,
    checkJourneyQuiz,
    finishCurrentDay,
    // 2. Viết tên tiếng Việt
    nameSearch,
    setNameSearch,
    filteredNames,
    selectedNameGuide,
    setSelectedNameGuide,
    customNameInput,
    setCustomNameInput,
    // 3. Bảng chữ cái
    selectedFilter,
    setSelectedFilter,
    selectedLetter,
    setSelectedLetter,
    filteredLetters,
    // 4. Patchim & Minimal Pairs
    patchimRules: PATCHIM_RULES,
    selectedPatchim,
    setSelectedPatchim,
    pronunciationRules: ESSENTIAL_PRONUNCIATION_RULES,
    pairCategory,
    setPairCategory,
    filteredMinimalPairs,
    // 5. Syllable Builder
    initialConsonant,
    setInitialConsonant,
    medialVowel,
    setMedialVowel,
    finalConsonant,
    setFinalConsonant,
    composedChar,
    INITIAL_CONSONANTS,
    MEDIAL_VOWELS,
    FINAL_CONSONANTS,
    speakKorean,
    // 6. Keyboard Trainer
    keyboardLayout: KEYBOARD_2SET_LAYOUT,
    practiceWords: KEYBOARD_PRACTICE_WORDS,
    currentPracticeWord,
    practiceWordIndex,
    setPracticeWordIndex,
    typedText,
    activeKey,
    isShiftActive,
    setIsShiftActive,
    isWordMatched,
    handleInputKoChar,
    handleBackspace,
    handleClearTyped,
    // 7. Quiz
    currentQuiz,
    quizIndex,
    totalQuiz: quizQuestions.length,
    score,
    selectedAnswer,
    isAnswerChecked,
    quizCompleted,
    handleSelectAnswer,
    handleNextQuiz,
    restartQuiz,
  };
}
