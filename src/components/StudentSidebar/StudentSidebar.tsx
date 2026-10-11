import React, { useState } from 'react';
import {
  BookOpen,
  UserCheck,
  Heart,
  Users,
  UserPlus,
  Check,
} from 'lucide-react';
import type { TodoStats } from '../../types/todo';
import './StudentSidebar.css';

interface StudentSidebarProps {
  activeStudent: string;
  onStudentChange: (student: string) => void;
  students: string[];
  onAddStudent: (name: string) => void;
  stats: TodoStats;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  activeStudent,
  onStudentChange,
  students,
  onAddStudent,
  stats,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddStudent(newName.trim());
      setNewName('');
      setIsAdding(false);
    }
  };

  return (
    <aside className="student-sidebar">
      <div className="sidebar-top-group">
        {/* Brand Header của Sidebar */}
        <div className="sidebar-brand">
          <div className="brand-logo-icon">
            <BookOpen size={22} />
          </div>
          <div className="brand-titles">
            <h2>English Tracker</h2>
            <span className="brand-sub">Nhật ký học mỗi ngày</span>
          </div>
        </div>

        {/* Danh sách học sinh */}
        <div className="sidebar-section">
          <div className="section-label-row">
            <span className="sidebar-label">DANH SÁCH HỌC VIÊN</span>
            <span className="students-total-count">{students.length} người</span>
          </div>

          <nav className="student-items-list">
            {students.map((student) => {
              const isTruong = student === 'Trường';
              const isNguyet = student === 'Nguyệt';
              const isSelected = activeStudent === student;
              const count = stats.studentStats?.[student]?.total || 0;

              return (
                <button
                  key={student}
                  type="button"
                  className={`student-nav-item ${isSelected ? 'active' : ''} ${
                    isTruong ? 'item-truong' : isNguyet ? 'item-nguyet' : 'item-other'
                  }`}
                  onClick={() => onStudentChange(student)}
                >
                  <div className="student-avatar-wrap">
                    {isTruong ? (
                      <UserCheck size={18} />
                    ) : isNguyet ? (
                      <Heart size={18} />
                    ) : (
                      <span className="avatar-initial">{student.charAt(0)}</span>
                    )}
                  </div>

                  <div className="student-meta">
                    <span className="student-name">{student}</span>
                    <span className="student-stats-sub">{count} buổi học</span>
                  </div>

                  <div className="student-badge-pill">{count}</div>
                </button>
              );
            })}

            {/* Lựa chọn xem Tất cả */}
            <button
              type="button"
              className={`student-nav-item item-all ${activeStudent === 'all' ? 'active' : ''}`}
              onClick={() => onStudentChange('all')}
            >
              <div className="student-avatar-wrap">
                <Users size={18} />
              </div>
              <div className="student-meta">
                <span className="student-name">Tất Cả Học Viên</span>
                <span className="student-stats-sub">Tổng {stats.total} buổi học</span>
              </div>
              <div className="student-badge-pill">{stats.total}</div>
            </button>
          </nav>

          {/* Nút hoặc Form Thêm học viên mới */}
          {!isAdding ? (
            <button
              type="button"
              className="btn-add-student-sidebar"
              onClick={() => setIsAdding(true)}
            >
              <UserPlus size={15} />
              <span>Thêm Học Viên Mới</span>
            </button>
          ) : (
            <form className="add-student-sidebar-form" onSubmit={handleAddSubmit}>
              <input
                type="text"
                placeholder="Nhập tên học viên..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <div className="form-buttons">
                <button type="submit" className="btn-save-mini" title="Lưu">
                  <Check size={14} />
                </button>
                <button
                  type="button"
                  className="btn-cancel-mini"
                  onClick={() => setIsAdding(false)}
                  title="Hủy"
                >
                  ✕
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Thông tin chân Sidebar */}
      <div className="sidebar-footer-info">
        <div className="sidebar-sync-pill">
          <span className="sync-live-dot" />
          <span>Hệ thống đồng bộ trực tiếp</span>
        </div>
        <span className="sidebar-version-tag">TaskFlow Study • v1.0.4</span>
      </div>
    </aside>
  );
};

export default StudentSidebar;
