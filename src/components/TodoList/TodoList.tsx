import React from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import type { Todo, PriorityLevel } from '../../types/todo';
import { TodoItem } from '../TodoItem/TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  search: string;
  statusFilter: 'all' | 'active' | 'completed';
  priorityFilter: string;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: { title: string; description?: string; priority: PriorityLevel }) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  search,
  statusFilter,
  priorityFilter,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  if (loading) {
    return (
      <div className="empty-state">
        <RefreshCw className="loading-spinner" size={32} />
        <p>Đang tải danh sách công việc...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <CheckCircle2 size={32} />
        </div>
        <h3>Không có công việc nào</h3>
        <p>
          {search || statusFilter !== 'all' || priorityFilter !== 'all'
            ? 'Không tìm thấy kết quả nào phù hợp với bộ lọc hiện tại.'
            : 'Tuyệt vời! Bạn không có công việc tồn đọng. Hãy thêm nhiệm vụ mới để bắt đầu.'}
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
