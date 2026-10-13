export type KoreanLetterType = 'basic_vowel' | 'complex_vowel' | 'basic_consonant' | 'tense_consonant' | 'patchim';

export interface HangeulLetter {
  char: string;
  name: string;
  romanization: string;
  vietnameseGuide: string;
  type: KoreanLetterType;
  sampleWord?: string;
  sampleMeaning?: string;
}

export type HanjaRelationType = 'identical' | 'false_friend' | 'pure_korean';

export interface KoreanVocabWord {
  id: string;
  hangeul: string;
  romanization: string;
  actualPronunciation?: string; // Dạng đọc thực tế (ví dụ: [함니다], [머거요])
  meaningVi: string;
  hanjaVi?: string; // Âm Hán-Hàn tương đương trong tiếng Việt (ví dụ: 학생 -> Học sinh)
  hanjaType?: HanjaRelationType; // Phân loại quan hệ: đồng nghĩa, bạn giả lệch nghĩa, hoặc thuần Hàn
  hanjaWarning?: string; // Cảnh báo từ bạn giả (false friend), ví dụ: 인사 là lời chào chứ không phải nhân sự
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'number' | 'pronoun' | 'phrase';
  dictionaryForm?: string; // Dạng nguyên thể (ví dụ: 가다, 먹다, 좋다)
  conjugatedForm?: string; // Dạng chia đuôi câu thân mật -아요/어요 (ví dụ: 가요, 먹어요, 좋아요)
  topic: string;
  level: string; // TOPIK 1 (Level 1, Level 2)
  exampleKo: string;
  exampleVi: string;
  repetition?: number;
  intervalDays?: number;
  easeFactor?: number;
  nextReviewDate?: string;
  status?: 'new' | 'learning' | 'mastered';
  isMachineTranslated?: boolean;
  leechCount?: number; // Số lần sai tích lũy để phát hiện Leech
  learningStep?: number; // Vị trí trong phiên học nếu trả lời sai
}

export interface ReviewLog {
  id: string;
  cardId: string;
  timestamp: string;
  mode: 'ko-to-vi' | 'vi-to-ko' | 'listen-to-ko' | 'type-in';
  correct: boolean;
  rating: 'again' | 'hard' | 'good' | 'easy';
  responseMs?: number;
}

export interface PatchimRule {
  id: string;
  representativeSound: string;
  soundLabel: string;
  vietnameseAnalogy?: string; // So sánh với phụ âm cuối tiếng Việt: -c, -t, -p, -m, -n, -ng
  letters: string[];
  explanation: string;
  examples: {
    word: string;
    reading: string;
    meaningVi: string;
  }[];
}

export interface MinimalPair {
  id: string;
  title: string;
  description: string;
  category: 'consonant_trio' | 'vowel_confusion';
  pairs: {
    word: string;
    soundType: string; // thường, bật hơi, căng
    rom: string;
    meaningVi: string;
  }[];
}

export interface GrammarExercise {
  id: string;
  grammarId: string;
  questionKo: string;
  blankTarget: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  ruleHint: string;
}

export interface KoreanGrammarPoint {
  id: string;
  title: string;
  koreanPattern: string;
  formula: string;
  explanation: string;
  tips: string;
  examples: {
    korean: string;
    vietnamese: string;
    breakdown?: string;
  }[];
  exercises?: GrammarExercise[];
}

export interface KoreanDialogueItem {
  id: string;
  category: string;
  korean: string;
  romanization: string;
  vietnamese: string;
  situation: string;
}
