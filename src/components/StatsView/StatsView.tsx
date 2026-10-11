import React, { useState } from 'react';
import {
  TrendingUp,
  UserCheck,
  Heart,
  ArrowRight,
  Award,
  BarChart3,
  Flame,
  Minus,
  Plus,
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
    studentsAnalytics,
    weeklyActivity,
    formattedWeekTotalDuration,
  } = useStatsView({ todos, stats, students });

  const [isWeeklyOpen, setIsWeeklyOpen] = useState(true);
  const [isStudentsOpen, setIsStudentsOpen] = useState(true);

  return (
    <div className="stats-view-container animate-fade-in">
      {/* 1. Biểu đồ hoạt động 7 ngày trong tuần */}
      <div className={`weekly-activity-section ${!isWeeklyOpen ? 'is-collapsed' : ''}`}>
        <div
          className="section-header"
          onClick={() => setIsWeeklyOpen(!isWeeklyOpen)}
          role="button"
          tabIndex={0}
        >
          {/* HÀNG 1 CỐ ĐỊNH: Tiêu đề bên trái, Badge + Nút (+ / -) bên phải */}
          <div className="section-header-top-row">
            <div className="section-title-left">
              <BarChart3 size={19} className="title-icon" />
              <h3>Hoạt Động Học Tập Trong Tuần</h3>
            </div>

            <div className="section-header-right">
              <span className="week-total-pill">
                Tổng tuần: {formattedWeekTotalDuration}
              </span>
              <button
                type="button"
                className="btn-toggle-section"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsWeeklyOpen(!isWeeklyOpen);
                }}
                title={isWeeklyOpen ? 'Thu gọn (-)' : 'Mở rộng (+)'}
                aria-label={isWeeklyOpen ? 'Thu gọn (-)' : 'Mở rộng (+)'}
              >
                {isWeeklyOpen ? <Minus size={15} strokeWidth={2.5} /> : <Plus size={15} strokeWidth={2.5} />}
              </button>
            </div>
          </div>

          {/* HÀNG 2: Mô tả phụ (khi mở) */}
          {isWeeklyOpen && (
            <p className="section-sub">
              Thời lượng học từng ngày từ Thứ 2 đến Chủ Nhật tuần này
            </p>
          )}
        </div>

        {isWeeklyOpen && (
          <div className="weekly-bars-container animate-fade-in">
            {weeklyActivity.map((day) => {
              // Chuẩn hóa chiều cao cột (tối đa 180 phút = 100%)
              const percent = Math.min(100, Math.round((day.totalMinutes / 180) * 100));
              const hasActivity = day.totalMinutes > 0;

              return (
                <div
                  key={day.dateStr}
                  className={`day-bar-column ${day.isToday ? 'is-today' : ''} ${hasActivity ? 'has-data' : ''
                    }`}
                  title={`${day.dayLabel}: ${day.formattedDuration} (${day.sessionCount} nhật ký)`}
                >
                  <div className="bar-track">
                    {hasActivity ? (
                      <div
                        className="bar-fill"
                        style={{ height: `${Math.max(14, percent)}%` }}
                      >
                        <span className="bar-duration-tooltip">
                          {day.formattedDuration}
                        </span>
                      </div>
                    ) : (
                      <div className="bar-empty-dot" />
                    )}
                  </div>

                  <div className="day-info-bottom">
                    <span className="day-name">{day.dayShort}</span>
                    <span className="day-date">{day.dateStr.split('-').slice(1).reverse().join('/')}</span>
                    {day.isToday && <span className="today-badge">Nay</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Bảng theo dõi tiến độ từng học viên */}
      <div className={`students-comparison-section ${!isStudentsOpen ? 'is-collapsed' : ''}`}>
        <div
          className="section-header"
          onClick={() => setIsStudentsOpen(!isStudentsOpen)}
          role="button"
          tabIndex={0}
        >
          {/* HÀNG 1 CỐ ĐỊNH: Tiêu đề bên trái, Badge + Nút (+ / -) bên phải */}
          <div className="section-header-top-row">
            <div className="section-title-left">
              <TrendingUp size={19} className="title-icon" />
              <h3>Tiến Độ Học Tập Từng Thành Viên</h3>
            </div>

            <div className="section-header-right">
              <span className="students-count-pill">
                {studentsAnalytics.length} thành viên
              </span>
              <button
                type="button"
                className="btn-toggle-section"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsStudentsOpen(!isStudentsOpen);
                }}
                title={isStudentsOpen ? 'Thu gọn (-)' : 'Mở rộng (+)'}
                aria-label={isStudentsOpen ? 'Thu gọn (-)' : 'Mở rộng (+)'}
              >
                {isStudentsOpen ? <Minus size={15} strokeWidth={2.5} /> : <Plus size={15} strokeWidth={2.5} />}
              </button>
            </div>
          </div>

          {/* HÀNG 2: Mô tả phụ (khi mở) */}
          {isStudentsOpen && (
            <p className="section-sub">
              Thống kê thời lượng, chuỗi ngày học và các chủ đề tiếng Anh đã học
            </p>
          )}
        </div>

        {isStudentsOpen && (
          <div className="students-analytics-list animate-fade-in">
            {studentsAnalytics.map((student) => {
              const isTruong = student.name === 'Trường';
              const isNguyet = student.name === 'Nguyệt';

              return (
                <div
                  key={student.name}
                  className={`student-analytics-row ${isTruong ? 'row-truong' : isNguyet ? 'row-nguyet' : 'row-other'
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
                        {isTruong ? 'Mục tiêu IELTS' : isNguyet ? 'Tiếng Anh giao tiếp' : 'Thành viên'}
                      </span>
                    </div>
                  </div>

                  {/* 2. Metrics: 4 chỉ số ngang kèm chuỗi học 🔥 */}
                  <div className="student-row-metrics">
                    <div className="metric-box">
                      <span className="metric-label">Tổng thời gian</span>
                      <strong className="metric-value">{student.formattedDuration}</strong>
                    </div>
                    <div className="metric-divider" />
                    <div className="metric-box">
                      <span className="metric-label">Số nhật ký</span>
                      <strong className="metric-value">{student.totalSessions} nhật ký</strong>
                    </div>
                    <div className="metric-divider" />
                    <div className="metric-box">
                      <span className="metric-label">TB / nhật ký</span>
                      <strong className="metric-value">{student.avgDuration}</strong>
                    </div>
                    <div className="metric-divider" />
                    <div className="metric-box metric-streak-box">
                      <span className="metric-label">Chuỗi học</span>
                      <strong className="metric-value streak-val">
                        {student.streak > 0 ? (
                          <>
                            <Flame size={13} className="flame-icon-metric" />
                            <span>{student.streak} ngày</span>
                          </>
                        ) : (
                          <span className="text-muted-streak">0 ngày</span>
                        )}
                      </strong>
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
                      <span className="no-topics">Chưa có nhật ký</span>
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
                      <span>Xem nhật ký</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsView;
