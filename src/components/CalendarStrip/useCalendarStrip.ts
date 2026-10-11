import { useState, useMemo } from 'react';
import type { Todo } from '../../types/todo';

export interface DayInfo {
  dateStr: string; // 'YYYY-MM-DD'
  dayNumber: number;
  dayName: string; // 'T2', 'T3', ...
  fullDayName: string; // 'Thứ Hai', 'Thứ Ba', ...
  monthLabel: string;
  isToday: boolean;
  isSelected: boolean;
  hasReport: boolean;
  reportCount: number;
  totalDurationMinutes: number;
}

interface UseCalendarStripProps {
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  todos: Todo[];
  activeStudent: string;
}

// Chuyển đổi Date sang 'YYYY-MM-DD' theo giờ địa phương
export function formatDateToLocalISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Lấy thứ 2 của tuần chứa ngày d
function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Thứ Hai là ngày đầu tuần
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const FULL_DAY_NAMES = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

export function useCalendarStrip({
  selectedDate,
  onSelectDate,
  todos,
  activeStudent,
}: UseCalendarStripProps) {
  // Tuần bắt đầu đang xem
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));

  // Đi tới tuần trước
  const prevWeek = () => {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() - 7);
      return next;
    });
  };

  // Đi tới tuần sau
  const nextWeek = () => {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 7);
      return next;
    });
  };

  // Về tuần này & hôm nay
  const goToToday = () => {
    const today = new Date();
    setWeekStart(getMonday(today));
    onSelectDate(formatDateToLocalISO(today));
  };

  // Nhảy tới ngày bất kỳ được chọn từ date picker
  const handleCustomDateChange = (dateStr: string) => {
    if (dateStr) {
      const [y, m, d] = dateStr.split('-').map(Number);
      const chosen = new Date(y, m - 1, d);
      setWeekStart(getMonday(chosen));
      onSelectDate(dateStr);
    }
  };

  // Tính toán dữ liệu 7 ngày trong tuần
  const days: DayInfo[] = useMemo(() => {
    const todayStr = formatDateToLocalISO(new Date());
    const result: DayInfo[] = [];

    // Lọc trước các báo cáo của người đang chọn
    const studentTodos = todos.filter((t) => {
      if (activeStudent === 'all') return true;
      return (t.studentName || 'Trường') === activeStudent;
    });

    for (let i = 0; i < 7; i++) {
      const current = new Date(weekStart);
      current.setDate(weekStart.getDate() + i);
      const dateStr = formatDateToLocalISO(current);

      const dayOfWeekIndex = current.getDay();
      const dayName = DAY_NAMES[dayOfWeekIndex];
      const fullDayName = FULL_DAY_NAMES[dayOfWeekIndex];

      // Đếm số báo cáo và thời lượng học của ngày này
      const dayTodos = studentTodos.filter((t) => t.date === dateStr);
      let totalMinutes = 0;
      dayTodos.forEach((t) => {
        if (t.startTime && t.endTime) {
          const [sh, sm] = t.startTime.split(':').map(Number);
          const [eh, em] = t.endTime.split(':').map(Number);
          const diff = eh * 60 + em - (sh * 60 + sm);
          if (diff > 0) totalMinutes += diff;
        }
      });

      result.push({
        dateStr,
        dayNumber: current.getDate(),
        dayName,
        fullDayName,
        monthLabel: `Thg ${current.getMonth() + 1}`,
        isToday: dateStr === todayStr,
        isSelected: selectedDate === dateStr,
        hasReport: dayTodos.length > 0,
        reportCount: dayTodos.length,
        totalDurationMinutes: totalMinutes,
      });
    }

    return result;
  }, [weekStart, selectedDate, todos, activeStudent]);

  // Tiêu đề khoảng tuần (ví dụ: "06/10 - 12/10/2026")
  const weekRangeLabel = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(weekStart.getDate() + 6);
    const startStr = `${String(weekStart.getDate()).padStart(2, '0')}/${String(
      weekStart.getMonth() + 1
    ).padStart(2, '0')}`;
    const endStr = `${String(end.getDate()).padStart(2, '0')}/${String(
      end.getMonth() + 1
    ).padStart(2, '0')}/${end.getFullYear()}`;
    return `${startStr} — ${endStr}`;
  }, [weekStart]);

  return {
    days,
    weekRangeLabel,
    prevWeek,
    nextWeek,
    goToToday,
    handleCustomDateChange,
  };
}
