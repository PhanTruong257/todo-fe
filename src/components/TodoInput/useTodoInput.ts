import { useState, useMemo } from 'react';
import type { PriorityLevel, CreateTodoPayload } from '../../types/todo';

interface UseTodoInputProps {
  onAddTodo: (payload: CreateTodoPayload) => void;
  defaultStudent?: string;
}

export function calculateDuration(start: string, end: string): string {
  if (!start || !end) return '';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let totalMin = (eh * 60 + em) - (sh * 60 + sm);
  if (totalMin < 0) totalMin += 24 * 60; // ca học qua đêm
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours} tiếng`;
  return `${mins} phút`;
}

export function useTodoInput({ onAddTodo, defaultStudent = 'Trường' }: UseTodoInputProps) {
  const [studentName, setStudentName] = useState(defaultStudent);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('19:30');
  const [endTime, setEndTime] = useState('21:00');
  const [title, setTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');

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
  };

  return {
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
  };
}

export default useTodoInput;
