export interface TopicDefinition {
  key: string;
  nameVi: string;
  nameEn: string;
  icon: string;
  color: string;
}

export const TOPIC_DEFINITIONS: TopicDefinition[] = [
  { key: 'Education & Academic', nameVi: 'Giáo dục & Học tập', nameEn: 'Education & Academic', icon: '🎓', color: '#6366f1' },
  { key: 'Work & Business', nameVi: 'Công việc & Kinh doanh', nameEn: 'Work & Business', icon: '💼', color: '#0ea5e9' },
  { key: 'Environment & Nature', nameVi: 'Môi trường & Thiên nhiên', nameEn: 'Environment & Nature', icon: '🌿', color: '#10b981' },
  { key: 'Science & Technology', nameVi: 'Khoa học & Công nghệ', nameEn: 'Science & Technology', icon: '💻', color: '#8b5cf6' },
  { key: 'People & Relationships', nameVi: 'Con người & Mối quan hệ', nameEn: 'People & Relationships', icon: '👥', color: '#f59e0b' },
  { key: 'General & Communication', nameVi: 'Giao tiếp & Đời sống', nameEn: 'General & Communication', icon: '💬', color: '#64748b' },
  { key: 'Health & Medicine', nameVi: 'Sức khỏe & Y tế', nameEn: 'Health & Medicine', icon: '🏥', color: '#ef4444' },
  { key: 'Food & Cooking', nameVi: 'Ẩm thực & Nấu nướng', nameEn: 'Food & Cooking', icon: '🍔', color: '#f97316' },
  { key: 'Travel & Transport', nameVi: 'Du lịch & Giao thông', nameEn: 'Travel & Transport', icon: '✈️', color: '#06b6d4' },
  { key: 'Arts & Entertainment', nameVi: 'Nghệ thuật & Giải trí', nameEn: 'Arts & Entertainment', icon: '🎨', color: '#ec4899' },
  { key: 'Feelings & Emotions', nameVi: 'Cảm xúc & Tâm lý', nameEn: 'Feelings & Emotions', icon: '💖', color: '#f43f5e' },
  { key: 'Sports & Leisure', nameVi: 'Thể thao & Vui chơi', nameEn: 'Sports & Leisure', icon: '⚽', color: '#14b8a6' },
  { key: 'Law, Politics & Society', nameVi: 'Pháp luật & Chính trị', nameEn: 'Law, Politics & Society', icon: '⚖️', color: '#a855f7' },
];

export function getTopicMeta(topicName?: string): TopicDefinition {
  if (!topicName) {
    return {
      key: 'General & Communication',
      nameVi: 'Giao tiếp & Đời sống',
      nameEn: 'General & Communication',
      icon: '💬',
      color: '#64748b',
    };
  }

  const found = TOPIC_DEFINITIONS.find(
    (t) => t.key.toLowerCase() === topicName.toLowerCase() || t.nameVi.toLowerCase() === topicName.toLowerCase(),
  );

  if (found) return found;

  return {
    key: topicName,
    nameVi: topicName,
    nameEn: topicName,
    icon: '📚',
    color: '#64748b',
  };
}
