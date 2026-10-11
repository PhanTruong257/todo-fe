import type { Todo } from '../types/todo';

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  isStudiedToday: boolean;
  studiedDatesCount: number;
}

// Chuyển đối tượng Date thành chuỗi YYYY-MM-DD theo giờ địa phương
function toLocalDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Lùi 1 ngày
function getPreviousDateString(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return toLocalDateString(date);
}

/**
 * Tính toán chuỗi ngày học liên tục (Streak) của một học viên
 */
export function calculateStreak(todos: Todo[], studentName?: string): StreakInfo {
  // Lọc bài học của học viên (nếu có chỉ định)
  const filteredTodos = studentName && studentName !== 'all'
    ? todos.filter((t) => (t.studentName || 'Trường') === studentName)
    : todos;

  // Thu thập các ngày có học (chuỗi YYYY-MM-DD)
  const uniqueDates = new Set<string>();
  filteredTodos.forEach((t) => {
    if (t.date) {
      uniqueDates.add(t.date);
    } else if (t.createdAt) {
      uniqueDates.add(toLocalDateString(new Date(t.createdAt)));
    }
  });

  const todayStr = toLocalDateString(new Date());
  const yesterdayStr = getPreviousDateString(todayStr);

  const isStudiedToday = uniqueDates.has(todayStr);
  const isStudiedYesterday = uniqueDates.has(yesterdayStr);

  let currentStreak = 0;

  // Xác định ngày bắt đầu đếm streak:
  // Nếu hôm nay đã học -> đếm từ hôm nay lùi về trước.
  // Nếu hôm nay chưa học nhưng hôm qua có học -> streak vẫn giữ nguyên, đếm từ hôm qua lùi về trước.
  let checkDateStr = isStudiedToday ? todayStr : isStudiedYesterday ? yesterdayStr : null;

  if (checkDateStr) {
    while (uniqueDates.has(checkDateStr)) {
      currentStreak++;
      checkDateStr = getPreviousDateString(checkDateStr);
    }
  }

  // Tính longest streak (chuỗi dài nhất từ trước đến nay)
  const sortedDates = Array.from(uniqueDates).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDateStr: string | null = null;

  for (const dateStr of sortedDates) {
    if (!prevDateStr) {
      tempStreak = 1;
    } else {
      const expectedPrev = getPreviousDateString(dateStr);
      if (expectedPrev === prevDateStr) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDateStr = dateStr;
  }

  return {
    currentStreak,
    longestStreak,
    isStudiedToday,
    studiedDatesCount: uniqueDates.size,
  };
}
