import { useState, useEffect, useRef, useCallback } from 'react';
import { playChimeSound } from '../../utils/audio';

export type TimerMode = 'stopwatch' | 'countdown';

const STORAGE_KEY_MODE = 'taskflow_study_timer_mode';
const STORAGE_KEY_IS_RUNNING = 'taskflow_study_timer_running';
const STORAGE_KEY_START_TIMESTAMP = 'taskflow_study_timer_start_timestamp';
const STORAGE_KEY_ACCUMULATED = 'taskflow_study_timer_accumulated_seconds';
const STORAGE_KEY_STUDENT = 'taskflow_study_timer_student';
const STORAGE_KEY_START_CLOCK = 'taskflow_study_timer_start_clock';

// Storage keys cho chế độ đếm ngược
const STORAGE_KEY_COUNTDOWN_MINS = 'taskflow_study_timer_cd_mins';
const STORAGE_KEY_COUNTDOWN_REMAINING = 'taskflow_study_timer_cd_remaining';
const STORAGE_KEY_COUNTDOWN_TARGET_TIMESTAMP = 'taskflow_study_timer_cd_target_ts';

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
  if (totalSeconds < 0) totalSeconds = 0;
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
  const [mode, setModeState] = useState<TimerMode>('countdown'); // Mặc định chế độ Đếm ngược theo yêu cầu
  const [countdownMinutes, setCountdownMinutesState] = useState(25); // Mặc định 25 phút Pomodoro
  const [countdownRemaining, setCountdownRemaining] = useState(25 * 60);
  const [isCompleted, setIsCompleted] = useState(false);

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
      const storedMode = (localStorage.getItem(STORAGE_KEY_MODE) as TimerMode) || 'countdown';
      setModeState(storedMode);

      const storedCdMins = parseInt(localStorage.getItem(STORAGE_KEY_COUNTDOWN_MINS) || '25', 10);
      setCountdownMinutesState(storedCdMins);

      const storedStudent = localStorage.getItem(STORAGE_KEY_STUDENT);
      if (storedStudent) {
        setActiveTimerStudent(storedStudent);
      }

      const storedStartClock = localStorage.getItem(STORAGE_KEY_START_CLOCK) || '';
      if (storedStartClock) {
        setStartClock(storedStartClock);
      }

      const storedRunning = localStorage.getItem(STORAGE_KEY_IS_RUNNING) === 'true';

      if (storedMode === 'countdown') {
        const storedCdTargetTs = localStorage.getItem(STORAGE_KEY_COUNTDOWN_TARGET_TIMESTAMP);
        const storedCdRemaining = parseInt(
          localStorage.getItem(STORAGE_KEY_COUNTDOWN_REMAINING) || `${storedCdMins * 60}`,
          10
        );

        if (storedRunning && storedCdTargetTs) {
          const targetMs = parseInt(storedCdTargetTs, 10);
          const remainingSec = Math.max(0, Math.round((targetMs - Date.now()) / 1000));
          if (remainingSec <= 0) {
            setCountdownRemaining(0);
            setIsRunning(false);
            setIsCompleted(true);
            playChimeSound();
          } else {
            setCountdownRemaining(remainingSec);
            setIsRunning(true);
          }
        } else {
          setCountdownRemaining(storedCdRemaining);
          setIsRunning(false);
        }
      } else {
        // Stopwatch
        const storedStartTimestamp = localStorage.getItem(STORAGE_KEY_START_TIMESTAMP);
        const storedAccumulated = parseInt(localStorage.getItem(STORAGE_KEY_ACCUMULATED) || '0', 10);

        if (storedRunning && storedStartTimestamp) {
          const startMs = parseInt(storedStartTimestamp, 10);
          const diffSeconds = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
          setElapsedSeconds(storedAccumulated + diffSeconds);
          setIsRunning(true);
        } else {
          setElapsedSeconds(storedAccumulated);
          setIsRunning(false);
        }
      }
    } catch {
      // Ignored
    }
  }, []);

  // Xử lý đếm giờ liên tục mỗi giây
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        if (mode === 'countdown') {
          try {
            const targetMsStr = localStorage.getItem(STORAGE_KEY_COUNTDOWN_TARGET_TIMESTAMP);
            if (targetMsStr) {
              const targetMs = parseInt(targetMsStr, 10);
              const remaining = Math.max(0, Math.round((targetMs - Date.now()) / 1000));
              setCountdownRemaining(remaining);
              if (remaining <= 0) {
                // Hết giờ đếm ngược! Phát chuông Ting và rung
                setIsRunning(false);
                setIsCompleted(true);
                playChimeSound();
                if ('vibrate' in navigator) {
                  try {
                    navigator.vibrate([250, 100, 250]);
                  } catch {
                    // Ignored
                  }
                }
                localStorage.setItem(STORAGE_KEY_IS_RUNNING, 'false');
                localStorage.removeItem(STORAGE_KEY_COUNTDOWN_TARGET_TIMESTAMP);
                localStorage.setItem(STORAGE_KEY_COUNTDOWN_REMAINING, '0');
              }
            } else {
              setCountdownRemaining((prev) => {
                if (prev <= 1) {
                  setIsRunning(false);
                  setIsCompleted(true);
                  playChimeSound();
                  return 0;
                }
                return prev - 1;
              });
            }
          } catch {
            setCountdownRemaining((prev) => (prev > 0 ? prev - 1 : 0));
          }
        } else {
          // Stopwatch
          try {
            const storedStartTimestamp = localStorage.getItem(STORAGE_KEY_START_TIMESTAMP);
            const storedAccumulated = parseInt(localStorage.getItem(STORAGE_KEY_ACCUMULATED) || '0', 10);
            if (storedStartTimestamp) {
              const startMs = parseInt(storedStartTimestamp, 10);
              const diffSeconds = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
              setElapsedSeconds(storedAccumulated + diffSeconds);
            } else {
              setElapsedSeconds((prev) => prev + 1);
            }
          } catch {
            setElapsedSeconds((prev) => prev + 1);
          }
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
  }, [isRunning, mode]);

  // Đổi chế độ: Đếm tiến <-> Đếm ngược
  const setMode = useCallback(
    (newMode: TimerMode) => {
      if (isRunning) return; // Không đổi khi đang chạy
      setModeState(newMode);
      setIsCompleted(false);
      try {
        localStorage.setItem(STORAGE_KEY_MODE, newMode);
      } catch {
        // Ignored
      }
    },
    [isRunning]
  );

  // Đổi số phút đếm ngược
  const setCountdownMinutes = useCallback(
    (mins: number) => {
      if (isRunning) return;
      setCountdownMinutesState(mins);
      setCountdownRemaining(mins * 60);
      setIsCompleted(false);
      try {
        localStorage.setItem(STORAGE_KEY_COUNTDOWN_MINS, mins.toString());
        localStorage.setItem(STORAGE_KEY_COUNTDOWN_REMAINING, (mins * 60).toString());
      } catch {
        // Ignored
      }
    },
    [isRunning]
  );

  // Bắt đầu bấm giờ
  const handleStart = useCallback(() => {
    const now = new Date();
    const clock = startClock || toClockString(now);
    setStartClock(clock);
    setIsRunning(true);
    setIsCompleted(false);

    try {
      localStorage.setItem(STORAGE_KEY_IS_RUNNING, 'true');
      localStorage.setItem(STORAGE_KEY_STUDENT, activeTimerStudent);
      localStorage.setItem(STORAGE_KEY_START_CLOCK, clock);

      if (mode === 'countdown') {
        const targetTs = Date.now() + countdownRemaining * 1000;
        localStorage.setItem(STORAGE_KEY_COUNTDOWN_TARGET_TIMESTAMP, targetTs.toString());
      } else {
        localStorage.setItem(STORAGE_KEY_START_TIMESTAMP, Date.now().toString());
        localStorage.setItem(STORAGE_KEY_ACCUMULATED, elapsedSeconds.toString());
      }
    } catch {
      // Ignored
    }
  }, [activeTimerStudent, countdownRemaining, elapsedSeconds, mode, startClock]);

  // Tạm dừng
  const handlePause = useCallback(() => {
    setIsRunning(false);
    try {
      localStorage.setItem(STORAGE_KEY_IS_RUNNING, 'false');
      if (mode === 'countdown') {
        localStorage.removeItem(STORAGE_KEY_COUNTDOWN_TARGET_TIMESTAMP);
        localStorage.setItem(STORAGE_KEY_COUNTDOWN_REMAINING, countdownRemaining.toString());
      } else {
        localStorage.removeItem(STORAGE_KEY_START_TIMESTAMP);
        localStorage.setItem(STORAGE_KEY_ACCUMULATED, elapsedSeconds.toString());
      }
    } catch {
      // Ignored
    }
  }, [countdownRemaining, elapsedSeconds, mode]);

  // Đặt lại về ban đầu
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsCompleted(false);
    setStartClock('');

    if (mode === 'countdown') {
      const resetSec = countdownMinutes * 60;
      setCountdownRemaining(resetSec);
      try {
        localStorage.removeItem(STORAGE_KEY_COUNTDOWN_TARGET_TIMESTAMP);
        localStorage.setItem(STORAGE_KEY_COUNTDOWN_REMAINING, resetSec.toString());
        localStorage.setItem(STORAGE_KEY_IS_RUNNING, 'false');
        localStorage.removeItem(STORAGE_KEY_START_CLOCK);
      } catch {
        // Ignored
      }
    } else {
      setElapsedSeconds(0);
      try {
        localStorage.removeItem(STORAGE_KEY_IS_RUNNING);
        localStorage.removeItem(STORAGE_KEY_START_TIMESTAMP);
        localStorage.removeItem(STORAGE_KEY_ACCUMULATED);
        localStorage.removeItem(STORAGE_KEY_START_CLOCK);
      } catch {
        // Ignored
      }
    }
  }, [countdownMinutes, mode]);

  // Kết thúc & Gửi dữ liệu vào form lưu buổi học
  const handleFinish = useCallback(() => {
    const now = new Date();
    const endClock = toClockString(now);
    const dateStr = toLocalDateString(now);

    let actualElapsed = 0;
    if (mode === 'countdown') {
      actualElapsed = countdownMinutes * 60 - countdownRemaining;
      if (actualElapsed <= 0) actualElapsed = countdownMinutes * 60;
    } else {
      actualElapsed = elapsedSeconds;
    }

    const sessionData: StudyTimerSession = {
      studentName: activeTimerStudent,
      startTime: startClock || toClockString(new Date(Date.now() - actualElapsed * 1000)),
      endTime: endClock,
      date: dateStr,
      elapsedSeconds: actualElapsed,
    };

    handleReset();
    onFinishSession?.(sessionData);
  }, [
    activeTimerStudent,
    countdownMinutes,
    countdownRemaining,
    elapsedSeconds,
    handleReset,
    mode,
    onFinishSession,
    startClock,
  ]);

  // Tính % tiến độ cho thanh tiến độ
  const totalCountdownSec = countdownMinutes * 60;
  const progressPercent =
    mode === 'countdown'
      ? Math.min(100, Math.max(0, ((totalCountdownSec - countdownRemaining) / totalCountdownSec) * 100))
      : 0;

  const formattedDisplay =
    mode === 'countdown'
      ? formatSecondsToTime(countdownRemaining)
      : formatSecondsToTime(elapsedSeconds);

  return {
    mode,
    setMode,
    countdownMinutes,
    setCountdownMinutes,
    countdownRemaining,
    isCompleted,
    isRunning,
    elapsedSeconds,
    formattedTime: formattedDisplay,
    progressPercent,
    activeTimerStudent,
    setActiveTimerStudent,
    startClock,
    handleStart,
    handlePause,
    handleReset,
    handleFinish,
    playPreviewChime: playChimeSound,
  };
}
