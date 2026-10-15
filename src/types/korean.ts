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

export interface HangeulDayLetter {
  char: string;
  vietnameseAnchor: string;
  mnemonicHint: string;
  audioPrompt: string;
}

export interface HangeulDayWord {
  word: string;
  meaningVi: string;
  rom?: string;
  breakdownHint?: string;
  icon?: string;
}

export interface HangeulDayQuizItem {
  question: string;
  targetAudio: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface HangeulDayLesson {
  day: number;
  title: string;
  subtitle: string;
  timeEstimate: string; // ví dụ: "10-12 phút"
  letters: HangeulDayLetter[];
  realWords: HangeulDayWord[];
  phoneticTips: string;
  quickQuiz: HangeulDayQuizItem[];
  victoryRewardBadge: string;
}

export interface VietnameseNameGuide {
  vi: string;
  ko: string;
  hanjaVi?: string;
  meaning?: string;
}

export interface DailyVocabLesson {
  day: number;
  week: number;
  theme: string;
  title: string;
  focus: string;
  grammarTip?: string;
  quickAdvice?: string;
  words: KoreanVocabWord[];
}

export interface SinoCompoundWord {
  word: string;
  hanja: string;
  meaningVi: string;
  rom?: string;
  exampleKo?: string;
  exampleVi?: string;
}

export interface SinoKoreanRoot {
  id: string;
  root: string; // ký tự Hán-Hàn (ví dụ: 학, 생, 인, 교)
  hanja: string; // chữ Hán (學, 生, 人, 校)
  hanjaVi: string; // Âm Hán-Việt tương đương (Học, Sinh, Nhân, Hiệu)
  meaningVi: string; // Nghĩa tiếng Việt
  category: 'core' | 'places' | 'people' | 'time' | 'actions' | 'objects';
  description: string;
  compounds: SinoCompoundWord[];
}

export interface SentenceWordToken {
  id: string;
  text: string;
  rom?: string;
  role: 'subject' | 'object' | 'verb' | 'adverb' | 'time' | 'place' | 'particle';
  colorTag?: string;
}

export interface SentenceBuilderItem {
  id: string;
  vietnamese: string;
  targetKorean: string;
  targetTokens: string[]; // Danh sách các token theo thứ tự đúng
  tokens: SentenceWordToken[]; // Danh sách token để người dùng chọn (đã xáo trộn)
  grammarPoint: string; // Trợ từ hoặc cấu trúc chính (ví dụ: 은/는 + 을/를 + -아요)
  explanation: string;
  level: 'level1' | 'level2' | 'level3';
}

export interface VerbConjugation {
  root: string; // Động từ nguyên thể (ví dụ: 가다, 먹다, 듣다, 춥다)
  meaningVi: string;
  type: 'regular' | 'irregular_b' | 'irregular_d' | 'irregular_eu' | 'irregular_reu' | 'irregular_s' | 'irregular_h';
  typeLabel: string; // ví dụ: "Bất quy tắc ㅂ", "Quy tắc nguyên âm sáng"
  presentCasual: string; // -아요/어요 (가요, 먹어요, 들어요, 추워요)
  presentFormal: string; // -습니다/ㅂ니다 (갑니다, 먹습니다, 듣습니다, 춥습니다)
  pastCasual: string; // -았/었어요 (갔어요, 먹었어요, 들었어요, 추웠어요)
  futureCasual: string; // -(으)ㄹ 거예요 (갈 거예요, 먹을 거예요, 들을 거예요, 추울 거예요)
  negativeCasual: string; // 안 ~ / -지 않아요 (안 가요, 먹지 않아요)
  wantCasual: string; // -고 싶어요 (가고 싶어요, 먹고 싶어요)
  honorific: string; // -(으)세요 (가세요, 드세요/먹으세요)
  explanation: string;
}

export interface RoleplayChoice {
  id: string;
  korean: string;
  romanization: string;
  vietnamese: string;
  isCorrect?: boolean;
  replyReaction: string; // Phản hồi tiếp theo của NPC
  scoreBonus?: number;
}

export interface RoleplayTurn {
  turnIndex: number;
  speaker: 'npc' | 'user';
  speakerName: string;
  speakerRole: string;
  korean: string;
  romanization: string;
  vietnamese: string;
  audioRate?: number;
  choices?: RoleplayChoice[];
  tip?: string;
}

export interface RoleplayScenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  location: string;
  difficulty: 'beginner' | 'intermediate';
  backgroundGradient: string;
  turns: RoleplayTurn[];
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  current: number;
  target: number;
  isCompleted: boolean;
  xpReward: number;
}

export type StudyAdviceCategory = 'all' | 'mindset' | 'pronunciation' | 'vocab' | 'grammar';

export interface StudyAdviceItem {
  id: string;
  category: 'mindset' | 'pronunciation' | 'vocab' | 'grammar';
  categoryLabel: string;
  icon: string;
  title: string;
  shortSnippet: string;
  proverbKo?: string;
  proverbVi?: string;
  coreAdvice: string;
  actionItem: string;
  badge: string;
  audioText?: string;
}


