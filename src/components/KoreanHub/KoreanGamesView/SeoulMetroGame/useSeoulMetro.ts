import { useState, useEffect } from 'react';
import { SEOUL_METRO_MISSIONS } from '../gamesData';
import type { MetroStationMission } from '../types';
import { soundEffects } from '../soundEffects';
import { speakKorean } from '../../../../constants/koreanData';

const STAMPS_STORAGE_KEY = 'taskflow_seoul_metro_stamps';

export function useSeoulMetro() {
  const [activeStationIndex, setActiveStationIndex] = useState(0);
  const [collectedStamps, setCollectedStamps] = useState<string[]>([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);

  // Load collected stamps
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STAMPS_STORAGE_KEY);
      if (saved) {
        setCollectedStamps(JSON.parse(saved) || []);
      }
    } catch (e) {
      console.warn('Cannot load metro stamps', e);
    }
  }, []);

  const currentMission: MetroStationMission =
    SEOUL_METRO_MISSIONS[activeStationIndex] || SEOUL_METRO_MISSIONS[0];

  const handleSelectStation = (index: number) => {
    setActiveStationIndex(index);
    setSelectedOptionIndex(null);
    setIsAnswerLocked(false);
    setFeedbackText(null);
    soundEffects.playMetroArrival();
    speakKorean(SEOUL_METRO_MISSIONS[index].stationNameKo);
  };

  const handleAnswerOption = (optionIndex: number) => {
    if (isAnswerLocked) return;
    setIsAnswerLocked(true);
    setSelectedOptionIndex(optionIndex);

    const option = currentMission.options[optionIndex];
    setFeedbackText(option.feedback);

    if (option.isCorrect) {
      soundEffects.playCorrect();

      // Collect stamp if not collected yet
      if (!collectedStamps.includes(currentMission.id)) {
        const nextStamps = [...collectedStamps, currentMission.id];
        setCollectedStamps(nextStamps);
        try {
          localStorage.setItem(STAMPS_STORAGE_KEY, JSON.stringify(nextStamps));
        } catch (e) {
          console.warn('Cannot save metro stamps', e);
        }

        if (nextStamps.length === SEOUL_METRO_MISSIONS.length) {
          setTimeout(() => {
            soundEffects.playCelebration();
          }, 600);
        }
      }
    } else {
      soundEffects.playIncorrect();
    }
  };

  const handleRetryCurrentStation = () => {
    setIsAnswerLocked(false);
    setSelectedOptionIndex(null);
  };

  const handleSpeakCurrentStation = () => {
    speakKorean(currentMission.stationNameKo);
  };

  const isCurrentStationCompleted = collectedStamps.includes(currentMission.id);

  return {
    currentMission,
    activeStationIndex,
    collectedStamps,
    selectedOptionIndex,
    isAnswerLocked,
    feedbackText,
    isCurrentStationCompleted,
    handleSelectStation,
    handleAnswerOption,
    handleRetryCurrentStation,
    handleSpeakCurrentStation,
  };
}
