import { useState, useRef, useCallback } from 'react';

export interface SpeechRecognitionResultState {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  accuracyScore: number | null; // 0 - 100
  feedbackMessage: string | null;
  error: string | null;
}

/**
 * Tính toán độ tương đồng giữa văn bản người học nói và câu mẫu chuẩn
 */
function calculateKoreanSimilarity(target: string, spoken: string): number {
  const cleanTarget = target.replace(/[^가-힣a-zA-Z0-9]/g, '').trim();
  const cleanSpoken = spoken.replace(/[^가-힣a-zA-Z0-9]/g, '').trim();

  if (!cleanTarget || !cleanSpoken) return 0;
  if (cleanTarget === cleanSpoken) return 100;

  // Tính số ký tự khớp
  let matches = 0;
  const targetChars = cleanTarget.split('');
  const spokenChars = cleanSpoken.split('');

  for (let i = 0; i < Math.min(targetChars.length, spokenChars.length); i++) {
    if (targetChars[i] === spokenChars[i]) {
      matches++;
    }
  }

  // Bonus nếu chứa cụm con
  if (cleanTarget.includes(cleanSpoken) || cleanSpoken.includes(cleanTarget)) {
    matches += Math.abs(cleanTarget.length - cleanSpoken.length) * 0.5;
  }

  const score = Math.round((matches / Math.max(cleanTarget.length, spokenChars.length)) * 100);
  return Math.min(100, Math.max(0, score));
}

export function useKoreanSpeech() {
  const [state, setState] = useState<SpeechRecognitionResultState>({
    isListening: false,
    transcript: '',
    isSupported: typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window),
    accuracyScore: null,
    feedbackMessage: null,
    error: null,
  });

  const recognitionRef = useRef<any>(null);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setState((prev) => ({ ...prev, isListening: false }));
  }, []);

  const startListening = useCallback(
    (targetKorean?: string) => {
      if (typeof window === 'undefined') return;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setState((prev) => ({
          ...prev,
          isSupported: false,
          error: 'Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech. Hãy thử trên Google Chrome hoặc Safari.',
        }));
        return;
      }

      // Dừng phiên trước nếu đang chạy
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR'; // Nhận diện tiếng Hàn
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        setState({
          isListening: true,
          transcript: '',
          isSupported: true,
          accuracyScore: null,
          feedbackMessage: 'Đang lắng nghe... Hãy nói to và rõ ràng câu tiếng Hàn nhé! 🎙️',
          error: null,
        });

        recognition.onresult = (event: any) => {
          const spokenText = event.results[0][0].transcript;
          let score: number | null = null;
          let feedback = `Bạn đã nói: "${spokenText}"`;

          if (targetKorean) {
            score = calculateKoreanSimilarity(targetKorean, spokenText);
            if (score >= 90) {
              feedback = `🎯 Tuyệt vời! Phát âm chuẩn xác ${score}%: "${spokenText}"`;
            } else if (score >= 70) {
              feedback = `🌟 Rất tốt! Độ chính xác ${score}%: "${spokenText}". Thử nhấn rõ âm hơn nhé!`;
            } else if (score >= 40) {
              feedback = `👍 Khá tốt (${score}%). Nhận diện: "${spokenText}". Bạn thử phát âm lại xem!`;
            } else {
              feedback = `💪 Cố lên! Máy nghe được: "${spokenText}". Nghe lại âm mẫu và thử lại nhé!`;
            }
          }

          setState((prev) => ({
            ...prev,
            isListening: false,
            transcript: spokenText,
            accuracyScore: score,
            feedbackMessage: feedback,
          }));
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          let errText = 'Lỗi nhận diện âm thanh.';
          if (event.error === 'not-allowed') {
            errText = 'Vui lòng cấp quyền truy cập Micro trên trình duyệt để luyện nói.';
          } else if (event.error === 'no-speech') {
            errText = 'Chưa nghe thấy bạn nói. Hãy bấm mic và nói lại nhé!';
          }

          setState((prev) => ({
            ...prev,
            isListening: false,
            error: errText,
            feedbackMessage: null,
          }));
        };

        recognition.onend = () => {
          setState((prev) => ({ ...prev, isListening: false }));
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          isListening: false,
          error: err?.message || 'Không thể khởi động micro.',
        }));
      }
    },
    [],
  );

  return {
    ...state,
    startListening,
    stopListening,
  };
}
