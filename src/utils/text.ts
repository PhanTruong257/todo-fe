/**
 * Tiện ích xử lý văn bản tiếng Việt & tìm kiếm không dấu
 */

/**
 * Chuẩn hóa chuỗi tiếng Việt thành chữ thường không dấu
 * Ví dụ: "Học Tiếng Anh (Trường)" -> "hoc tieng anh (truong)"
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}

/**
 * Kiểm tra văn bản có khớp với từ khóa tìm kiếm hay không:
 * - Hỗ trợ gõ không dấu (ví dụ: "ho" -> khớp "học", "truong" -> khớp "Trường")
 * - Hỗ trợ tìm kiếm nhiều từ cách nhau bởi khoảng trắng (ví dụ: "ho anh" -> khớp "Học tiếng Anh")
 */
export function matchesSearch(targetText: string, search: string): boolean {
  if (!search || !search.trim()) return true;
  if (!targetText) return false;

  const cleanSearch = removeVietnameseTones(search);
  const cleanTarget = removeVietnameseTones(targetText);

  // 1. Khớp chuỗi trực tiếp
  if (cleanTarget.includes(cleanSearch)) return true;

  // 2. Khớp từng từ khóa nếu tìm nhiều từ
  const words = cleanSearch.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return words.every((word) => cleanTarget.includes(word));
  }

  return false;
}
