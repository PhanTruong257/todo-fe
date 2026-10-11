import React from 'react';
import {
  Clock,
  BookOpen,
  TrendingUp,
  UserCheck,
  Heart,
  ArrowRight,
  Award,
  Sparkles,
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
  const {
    formattedTotalDuration,
    formattedAvgDuration,
    studentsAnalytics,
  } = useStatsView({ todos, stats, students });

  return (
    <div className="stats-view-container animate-fade-in">
      {/* 3 Thẻ tổng quan đầu bảng */}
      <div className="stats-summary-grid">
        <div className="stat-summary-card">
          <div className="stat-icon-wrapper duration">
            <Clock size={22} />
          </div>
          <div className="stat-summary-info">
            <span className="stat-summary-label">Tổng Thời Gian Học</span>
            <div className="stat-summary-val">{formattedTotalDuration}</div>
          </div>
        </div>

        <div className="stat-summary-card">
          <div className="stat-icon-wrapper sessions">
            <BookOpen size={22} />
          </div>
          <div className="stat-summary-info">
            <span className="stat-summary-label">Tổng Số Buổi Học</span>
            <div className="stat-summary-val">{stats.total} buổi</div>
          </div>
        </div>

        <div className="stat-summary-card">
          <div className="stat-icon-wrapper avg">
            <Sparkles size={22} />
          </div>
          <div className="stat-summary-info">
            <span className="stat-summary-label">Trung Bình Mỗi Buổi</span>
            <div className="stat-summary-val">{formattedAvgDuration}</div>
          </div>
        </div>
      </div>

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

        <div className="students-cards-grid">
          {studentsAnalytics.map((student) => {
            const isTruong = student.name === 'Trường';
            const isNguyet = student.name === 'Nguyệt';

            return (
              <div
                key={student.name}
                className={`student-analytics-card ${
                  isTruong ? 'card-truong' : isNguyet ? 'card-nguyet' : 'card-other'
                }`}
              >
                <div className="card-header">
                  <div className="student-profile">
                    <div className="avatar-badge">
                      {isTruong ? <UserCheck size={22} /> : isNguyet ? <Heart size={22} /> : '👤'}
                    </div>
                    <div>
                      <h4>{student.name}</h4>
                      <span className="student-role">
                        {isTruong ? 'Học viên IELTS' : isNguyet ? 'Học viên Tiếng Anh' : 'Học viên'}
                      </span>
                    </div>
                  </div>

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

                {/* Số liệu thống kê */}
                <div className="metrics-row">
                  <div className="metric-box">
                    <span className="metric-label">Tổng thời gian</span>
                    <strong className="metric-value">{student.formattedDuration}</strong>
                  </div>

                  <div className="metric-box">
                    <span className="metric-label">Số buổi học</span>
                    <strong className="metric-value">{student.totalSessions} buổi</strong>
                  </div>

                  <div className="metric-box">
                    <span className="metric-label">Trung bình/buổi</span>
                    <strong className="metric-value">{student.avgDuration}</strong>
                  </div>
                </div>

                {/* Các chủ đề gần đây */}
                <div className="recent-topics">
                  <span className="topics-label">
                    <Award size={13} /> Chủ đề đã học:
                  </span>
                  {student.recentTopics.length > 0 ? (
                    <div className="topics-pills">
                      {student.recentTopics.map((topic, i) => (
                        <span key={i} className="topic-pill">
                          {topic}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-topics">Chưa có chủ đề nào được ghi nhận</p>
                  )}
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
