import { useMemo } from 'react';
import type { Todo, TodoStats } from '../../types/todo';
import { calculateStreak } from '../../utils/streak';

export interface StudentAnalytics {
  name: string;
  totalSessions: number;
  totalMinutes: number;
  formattedDuration: string;
  avgDuration: string;
  recentTopics: string[];
  streak: number;
  longestStreak: number;
}

export interface DayActivity {
  dateStr: string;
  dayShort: string;
  dayLabel: string;
  totalMinutes: number;
  formattedDuration: string;
  sessionCount: number;
  isToday: boolean;
  studentMinutes: Record<string, number>;
}

interface UseStatsViewProps {
  todos: Todo[];
  stats: TodoStats;
  students: string[];
}

export function formatMinutesToHours(minutes: number): string {
  if (minutes <= 0) return '0h';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h} giờ`;
  return `${m} phút`;
}

function toLocalDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useStatsView({ todos, stats, students }: UseStatsViewProps) {
  const analytics = useMemo(() => {
    let totalAllMinutes = 0;

    const studentList: StudentAnalytics[] = students.map((studentName) => {
      const studentTodos = todos.filter(
        (t) => (t.studentName || 'Trường') === studentName
      );
      const totalSessions = studentTodos.length;

      let studentMinutes = 0;
      const topics: string[] = [];

      studentTodos.forEach((t) => {
        if (t.startTime && t.endTime) {
          const [sh, sm] = t.startTime.split(':').map(Number);
          const [eh, em] = t.endTime.split(':').map(Number);
          let diff = eh * 60 + em - (sh * 60 + sm);
          if (diff < 0) diff += 24 * 60;
          if (diff > 0) studentMinutes += diff;
        }
        if (t.title) topics.push(t.title);
      });

      totalAllMinutes += studentMinutes;

      const avg = totalSessions > 0 ? Math.round(studentMinutes / totalSessions) : 0;
      const streakInfo = calculateStreak(todos, studentName);

      return {
        name: studentName,
        totalSessions,
        totalMinutes: studentMinutes,
        formattedDuration: formatMinutesToHours(studentMinutes),
        avgDuration: formatMinutesToHours(avg),
        recentTopics: Array.from(new Set(topics)).slice(0, 5),
        streak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
      };
    });

    const avgMinutesTotal =
      stats.total > 0 ? Math.round(totalAllMinutes / stats.total) : 0;

    // Tính toán hoạt động 7 ngày trong tuần hiện tại (từ Thứ 2 đến Chủ Nhật)
    const now = new Date();
    const todayStr = toLocalDateString(now);
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, ...
    // Khoảng cách lùi về Thứ 2: nếu Chủ Nhật (0) lùi 6 ngày, còn lại lùi (dayOfWeek - 1)
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysSinceMonday);

    const dayShortNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const weeklyActivity: DayActivity[] = [];
    let weekTotalMinutes = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = toLocalDateString(d);
      const isToday = dateStr === todayStr;

      const dayTodos = todos.filter((t) => {
        const itemDate = t.date || (t.createdAt ? toLocalDateString(new Date(t.createdAt)) : '');
        return itemDate === dateStr;
      });

      let dayTotalMinutes = 0;
      const studentMinutes: Record<string, number> = {};

      dayTodos.forEach((t) => {
        let mins = 0;
        if (t.startTime && t.endTime) {
          const [sh, sm] = t.startTime.split(':').map(Number);
          const [eh, em] = t.endTime.split(':').map(Number);
          let diff = eh * 60 + em - (sh * 60 + sm);
          if (diff < 0) diff += 24 * 60;
          if (diff > 0) mins = diff;
        }
        dayTotalMinutes += mins;
        const name = t.studentName || 'Trường';
        studentMinutes[name] = (studentMinutes[name] || 0) + mins;
      });

      weekTotalMinutes += dayTotalMinutes;

      const dayDisplay = `${d.getDate()}/${d.getMonth() + 1}`;

      weeklyActivity.push({
        dateStr,
        dayShort: dayShortNames[i],
        dayLabel: `${dayShortNames[i]} (${dayDisplay})`,
        totalMinutes: dayTotalMinutes,
        formattedDuration: formatMinutesToHours(dayTotalMinutes),
        sessionCount: dayTodos.length,
        isToday,
        studentMinutes,
      });
    }

    return {
      totalAllMinutes,
      formattedTotalDuration: formatMinutesToHours(totalAllMinutes),
      formattedAvgDuration: formatMinutesToHours(avgMinutesTotal),
      studentsAnalytics: studentList,
      weeklyActivity,
      weekTotalMinutes,
      formattedWeekTotalDuration: formatMinutesToHours(weekTotalMinutes),
    };
  }, [todos, stats, students]);

  return analytics;
}
