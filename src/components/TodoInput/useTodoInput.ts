import { useState, useMemo, useEffect } from 'react';
import type { PriorityLevel, CreateTodoPayload } from '../../types/todo';

interface UseTodoInputProps {
  onAddTodo: (payload: CreateTodoPayload) => void;
  onClose?: () => void;
  defaultStudent?: string;
  defaultDate?: string | null;
}

export function calculateDuration(start: string, end: string): string {
  if (!start || !end) return '';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let totalMin = eh * 60 + em - (sh * 60 + sm);
  if (totalMin < 0) totalMin += 24 * 60; // ca học qua đêm
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours} tiếng`;
  return `${mins} phút`;
}

export function useTodoInput({
  onAddTodo,
  onClose,
  defaultStudent = 'Trường',
  defaultDate,
}: UseTodoInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const resolvedStudent =
    defaultStudent && defaultStudent !== 'all' ? defaultStudent : 'Trường';
  const [studentName, setStudentName] = useState(resolvedStudent);
  const [date, setDate] = useState(() => defaultDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('19:30');
  const [endTime, setEndTime] = useState('21:00');
  const [title, setTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');

  // Luôn tự động cập nhật người học theo học viên đang chọn ở ngoài (sidebar/header)
  useEffect(() => {
    const nextStudent =
      defaultStudent && defaultStudent !== 'all' ? defaultStudent : 'Trường';
    setStudentName(nextStudent);
  }, [defaultStudent]);

  // Cập nhật khi ngày được chọn thay đổi
  useEffect(() => {
    if (defaultDate) {
      setDate(defaultDate);
    }
  }, [defaultDate]);

  const duration = useMemo(() => calculateDuration(startTime, endTime), [startTime, endTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || `Buổi học Tiếng Anh (${studentName})`;

    onAddTodo({
      title: finalTitle,
      studentName,
      date,
      startTime,
      endTime,
      lessonContent: lessonContent.trim() || undefined,
      description: lessonContent.trim() || undefined,
      priority,
    });

    setTitle('');
    setLessonContent('');
    setIsOpen(false);
    onClose?.();
  };

  const handleCancel = () => {
    setTitle('');
    setLessonContent('');
    setIsOpen(false);
    onClose?.();
  };

  return {
    isOpen,
    setIsOpen,
    studentName,
    setStudentName,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    title,
    setTitle,
    lessonContent,
    setLessonContent,
    priority,
    setPriority,
    duration,
    handleSubmit,
    handleCancel,
  };
}

export default useTodoInput;
