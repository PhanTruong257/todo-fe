import React from 'react';
import { Plus, X, Clock, Calendar } from 'lucide-react';
import type { CreateTodoPayload } from '../../types/todo';
import { useTodoInput } from './useTodoInput';
import './TodoInput.css';

interface TodoInputProps {
  onAddTodo: (payload: CreateTodoPayload) => void;
  onClose?: () => void;
  students?: string[];
  activeStudentFilter?: string;
  selectedDate?: string | null;
}

export const TodoInput: React.FC<TodoInputProps> = ({
  onAddTodo,
  onClose,
  activeStudentFilter = 'Trường',
  selectedDate,
}) => {
  const {
    studentName,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    title,
    setTitle,
    lessonContent,
    setLessonContent,
    duration,
    handleSubmit,
    handleCancel,
  } = useTodoInput({
    onAddTodo,
    onClose,
    defaultStudent: activeStudentFilter,
    defaultDate: selectedDate,
  });

  const isTruong = studentName === 'Trường';
  const isNguyet = studentName === 'Nguyệt';

  return (
    <section className="add-report-section animate-fade-in">
      <form onSubmit={handleSubmit} className="report-form">
        {/* Header form với thông tin người học tự động nhận diện */}
        <div className="report-form-header">
          <div className="form-header-title-group">
            <h4>Thêm Buổi Học Mới</h4>
            <span
              className={`form-student-badge ${
                isTruong ? 'badge-truong' : isNguyet ? 'badge-nguyet' : ''
              }`}
            >
              {isTruong ? '👨‍🎓' : isNguyet ? '👩‍🎓' : '👤'} {studentName}
            </span>
          </div>

          {onClose && (
            <button
              type="button"
              className="btn-close-form"
              onClick={handleCancel}
              title="Đóng form"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Hàng chọn Ngày & Thời gian (gọn gàng trên cùng 1 hàng) */}
        <div className="time-date-row">
          <div className="input-group">
            <label>
              <Calendar size={13} /> Ngày học:
            </label>
            <input
              type="date"
              className="time-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>
              <Clock size={13} /> Bắt đầu:
            </label>
            <input
              type="time"
              className="time-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>
              <Clock size={13} /> Kết thúc:
            </label>
            <input
              type="time"
              className="time-input"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          {duration && (
            <div className="duration-badge">
              <span>Thời lượng:</span>
              <strong>{duration}</strong>
            </div>
          )}
        </div>

        {/* Tiêu đề / Chủ đề buổi học */}
        <div className="form-group">
          <input
            type="text"
            className="input-primary"
            placeholder="Chủ đề buổi học (ví dụ: Luyện Speaking Part 2, 40 Từ Vựng Cam 18...)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Nội dung bài học */}
        <div className="form-group">
          <textarea
            className="textarea-content"
            rows={3}
            placeholder="Hôm nay đã học những gì? Ghi chép chi tiết nội dung (từ vựng mới, bài tập, ngữ pháp...)"
            value={lessonContent}
            onChange={(e) => setLessonContent(e.target.value)}
            required
          />
        </div>

        {/* Nút hành động */}
        <div className="form-actions">
          {onClose && (
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
            >
              Hủy
            </button>
          )}
          <button type="submit" className="btn-submit-report">
            <Plus size={16} />
            <span>Lưu Báo Cáo Cho {studentName}</span>
          </button>
        </div>
      </form>
    </section>
  );
};

export default TodoInput;
