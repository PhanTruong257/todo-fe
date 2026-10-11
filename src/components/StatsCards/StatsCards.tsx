import React from 'react';
import { UserCheck, Heart, BookOpen, CheckCircle2 } from 'lucide-react';
import type { TodoStats } from '../../types/todo';
import './StatsCards.css';

interface StatsCardsProps {
  stats: TodoStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const truongStats = stats.studentStats?.['Trường'] || { total: 0, completed: 0 };
  const nguyetStats = stats.studentStats?.['Nguyệt'] || { total: 0, completed: 0 };

  return (
    <section className="stats-grid">
      <div className="stat-card student-truong">
        <div className="stat-icon truong">
          <UserCheck size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{truongStats.total}</div>
          <div className="stat-label">Buổi học của <strong>Trường</strong> ({truongStats.completed} xong)</div>
        </div>
      </div>

      <div className="stat-card student-nguyet">
        <div className="stat-icon nguyet">
          <Heart size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{nguyetStats.total}</div>
          <div className="stat-label">Buổi học của <strong>Nguyệt</strong> ({nguyetStats.completed} xong)</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon total">
          <BookOpen size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Tổng số buổi học</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon completed">
          <CheckCircle2 size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Đã hoàn thành</div>
        </div>
      </div>
    </section>
  );
};

export default StatsCards;
