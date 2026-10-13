import { useState, useMemo, useCallback, useEffect } from 'react';
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
} from '../../../constants/koreanData';
import type { HangeulLetter, KoreanLetterType, PatchimRule } from '../../../types/korean';

const ROMAN_KEY = 'korean_hide_romanization';

export type HangeulSubTab = 'chart' | 'patchim' | 'builder' | 'keyboard' | 'quiz';

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

  // Syllable Builder State
  const [initialConsonant, setInitialConsonant] = useState('ㄱ');
  const [medialVowel, setMedialVowel] = useState('ㅏ');
  const [finalConsonant, setFinalConsonant] = useState('');

  // Keyboard Trainer State
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isShiftActive, setIsShiftActive] = useState<boolean>(false);
  const [practiceWordIndex, setPracticeWordIndex] = useState<number>(0);

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
    setTypedChars((prev) => [...prev, char]);
    if (keyName) {
      setActiveKey(keyName.toLowerCase());
      setTimeout(() => setActiveKey(null), 200);
    }
  }, []);

  const handleBackspace = useCallback(() => {
    setTypedChars((prev) => prev.slice(0, -1));
  }, []);

  const handleClearTyped = useCallback(() => {
    setTypedChars([]);
  }, []);

  // Bắt phím vật lý khi đang ở tab Keyboard
  useEffect(() => {
    if (subTab !== 'keyboard') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Backspace') {
        handleBackspace();
        return;
      }

      if (e.key === 'Shift') {
        setIsShiftActive(true);
        return;
      }

      const keyLower = e.key.toLowerCase();
      // Tìm phím trong KEYBOARD_2SET_LAYOUT
      for (const row of KEYBOARD_2SET_LAYOUT) {
        const found = row.find((k) => k.key === keyLower);
        if (found) {
          e.preventDefault();
          const char = (e.shiftKey && found.shiftKo) ? found.shiftKo : found.normalKo;
          handleInputKoChar(char, found.key);
          break;
        }
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
    // Keyboard Trainer
    keyboardLayout: KEYBOARD_2SET_LAYOUT,
    practiceWords: KEYBOARD_PRACTICE_WORDS,
    currentPracticeWord,
    practiceWordIndex,
    setPracticeWordIndex,
    typedChars,
    activeKey,
    isShiftActive,
    setIsShiftActive,
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
