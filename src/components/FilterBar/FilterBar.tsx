import React from 'react';
import { Search } from 'lucide-react';
import type { TodoStats } from '../../types/todo';
import './FilterBar.css';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'active' | 'completed';
  onStatusFilterChange: (status: 'all' | 'active' | 'completed') => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
  stats: TodoStats;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  stats,
}) => {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm công việc..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="status-tabs">
        <button
          className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('all')}
        >
          Tất cả ({stats.total})
        </button>
        <button
          className={`tab-btn ${statusFilter === 'active' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('active')}
        >
          Đang làm ({stats.active})
        </button>
        <button
          className={`tab-btn ${statusFilter === 'completed' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('completed')}
        >
          Đã xong ({stats.completed})
        </button>
      </div>

      <select
        className="select-filter-priority"
        value={priorityFilter}
        onChange={(e) => onPriorityFilterChange(e.target.value)}
        title="Lọc theo mức độ ưu tiên"
      >
        <option value="all">Mọi mức ưu tiên</option>
        <option value="high">Chỉ ưu tiên cao</option>
        <option value="medium">Chỉ bình thường</option>
        <option value="low">Chỉ ưu tiên thấp</option>
      </select>
    </div>
  );
};

export default FilterBar;
