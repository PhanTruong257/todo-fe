import { useState, useEffect, useRef, useCallback } from 'react';

export function normalizeTime24h(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Trường hợp 1: "20:30" hoặc "9:15"
  if (trimmed.includes(':')) {
    const parts = trimmed.split(':');
    let h = parseInt(parts[0], 10);
    let m = parseInt(parts[1] || '0', 10);
    if (isNaN(h)) return null;
    if (isNaN(m)) m = 0;
    h = Math.max(0, Math.min(23, h));
    m = Math.max(0, Math.min(59, m));
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  // Trường hợp 2: 4 chữ số liền nhau "2030" -> "20:30"
  if (/^\d{4}$/.test(trimmed)) {
    let h = parseInt(trimmed.slice(0, 2), 10);
    let m = parseInt(trimmed.slice(2, 4), 10);
    h = Math.max(0, Math.min(23, h));
    m = Math.max(0, Math.min(59, m));
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  // Trường hợp 3: 3 chữ số liền nhau "930" -> "09:30"
  if (/^\d{3}$/.test(trimmed)) {
    let h = parseInt(trimmed.slice(0, 1), 10);
    let m = parseInt(trimmed.slice(1, 3), 10);
    h = Math.max(0, Math.min(23, h));
    m = Math.max(0, Math.min(59, m));
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  // Trường hợp 4: 1 hoặc 2 chữ số nhập giờ "20" -> "20:00" hoặc "8" -> "08:00"
  if (/^\d{1,2}$/.test(trimmed)) {
    let h = parseInt(trimmed, 10);
    if (isNaN(h)) return null;
    h = Math.max(0, Math.min(23, h));
    return `${String(h).padStart(2, '0')}:00`;
  }

  return null;
}

export function getCurrentTime24h(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  const [h, m] = (timeStr || '20:00').split(':').map(Number);
  let total = (h * 60 + m + minutesToAdd) % (24 * 60);
  if (total < 0) total += 24 * 60;
  const newH = String(Math.floor(total / 60)).padStart(2, '0');
  const newM = String(total % 60).padStart(2, '0');
  return `${newH}:${newM}`;
}

// Danh sách các mốc giờ 24h gợi ý từ 06:00 đến 23:30 (bước nhảy 30 phút)
export const TIME_PRESETS_24H: string[] = [];
for (let h = 6; h <= 23; h++) {
  const hStr = String(h).padStart(2, '0');
  TIME_PRESETS_24H.push(`${hStr}:00`);
  TIME_PRESETS_24H.push(`${hStr}:30`);
}

interface UseTimePicker24hProps {
  value: string;
  onChange: (val: string) => void;
}

export function useTimePicker24h({ value, onChange }: UseTimePicker24hProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '20:00');
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  // Đồng bộ giá trị prop khi thay đổi từ bên ngoài
  useEffect(() => {
    if (value) {
      setInputValue(value);
    }
  }, [value]);

  // Cuộn đến mốc giờ đang chọn khi mở dropdown
  useEffect(() => {
    if (isOpen && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen]);

  // Đóng khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCommit = useCallback(() => {
    const normalized = normalizeTime24h(inputValue);
    if (normalized) {
      setInputValue(normalized);
      onChange(normalized);
    } else {
      // Khôi phục giá trị hợp lệ trước đó nếu người dùng nhập linh tinh
      setInputValue(value || '20:00');
    }
  }, [inputValue, onChange, value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommit();
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setInputValue(value || '20:00');
    }
  };

  const handleSelectPreset = (preset: string) => {
    setInputValue(preset);
    onChange(preset);
    setIsOpen(false);
  };

  const handleSetNow = () => {
    const nowTime = getCurrentTime24h();
    setInputValue(nowTime);
    onChange(nowTime);
    setIsOpen(false);
  };

  const handleAdjust = (minutes: number) => {
    const currentBase = value || inputValue || '20:00';
    const adjusted = addMinutesToTime(currentBase, minutes);
    setInputValue(adjusted);
    onChange(adjusted);
  };

  return {
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
  };
}
