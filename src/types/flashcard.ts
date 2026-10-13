export type FlashcardStatus = 'new' | 'learning' | 'mastered';
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface Flashcard {
  id: string;
  word: string;
  ipa?: string;
  partOfSpeech?: string;
  meaningVi: string;
  meaningEn?: string;
  exampleEn?: string;
  exampleVi?: string;
  audioUrl?: string;
  topic?: string;
  level?: string;
  studentName?: string;
  repetition?: number;
  intervalDays?: number;
  easeFactor?: number;
  nextReviewDate?: string;
  lastReviewedAt?: string;
  status: FlashcardStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface FlashcardStats {
  totalCards: number;
  dueToday: number;
  newCards: number;
  learning: number;
  mastered: number;
  topics: string[];
}

export interface CreateFlashcardPayload {
  word: string;
  ipa?: string;
  partOfSpeech?: string;
  meaningVi: string;
  meaningEn?: string;
  exampleEn?: string;
  exampleVi?: string;
  audioUrl?: string;
  topic?: string;
  level?: string;
  studentName?: string;
}

export interface WordLookupResult {
  word: string;
  ipa: string;
  partOfSpeech: string;
  meaningEn: string;
  exampleEn: string;
  audioUrl: string;
}
