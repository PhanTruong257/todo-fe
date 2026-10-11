import { useMemo } from 'react';
import type { Todo, TodoStats } from '../../types/todo';

export interface StudentAnalytics {
  name: string;
  totalSessions: number;
  totalMinutes: number;
  formattedDuration: string;
  avgDuration: string;
  recentTopics: string[];
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

      return {
        name: studentName,
        totalSessions,
        totalMinutes: studentMinutes,
        formattedDuration: formatMinutesToHours(studentMinutes),
        avgDuration: formatMinutesToHours(avg),
        recentTopics: Array.from(new Set(topics)).slice(0, 5),
      };
    });

    const avgMinutesTotal =
      stats.total > 0 ? Math.round(totalAllMinutes / stats.total) : 0;

    return {
      totalAllMinutes,
      formattedTotalDuration: formatMinutesToHours(totalAllMinutes),
      formattedAvgDuration: formatMinutesToHours(avgMinutesTotal),
      studentsAnalytics: studentList,
    };
  }, [todos, stats, students]);

  return analytics;
}
