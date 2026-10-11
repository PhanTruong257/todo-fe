import { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY_IS_RUNNING = 'taskflow_study_timer_running';
const STORAGE_KEY_START_TIMESTAMP = 'taskflow_study_timer_start_timestamp';
const STORAGE_KEY_ACCUMULATED = 'taskflow_study_timer_accumulated_seconds';
const STORAGE_KEY_STUDENT = 'taskflow_study_timer_student';
const STORAGE_KEY_START_CLOCK = 'taskflow_study_timer_start_clock';

export interface StudyTimerSession {
  studentName: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  date: string;      // YYYY-MM-DD
  elapsedSeconds: number;
}

interface UseStudyTimerProps {
  currentStudent: string;
  onFinishSession?: (session: StudyTimerSession) => void;
}

// Chuyển đối tượng Date thành chuỗi YYYY-MM-DD
function toLocalDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Chuyển đối tượng Date thành chuỗi HH:mm
function toClockString(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function formatSecondsToTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hStr = String(hours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${hStr}:${mStr}:${sStr}`;
  }
  return `${mStr}:${sStr}`;
}

export function useStudyTimer({ currentStudent, onFinishSession }: UseStudyTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeTimerStudent, setActiveTimerStudent] = useState(
    currentStudent && currentStudent !== 'all' ? currentStudent : 'Trường'
  );
  const [startClock, setStartClock] = useState('');
  const intervalRef = useRef<number | null>(null);

  // Phục hồi trạng thái bộ đếm từ localStorage
  useEffect(() => {
    try {
      const storedRunning = localStorage.getItem(STORAGE_KEY_IS_RUNNING) === 'true';
      const storedStartTimestamp = localStorage.getItem(STORAGE_KEY_START_TIMESTAMP);
      const storedAccumulated = parseInt(localStorage.getItem(STORAGE_KEY_ACCUMULATED) || '0', 10);
      const storedStudent = localStorage.getItem(STORAGE_KEY_STUDENT);
      const storedStartClock = localStorage.getItem(STORAGE_KEY_START_CLOCK) || '';

      if (storedStudent) {
        setActiveTimerStudent(storedStudent);
      }
      if (storedStartClock) {
        setStartClock(storedStartClock);
      }

      if (storedRunning && storedStartTimestamp) {
        const startMs = parseInt(storedStartTimestamp, 10);
        const nowMs = Date.now();
        const diffSeconds = Math.max(0, Math.floor((nowMs - startMs) / 1000));
        setElapsedSeconds(storedAccumulated + diffSeconds);
        setIsRunning(true);
      } else {
        setElapsedSeconds(storedAccumulated);
        setIsRunning(false);
      }
    } catch {
      // Ignored localStorage errors
    }
  }, []);

  // Xử lý đếm giờ liên tục mỗi giây
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        try {
          const storedStartTimestamp = localStorage.getItem(STORAGE_KEY_START_TIMESTAMP);
          const storedAccumulated = parseInt(localStorage.getItem(STORAGE_KEY_ACCUMULATED) || '0', 10);
          if (storedStartTimestamp) {
            const startMs = parseInt(storedStartTimestamp, 10);
            const nowMs = Date.now();
            const diffSeconds = Math.max(0, Math.floor((nowMs - startMs) / 1000));
            setElapsedSeconds(storedAccumulated + diffSeconds);
          } else {
            setElapsedSeconds((prev) => prev + 1);
          }
        } catch {
          setElapsedSeconds((prev) => prev + 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Bắt đầu bấm giờ
  const handleStart = useCallback(() => {
    const now = new Date();
    const clock = toClockString(now);
    setIsRunning(true);
    setStartClock(clock);

    try {
      localStorage.setItem(STORAGE_KEY_IS_RUNNING, 'true');
      localStorage.setItem(STORAGE_KEY_START_TIMESTAMP, Date.now().toString());
      localStorage.setItem(STORAGE_KEY_ACCUMULATED, elapsedSeconds.toString());
      localStorage.setItem(STORAGE_KEY_STUDENT, activeTimerStudent);
      localStorage.setItem(STORAGE_KEY_START_CLOCK, clock);
    } catch {
      // Ignored
    }
  }, [activeTimerStudent, elapsedSeconds]);

  // Tạm dừng
  const handlePause = useCallback(() => {
    setIsRunning(false);
    try {
      localStorage.setItem(STORAGE_KEY_IS_RUNNING, 'false');
      localStorage.setItem(STORAGE_KEY_ACCUMULATED, elapsedSeconds.toString());
      localStorage.removeItem(STORAGE_KEY_START_TIMESTAMP);
    } catch {
      // Ignored
    }
  }, [elapsedSeconds]);

  // Đặt lại về 0
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setStartClock('');
    try {
      localStorage.removeItem(STORAGE_KEY_IS_RUNNING);
      localStorage.removeItem(STORAGE_KEY_START_TIMESTAMP);
      localStorage.removeItem(STORAGE_KEY_ACCUMULATED);
      localStorage.removeItem(STORAGE_KEY_START_CLOCK);
    } catch {
      // Ignored
    }
  }, []);

  // Kết thúc & Gửi dữ liệu vào form lưu buổi học
  const handleFinish = useCallback(() => {
    const now = new Date();
    const endClock = toClockString(now);
    const dateStr = toLocalDateString(now);

    const sessionData: StudyTimerSession = {
      studentName: activeTimerStudent,
      startTime: startClock || toClockString(new Date(Date.now() - elapsedSeconds * 1000)),
      endTime: endClock,
      date: dateStr,
      elapsedSeconds,
    };

    handleReset();
    onFinishSession?.(sessionData);
  }, [activeTimerStudent, elapsedSeconds, handleReset, onFinishSession, startClock]);

  return {
    isRunning,
    elapsedSeconds,
    formattedTime: formatSecondsToTime(elapsedSeconds),
    activeTimerStudent,
    setActiveTimerStudent,
    startClock,
    handleStart,
    handlePause,
    handleReset,
    handleFinish,
  };
}
