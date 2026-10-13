/**
 * Hangul IME Automata (Bộ gõ tiếng Hàn 2-Set Dubeolsik chuẩn)
 * Hỗ trợ ghép âm tiết động theo thời gian thực (Jamo to Syllable),
 * xử lý quy tắc nhảy phụ âm cuối (như 먹 + ㅓ -> 머 + 거),
 * ghép nguyên âm mở rộng (ㅗ+ㅏ->ㅘ) và patchim kép (ㄺ, ㅄ...),
 * tháo gỡ từng nét khi nhấn Backspace.
 */

// 19 Phụ âm đầu (초성)
export const CHO_SEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

// 21 Nguyên âm giữa (중성)
export const JUNG_SEONG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
];

// 28 Phụ âm cuối (종성 / Patchim, index 0 là rỗng)
export const JONG_SEONG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

// Bản đồ ghép nguyên âm kép
export const COMPLEX_VOWELS: Record<string, Record<string, string>> = {
  'ㅗ': { 'ㅏ': 'ㅘ', 'ㅐ': 'ㅙ', 'ㅣ': 'ㅚ' },
  'ㅜ': { 'ㅓ': 'ㅝ', 'ㅔ': 'ㅞ', 'ㅣ': 'ㅟ' },
  'ㅡ': { 'ㅣ': 'ㅢ' },
};

// Bản đồ tách nguyên âm kép khi Backspace
export const COMPLEX_VOWELS_SPLIT: Record<string, [string, string]> = {
  'ㅘ': ['ㅗ', 'ㅏ'],
  'ㅙ': ['ㅗ', 'ㅐ'],
  'ㅚ': ['ㅗ', 'ㅣ'],
  'ㅝ': ['ㅜ', 'ㅓ'],
  'ㅞ': ['ㅜ', 'ㅔ'],
  'ㅟ': ['ㅜ', 'ㅣ'],
  'ㅢ': ['ㅡ', 'ㅣ'],
};

// Bản đồ ghép patchim kép
export const COMPLEX_PATCHIM: Record<string, Record<string, string>> = {
  'ㄱ': { 'ㅅ': 'ㄳ' },
  'ㄴ': { 'ㅈ': 'ㄵ', 'ㅎ': 'ㄶ' },
  'ㄹ': { 'ㄱ': 'ㄺ', 'ㅁ': 'ㄻ', 'ㅂ': 'ㄼ', 'ㅅ': 'ㄽ', 'ㅌ': 'ㄾ', 'ㅍ': 'ㄿ', 'ㅎ': 'ㅀ' },
  'ㅂ': { 'ㅅ': 'ㅄ' },
};

// Bản đồ tách patchim kép khi tách âm hoặc Backspace
export const COMPLEX_PATCHIM_SPLIT: Record<string, [string, string]> = {
  'ㄳ': ['ㄱ', 'ㅅ'],
  'ㄵ': ['ㄴ', 'ㅈ'],
  'ㄶ': ['ㄴ', 'ㅎ'],
  'ㄺ': ['ㄹ', 'ㄱ'],
  'ㄻ': ['ㄹ', 'ㅁ'],
  'ㄼ': ['ㄹ', 'ㅂ'],
  'ㄽ': ['ㄹ', 'ㅅ'],
  'ㄾ': ['ㄹ', 'ㅌ'],
  'ㄿ': ['ㄹ', 'ㅍ'],
  'ㅀ': ['ㄹ', 'ㅎ'],
  'ㅄ': ['ㅂ', 'ㅅ'],
};

// Bản đồ ánh xạ event.code (vật lý) sang ký tự tiếng Hàn
export const PHYSICAL_KEY_MAP: Record<string, { normal: string; shift?: string }> = {
  KeyQ: { normal: 'ㅂ', shift: 'ㅃ' },
  KeyW: { normal: 'ㅈ', shift: 'ㅉ' },
  KeyE: { normal: 'ㄷ', shift: 'ㄸ' },
  KeyR: { normal: 'ㄱ', shift: 'ㄲ' },
  KeyT: { normal: 'ㅅ', shift: 'ㅆ' },
  KeyY: { normal: 'ㅛ' },
  KeyU: { normal: 'ㅕ' },
  KeyI: { normal: 'ㅑ' },
  KeyO: { normal: 'ㅐ', shift: 'ㅒ' },
  KeyP: { normal: 'ㅔ', shift: 'ㅖ' },
  KeyA: { normal: 'ㅁ' },
  KeyS: { normal: 'ㄴ' },
  KeyD: { normal: 'ㅇ' },
  KeyF: { normal: 'ㄹ' },
  KeyG: { normal: 'ㅎ' },
  KeyH: { normal: 'ㅗ' },
  KeyJ: { normal: 'ㅓ' },
  KeyK: { normal: 'ㅏ' },
  KeyL: { normal: 'ㅣ' },
  KeyZ: { normal: 'ㅋ' },
  KeyX: { normal: 'ㅌ' },
  KeyC: { normal: 'ㅊ' },
  KeyV: { normal: 'ㅍ' },
  KeyB: { normal: 'ㅠ' },
  KeyN: { normal: 'ㅜ' },
  KeyM: { normal: 'ㅡ' },
  Space: { normal: ' ' },
};

export interface HangulBufferState {
  cho: string;   // Phụ âm đầu
  jung: string;  // Nguyên âm giữa
  jong: string;  // Phụ âm cuối
}

/**
 * Ghép {cho, jung, jong} thành ký tự Unicode
 */
export function composeSyllable(cho: string, jung: string, jong: string = ''): string {
  const choIdx = CHO_SEONG.indexOf(cho);
  const jungIdx = JUNG_SEONG.indexOf(jung);
  const jongIdx = JONG_SEONG.indexOf(jong);

  if (choIdx === -1 || jungIdx === -1) {
    return cho || jung || jong || '';
  }

  const code = 0xac00 + (choIdx * 21 + jungIdx) * 28 + (jongIdx > 0 ? jongIdx : 0);
  return String.fromCharCode(code);
}

export class HangulImeAutomata {
  private completedText: string = '';
  private currentSyllable: HangulBufferState = { cho: '', jung: '', jong: '' };

  constructor(initialText = '') {
    this.completedText = initialText;
  }

  public getText(): string {
    const cur = this.getCurrentChar();
    return this.completedText + (cur ? cur : '');
  }

  public getCurrentChar(): string {
    const { cho, jung, jong } = this.currentSyllable;
    if (!cho && !jung && !jong) return '';
    if (cho && jung) {
      return composeSyllable(cho, jung, jong);
    }
    return cho || jung || jong || '';
  }

  public getRawBuffer(): HangulBufferState {
    return { ...this.currentSyllable };
  }

  public clear(): void {
    this.completedText = '';
    this.currentSyllable = { cho: '', jung: '', jong: '' };
  }

  /**
   * Xử lý khi nhấn 1 ký tự jamo hoặc dấu cách
   */
  public input(char: string): string {
    if (char === ' ') {
      this.commitCurrent();
      this.completedText += ' ';
      return this.getText();
    }

    const isCons = CHO_SEONG.includes(char) || JONG_SEONG.includes(char);
    const isVow = JUNG_SEONG.includes(char);

    if (isCons) {
      this.handleConsonant(char);
    } else if (isVow) {
      this.handleVowel(char);
    } else {
      this.commitCurrent();
      this.completedText += char;
    }

    return this.getText();
  }

  private handleConsonant(cons: string): void {
    const { cho, jung, jong } = this.currentSyllable;

    // 1. Chưa có gì -> cho phụ âm vào cho
    if (!cho && !jung) {
      this.currentSyllable.cho = cons;
      return;
    }

    // 2. Đã có cho nhưng chưa có jung (ví dụ: gõ ㄱ rồi gõ tiếp ㄴ)
    if (cho && !jung) {
      this.commitCurrent();
      this.currentSyllable.cho = cons;
      return;
    }

    // 3. Đã có cho và jung, chưa có jong -> cho vào jong nếu hợp lệ
    if (cho && jung && !jong) {
      if (JONG_SEONG.includes(cons)) {
        this.currentSyllable.jong = cons;
      } else {
        // Phụ âm không thể làm patchim (như ㄸ, ㅃ, ㅉ)
        this.commitCurrent();
        this.currentSyllable.cho = cons;
      }
      return;
    }

    // 4. Đã có cho, jung, và jong -> kiểm tra xem có ghép thành patchim kép được không
    if (cho && jung && jong) {
      const comp = COMPLEX_PATCHIM[jong]?.[cons];
      if (comp) {
        this.currentSyllable.jong = comp;
      } else {
        // Không ghép được patchim kép -> chốt âm tiết cũ, mở âm tiết mới
        this.commitCurrent();
        this.currentSyllable.cho = cons;
      }
      return;
    }
  }

  private handleVowel(vow: string): void {
    const { cho, jung, jong } = this.currentSyllable;

    // 1. Chưa có gì -> nguyên âm đứng một mình
    if (!cho && !jung) {
      this.currentSyllable.jung = vow;
      return;
    }

    // 2. Đang có nguyên âm đứng 1 mình -> kiểm tra ghép nguyên âm kép
    if (!cho && jung) {
      const comp = COMPLEX_VOWELS[jung]?.[vow];
      if (comp) {
        this.currentSyllable.jung = comp;
      } else {
        this.commitCurrent();
        this.currentSyllable.jung = vow;
      }
      return;
    }

    // 3. Đang có cho nhưng chưa có jung -> kết hợp thành khối vuông chuẩn! (ㄱ + ㅏ = 가)
    if (cho && !jung) {
      this.currentSyllable.jung = vow;
      return;
    }

    // 4. Đang có cho và jung, chưa có jong -> kiểm tra ghép nguyên âm kép (ㅗ + ㅏ = ㅘ)
    if (cho && jung && !jong) {
      const comp = COMPLEX_VOWELS[jung]?.[vow];
      if (comp) {
        this.currentSyllable.jung = comp;
      } else {
        this.commitCurrent();
        this.currentSyllable.jung = vow;
      }
      return;
    }

    // 5. Đã có cho, jung và jong: ĐẶC BIỆT - Patchim nhảy sang âm sau! (먹 + ㅓ -> 머 + 거)
    if (cho && jung && jong) {
      // Nếu là patchim kép (ví dụ: 닭 + ㅣ -> 달 + 기)
      if (COMPLEX_PATCHIM_SPLIT[jong]) {
        const [firstJong, secondJong] = COMPLEX_PATCHIM_SPLIT[jong];
        this.currentSyllable.jong = firstJong;
        this.commitCurrent();
        this.currentSyllable = { cho: secondJong, jung: vow, jong: '' };
      } else {
        // Patchim đơn (ví dụ: 먹 + ㅓ -> 머 + 거)
        const movingCons = jong;
        this.currentSyllable.jong = '';
        this.commitCurrent();
        this.currentSyllable = { cho: movingCons, jung: vow, jong: '' };
      }
      return;
    }
  }

  private commitCurrent(): void {
    const char = this.getCurrentChar();
    if (char) {
      this.completedText += char;
    }
    this.currentSyllable = { cho: '', jung: '', jong: '' };
  }

  /**
   * Xử lý Backspace tháo từng nét (Jamo-by-Jamo backspace)
   */
  public backspace(): string {
    const { cho, jung, jong } = this.currentSyllable;

    // Nếu đang có patchim kép -> tách về patchim đơn
    if (jong) {
      if (COMPLEX_PATCHIM_SPLIT[jong]) {
        this.currentSyllable.jong = COMPLEX_PATCHIM_SPLIT[jong][0];
      } else {
        this.currentSyllable.jong = '';
      }
      return this.getText();
    }

    // Nếu đang có nguyên âm kép -> tách về nguyên âm đơn
    if (jung) {
      if (COMPLEX_VOWELS_SPLIT[jung]) {
        this.currentSyllable.jung = COMPLEX_VOWELS_SPLIT[jung][0];
      } else {
        this.currentSyllable.jung = '';
      }
      return this.getText();
    }

    // Nếu chỉ có cho -> xóa cho
    if (cho) {
      this.currentSyllable.cho = '';
      return this.getText();
    }

    // Nếu buffer hiện tại trống -> xóa 1 ký tự cuối trong completedText
    if (this.completedText.length > 0) {
      this.completedText = this.completedText.slice(0, -1);
    }

    return this.getText();
  }
}
