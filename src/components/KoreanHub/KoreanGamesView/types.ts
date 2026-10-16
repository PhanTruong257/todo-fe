// ==========================================
// TYPES: KOREAN GAMES & ARCADE (GIAI ĐOẠN 5)
// ==========================================

export type GameTab = 'speed_rush' | 'stroke_canvas' | 'kchat' | 'seoul_metro';

// 1. SPEED RUSH ARENA (ĐẤU TRƯỜNG PHẢN XẠ 60S)
export interface SpeedRushQuestion {
  id: string;
  category: 'hangeul' | 'vocab' | 'culture' | 'numbers' | 'quick_reply';
  prompt: string;
  subPrompt?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  koreanAudio?: string;
}

export interface SpeedRushScoreRecord {
  score: number;
  maxCombo: number;
  correctCount: number;
  totalAnswered: number;
  accuracy: number;
  rank: 'S' | 'A' | 'B' | 'C';
  playedAt: string;
}

// 2. HANGEUL STROKE CANVAS (TẬP ĐỒ NÉT THƯ PHÁP)
export interface StrokeGuidePoint {
  x: number; // 0 to 1 normalized coordinates
  y: number; // 0 to 1 normalized coordinates
}

export interface StrokePath {
  strokeNumber: number;
  label: string;
  points: StrokeGuidePoint[];
  direction: 'down' | 'right' | 'diagonal-down-left' | 'diagonal-down-right' | 'circle' | 'curve';
}

export interface StrokeCharacter {
  char: string;
  name: string;
  romanization: string;
  vietnameseMeaning: string;
  type: 'consonant' | 'vowel' | 'syllable';
  totalStrokes: number;
  strokes: StrokePath[];
  culturalNote?: string;
}

// 3. KAKAOTALK K-CHAT SIMULATOR (MÔ PHỎNG NHẮN TIN)
export interface KChatOption {
  id: string;
  koreanText: string;
  vietnameseMeaning: string;
  affinityDelta: number; // +10, +20, etc.
  replyReaction: string; // Phản hồi của đối phương
  reactionVi: string;
}

export interface KChatStep {
  stepId: number;
  senderName: string;
  senderAvatar: string;
  isNpc: boolean;
  messageKo: string;
  messageVi: string;
  timestamp: string;
  options?: KChatOption[];
  inputPlaceholder?: string;
  expectedInputKo?: string[];
}

export interface KChatScenario {
  id: string;
  title: string;
  subtitle: string;
  partnerName: string;
  partnerAvatar: string;
  badge: string;
  statusQuote: string;
  initialMessage: string;
  initialMessageVi: string;
  steps: KChatStep[];
}

// 4. SEOUL METRO SURVIVAL (BẢN ĐỒ THÁM HIỂM TUYẾN SỐ 2)
export interface MetroStationMission {
  id: string;
  stationNumber: string;
  stationNameKo: string;
  stationNameRom: string;
  stationNameVi: string;
  badge: string;
  accentColor: string;
  brief: string;
  icon: string;
  situationScenario: string;
  questionKo: string;
  questionVi: string;
  options: {
    korean: string;
    vietnamese: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  stampTitleKo: string;
  stampTitleVi: string;
  rewardXp: number;
}

// 5. AESTHETIC K-CARD DATA (XUẤT THẺ INSTAGRAM STORY)
export interface AestheticKCardData {
  learnerName: string;
  dateStr: string;
  speedRushHighScore: number;
  metroStampsUnlocked: number;
  favoriteChar: string;
  favoriteQuoteKo: string;
  favoriteQuoteVi: string;
}
