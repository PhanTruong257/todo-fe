import React from 'react';
import { Plus } from 'lucide-react';
import type { PriorityLevel, CreateTodoPayload } from '../../types/todo';
import { useTodoInput } from './useTodoInput';
import './TodoInput.css';

interface TodoInputProps {
  onAddTodo: (payload: CreateTodoPayload) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    handleSubmit,
  } = useTodoInput({ onAddTodo });

  return (
    <section className="add-todo-section">
      <form onSubmit={handleSubmit}>
        <div className="add-input-main">
          <input
            type="text"
            className="input-primary"
            placeholder="Bạn muốn hoàn thành điều gì hôm nay?..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">
            <Plus size={18} />
            <span>Thêm việc</span>
          </button>
        </div>

        <div className="add-options-row">
          <input
            type="text"
            className="input-secondary"
            placeholder="Ghi chú / mô tả thêm (tùy chọn)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="select-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as PriorityLevel)}
            title="Mức độ ưu tiên"
          >
            <option value="low">Ưu tiên: Thấp (Low)</option>
            <option value="medium">Ưu tiên: Bình thường (Medium)</option>
            <option value="high">Ưu tiên: Cao (High)</option>
          </select>

          <input
            type="date"
            className="select-priority"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            title="Hạn chót"
          />
        </div>
      </form>
    </section>
  );
};

export default TodoInput;
