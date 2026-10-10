export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: PriorityLevel;
  dueDate?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  priority?: PriorityLevel;
  dueDate?: string;
  tags?: string[];
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  priority?: PriorityLevel;
  dueDate?: string;
  tags?: string[];
}

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
  highPriority: number;
}
