import React from 'react';
import { Play, Pause, Square, RotateCcw, Timer, X } from 'lucide-react';
import { useStudyTimer, type StudyTimerSession } from './useStudyTimer';
import './StudyTimer.css';

interface StudyTimerProps {
  currentStudent: string;
  students: string[];
  onFinishSession: (session: StudyTimerSession) => void;
  onClose?: () => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  currentStudent,
  students,
  onFinishSession,
  onClose,
}) => {
  const {
    isRunning,
    elapsedSeconds,
    formattedTime,
    activeTimerStudent,
    setActiveTimerStudent,
    handleStart,
    handlePause,
    handleReset,
    handleFinish,
  } = useStudyTimer({ currentStudent, onFinishSession });

  return (
    <div className={`study-timer-container animate-fade-in ${isRunning ? 'is-active' : ''}`}>
      {/* 1. Bên trái: Tiêu đề & Chọn người học */}
      <div className="timer-left-meta">
        <div className="timer-icon-wrap">
          <Timer size={20} />
        </div>
        <div className="timer-titles">
          <h4>
            {isRunning && <span className="timer-live-dot" />}
            <span>Đồng Hồ Bấm Giờ Học</span>
          </h4>
          <div className="timer-student-select">
            {students.map((student) => {
              const isSelected = activeTimerStudent === student;
              const isTruong = student === 'Trường';
              const isNguyet = student === 'Nguyệt';

              return (
                <button
                  key={student}
                  type="button"
                  className={`btn-timer-student ${isSelected ? 'active' : ''} ${
                    isTruong ? 'student-truong' : isNguyet ? 'student-nguyet' : ''
                  }`}
                  onClick={() => setActiveTimerStudent(student)}
                  disabled={isRunning}
                  title={isRunning ? 'Tạm dừng để đổi học viên' : `Học viên: ${student}`}
                >
                  {isTruong ? '👨‍🎓 ' : isNguyet ? '👩‍🎓 ' : ''}
                  {student}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Ở giữa: Hiển thị thời gian đếm giây số to */}
      <div className="timer-clock-display">
        <span className="clock-digits">{formattedTime}</span>
      </div>

      {/* 3. Bên phải: Nút điều khiển */}
      <div className="timer-actions">
        {!isRunning ? (
          <button
            type="button"
            className="btn-timer-ctrl btn-timer-start"
            onClick={handleStart}
            title="Bắt đầu tính giờ"
          >
            <Play size={14} fill="currentColor" />
            <span>{elapsedSeconds > 0 ? 'Tiếp tục' : 'Bắt đầu học'}</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn-timer-ctrl btn-timer-pause"
            onClick={handlePause}
            title="Tạm dừng"
          >
            <Pause size={14} fill="currentColor" />
            <span>Tạm dừng</span>
          </button>
        )}

        {elapsedSeconds > 0 && (
          <>
            <button
              type="button"
              className="btn-timer-ctrl btn-timer-finish"
              onClick={handleFinish}
              title="Kết thúc & Điền vào form lưu bài học"
            >
              <Square size={13} fill="currentColor" />
              <span>Hoàn thành & Lưu</span>
            </button>

            {!isRunning && (
              <button
                type="button"
                className="btn-timer-ctrl btn-timer-reset"
                onClick={handleReset}
                title="Đặt lại về 0"
              >
                <RotateCcw size={13} />
              </button>
            )}
          </>
        )}

        {onClose && !isRunning && elapsedSeconds === 0 && (
          <button
            type="button"
            className="btn-timer-ctrl btn-timer-reset"
            onClick={onClose}
            title="Đóng đồng hồ"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StudyTimer;
