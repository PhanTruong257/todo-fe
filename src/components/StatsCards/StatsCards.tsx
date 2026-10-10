import React from 'react';
import { Layers, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import type { TodoStats } from '../../types/todo';
import './StatsCards.css';

interface StatsCardsProps {
  stats: TodoStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon total">
          <Layers size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Tổng công việc</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon active">
          <Clock size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Đang thực hiện</div>
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

      <div className="stat-card">
        <div className="stat-icon high">
          <Sparkles size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.highPriority}</div>
          <div className="stat-label">Ưu tiên cao</div>
        </div>
      </div>
    </section>
  );
};

export default StatsCards;
