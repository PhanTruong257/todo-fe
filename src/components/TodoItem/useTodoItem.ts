import { useState } from 'react';
import type { Todo, PriorityLevel } from '../../types/todo';

interface UseTodoItemProps {
  todo: Todo;
  onUpdate: (
    id: string,
    updates: {
      title?: string;
      studentName?: string;
      date?: string;
      startTime?: string;
      endTime?: string;
      lessonContent?: string;
      description?: string;
      priority?: PriorityLevel;
    }
  ) => void;
}

export function useTodoItem({ todo, onUpdate }: UseTodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editStudentName, setEditStudentName] = useState(todo.studentName || 'Trường');
  const [editDate, setEditDate] = useState(todo.date || '');
  const [editStartTime, setEditStartTime] = useState(todo.startTime || '');
  const [editEndTime, setEditEndTime] = useState(todo.endTime || '');
  const [editContent, setEditContent] = useState(todo.lessonContent || todo.description || '');
  const [editPriority, setEditPriority] = useState<PriorityLevel>(todo.priority);

  const handleStartEdit = () => {
    setEditTitle(todo.title);
    setEditStudentName(todo.studentName || 'Trường');
    setEditDate(todo.date || '');
    setEditStartTime(todo.startTime || '');
    setEditEndTime(todo.endTime || '');
    setEditContent(todo.lessonContent || todo.description || '');
    setEditPriority(todo.priority);
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editTitle.trim() || `Nhật ký học của ${editStudentName}`,
      studentName: editStudentName,
      date: editDate || undefined,
      startTime: editStartTime || undefined,
      endTime: editEndTime || undefined,
      lessonContent: editContent.trim() || undefined,
      description: editContent.trim() || undefined,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return {
    isEditing,
    editTitle,
    setEditTitle,
    editStudentName,
    setEditStudentName,
    editDate,
    setEditDate,
    editStartTime,
    setEditStartTime,
    editEndTime,
    setEditEndTime,
    editContent,
    setEditContent,
    editPriority,
    setEditPriority,
    handleStartEdit,
    handleSave,
    handleCancel,
  };
}

export default useTodoItem;
