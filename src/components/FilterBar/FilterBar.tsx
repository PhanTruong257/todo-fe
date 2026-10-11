import React from 'react';
import { Search, Plus, X, BookOpen, Timer } from 'lucide-react';
import './FilterBar.css';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
  isAddOpen: boolean;
  onToggleAdd: () => void;
  isTimerOpen?: boolean;
  onToggleTimer?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  totalCount,
  isAddOpen,
  onToggleAdd,
  isTimerOpen,
  onToggleTimer,
}) => {
  return (
    <div className="filter-bar-compact">
      {/* Ô tìm kiếm nội dung bài học */}
      <div className="search-box">
        <Search size={16} />
        <input
          type="text"
          className="search-input"
          placeholder="Tìm theo chủ đề, từ vựng, ngữ pháp..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="btn-clear-search"
            onClick={() => onSearchChange('')}
            title="Xóa tìm kiếm"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-right-actions">
        {/* Nút bấm giờ học */}
        {onToggleTimer && (
          <button
            type="button"
            className={`btn-timer-pill ${isTimerOpen ? 'active' : ''}`}
            onClick={onToggleTimer}
            title="Đồng hồ bấm giờ học trực tiếp"
          >
            <Timer size={14} />
            <span>Bấm giờ</span>
          </button>
        )}

        {/* Số lượng báo cáo */}
        <div className="reports-count-badge" title="Tổng số nhật ký trong danh sách">
          <BookOpen size={13} />
          <span>{totalCount} nhật ký</span>
        </div>

        {/* Nút + tối giản duy nhất để thêm báo cáo */}
        <button
          type="button"
          className={`btn-add-circle ${isAddOpen ? 'active' : ''}`}
          onClick={onToggleAdd}
          title={isAddOpen ? 'Đóng bảng thêm' : 'Thêm nhật ký học mới'}
        >
          {isAddOpen ? <X size={18} /> : <Plus size={18} />}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
