import React from 'react';
import { Plus, Clock, Calendar, BookOpen, User } from 'lucide-react';
import type { CreateTodoPayload } from '../../types/todo';
import { useTodoInput } from './useTodoInput';
import './TodoInput.css';

interface TodoInputProps {
  onAddTodo: (payload: CreateTodoPayload) => void;
  students?: string[];
  activeStudentFilter?: string;
}

export const TodoInput: React.FC<TodoInputProps> = ({
  onAddTodo,
  students = ['Trường', 'Nguyệt'],
  activeStudentFilter,
}) => {
  const initialStudent = activeStudentFilter && activeStudentFilter !== 'all' ? activeStudentFilter : 'Trường';

  const {
    studentName,
    setStudentName,
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
  } = useTodoInput({ onAddTodo, defaultStudent: initialStudent });

  return (
    <section className="add-report-section">
      <form onSubmit={handleSubmit} className="report-form">
        <div className="report-form-header">
          <div className="section-title">
            <BookOpen size={18} />
            <span>Thêm Báo Cáo Học Tiếng Anh Mới</span>
          </div>

          {/* Chọn Người học */}
          <div className="student-selector">
            <span className="selector-label"><User size={14} /> Người học:</span>
            <div className="student-pills">
              {students.map((name) => {
                const isTruong = name === 'Trường';
                const isNguyet = name === 'Nguyệt';
                const isSelected = studentName === name;

                return (
                  <button
                    key={name}
                    type="button"
                    className={`student-pill ${isSelected ? 'selected' : ''} ${
                      isTruong ? 'pill-truong' : isNguyet ? 'pill-nguyet' : ''
                    }`}
                    onClick={() => setStudentName(name)}
                  >
                    {isTruong ? '👨‍🎓 Trường' : isNguyet ? '👩‍🎓 Nguyệt' : `👤 ${name}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hàng chọn thời gian & ngày tháng */}
        <div className="time-date-row">
          <div className="input-group">
            <label><Calendar size={13} /> Ngày học:</label>
            <input
              type="date"
              className="time-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label><Clock size={13} /> Bắt đầu:</label>
            <input
              type="time"
              className="time-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label><Clock size={13} /> Kết thúc:</label>
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

        {/* Tiêu đề / Chủ đề */}
        <div className="form-group">
          <input
            type="text"
            className="input-primary"
            placeholder="Chủ đề buổi học (ví dụ: Luyện Speaking Part 2, 40 Từ Vựng Unit 3...)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Nội dung bài học */}
        <div className="form-group">
          <textarea
            className="textarea-content"
            rows={2}
            placeholder="Bữa đó học những gì? Ghi chép chi tiết nội dung đã học (từ vựng, ngữ pháp, bài tập...)"
            value={lessonContent}
            onChange={(e) => setLessonContent(e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit-report">
            <Plus size={18} />
            <span>Lưu Báo Cáo Cho {studentName}</span>
          </button>
        </div>
      </form>
    </section>
  );
};

export default TodoInput;
