import React from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { useTimePicker24h, TIME_PRESETS_24H } from './useTimePicker24h';
import './TimePicker24h.css';

interface TimePicker24hProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  id?: string;
}

export const TimePicker24h: React.FC<TimePicker24hProps> = ({
  value,
  onChange,
  placeholder = '20:00',
  id,
}) => {
  const {
    isOpen,
    setIsOpen,
    inputValue,
    containerRef,
    selectedItemRef,
    handleInputChange,
    handleCommit,
    handleKeyDown,
    handleSelectPreset,
    handleSetNow,
    handleAdjust,
  } = useTimePicker24h({ value, onChange });

  return (
    <div className="time-picker-24h-container" ref={containerRef}>
      {/* Ô nhập giờ định dạng 24h trực tiếp (gõ được 20, 20:00, 20:30,...) */}
      <input
        id={id}
        type="text"
        className="time-input-24h-field"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={5}
        title="Nhập giờ 24h (ví dụ: 20:00 hoặc gõ 20 rồi Enter)"
      />

      {/* Nút bấm mở popover chọn giờ */}
      <button
        type="button"
        className="time-picker-toggle-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Chọn giờ 24h"
      >
        <ChevronDown size={12} />
      </button>

      {/* Popover chọn giờ dạng 24h */}
      {isOpen && (
        <div className="time-picker-popover">
          {/* Hàng chọn nhanh: Bây giờ & Tăng/Giảm thời gian */}
          <div className="time-picker-quick-bar">
            <button
              type="button"
              className="btn-set-now"
              onClick={handleSetNow}
            >
              <Clock size={12} />
              <span>Thời điểm hiện tại</span>
            </button>

            <div className="time-adjust-row">
              <button
                type="button"
                className="btn-adjust-pill"
                onClick={() => handleAdjust(-15)}
                title="Lùi 15 phút"
              >
                -15m
              </button>
              <button
                type="button"
                className="btn-adjust-pill"
                onClick={() => handleAdjust(15)}
                title="Thêm 15 phút"
              >
                +15m
              </button>
              <button
                type="button"
                className="btn-adjust-pill"
                onClick={() => handleAdjust(30)}
                title="Thêm 30 phút"
              >
                +30m
              </button>
              <button
                type="button"
                className="btn-adjust-pill"
                onClick={() => handleAdjust(60)}
                title="Thêm 1 giờ"
              >
                +1h
              </button>
            </div>
          </div>

          {/* Danh sách các mốc giờ 24h (từ 06:00 đến 23:30) */}
          <div className="time-presets-scroll">
            {TIME_PRESETS_24H.map((preset) => {
              const isSelected = preset === value;
              return (
                <button
                  key={preset}
                  ref={isSelected ? selectedItemRef : undefined}
                  type="button"
                  className={`time-preset-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectPreset(preset)}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker24h;
