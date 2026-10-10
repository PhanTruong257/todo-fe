import { useState } from 'react';
import type { PriorityLevel, CreateTodoPayload } from '../../types/todo';

interface UseTodoInputProps {
  onAddTodo: (payload: CreateTodoPayload) => void;
}

export function useTodoInput({ onAddTodo }: UseTodoInputProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTodo({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    handleSubmit,
  };
}

export default useTodoInput;
