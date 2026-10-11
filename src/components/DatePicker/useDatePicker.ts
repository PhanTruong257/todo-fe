import { useState, useMemo, useEffect, useRef } from 'react';
import type { Todo } from '../../types/todo';
import { shiftDateLocalISO, getTodayLocalISO } from '../../utils/date';

export interface CalendarDay {
  dateStr: string; // 'YYYY-MM-DD'
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasReport: boolean;
}

interface UseDatePickerProps {
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  todos?: Todo[];
  activeStudent?: string;
}

function formatISO(y: number, m: number, d: number): string {
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

export function useDatePicker({
  selectedDate,
  onSelectDate,
  todos = [],
  activeStudent = 'all',
}: UseDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tháng và năm đang xem trong lịch (mặc định lấy theo selectedDate hoặc hôm nay)
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (selectedDate) {
      const [y, m, d] = selectedDate.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  });

  // Khi selectedDate thay đổi từ ngoài, cập nhật lại viewDate
  useEffect(() => {
    if (selectedDate) {
      const [y, m, d] = selectedDate.split('-').map(Number);
      setViewDate(new Date(y, m - 1, d));
    }
  }, [selectedDate]);

  // Click outside listener để tự động đóng popup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const prevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Chuyển sang ngày trước (-1 ngày)
  const prevDay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextDate = shiftDateLocalISO(selectedDate, -1);
    onSelectDate(nextDate);
  };

  // Chuyển sang ngày sau (+1 ngày)
  const nextDay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextDate = shiftDateLocalISO(selectedDate, 1);
    onSelectDate(nextDate);
  };

  const goToToday = () => {
    const today = new Date();
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(getTodayLocalISO());
    setIsOpen(false);
  };

  const selectDateAndClose = (dateStr: string | null) => {
    onSelectDate(dateStr);
    setIsOpen(false);
  };

  // Tính toán lưới các ngày trong tháng
  const days: CalendarDay[] = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth(); // 0-11
    const todayStr = getTodayLocalISO();

    // Tập hợp các ngày có báo cáo của học sinh
    const reportDates = new Set<string>();
    todos.forEach((t) => {
      if (t.date) {
        if (activeStudent === 'all' || (t.studentName || 'Trường') === activeStudent) {
          reportDates.add(t.date);
        }
      }
    });

    // Ngày đầu tiên trong tháng
    const firstDay = new Date(year, month, 1);
    // Thứ của ngày đầu tiên (0: CN, 1: T2, ..., 6: T7) -> Đổi sang chuẩn Thứ 2 đầu tuần (0..6)
    const firstDayIndex = (firstDay.getDay() + 6) % 7; // T2=0, ..., CN=6

    // Số ngày trong tháng này
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    // Số ngày trong tháng trước
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const result: CalendarDay[] = [];

    // Các ngày của tháng trước bù vào đầu
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dNum = daysInPrevMonth - i;
      const prevM = month === 0 ? 12 : month;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = formatISO(prevY, prevM, dNum);
      result.push({
        dateStr,
        dayNumber: dNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isSelected: selectedDate === dateStr,
        hasReport: reportDates.has(dateStr),
      });
    }

    // Các ngày của tháng hiện tại
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const dateStr = formatISO(year, month + 1, i);
      result.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        isSelected: selectedDate === dateStr,
        hasReport: reportDates.has(dateStr),
      });
    }

    // Các ngày của tháng sau bù vào cuối để đủ bội số của 7 (tối đa 42 ô)
    const remainingSlots = (7 - (result.length % 7)) % 7;
    for (let i = 1; i <= remainingSlots; i++) {
      const nextM = month === 11 ? 1 : month + 2;
      const nextY = month === 11 ? year + 1 : year;
      const dateStr = formatISO(nextY, nextM, i);
      result.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isSelected: selectedDate === dateStr,
        hasReport: reportDates.has(dateStr),
      });
    }

    return result;
  }, [viewDate, selectedDate, todos, activeStudent]);

  // Tiêu đề tháng (ví dụ: "Tháng 10, 2026")
  const monthTitle = useMemo(() => {
    return `Tháng ${viewDate.getMonth() + 1}, ${viewDate.getFullYear()}`;
  }, [viewDate]);

  return {
    isOpen,
    setIsOpen,
    containerRef,
    days,
    monthTitle,
    prevMonth,
    nextMonth,
    prevDay,
    nextDay,
    goToToday,
    selectDateAndClose,
  };
}
