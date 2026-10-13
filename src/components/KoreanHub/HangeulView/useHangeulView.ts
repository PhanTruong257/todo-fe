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
import { HangulImeAutomata, PHYSICAL_KEY_MAP } from '../../../utils/hangulIme';
import type { HangeulLetter, KoreanLetterType, PatchimRule, MinimalPair } from '../../../types/korean';

const ROMAN_KEY = 'korean_hide_romanization';

export type HangeulSubTab = 'chart' | 'patchim' | 'minimal_pairs' | 'builder' | 'keyboard' | 'quiz';

export function useHangeulView() {
  const [subTab, setSubTab] = useState<HangeulSubTab>('chart');
  const [selectedFilter, setSelectedFilter] = useState<'all' | KoreanLetterType>('all');
  const [selectedLetter, setSelectedLetter] = useState<HangeulLetter | null>(null);

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

  // Patchim Tab State
  const [selectedPatchim, setSelectedPatchim] = useState<PatchimRule | null>(PATCHIM_RULES[0]);

  // Minimal Pairs State
  const [pairCategory, setPairCategory] = useState<'all' | 'consonant_trio' | 'vowel_confusion'>('all');
  const filteredMinimalPairs = useMemo<MinimalPair[]>(() => {
    if (pairCategory === 'all') return MINIMAL_PAIRS;
    return MINIMAL_PAIRS.filter((p) => p.category === pairCategory);
  }, [pairCategory]);

  // Syllable Builder State
  const [initialConsonant, setInitialConsonant] = useState('ㄱ');
  const [medialVowel, setMedialVowel] = useState('ㅏ');
  const [finalConsonant, setFinalConsonant] = useState('');

  // Keyboard Trainer State (Hangul Automata IME)
  const imeRef = useRef<HangulImeAutomata>(new HangulImeAutomata());
  const [typedText, setTypedText] = useState<string>('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isShiftActive, setIsShiftActive] = useState<boolean>(false);
  const [practiceWordIndex, setPracticeWordIndex] = useState<number>(0);
  const [isWordMatched, setIsWordMatched] = useState<boolean>(false);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Lọc danh sách chữ cái
  const filteredLetters = useMemo(() => {
    if (selectedFilter === 'all') return HANGEUL_LETTERS;
    return HANGEUL_LETTERS.filter((l) => l.type === selectedFilter);
  }, [selectedFilter]);

  // Khối chữ được ghép trong Syllable Builder
  const composedChar = useMemo(() => {
    return composeHangeul(initialConsonant, medialVowel, finalConsonant);
  }, [initialConsonant, medialVowel, finalConsonant]);

  // Keyboard Trainer Logic
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

  // Kiểm tra hoàn thành từ đang gõ
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

  // Bắt phím vật lý khi đang ở tab Keyboard dùng event.code (tránh lỗi Telex / IME ngoài)
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
        const char = (e.shiftKey && map.shift) ? map.shift : map.normal;
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

  // Bộ 10 câu hỏi trắc nghiệm
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
    selectedFilter,
    setSelectedFilter,
    selectedLetter,
    setSelectedLetter,
    filteredLetters,
    hideRomanization,
    toggleHideRomanization,
    // Patchim & Pronunciation
    patchimRules: PATCHIM_RULES,
    selectedPatchim,
    setSelectedPatchim,
    pronunciationRules: ESSENTIAL_PRONUNCIATION_RULES,
    // Minimal Pairs
    pairCategory,
    setPairCategory,
    filteredMinimalPairs,
    // Syllable Builder
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
    // Keyboard Trainer (Automata IME)
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
    // Quiz
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
