import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Flashcard, FlashcardStats, CreateFlashcardPayload, ReviewRating } from '../../types/flashcard';
import { api } from '../../services/api';

const MOCK_FLASHCARDS: Flashcard[] = [
  {
    id: 'mock-fc-1',
    word: 'resilient',
    ipa: '/rɪˈzɪl.jənt/',
    partOfSpeech: 'adjective',
    meaningVi: 'kiên cường, có khả năng phục hồi nhanh sau khó khăn',
    meaningEn: 'able to withstand or recover quickly from difficult conditions',
    exampleEn: 'She is a resilient student who bounced back stronger after the exam failure.',
    exampleVi: 'Cô ấy là một học sinh kiên cường, đã vực dậy mạnh mẽ hơn sau lần thi trượt.',
    topic: 'IELTS Academic',
    level: 'C1',
    status: 'learning',
    repetition: 1,
    intervalDays: 1,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString().split('T')[0],
  },
  {
    word: 'meticulous',
    id: 'mock-fc-2',
    ipa: '/məˈtɪk.jə.ləs/',
    partOfSpeech: 'adjective',
    meaningVi: 'tỉ mỉ, cẩn thận, chi tiết từng li từng tí',
    meaningEn: 'showing great attention to detail; very careful and precise',
    exampleEn: 'He kept meticulous notes during every English lecture.',
    exampleVi: 'Anh ấy ghi chép cực kỳ tỉ mỉ trong mỗi bài giảng tiếng Anh.',
    topic: 'IELTS Academic',
    level: 'C1',
    status: 'new',
    repetition: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString().split('T')[0],
  },
  {
    word: 'ubiquitous',
    id: 'mock-fc-3',
    ipa: '/juːˈbɪk.wə.təs/',
    partOfSpeech: 'adjective',
    meaningVi: 'phổ biến khắp nơi, đâu đâu cũng thấy',
    meaningEn: 'present, appearing, or found everywhere',
    exampleEn: 'Smartphones have become ubiquitous in modern daily life.',
    exampleVi: 'Điện thoại thông minh đã trở nên phổ biến ở khắp mọi nơi trong đời sống hiện đại.',
    topic: 'IELTS Academic',
    level: 'C1',
    status: 'learning',
    repetition: 2,
    intervalDays: 3,
    easeFactor: 2.6,
    nextReviewDate: new Date().toISOString().split('T')[0],
  },
  {
    word: 'sustainable',
    id: 'mock-fc-4',
    ipa: '/səˈsteɪ.nə.bəl/',
    partOfSpeech: 'adjective',
    meaningVi: 'bền vững, thân thiện với môi trường lâu dài',
    meaningEn: 'able to be maintained at a certain rate or level without depleting resources',
    exampleEn: 'Sustainable daily habits help you maintain long-term English progress.',
    exampleVi: 'Các thói quen bền vững hàng ngày giúp bạn duy trì sự tiến bộ tiếng Anh lâu dài.',
    topic: 'Environment',
    level: 'B2',
    status: 'new',
    repetition: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString().split('T')[0],
  },
  {
    word: 'perseverance',
    id: 'mock-fc-5',
    ipa: '/ˌpɝː.səˈvɪr.əns/',
    partOfSpeech: 'noun',
    meaningVi: 'sự kiên trì, bền bỉ theo đuổi mục tiêu',
    meaningEn: 'persistence in doing something despite difficulty or delay in achieving success',
    exampleEn: 'Perseverance is the key factor in conquering IELTS band 7.5.',
    exampleVi: 'Sự kiên trì là yếu tố then chốt để chinh phục IELTS band 7.5.',
    topic: 'Daily Life',
    level: 'C1',
    status: 'mastered',
    repetition: 4,
    intervalDays: 15,
    easeFactor: 2.8,
    nextReviewDate: '2026-10-28',
  },
];

export function useFlashcardView(currentStudent: string) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [stats, setStats] = useState<FlashcardStats>({
    totalCards: 0,
    dueToday: 0,
    newCards: 0,
    learning: 0,
    mastered: 0,
    topics: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'study' | 'library'>('study');

  // Study Mode State
  const [studyIndex, setStudyIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyCompleted, setStudyCompleted] = useState(false);
  const [studyLevel, setStudyLevel] = useState<string>('all');
  const [studyTopic, setStudyTopic] = useState<string>('all');

  // Filter & Search State
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [visibleCount, setVisibleCount] = useState(60);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);

  // 1. Tải danh sách thẻ từ Backend (hoặc fallback mock)
  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getFlashcards({
        studentName: currentStudent,
      });

      if (Array.isArray(data) && data.length > 0) {
        setCards(data);
      } else {
        setCards(MOCK_FLASHCARDS);
      }

      // Tải stats
      try {
        const statsData = await api.getFlashcardStats(currentStudent);
        if (statsData) setStats(statsData);
      } catch {
        // Tự tính stats từ cards
      }
    } catch {
      setCards(MOCK_FLASHCARDS);
    } finally {
      setLoading(false);
    }
  }, [currentStudent]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Cập nhật stats nội bộ nếu cần
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const dueCount = cards.filter((c) => !c.nextReviewDate || c.nextReviewDate <= todayStr).length;
    const newCount = cards.filter((c) => c.status === 'new').length;
    const learnCount = cards.filter((c) => c.status === 'learning').length;
    const masterCount = cards.filter((c) => c.status === 'mastered').length;
    const topics = Array.from(new Set(cards.map((c) => c.topic || 'General'))).filter(Boolean);

    setStats({
      totalCards: cards.length,
      dueToday: dueCount,
      newCards: newCount,
      learning: learnCount,
      mastered: masterCount,
      topics,
    });
  }, [cards]);

  // 2. Danh sách các thẻ cần ôn hôm nay (Study Queue, chia mẻ 20 từ mỗi đợt)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const dueQueue = useMemo(() => {
    const due = cards.filter((c) => {
      const isDue = !c.nextReviewDate || c.nextReviewDate <= todayStr;
      const matchLevel =
        studyLevel === 'all' ||
        (c.level && c.level.toUpperCase() === studyLevel.toUpperCase());
      const matchTopic =
        studyTopic === 'all' ||
        (c.topic && c.topic.toLowerCase() === studyTopic.toLowerCase());
      return isDue && matchLevel && matchTopic;
    });
    return due.slice(0, 20); // Mỗi lượt học 20 từ để tập trung tối đa
  }, [cards, todayStr, studyLevel, studyTopic]);

  // Reset tiến độ ôn khi đổi Level hoặc Chủ đề ôn
  useEffect(() => {
    setStudyIndex(0);
    setIsFlipped(false);
    setStudyCompleted(false);
  }, [studyLevel, studyTopic]);

  // Đếm số lượng từ vựng theo từng chủ đề thực tế
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const card of cards) {
      if (card.topic) {
        counts[card.topic] = (counts[card.topic] || 0) + 1;
      }
    }
    return counts;
  }, [cards]);

  // Thẻ hiện tại đang hiển thị trong chế độ ôn
  const currentCard = useMemo(() => {
    if (dueQueue.length === 0) return null;
    return dueQueue[studyIndex] || null;
  }, [dueQueue, studyIndex]);

  // 3. Lật thẻ
  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // 4. Phát âm từ vựng (Audio MP3 hoặc Web Speech API)
  const speakWord = useCallback((word: string, audioUrl?: string) => {
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        audio.play().catch(() => {
          // Fallback Web Speech
          if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(word);
            u.lang = 'en-US';
            u.rate = 0.9;
            window.speechSynthesis.speak(u);
          }
        });
        return;
      } catch {
        // Fallback
      }
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  }, []);

  // 5. Đánh giá ôn tập SRS (Again, Hard, Good, Easy)
  const handleReview = useCallback(
    async (rating: ReviewRating) => {
      if (!currentCard) return;

      // Reset flip
      setIsFlipped(false);

      try {
        // Gọi API backend
        const updated = await api.reviewFlashcard(currentCard.id, rating, currentStudent);
        if (updated) {
          setCards((prev) => prev.map((c) => (c.id === currentCard.id ? updated : c)));
        }
      } catch {
        // Local update nếu offline
        setCards((prev) =>
          prev.map((c) => {
            if (c.id === currentCard.id) {
              const rep = rating === 'again' ? 0 : (c.repetition || 0) + 1;
              const nextDays = rating === 'again' ? 1 : rating === 'hard' ? 2 : rating === 'good' ? 4 : 7;
              const nextD = new Date();
              nextD.setDate(nextD.getDate() + nextDays);
              return {
                ...c,
                repetition: rep,
                nextReviewDate: nextD.toISOString().split('T')[0],
                status: rep >= 3 ? 'mastered' : 'learning',
              };
            }
            return c;
          }),
        );
      }

      // Chuyển sang thẻ tiếp theo
      if (studyIndex + 1 < dueQueue.length) {
        setStudyIndex((prev) => prev + 1);
      } else {
        setStudyCompleted(true);
      }
    },
    [currentCard, currentStudent, dueQueue.length, studyIndex],
  );

  // 6. Reset chế độ ôn khi muốn ôn lại
  const restartStudy = useCallback(() => {
    setStudyIndex(0);
    setIsFlipped(false);
    setStudyCompleted(false);
  }, []);

  // 7. Thêm thẻ mới
  const handleAddCard = useCallback(async (payload: CreateFlashcardPayload) => {
    try {
      const created = await api.createFlashcard(payload);
      if (created) {
        setCards((prev) => [created, ...prev]);
      }
    } catch {
      // Local fallback
      const newMock: Flashcard = {
        id: `card-${Date.now()}`,
        ...payload,
        status: 'new',
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString().split('T')[0],
      };
      setCards((prev) => [newMock, ...prev]);
    }
  }, []);

  // 8. Xóa thẻ
  const handleDeleteCard = useCallback(async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thẻ từ vựng này?')) return;
    try {
      await api.deleteFlashcard(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setCards((prev) => prev.filter((c) => c.id !== id));
    }
  }, []);

  // 9. Lọc danh sách thẻ trong thư viện (Library)
  const filteredLibraryCards = useMemo(() => {
    return cards.filter((c) => {
      const matchTopic = selectedTopic === 'all' || c.topic === selectedTopic;
      const matchLevel = selectedLevel === 'all' || c.level === selectedLevel;
      const matchSearch =
        !search.trim() ||
        c.word.toLowerCase().includes(search.toLowerCase()) ||
        c.meaningVi.toLowerCase().includes(search.toLowerCase()) ||
        (c.exampleEn && c.exampleEn.toLowerCase().includes(search.toLowerCase()));

      return matchTopic && matchLevel && matchSearch;
    });
  }, [cards, selectedTopic, selectedLevel, search]);

  const displayedLibraryCards = useMemo(() => {
    return filteredLibraryCards.slice(0, visibleCount);
  }, [filteredLibraryCards, visibleCount]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 60);
  }, []);

  // Reset pagination khi search/filter đổi
  useEffect(() => {
    setVisibleCount(60);
  }, [search, selectedTopic, selectedLevel]);

  return {
    cards,
    stats,
    loading,
    activeSubTab,
    setActiveSubTab,
    // Study Mode
    dueQueue,
    currentCard,
    studyIndex,
    isFlipped,
    toggleFlip,
    speakWord,
    handleReview,
    studyCompleted,
    restartStudy,
    studyLevel,
    setStudyLevel,
    studyTopic,
    setStudyTopic,
    topicCounts,
    // Library Mode
    filteredLibraryCards,
    displayedLibraryCards,
    visibleCount,
    loadMore,
    search,
    setSearch,
    selectedTopic,
    setSelectedTopic,
    selectedLevel,
    setSelectedLevel,
    handleDeleteCard,
    // Add Modal
    isAddOpen,
    setIsAddOpen,
    handleAddCard,
    fetchCards,
  };
}
