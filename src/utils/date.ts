/**
 * Date utilities cho định dạng Local Timezone YYYY-MM-DD
 * TUYỆT ĐỐI KHÔNG dùng new Date().toISOString().split('T')[0] vì sẽ bị lệch múi giờ UTC
 * (Ví dụ: Tại Việt Nam UTC+7, từ 00:00 đến 07:00 sáng sẽ bị tính nhầm thành ngày hôm qua).
 */

export function toLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayLocalISO(): string {
  return toLocalDateString(new Date());
}

export function getYesterdayLocalISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toLocalDateString(d);
}

export function getTomorrowLocalISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toLocalDateString(d);
}

export function shiftDateLocalISO(dateStr: string | null, daysOffset: number): string {
  let base: Date;
  if (dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    base = new Date(y, m - 1, d, 12, 0, 0); // Giờ 12:00:00 tránh lệch múi giờ khi cộng trừ ngày
  } else {
    base = new Date();
    base.setHours(12, 0, 0, 0);
  }
  base.setDate(base.getDate() + daysOffset);
  return toLocalDateString(base);
}
