export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: PriorityLevel;
  dueDate?: string;
  tags?: string[];
  // Study report fields
  studentName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  lessonContent?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  priority?: PriorityLevel;
  dueDate?: string;
  tags?: string[];
  studentName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  lessonContent?: string;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  priority?: PriorityLevel;
  dueDate?: string;
  tags?: string[];
  studentName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  lessonContent?: string;
}

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
  highPriority: number;
  studentStats?: Record<string, { total: number; completed: number }>;
  students?: string[];
}
