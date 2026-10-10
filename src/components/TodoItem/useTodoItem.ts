import { useState } from 'react';
import type { Todo, PriorityLevel } from '../../types/todo';

interface UseTodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: { title: string; description?: string; priority: PriorityLevel }) => void;
}

export function useTodoItem({ todo, onUpdate }: UseTodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState<PriorityLevel>(todo.priority);

  const handleStartEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  return {
    isEditing,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editPriority,
    setEditPriority,
    handleStartEdit,
    handleSave,
    handleCancel,
  };
}

export default useTodoItem;
