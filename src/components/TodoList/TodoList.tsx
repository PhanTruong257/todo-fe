import React from 'react';
import { BookOpen, RefreshCw, Calendar } from 'lucide-react';
import type { Todo, PriorityLevel } from '../../types/todo';
import { TodoItem } from '../TodoItem/TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  search: string;
  studentFilter?: string;
  selectedDate?: string | null;
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
  studentFilter = 'all',
  selectedDate,
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
    const studentLabel = studentFilter === 'all' ? 'học viên' : studentFilter;

    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          {selectedDate ? <Calendar size={32} /> : <BookOpen size={32} />}
        </div>
        <h3>
          {selectedDate
            ? `Chưa có buổi học ngày ${selectedDate}`
            : 'Chưa có báo cáo buổi học nào'}
        </h3>
        <p>
          {selectedDate
            ? `Học viên ${studentLabel} chưa có ghi chép buổi học nào vào ngày này. Hãy bấm dấu "+" ở trên để ghi chép nội dung bài học!`
            : search || studentFilter !== 'all'
            ? 'Không tìm thấy buổi học nào phù hợp với tìm kiếm.'
            : 'Hãy thêm báo cáo buổi học tiếng Anh đầu tiên bằng cách bấm dấu "+" ở trên!'}
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
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TodoList;
