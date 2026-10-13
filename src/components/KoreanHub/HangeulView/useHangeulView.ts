import { useState, useMemo, useCallback } from 'react';
import {
  HANGEUL_LETTERS,
  INITIAL_CONSONANTS,
  MEDIAL_VOWELS,
  FINAL_CONSONANTS,
  composeHangeul,
  speakKorean,
} from '../../../constants/koreanData';
import type { HangeulLetter, KoreanLetterType } from '../../../types/korean';

export function useHangeulView() {
  const [subTab, setSubTab] = useState<'chart' | 'builder' | 'quiz'>('chart');
  const [selectedFilter, setSelectedFilter] = useState<'all' | KoreanLetterType>('all');
  const [selectedLetter, setSelectedLetter] = useState<HangeulLetter | null>(null);

  // Syllable Builder State
  const [initialConsonant, setInitialConsonant] = useState('ㄱ');
  const [medialVowel, setMedialVowel] = useState('ㅏ');
  const [finalConsonant, setFinalConsonant] = useState('');

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

  // Khối chữ được ghép
  const composedChar = useMemo(() => {
    return composeHangeul(initialConsonant, medialVowel, finalConsonant);
  }, [initialConsonant, medialVowel, finalConsonant]);

  // Bộ 10 câu hỏi trắc nghiệm ngẫu nhiên
  const quizQuestions = useMemo(() => {
    // Trộn ngẫu nhiên chữ cái để tạo 10 câu hỏi
    const shuffled = [...HANGEUL_LETTERS].sort(() => Math.random() - 0.5).slice(0, 10);
    return shuffled.map((item) => {
      // 3 đáp án sai ngẫu nhiên
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

  const handleSelectAnswer = useCallback((ans: string) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(ans);
    setIsAnswerChecked(true);
    if (currentQuiz && ans === currentQuiz.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  }, [isAnswerChecked, currentQuiz]);

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
