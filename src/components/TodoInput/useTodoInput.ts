import { useState, useMemo, useEffect, useCallback } from 'react';
import type { PriorityLevel, CreateTodoPayload } from '../../types/todo';
import { getCurrentTime24h } from '../TimePicker24h';

interface UseTodoInputProps {
  onAddTodo: (payload: CreateTodoPayload) => void;
  onClose?: () => void;
  defaultStudent?: string;
  defaultDate?: string | null;
  initialStartTime?: string;
  initialEndTime?: string;
}

export function getLocalTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getEndTimeFromStart(start: string, durationMinutes: number = 60): string {
  if (!start) return '21:00';
  const [h, m] = start.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return '21:00';
  const total = (h * 60 + m + durationMinutes) % (24 * 60);
  const endH = String(Math.floor(total / 60)).padStart(2, '0');
  const endM = String(total % 60).padStart(2, '0');
  return `${endH}:${endM}`;
}

export function calculateDuration(start: string, end: string): string {
  if (!start || !end) return '';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return '';
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
  initialStartTime,
  initialEndTime,
}: UseTodoInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const resolvedStudent =
    defaultStudent && defaultStudent !== 'all' ? defaultStudent : 'Trường';
  const [studentName, setStudentName] = useState(resolvedStudent);
  const [date, setDate] = useState(() => defaultDate || getLocalTodayString());

  // Gán thời điểm hiện tại hoặc nhận từ đồng hồ bấm giờ
  const defaultStart = initialStartTime || getCurrentTime24h();
  const defaultEnd = initialEndTime || getEndTimeFromStart(defaultStart, 60);

  const [startTime, setStartTimeState] = useState(defaultStart);
  const [endTime, setEndTime] = useState(defaultEnd);
  const [title, setTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');

  // Hàm set startTime thông minh: tự động đẩy endTime lên nếu endTime <= startTime mới
  const setStartTime = useCallback((newStart: string) => {
    setStartTimeState(newStart);
    if (newStart) {
      const [sh, sm] = newStart.split(':').map(Number);
      const [eh, em] = (endTime || '').split(':').map(Number);
      if (!isNaN(sh) && !isNaN(sm) && !isNaN(eh) && !isNaN(em)) {
        const startTotal = sh * 60 + sm;
        const endTotal = eh * 60 + em;
        // Nếu giờ kết thúc trước hoặc bằng giờ bắt đầu, tự động cộng thêm 60 phút
        if (endTotal <= startTotal) {
          setEndTime(getEndTimeFromStart(newStart, 60));
        }
      }
    }
  }, [endTime]);

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
