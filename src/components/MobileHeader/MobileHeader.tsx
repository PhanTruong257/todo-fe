import React, { useState } from 'react';
import {
  BookOpen,
  BarChart3,
  UserCheck,
  Heart,
  Users,
  Search,
  Plus,
  X,
  Check,
  UserPlus,
  Timer,
} from 'lucide-react';
import type { Todo, TodoStats } from '../../types/todo';
import { DatePicker } from '../DatePicker/DatePicker';
import { calculateStreak } from '../../utils/streak';
import './MobileHeader.css';

interface MobileHeaderProps {
  activeStudent: string;
  onStudentChange: (student: string) => void;
  students: string[];
  onAddStudent: (name: string) => void;
  stats: TodoStats;
  activeTab: 'reports' | 'stats';
  onTabChange: (tab: 'reports' | 'stats') => void;
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  todos: Todo[];
  search: string;
  onSearchChange: (search: string) => void;
  isAddOpen: boolean;
  onToggleAdd: () => void;
  isTimerOpen?: boolean;
  onToggleTimer?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  activeStudent,
  onStudentChange,
  students,
  onAddStudent,
  stats,
  activeTab,
  onTabChange,
  selectedDate,
  onSelectDate,
  todos,
  search,
  onSearchChange,
  isAddOpen,
  onToggleAdd,
  isTimerOpen,
  onToggleTimer,
}) => {
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      onAddStudent(newStudentName.trim());
      setNewStudentName('');
      setIsAddingStudent(false);
    }
  };

  return (
    <header className="mobile-app-header">
      {/* HÀNG 1: Brand Logo + Tabs Báo Cáo / Thống Kê */}
      <div className="mobile-header-top-row">
        <div className="mobile-brand-group">
          <div className="mobile-brand-icon">
            <BookOpen size={18} />
          </div>
          <div className="mobile-brand-text">
            <h1>English Tracker</h1>
          </div>
        </div>

        <nav className="mobile-nav-tabs">
          <button
            type="button"
            className={`mobile-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => onTabChange('reports')}
          >
            <BookOpen size={13} />
            <span>Báo Cáo</span>
          </button>
          <button
            type="button"
            className={`mobile-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => onTabChange('stats')}
          >
            <BarChart3 size={13} />
            <span>Thống Kê</span>
          </button>
        </nav>
      </div>

      {/* HÀNG 2: Hàng Chip Vuốt Ngang Chọn Học Viên (Tất cả / Trường / Nguyệt / +) */}
      <div className="mobile-students-scroll-row">
        {/* Chip: Tất cả */}
        {(() => {
          const allStreak = todos ? calculateStreak(todos).currentStreak : 0;
          return (
            <button
              type="button"
              className={`mobile-student-chip chip-all ${
                activeStudent === 'all' ? 'active' : ''
              }`}
              onClick={() => onStudentChange('all')}
            >
              <Users size={14} className="chip-icon" />
              <span className="chip-name">Tất cả</span>
              {allStreak > 0 && (
                <span className="chip-streak-pill" title={`Chuỗi học: ${allStreak} ngày`}>
                  🔥{allStreak}
                </span>
              )}
              <span className="chip-count">{stats.total}</span>
            </button>
          );
        })()}

        {/* Các chip từng học viên */}
        {students.map((student) => {
          const isTruong = student === 'Trường';
          const isNguyet = student === 'Nguyệt';
          const isSelected = activeStudent === student;
          const count = stats.studentStats?.[student]?.total || 0;
          const streak = todos ? calculateStreak(todos, student).currentStreak : 0;

          return (
            <button
              key={student}
              type="button"
              className={`mobile-student-chip ${
                isTruong ? 'chip-truong' : isNguyet ? 'chip-nguyet' : 'chip-other'
              } ${isSelected ? 'active' : ''}`}
              onClick={() => onStudentChange(student)}
            >
                  {isTruong ? (
                    <UserCheck size={14} className="chip-icon" />
                  ) : isNguyet ? (
                    <Heart size={14} className="chip-icon" />
                  ) : (
                    <span className="chip-avatar-letter">{student.charAt(0)}</span>
                  )}
                  <span className="chip-name">{student}</span>
                  {streak > 0 && (
                    <span className="chip-streak-pill" title={`Chuỗi học: ${streak} ngày`}>
                      🔥{streak}
                    </span>
                  )}
                  <span className="chip-count">{count}</span>
                </button>
              );
            })}

        {/* Nút hoặc Form thêm nhanh học viên */}
        {!isAddingStudent ? (
          <button
            type="button"
            className="mobile-chip-add"
            onClick={() => setIsAddingStudent(true)}
            title="Thêm học viên mới"
          >
            <UserPlus size={13} />
            <span>Thêm</span>
          </button>
        ) : (
          <form
            className="mobile-inline-add-form"
            onSubmit={handleAddStudentSubmit}
          >
            <input
              type="text"
              placeholder="Tên..."
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-mini-confirm" title="Lưu">
              <Check size={12} />
            </button>
            <button
              type="button"
              className="btn-mini-dismiss"
              onClick={() => setIsAddingStudent(false)}
              title="Hủy"
            >
              <X size={12} />
            </button>
          </form>
        )}
      </div>

      {/* HÀNG 3: Lịch Ngày + Tìm Kiếm + Nút + Thêm Bài Học */}
      {activeTab === 'reports' && (
        <div className="mobile-header-bottom-row">
          {/* Pop-up Lịch Chọn Ngày */}
          <div className="mobile-date-wrapper">
            <DatePicker
              selectedDate={selectedDate}
              onSelectDate={onSelectDate}
              todos={todos}
              activeStudent={activeStudent}
            />
          </div>

          {/* Ô Tìm Kiếm Nhanh */}
          <div className="mobile-search-wrapper">
            <Search size={14} className="mobile-search-icon" />
            <input
              type="text"
              className="mobile-search-input"
              placeholder="Tìm bài học..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="mobile-clear-search"
                onClick={() => onSearchChange('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Nút Bấm Giờ Học */}
          {onToggleTimer && (
            <button
              type="button"
              className={`mobile-btn-timer-circle ${isTimerOpen ? 'active' : ''}`}
              onClick={onToggleTimer}
              title="Đồng hồ bấm giờ học trực tiếp"
            >
              <Timer size={16} />
            </button>
          )}

          {/* Nút + Thêm Buổi Học */}
          <button
            type="button"
            className={`mobile-btn-add-circle ${isAddOpen ? 'active' : ''}`}
            onClick={onToggleAdd}
            title={isAddOpen ? 'Đóng' : 'Thêm báo cáo mới'}
          >
            {isAddOpen ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
