import { useState, useEffect, useRef } from 'react';
import { KCHAT_SCENARIOS } from '../gamesData';
import type { KChatScenario, KChatOption } from '../types';
import { soundEffects } from '../soundEffects';
import { speakKorean } from '../../../../constants/koreanData';

export interface ChatFeedItem {
  id: string;
  senderName: string;
  senderAvatar: string;
  isNpc: boolean;
  messageKo: string;
  messageVi: string;
  timestamp: string;
  isUnread?: boolean;
}

export function useKChat() {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatFeedItem[]>([]);
  const [affinity, setAffinity] = useState(60);
  const [isTyping, setIsTyping] = useState(false);
  const [isScenarioFinished, setIsScenarioFinished] = useState(false);

  const activeScenario: KChatScenario = KCHAT_SCENARIOS[activeScenarioIndex] || KCHAT_SCENARIOS[0];
  const chatStreamRef = useRef<HTMLDivElement | null>(null);

  // Initialize scenario
  const initScenario = (scenarioIndex: number) => {
    const sc = KCHAT_SCENARIOS[scenarioIndex];
    if (!sc) return;
    setActiveScenarioIndex(scenarioIndex);
    setCurrentStepIndex(0);
    setAffinity(60);
    setIsTyping(false);
    setIsScenarioFinished(false);

    // Initial message from NPC
    const firstItem: ChatFeedItem = {
      id: `msg_init_${Date.now()}`,
      senderName: sc.partnerName,
      senderAvatar: sc.partnerAvatar,
      isNpc: true,
      messageKo: sc.initialMessage,
      messageVi: sc.initialMessageVi,
      timestamp: '오후 ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory([firstItem]);
    soundEffects.playKatalkMessage();
  };

  useEffect(() => {
    initScenario(0);
  }, []);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  // Handle user response click
  const handleSelectOption = (option: KChatOption) => {
    if (isTyping) return;

    const timeStr = '오후 ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    // 1. Add user message
    const userMsg: ChatFeedItem = {
      id: `user_${Date.now()}`,
      senderName: 'Bạn (나)',
      senderAvatar: '🌸',
      isNpc: false,
      messageKo: option.koreanText,
      messageVi: option.vietnameseMeaning,
      timestamp: timeStr,
      isUnread: true,
    };

    setChatHistory((prev) => [...prev, userMsg]);
    soundEffects.playCorrect();
    setAffinity((prev) => Math.min(100, prev + option.affinityDelta));

    // 2. Partner typing indicator
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      // Unread "1" disappears
      setChatHistory((prev) =>
        prev.map((m) => (m.id === userMsg.id ? { ...m, isUnread: false } : m))
      );

      // 3. Add partner reply
      const replyMsg: ChatFeedItem = {
        id: `reply_${Date.now()}`,
        senderName: activeScenario.partnerName,
        senderAvatar: activeScenario.partnerAvatar,
        isNpc: true,
        messageKo: option.replyReaction,
        messageVi: option.reactionVi,
        timestamp: '오후 ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, replyMsg]);
      soundEffects.playKatalkMessage();

      // Check next step
      const nextStep = currentStepIndex + 1;
      if (nextStep < activeScenario.steps.length) {
        setCurrentStepIndex(nextStep);
      } else {
        setIsScenarioFinished(true);
        soundEffects.playCelebration();
      }
    }, 1200);
  };

  const handleSpeak = (text: string) => {
    speakKorean(text);
  };

  const currentStep = activeScenario.steps[currentStepIndex];
  const availableOptions = !isScenarioFinished ? currentStep?.options || [] : [];

  return {
    activeScenario,
    activeScenarioIndex,
    chatHistory,
    affinity,
    isTyping,
    isScenarioFinished,
    availableOptions,
    chatStreamRef,
    initScenario,
    handleSelectOption,
    handleSpeak,
  };
}
