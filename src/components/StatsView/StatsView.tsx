import React from 'react';
import {
  TrendingUp,
  UserCheck,
  Heart,
  ArrowRight,
  Award,
} from 'lucide-react';
import type { Todo, TodoStats } from '../../types/todo';
import { useStatsView } from './useStatsView';
import './StatsView.css';

interface StatsViewProps {
  todos: Todo[];
  stats: TodoStats;
  students: string[];
  onSelectStudent: (student: string) => void;
  onGoToReports: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  todos,
  stats,
  students,
  onSelectStudent,
  onGoToReports,
}) => {
  const { studentsAnalytics } = useStatsView({ todos, stats, students });

  return (
    <div className="stats-view-container animate-fade-in">
      {/* Bảng theo dõi tiến độ từng học viên */}
      <div className="students-comparison-section">
        <div className="section-header">
          <div className="section-title-group">
            <TrendingUp size={20} className="title-icon" />
            <h3>Báo Cáo Học Tập Từng Học Viên</h3>
          </div>
          <p className="section-sub">
            Thống kê thời lượng và các chủ đề tiếng Anh đã học
          </p>
        </div>

        <div className="students-analytics-list">
          {studentsAnalytics.map((student) => {
            const isTruong = student.name === 'Trường';
            const isNguyet = student.name === 'Nguyệt';

            return (
              <div
                key={student.name}
                className={`student-analytics-row ${
                  isTruong ? 'row-truong' : isNguyet ? 'row-nguyet' : 'row-other'
                }`}
              >
                {/* 1. Profile: Avatar + Tên + Vai trò */}
                <div className="student-row-profile">
                  <div className="avatar-badge">
                    {isTruong ? <UserCheck size={20} /> : isNguyet ? <Heart size={20} /> : '👤'}
                  </div>
                  <div className="profile-text">
                    <h4>{student.name}</h4>
                    <span className="student-role">
                      {isTruong ? 'Học viên IELTS' : isNguyet ? 'Học viên Tiếng Anh' : 'Học viên'}
                    </span>
                  </div>
                </div>

                {/* 2. Metrics: 3 chỉ số ngang */}
                <div className="student-row-metrics">
                  <div className="metric-box">
                    <span className="metric-label">Tổng thời gian</span>
                    <strong className="metric-value">{student.formattedDuration}</strong>
                  </div>
                  <div className="metric-divider" />
                  <div className="metric-box">
                    <span className="metric-label">Số buổi học</span>
                    <strong className="metric-value">{student.totalSessions} buổi</strong>
                  </div>
                  <div className="metric-divider" />
                  <div className="metric-box">
                    <span className="metric-label">Trung bình/buổi</span>
                    <strong className="metric-value">{student.avgDuration}</strong>
                  </div>
                </div>

                {/* 3. Chủ đề đã học */}
                <div className="student-row-topics">
                  <div className="topics-header">
                    <Award size={13} className="award-icon" />
                    <span>Chủ đề:</span>
                  </div>
                  {student.recentTopics.length > 0 ? (
                    <div className="topics-pills">
                      {student.recentTopics.map((topic, i) => (
                        <span key={i} className="topic-pill" title={topic}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="no-topics">Chưa có bài học</span>
                  )}
                </div>

                {/* 4. Nút Xem báo cáo */}
                <div className="student-row-action">
                  <button
                    type="button"
                    className="btn-view-reports"
                    onClick={() => {
                      onSelectStudent(student.name);
                      onGoToReports();
                    }}
                    title={`Xem nhật ký của ${student.name}`}
                  >
                    <span>Xem báo cáo</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsView;
