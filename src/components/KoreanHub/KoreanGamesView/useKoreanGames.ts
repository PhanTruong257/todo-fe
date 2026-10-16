import { useState, useEffect } from 'react';
import type { GameTab } from './types';

const BEST_SCORE_KEY = 'taskflow_speed_rush_best_score';
const STAMPS_STORAGE_KEY = 'taskflow_seoul_metro_stamps';

export function useKoreanGames() {
  const [activeGameTab, setActiveGameTab] = useState<GameTab>('speed_rush');
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [speedRushScore, setSpeedRushScore] = useState(0);
  const [metroStampsCount, setMetroStampsCount] = useState(0);

  // Sync latest scores for the card modal
  useEffect(() => {
    try {
      const savedScore = localStorage.getItem(BEST_SCORE_KEY);
      if (savedScore) {
        setSpeedRushScore(parseInt(savedScore, 10) || 0);
      }
      const savedStamps = localStorage.getItem(STAMPS_STORAGE_KEY);
      if (savedStamps) {
        const parsed = JSON.parse(savedStamps);
        if (Array.isArray(parsed)) {
          setMetroStampsCount(parsed.length);
        }
      }
    } catch (e) {
      console.warn('Cannot read storage stats for Korean games', e);
    }
  }, [activeGameTab, isCardModalOpen]);

  const handleOpenCardModal = (scoreOverride?: number) => {
    if (typeof scoreOverride === 'number') {
      setSpeedRushScore(scoreOverride);
    }
    setIsCardModalOpen(true);
  };

  const handleCloseCardModal = () => {
    setIsCardModalOpen(false);
  };

  return {
    activeGameTab,
    setActiveGameTab,
    isCardModalOpen,
    speedRushScore,
    metroStampsCount,
    handleOpenCardModal,
    handleCloseCardModal,
  };
}
