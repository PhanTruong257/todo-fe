import React, { useState } from 'react';
import { Search, UserPlus, Check } from 'lucide-react';
import type { TodoStats } from '../../types/todo';
import './FilterBar.css';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'active' | 'completed';
  onStatusFilterChange: (status: 'all' | 'active' | 'completed') => void;
  studentFilter: string;
  onStudentFilterChange: (student: string) => void;
  students: string[];
  onAddStudent: (name: string) => void;
  stats: TodoStats;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  studentFilter,
  onStudentFilterChange,
  students,
  onAddStudent,
  stats,
}) => {
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');

  const handleCreatePerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonName.trim()) {
      onAddStudent(newPersonName.trim());
      setNewPersonName('');
      setIsAddingPerson(false);
    }
  };

  return (
    <div className="filter-wrapper">
      {/* Hàng chọn Người học (Trường / Nguyệt / Khác) */}
      <div className="student-filter-row">
        <span className="filter-title">Xem báo cáo của:</span>
        <div className="student-tabs">
          <button
            type="button"
            className={`student-tab ${studentFilter === 'all' ? 'active' : ''}`}
            onClick={() => onStudentFilterChange('all')}
          >
            Tất cả ({stats.total})
          </button>

          {students.map((student) => {
            const count = stats.studentStats?.[student]?.total || 0;
            const isTruong = student === 'Trường';
            const isNguyet = student === 'Nguyệt';
            const icon = isTruong ? '👨‍🎓' : isNguyet ? '👩‍🎓' : '👤';

            return (
              <button
                key={student}
                type="button"
                className={`student-tab ${
                  studentFilter === student ? 'active' : ''
                } ${isTruong ? 'tab-truong' : ''} ${isNguyet ? 'tab-nguyet' : ''}`}
                onClick={() => onStudentFilterChange(student)}
              >
                <span>{icon} {student}</span>
                <span className="student-count">({count})</span>
              </button>
            );
          })}

          {!isAddingPerson ? (
            <button
              type="button"
              className="btn-add-person"
              onClick={() => setIsAddingPerson(true)}
              title="Thêm người học mới"
            >
              <UserPlus size={14} />
              <span>Thêm người</span>
            </button>
          ) : (
            <form className="add-person-form" onSubmit={handleCreatePerson}>
              <input
                type="text"
                placeholder="Tên người mới..."
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn-confirm-person" title="Xác nhận">
                <Check size={14} />
              </button>
              <button
                type="button"
                className="btn-cancel-person"
                onClick={() => setIsAddingPerson(false)}
                title="Hủy"
              >
                ✕
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Hàng tìm kiếm & lọc trạng thái */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo nội dung bài học, từ vựng, chủ đề..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="status-tabs">
          <button
            type="button"
            className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('all')}
          >
            Tất cả
          </button>
          <button
            type="button"
            className={`tab-btn ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('active')}
          >
            Đang học ({stats.active})
          </button>
          <button
            type="button"
            className={`tab-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('completed')}
          >
            Đã xong ({stats.completed})
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
