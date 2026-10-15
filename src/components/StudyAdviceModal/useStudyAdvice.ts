import { useState, useEffect, useMemo, useCallback } from 'react';
import type { StudyAdviceItem, StudyAdviceCategory } from '../../types/korean';
import { STUDY_ADVICE_LIST } from '../../constants/studyAdviceData';
import { speakKorean } from '../../constants/koreanData';

const STORAGE_KEY_APPLIED_ADVICE = 'taskflow_applied_advice_ids_v1';
const STORAGE_KEY_DAILY_SPOTLIGHT = 'taskflow_daily_advice_spotlight_id_v1';

export const useStudyAdvice = () => {
  const [selectedCategory, setSelectedCategory] = useState<StudyAdviceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedAdviceIds, setAppliedAdviceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPLIED_ADVICE);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Spotlight lời khuyên nổi bật ngẫu nhiên hôm nay
  const [spotlightId, setSpotlightId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DAILY_SPOTLIGHT);
      if (saved && STUDY_ADVICE_LIST.some((a) => a.id === saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    // Mặc định bốc ngẫu nhiên
    const randomIndex = Math.floor(Math.random() * STUDY_ADVICE_LIST.length);
    return STUDY_ADVICE_LIST[randomIndex]?.id || STUDY_ADVICE_LIST[0].id;
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Lưu trạng thái appliedAdviceIds vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPLIED_ADVICE, JSON.stringify(appliedAdviceIds));
    } catch (e) {
      console.error('Failed to save applied advice ids', e);
    }
  }, [appliedAdviceIds]);

  // Lưu spotlightId vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DAILY_SPOTLIGHT, spotlightId);
    } catch (e) {
      console.error('Failed to save spotlight advice id', e);
    }
  }, [spotlightId]);

  // Đổi lời khuyên ngẫu nhiên
  const rollRandomAdvice = useCallback(() => {
    const remaining = STUDY_ADVICE_LIST.filter((a) => a.id !== spotlightId);
    if (remaining.length > 0) {
      const nextIndex = Math.floor(Math.random() * remaining.length);
      setSpotlightId(remaining[nextIndex].id);
    }
  }, [spotlightId]);

  // Toggle áp dụng lời khuyên
  const toggleApplyAdvice = useCallback((id: string) => {
    setAppliedAdviceIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  // Sao chép lời khuyên
  const copyAdvice = useCallback((item: StudyAdviceItem) => {
    const textToCopy = `💡 [TaskFlow Korean - Lời Khuyên & Động Lực]\n📌 ${item.title}\n${item.proverbKo ? `🇰🇷 "${item.proverbKo}" - ${item.proverbVi}\n` : ''}✨ Lời khuyên: ${item.coreAdvice}\n🎯 Hành động: ${item.actionItem}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  // Lời khuyên spotlight hiện tại
  const spotlightItem = useMemo(() => {
    return STUDY_ADVICE_LIST.find((a) => a.id === spotlightId) || STUDY_ADVICE_LIST[0];
  }, [spotlightId]);

  // Lọc danh sách theo Category & Search
  const filteredList = useMemo(() => {
    return STUDY_ADVICE_LIST.filter((item) => {
      // 1. Lọc theo category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // 2. Lọc theo search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.coreAdvice.toLowerCase().includes(q);
        const matchProverb = item.proverbKo?.toLowerCase().includes(q) || item.proverbVi?.toLowerCase().includes(q);
        const matchAction = item.actionItem.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchProverb || matchAction;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Thống kê tiến độ áp dụng
  const totalCount = STUDY_ADVICE_LIST.length;
  const appliedCount = appliedAdviceIds.length;
  const progressPercent = Math.round((appliedCount / totalCount) * 100);

  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    appliedAdviceIds,
    toggleApplyAdvice,
    spotlightItem,
    rollRandomAdvice,
    filteredList,
    copyAdvice,
    copiedId,
    speakKorean,
    totalCount,
    appliedCount,
    progressPercent,
  };
};
