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

export interface KoreanVocabWord {
  id: string;
  hangeul: string;
  romanization: string;
  actualPronunciation?: string; // Dạng đọc thực tế (ví dụ: [함니다], [머거요])
  meaningVi: string;
  hanjaVi?: string; // Âm Hán-Hàn tương đương trong tiếng Việt (ví dụ: 학생 -> Học sinh)
  partOfSpeech: string;
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
}

export interface PatchimRule {
  id: string;
  representativeSound: string;
  soundLabel: string;
  letters: string[];
  explanation: string;
  examples: {
    word: string;
    reading: string;
    meaningVi: string;
  }[];
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
}

export interface KoreanDialogueItem {
  id: string;
  category: string;
  korean: string;
  romanization: string;
  vietnamese: string;
  situation: string;
}
