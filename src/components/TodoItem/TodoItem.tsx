import React from 'react';
import { Circle, Check, Edit3, Trash2, Clock } from 'lucide-react';
import type { Todo, PriorityLevel } from '../../types/todo';
import { useTodoItem } from './useTodoItem';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: { title: string; description?: string; priority: PriorityLevel }) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const {
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
  } = useTodoItem({ todo, onUpdate });

  return (
    <div className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
      {!isEditing && (
        <button
          className={`todo-checkbox ${todo.isCompleted ? 'checked' : ''}`}
          onClick={() => onToggle(todo)}
          title={todo.isCompleted ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
        >
          {todo.isCompleted ? <Check size={14} /> : <Circle size={14} />}
        </button>
      )}

      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            className="input-primary"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
          />
          <input
            type="text"
            className="input-secondary"
            placeholder="Mô tả bổ sung"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select
              className="select-priority"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as PriorityLevel)}
            >
              <option value="low">Thấp</option>
              <option value="medium">Bình thường</option>
              <option value="high">Cao</option>
            </select>
            <div className="edit-actions">
              <button className="btn-sm-save" onClick={handleSave}>
                Lưu
              </button>
              <button className="btn-sm-cancel" onClick={handleCancel}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="todo-content">
            <div className="todo-title">{todo.title}</div>
            {todo.description && (
              <div className="todo-description">{todo.description}</div>
            )}
            <div className="todo-meta">
              <span className={`priority-badge ${todo.priority}`}>
                {todo.priority === 'high'
                  ? 'Ưu tiên cao'
                  : todo.priority === 'medium'
                  ? 'Bình thường'
                  : 'Ưu tiên thấp'}
              </span>
              {todo.dueDate && (
                <span className="todo-date">
                  <Clock size={12} />
                  Hạn: {todo.dueDate}
                </span>
              )}
            </div>
          </div>

          <div className="todo-actions">
            <button
              className="action-btn"
              onClick={handleStartEdit}
              title="Chỉnh sửa"
            >
              <Edit3 size={15} />
            </button>
            <button
              className="action-btn delete"
              onClick={() => onDelete(todo.id)}
              title="Xóa công việc"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
