import React from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Timer,
  Hourglass,
  Bell,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
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
    mode,
    setMode,
    countdownMinutes,
    setCountdownMinutes,
    countdownRemaining,
    isCompleted,
    isRunning,
    elapsedSeconds,
    formattedTime,
    progressPercent,
    activeTimerStudent,
    setActiveTimerStudent,
    handleStart,
    handlePause,
    handleReset,
    handleFinish,
    playPreviewChime,
  } = useStudyTimer({ currentStudent, onFinishSession });

  const countdownPresets = [15, 25, 30, 45, 60];

  return (
    <div
      className={`study-timer-container animate-fade-in ${
        isRunning ? 'is-active' : ''
      } ${isCompleted ? 'is-completed' : ''}`}
    >
      {/* 1. Hàng trên: Chế độ (Đếm ngược / Bấm giờ) & Học viên & Nút đóng */}
      <div className="timer-top-row">
        <div className="timer-mode-switcher">
          <button
            type="button"
            className={`btn-mode-tab ${mode === 'countdown' ? 'active' : ''}`}
            onClick={() => setMode('countdown')}
            disabled={isRunning}
            title="Đếm ngược theo mốc thời gian đặt trước"
          >
            <Hourglass size={13} />
            <span>Đếm ngược</span>
          </button>
          <button
            type="button"
            className={`btn-mode-tab ${mode === 'stopwatch' ? 'active' : ''}`}
            onClick={() => setMode('stopwatch')}
            disabled={isRunning}
            title="Bấm giờ học tự do"
          >
            <Timer size={13} />
            <span>Bấm giờ</span>
          </button>
        </div>

        {/* Học viên đang học */}
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
                title={isRunning ? 'Tạm dừng để đổi người' : `Thành viên: ${student}`}
              >
                {isTruong ? '👨‍🎓 ' : isNguyet ? '👩‍🎓 ' : ''}
                {student}
              </button>
            );
          })}
        </div>

        {/* Nút thử chuông Ting & Nút đóng */}
        <div className="timer-top-actions">
          <button
            type="button"
            className="btn-timer-icon-action"
            onClick={playPreviewChime}
            title="Thử âm thanh chuông Ting! 🔔"
          >
            <Bell size={14} />
          </button>

          {onClose && !isRunning && (
            <button
              type="button"
              className="btn-timer-icon-action"
              onClick={onClose}
              title="Đóng đồng hồ"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Mốc thời gian đếm ngược (chỉ hiện ở chế độ Đếm ngược) */}
      {mode === 'countdown' && !isCompleted && (
        <div className="countdown-presets-row">
          <span className="presets-label">
            <Sparkles size={11} /> Mốc học:
          </span>
          <div className="presets-pills">
            {countdownPresets.map((mins) => {
              const isSelected = countdownMinutes === mins;
              return (
                <button
                  key={mins}
                  type="button"
                  className={`btn-preset-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => setCountdownMinutes(mins)}
                  disabled={isRunning}
                >
                  {mins === 25 ? '25p (Pomodoro)' : `${mins} phút`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Hiển thị thông báo khi hết giờ */}
      {isCompleted && (
        <div className="countdown-completed-banner animate-bounce-subtle">
          <CheckCircle2 size={16} className="completed-icon" />
          <span>
            🎉 <strong>Ting! Đã hết {countdownMinutes} phút học!</strong> Hãy lưu bài học vào nhật ký nhé!
          </span>
        </div>
      )}

      {/* 4. Ở giữa: Đồng hồ số to & Thanh tiến độ */}
      <div className="timer-center-display">
        <div className="timer-clock-display">
          {isRunning && <span className="timer-live-dot" />}
          <span className="clock-digits">{formattedTime}</span>
        </div>

        {mode === 'countdown' && (
          <div className="timer-progress-bar-wrap">
            <div
              className="timer-progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* 5. Hàng nút điều khiển chính */}
      <div className="timer-actions">
        {!isCompleted && (
          <>
            {!isRunning ? (
              <button
                type="button"
                className="btn-timer-ctrl btn-timer-start"
                onClick={handleStart}
                title="Bắt đầu học"
              >
                <Play size={14} fill="currentColor" />
                <span>
                  {mode === 'countdown'
                    ? countdownRemaining < countdownMinutes * 60
                      ? 'Tiếp tục'
                      : 'Bắt đầu học'
                    : elapsedSeconds > 0
                    ? 'Tiếp tục'
                    : 'Bắt đầu học'}
                </span>
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
          </>
        )}

        {/* Nút Hoàn thành & Lưu */}
        {(isCompleted ||
          (mode === 'countdown' && countdownRemaining < countdownMinutes * 60) ||
          (mode === 'stopwatch' && elapsedSeconds > 0)) && (
          <button
            type="button"
            className="btn-timer-ctrl btn-timer-finish"
            onClick={handleFinish}
            title="Lưu thời gian vừa học vào Form nhật ký"
          >
            <Square size={13} fill="currentColor" />
            <span>Hoàn thành & Lưu</span>
          </button>
        )}

        {/* Nút Đặt lại (Reset) */}
        {!isRunning &&
          (isCompleted ||
            (mode === 'countdown' && countdownRemaining < countdownMinutes * 60) ||
            (mode === 'stopwatch' && elapsedSeconds > 0)) && (
            <button
              type="button"
              className="btn-timer-ctrl btn-timer-reset"
              onClick={handleReset}
              title="Đặt lại từ đầu"
            >
              <RotateCcw size={13} />
            </button>
          )}
      </div>
    </div>
  );
};

export default StudyTimer;
