import { useState, useEffect, useRef, useCallback } from 'react';
import { SPEED_RUSH_QUESTIONS } from '../gamesData';
import type { SpeedRushQuestion, SpeedRushScoreRecord } from '../types';
import { soundEffects } from '../soundEffects';
import { speakKorean } from '../../../../constants/koreanData';

const BEST_SCORE_KEY = 'taskflow_speed_rush_best_score';
const GAME_DURATION_SECONDS = 60;

export function useSpeedRush(onOpenCardModal?: (score: number) => void) {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'ended'>('lobby');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<SpeedRushQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [resultRecord, setResultRecord] = useState<SpeedRushScoreRecord | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load best score on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BEST_SCORE_KEY);
      if (saved) {
        setBestScore(parseInt(saved, 10) || 0);
      }
    } catch (e) {
      console.warn('Cannot load best score', e);
    }
  }, []);

  // Shuffle questions helper
  const shuffleDeck = () => {
    const list = [...SPEED_RUSH_QUESTIONS];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  // Start game
  const startGame = () => {
    const deck = shuffleDeck();
    setShuffledQuestions(deck);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setTotalAnswered(0);
    setSelectedAnswer(null);
    setIsAnswerLocked(false);
    setTimeLeft(GAME_DURATION_SECONDS);
    setGameState('playing');
  };

  // Confetti trigger
  const runConfetti = useCallback(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number }[] = [];
    const colors = ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#3b82f6', '#10b981', '#a855f7'];

    for (let i = 0; i < 65; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 7 + 4,
      });
    }

    let frames = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      frames++;
      if (frames < 70) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    render();
  }, []);

  // End game callback
  const endGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameState('ended');
    soundEffects.playCelebration();

    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    let rank: 'S' | 'A' | 'B' | 'C' = 'C';
    if (score >= 350) rank = 'S';
    else if (score >= 220) rank = 'A';
    else if (score >= 120) rank = 'B';

    const record: SpeedRushScoreRecord = {
      score,
      maxCombo,
      correctCount,
      totalAnswered,
      accuracy,
      rank,
      playedAt: new Date().toISOString(),
    };
    setResultRecord(record);

    if (score > bestScore) {
      setBestScore(score);
      try {
        localStorage.setItem(BEST_SCORE_KEY, score.toString());
      } catch (e) {
        console.warn('Cannot save best score', e);
      }
    }

    if (score >= 100) {
      setTimeout(runConfetti, 100);
    }
  }, [totalAnswered, correctCount, score, maxCombo, bestScore, runConfetti]);

  // Timer loop
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, endGame]);

  // Handle answer click
  const handleSelectAnswer = (index: number) => {
    if (isAnswerLocked || gameState !== 'playing') return;
    setIsAnswerLocked(true);
    setSelectedAnswer(index);

    const question = shuffledQuestions[currentQuestionIndex];
    const isCorrect = index === question.correctIndex;
    setTotalAnswered((t) => t + 1);

    if (isCorrect) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > maxCombo) {
        setMaxCombo(nextCombo);
      }

      // Combo multiplier: x1 (<3), x2 (3-5), x3 (6-9), x5 (10+)
      let multiplier = 1;
      if (nextCombo >= 10) multiplier = 5;
      else if (nextCombo >= 6) multiplier = 3;
      else if (nextCombo >= 3) multiplier = 2;

      const pointsAwarded = 10 * multiplier;
      setScore((s) => s + pointsAwarded);
      setCorrectCount((c) => c + 1);

      if (nextCombo >= 3) {
        soundEffects.playCombo(nextCombo);
      } else {
        soundEffects.playCorrect();
      }
    } else {
      setCombo(0);
      soundEffects.playIncorrect();
    }

    // Auto advance to next question (450ms if correct, 800ms if wrong to read explanation)
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsAnswerLocked(false);
      setCurrentQuestionIndex((prev) => {
        const next = prev + 1;
        if (next >= shuffledQuestions.length) {
          // Re-shuffle to keep going until 60s expires!
          setShuffledQuestions(shuffleDeck());
          return 0;
        }
        return next;
      });
    }, isCorrect ? 450 : 800);
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex] || SPEED_RUSH_QUESTIONS[0];

  const handleSpeakCurrent = () => {
    if (currentQuestion.koreanAudio) {
      speakKorean(currentQuestion.koreanAudio);
    } else {
      speakKorean(currentQuestion.prompt);
    }
  };

  return {
    gameState,
    timeLeft,
    score,
    combo,
    maxCombo,
    correctCount,
    totalAnswered,
    bestScore,
    currentQuestion,
    selectedAnswer,
    isAnswerLocked,
    resultRecord,
    confettiCanvasRef,
    startGame,
    endGame,
    handleSelectAnswer,
    handleSpeakCurrent,
    onOpenCardModal,
  };
}
