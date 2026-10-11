import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import type { Todo } from '../../types/todo';
import { useCalendarStrip } from './useCalendarStrip';
import './CalendarStrip.css';

interface CalendarStripProps {
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  todos: Todo[];
  activeStudent: string;
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({
  selectedDate,
  onSelectDate,
  todos,
  activeStudent,
}) => {
  const {
    days,
    weekRangeLabel,
    prevWeek,
    nextWeek,
    goToToday,
    handleCustomDateChange,
  } = useCalendarStrip({
    selectedDate,
    onSelectDate,
    todos,
    activeStudent,
  });

  const isAllDatesSelected = selectedDate === null;

  // Format số phút thành chuỗi xh y m
  const formatMinutes = (minutes: number) => {
    if (minutes <= 0) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `${h}h${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  return (
    <div className="calendar-strip-container">
      {/* Thanh điều khiển tuần & chọn ngày */}
      <div className="calendar-header">
        <div className="calendar-title-group">
          <div className="calendar-icon-badge">
            <CalendarIcon size={18} />
          </div>
          <div className="calendar-title-info">
            <h3>Lịch Nhật Ký Học Tập</h3>
            <span className="week-range-text">{weekRangeLabel}</span>
          </div>
        </div>

        <div className="calendar-controls">
          <button
            type="button"
            className="cal-btn nav-btn"
            onClick={prevWeek}
            title="Tuần trước"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            className="cal-btn today-btn"
            onClick={goToToday}
            title="Về ngày hôm nay"
          >
            Hôm nay
          </button>

          <button
            type="button"
            className="cal-btn nav-btn"
            onClick={nextWeek}
            title="Tuần sau"
          >
            <ChevronRight size={16} />
          </button>

          {/* Chọn ngày tùy ý bằng date picker */}
          <label className="cal-btn date-picker-btn" title="Chọn ngày cụ thể">
            <CalendarIcon size={14} />
            <span>Chọn ngày</span>
            <input
              type="date"
              className="hidden-date-input"
              value={selectedDate || ''}
              onChange={(e) => handleCustomDateChange(e.target.value)}
            />
          </label>

          {/* Nút xem tất cả ngày */}
          <button
            type="button"
            className={`cal-btn all-dates-btn ${isAllDatesSelected ? 'active' : ''}`}
            onClick={() => onSelectDate(null)}
            title="Xem tất cả nhật ký"
          >
            Tất cả ngày
          </button>
        </div>
      </div>

      {/* Dải 7 ngày trong tuần */}
      <div className="days-strip-grid">
        {days.map((day) => {
          const isSelected = day.isSelected && !isAllDatesSelected;

          return (
            <button
              key={day.dateStr}
              type="button"
              className={`day-card ${isSelected ? 'selected' : ''} ${
                day.isToday ? 'is-today' : ''
              } ${day.hasReport ? 'has-report' : 'empty-day'}`}
              onClick={() => onSelectDate(day.dateStr)}
            >
              <div className="day-name">{day.dayName}</div>
              <div className="day-number">{day.dayNumber}</div>
              <div className="day-month">{day.monthLabel}</div>

              {/* Tag hoặc chấm báo cáo */}
              {day.hasReport ? (
                <div className="day-report-badge" title={`${day.reportCount} nhật ký`}>
                  <CheckCircle2 size={11} />
                  <span>
                    {day.totalDurationMinutes > 0
                      ? formatMinutes(day.totalDurationMinutes)
                      : `${day.reportCount} nhật ký`}
                  </span>
                </div>
              ) : (
                <div className="day-empty-indicator">
                  <span className="dot-empty" />
                </div>
              )}

              {day.isToday && <span className="today-pill">Nay</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarStrip;
