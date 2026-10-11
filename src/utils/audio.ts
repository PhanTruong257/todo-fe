/**
 * Tiện ích âm thanh thông báo bằng Web Audio API
 * Tự động tổng hợp âm thanh chuông "Ting! 🔔" trong trẻo, không phụ thuộc file mp3
 */

export function playChimeSound(): void {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Âm 1: Nốt cao trong trẻo (E6 ~ 1318.5 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1318.5, now);
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.2);

    // Âm 2: Hài âm ngân vang (A5 ~ 880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.04);
    gain2.gain.setValueAtTime(0.3, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.04);
    osc2.stop(now + 1.6);

    // Âm 3: Tiếng chuông lấp lánh (C#6 ~ 1108.7 Hz)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(1108.7, now + 0.08);
    gain3.gain.setValueAtTime(0.22, now + 0.08);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.08);
    osc3.stop(now + 2.0);
  } catch (err) {
    console.warn('AudioContext chime error:', err);
  }
}
