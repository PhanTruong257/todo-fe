import React from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import type { Todo, PriorityLevel } from '../../types/todo';
import { TodoItem } from '../TodoItem/TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  search: string;
  statusFilter: 'all' | 'active' | 'completed';
  studentFilter?: string;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
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

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  search,
  statusFilter,
  studentFilter = 'all',
  onToggle,
  onDelete,
  onUpdate,
}) => {
  if (loading) {
    return (
      <div className="empty-state">
        <RefreshCw className="loading-spinner" size={32} />
        <p>Đang tải danh sách báo cáo học tập...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <BookOpen size={32} />
        </div>
        <h3>Chưa có báo cáo buổi học nào</h3>
        <p>
          {search || statusFilter !== 'all' || studentFilter !== 'all'
            ? 'Không tìm thấy buổi học nào phù hợp với bộ lọc hiện tại.'
            : 'Hãy thêm báo cáo buổi học tiếng Anh đầu tiên cho Trường hoặc Nguyệt ở khung bên trên!'}
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TodoList;
