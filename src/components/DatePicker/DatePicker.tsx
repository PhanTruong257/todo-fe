import React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import type { Todo } from '../../types/todo';
import { useDatePicker } from './useDatePicker';
import './DatePicker.css';

interface DatePickerProps {
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  todos?: Todo[];
  activeStudent?: string;
}

// Format hiển thị trên pill (ví dụ: "CN, 11/10/2026")
function formatDateDisplay(dateStr: string | null): string {
  if (!dateStr) return 'Tất cả các ngày';

  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dayName = dayNames[dateObj.getDay()];
    const formatted = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
    return `${dayName}, ${formatted}`;
  } catch {
    return dateStr;
  }
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onSelectDate,
  todos = [],
  activeStudent = 'all',
}) => {
  const {
    isOpen,
    setIsOpen,
    containerRef,
    days,
    monthTitle,
    prevMonth,
    nextMonth,
    goToToday,
    selectDateAndClose,
  } = useDatePicker({
    selectedDate,
    onSelectDate,
    todos,
    activeStudent,
  });

  const weekDayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <div className="custom-datepicker-container" ref={containerRef}>
      {/* 1. Nút bấm chính trên Header (Click bất kỳ đâu đều mở/đóng popup) */}
      <button
        type="button"
        className={`datepicker-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Bấm để mở lịch chọn ngày"
      >
        <CalendarIcon size={16} className="dp-cal-icon" />
        <span className="dp-date-text">
          {formatDateDisplay(selectedDate)}
        </span>
        <ChevronDown
          size={14}
          className={`dp-chevron-icon ${isOpen ? 'rotate' : ''}`}
        />
      </button>

      {/* 2. Pop-up Lịch Đẹp Mắt Hiện Ra Khi Bấm */}
      {isOpen && (
        <div className="datepicker-dropdown-popup animate-popup-in">
          {/* Header của Popup: Điều hướng tháng */}
          <div className="popup-month-header">
            <button
              type="button"
              className="month-nav-btn"
              onClick={prevMonth}
              title="Tháng trước"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="month-header-title">{monthTitle}</span>

            <button
              type="button"
              className="month-nav-btn"
              onClick={nextMonth}
              title="Tháng sau"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Phím tắt chọn nhanh */}
          <div className="popup-shortcuts-row">
            <button
              type="button"
              className="shortcut-btn"
              onClick={goToToday}
            >
              Hôm nay
            </button>
            <button
              type="button"
              className="shortcut-btn"
              onClick={() => {
                const yest = new Date(Date.now() - 86400000);
                const yestStr = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(yest.getDate()).padStart(2, '0')}`;
                selectDateAndClose(yestStr);
              }}
            >
              Hôm qua
            </button>
            <button
              type="button"
              className={`shortcut-btn ${selectedDate === null ? 'highlight' : ''}`}
              onClick={() => selectDateAndClose(null)}
            >
              <RotateCcw size={11} /> Tất cả ngày
            </button>
          </div>

          {/* Hàng tên thứ trong tuần (T2 - CN) */}
          <div className="popup-weekdays-grid">
            {weekDayLabels.map((label) => (
              <span key={label} className="weekday-col-label">
                {label}
              </span>
            ))}
          </div>

          {/* Lưới các ngày trong tháng */}
          <div className="popup-days-grid">
            {days.map((day) => {
              return (
                <button
                  key={day.dateStr}
                  type="button"
                  className={`cal-day-cell ${
                    day.isSelected ? 'selected' : ''
                  } ${!day.isCurrentMonth ? 'other-month' : ''} ${
                    day.isToday ? 'is-today' : ''
                  } ${day.hasReport ? 'has-report' : ''}`}
                  onClick={() => selectDateAndClose(day.dateStr)}
                >
                  <span className="day-number-text">{day.dayNumber}</span>
                  {day.hasReport && <span className="report-dot-indicator" />}
                </button>
              );
            })}
          </div>

          {/* Chân popup giải thích ký hiệu */}
          <div className="popup-footer-legend">
            <span className="legend-item">
              <span className="legend-dot" /> Có buổi học
            </span>
            {selectedDate && (
              <button
                type="button"
                className="btn-clear-selection"
                onClick={() => selectDateAndClose(null)}
              >
                Xóa lọc ngày
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
