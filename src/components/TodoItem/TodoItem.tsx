import React from 'react';
import { Edit3, Trash2, Clock, Calendar, BookOpen } from 'lucide-react';
import type { Todo, PriorityLevel } from '../../types/todo';
import { useTodoItem } from './useTodoItem';
import { calculateDuration } from '../TodoInput/useTodoInput';
import { TimePicker24h } from '../TimePicker24h';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
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

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  onUpdate,
}) => {
  const {
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
    handleStartEdit,
    handleSave,
    handleCancel,
  } = useTodoItem({ todo, onUpdate });

  const student = todo.studentName || 'Trường';
  const isTruong = student === 'Trường';
  const isNguyet = student === 'Nguyệt';
  const duration =
    todo.startTime && todo.endTime
      ? calculateDuration(todo.startTime, todo.endTime)
      : '';

  return (
    <div
      className={`report-card ${
        isTruong ? 'border-truong' : isNguyet ? 'border-nguyet' : ''
      }`}
    >
      {isEditing ? (
        <div className="report-edit-form">
          <div className="edit-row">
            <input
              type="text"
              className="input-primary"
              placeholder="Tên thành viên"
              value={editStudentName}
              onChange={(e) => setEditStudentName(e.target.value)}
              style={{ width: '140px' }}
            />
            <input
              type="date"
              className="time-input"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
            />
            <div className="input-group-mini">
              <Clock size={12} />
              <TimePicker24h
                value={editStartTime}
                onChange={setEditStartTime}
                placeholder="20:00"
              />
            </div>
            <div className="input-group-mini">
              <Clock size={12} />
              <TimePicker24h
                value={editEndTime}
                onChange={setEditEndTime}
                placeholder="21:00"
              />
            </div>
          </div>

          <input
            type="text"
            className="input-primary"
            placeholder="Chủ đề học"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <textarea
            className="textarea-content"
            rows={2}
            placeholder="Nội dung đã học..."
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />

          <div className="edit-actions">
            <button className="btn-sm-save" onClick={handleSave}>
              Lưu thay đổi
            </button>
            <button className="btn-sm-cancel" onClick={handleCancel}>
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <div className="report-content">
          {/* Hàng chính: Tiêu đề + Thời gian + Nút hành động */}
          <div className="report-main-row">
            <div className="report-left-group">
              <div className="report-title">
                <BookOpen size={15} />
                <span>{todo.title}</span>
              </div>
            </div>

            <div className="report-right-group">
              <div className="report-time-meta">
                {todo.date && (
                  <span className="meta-item">
                    <Calendar size={12} />
                    {todo.date}
                  </span>
                )}
                {todo.startTime && todo.endTime && (
                  <span className="meta-item time">
                    <Clock size={12} />
                    {todo.startTime} - {todo.endTime}
                    {duration && (
                      <strong className="duration-pill">({duration})</strong>
                    )}
                  </span>
                )}
              </div>

              {/* Nút bấm Sửa/Xóa tích hợp thẳng ở góc phải */}
              <div className="report-card-actions">
                <button
                  className="action-btn"
                  onClick={handleStartEdit}
                  title="Chỉnh sửa nhật ký"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => onDelete(todo.id)}
                  title="Xóa nhật ký"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Chi tiết nội dung học (chỉ hiển thị trực tiếp chữ ghi chép) */}
          {(todo.lessonContent || todo.description) && (
            <p className="lesson-content-inline">
              {todo.lessonContent || todo.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoItem;
