import React, { useEffect, useRef } from 'react';
import { Plus, X, Clock, Calendar, Sparkles } from 'lucide-react';
import type { CreateTodoPayload } from '../../types/todo';
import { useTodoInput } from './useTodoInput';
import { TimePicker24h } from '../TimePicker24h';
import './TodoInput.css';

interface TodoInputProps {
  onAddTodo: (payload: CreateTodoPayload) => void;
  onClose?: () => void;
  students?: string[];
  activeStudentFilter?: string;
  selectedDate?: string | null;
  initialStartTime?: string;
  initialEndTime?: string;
}

export const TodoInput: React.FC<TodoInputProps> = ({
  onAddTodo,
  onClose,
  activeStudentFilter = 'Trường',
  selectedDate,
  initialStartTime,
  initialEndTime,
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
    quickDurationPresets,
    currentDurationMinutes,
    setQuickDuration,
    handleSubmit,
    handleCancel,
  } = useTodoInput({
    onAddTodo,
    onClose,
    defaultStudent: activeStudentFilter,
    defaultDate: selectedDate,
    initialStartTime,
    initialEndTime,
  });

  const touchStartY = useRef<number>(0);

  // Khóa cuộn trang nền khi mở bottom sheet + phím ESC để thoát
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [handleCancel]);

  // Hỗ trợ vuốt xuống trên màn hình cảm ứng điện thoại để đóng sheet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    if (currentY - touchStartY.current > 75) {
      handleCancel();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const isTruong = studentName === 'Trường';
  const isNguyet = studentName === 'Nguyệt';

  return (
    <div className="bottom-sheet-backdrop" onClick={handleBackdropClick}>
      <div className="bottom-sheet-content animate-sheet-up" onClick={(e) => e.stopPropagation()}>
        {/* Vạch kéo ngang đặc trưng iOS để vuốt xuống */}
        <div
          className="bottom-sheet-handle-bar"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="bottom-sheet-handle-pill" />
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          {/* Header form với thông tin người học tự động nhận diện */}
          <div className="report-form-header">
            <div className="form-header-title-group">
              <h4>Thêm Nhật Ký Học</h4>
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
                title="Đóng bảng"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Hàng chọn Ngày & Thời gian */}
          <div className="time-date-row">
            <div className="input-group">
              <label>
                <Calendar size={13} /> Ngày:
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
              <TimePicker24h
                value={startTime}
                onChange={setStartTime}
                placeholder="20:00"
              />
            </div>

            <div className="input-group">
              <label>
                <Clock size={13} /> Kết thúc:
              </label>
              <TimePicker24h
                value={endTime}
                onChange={setEndTime}
                placeholder="21:00"
              />
            </div>

            {duration && (
              <div className="duration-badge">
                <span>Thời lượng:</span>
                <strong>{duration}</strong>
              </div>
            )}
          </div>

          {/* Hàng chọn nhanh thời lượng 1-chạm (Mục 2) */}
          <div className="quick-duration-row">
            <span className="quick-duration-label">
              <Sparkles size={12} /> Thời lượng:
            </span>
            <div className="quick-duration-pills">
              {quickDurationPresets.map((mins) => {
                const isActive = currentDurationMinutes === mins;
                const label =
                  mins === 60 ? '1 tiếng' : mins === 90 ? '1.5 tiếng' : `${mins} phút`;
                return (
                  <button
                    key={mins}
                    type="button"
                    className={`duration-pill ${isActive ? 'active' : ''}`}
                    onClick={() => setQuickDuration(mins)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hàng gợi ý nhanh kỹ năng học */}
          <div className="quick-skills-group">
            <span className="quick-skills-label">⚡ Chọn nhanh kỹ năng:</span>
            <div className="quick-skills-pills">
              {[
                '🗣️ Speaking Part 1/2',
                '✍️ Writing Task 2',
                '🎧 Listening Cam',
                '📖 Reading Cam',
                '📚 30 Từ Vựng Mới',
                '🧩 Ngữ Pháp',
                '🎯 Luyện Phát Âm',
                '📝 Luyện Đề Mock',
              ].map((skill) => {
                const isSelected = title.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    className={`skill-tag-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      if (!title.trim()) {
                        setTitle(skill);
                      } else if (!title.includes(skill)) {
                        setTitle(`${title} • ${skill}`);
                      }
                    }}
                    title={`Thêm ${skill} vào chủ đề`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tiêu đề / Chủ đề học */}
          <div className="form-group">
            <input
              type="text"
              className="input-primary"
              placeholder="Chủ đề học (ví dụ: Luyện Speaking Part 2, 40 Từ Vựng Cam 18...)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Nội dung bài học (tùy chọn) */}
          <div className="form-group">
            <textarea
              className="textarea-content"
              rows={2}
              placeholder="Ghi chép thêm nội dung (tùy chọn: từ vựng, ngữ pháp, bài tập...)"
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
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
              <span>Lưu Nhật Ký Cho {studentName}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoInput;
