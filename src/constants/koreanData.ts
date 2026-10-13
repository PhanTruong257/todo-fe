import type {
  HangeulLetter,
  KoreanVocabWord,
  KoreanGrammarPoint,
  KoreanDialogueItem,
} from '../types/korean';

// ==========================================
// 1. DỮ LIỆU BẢNG CHỮ CÁI HANGEUL (40 KÝ TỰ)
// ==========================================
export const HANGEUL_LETTERS: HangeulLetter[] = [
  // --- 10 NGUYÊN ÂM CƠ BẢN ---
  { char: 'ㅏ', name: 'A', romanization: 'a', vietnameseGuide: 'Phát âm giống âm "A" tiếng Việt', type: 'basic_vowel', sampleWord: '아이', sampleMeaning: 'Em bé' },
  { char: 'ㅑ', name: 'Ya', romanization: 'ya', vietnameseGuide: 'Âm "I" lướt nhanh sang "A" (Ya)', type: 'basic_vowel', sampleWord: '야구', sampleMeaning: 'Bóng chày' },
  { char: 'ㅓ', name: 'Eo', romanization: 'eo', vietnameseGuide: 'Phát âm mở miệng tròn như âm "Ơ" hoặc "O"', type: 'basic_vowel', sampleWord: '어머니', sampleMeaning: 'Mẹ' },
  { char: 'ㅕ', name: 'Yeo', romanization: 'yeo', vietnameseGuide: 'Âm "I" lướt sang "Ơ" (Dơ / Yơ)', type: 'basic_vowel', sampleWord: '여동생', sampleMeaning: 'Em gái' },
  { char: 'ㅗ', name: 'O', romanization: 'o', vietnameseGuide: 'Tròn môi phát âm giống âm "Ô" tiếng Việt', type: 'basic_vowel', sampleWord: '오이', sampleMeaning: 'Dưa chuột' },
  { char: 'ㅛ', name: 'Yo', romanization: 'yo', vietnameseGuide: 'Âm "I" lướt sang "Ô" (Yô)', type: 'basic_vowel', sampleWord: '요리', sampleMeaning: 'Nấu ăn' },
  { char: 'ㅜ', name: 'U', romanization: 'u', vietnameseGuide: 'Tròn môi phát âm giống âm "U" tiếng Việt', type: 'basic_vowel', sampleWord: '우유', sampleMeaning: 'Sữa tươi' },
  { char: 'ㅠ', name: 'Yu', romanization: 'yu', vietnameseGuide: 'Âm "I" lướt sang "U" (Yu)', type: 'basic_vowel', sampleWord: '유리', sampleMeaning: 'Thủy tinh' },
  { char: 'ㅡ', name: 'Eu', romanization: 'eu', vietnameseGuide: 'Khép bẹt môi phát âm giống âm "Ư"', type: 'basic_vowel', sampleWord: '음악', sampleMeaning: 'Âm nhạc' },
  { char: 'ㅣ', name: 'I', romanization: 'i', vietnameseGuide: 'Phát âm giống âm "I" tiếng Việt', type: 'basic_vowel', sampleWord: '이름', sampleMeaning: 'Tên' },

  // --- 11 NGUYÊN ÂM GHÉP / MỞ RỘNG ---
  { char: 'ㅐ', name: 'Ae', romanization: 'ae', vietnameseGuide: 'Phát âm giống âm "E" mở rộng khẩu hình', type: 'complex_vowel', sampleWord: '새', sampleMeaning: 'Con chim' },
  { char: 'ㅒ', name: 'Yae', romanization: 'yae', vietnameseGuide: 'Âm "I" lướt sang "E" (Ye)', type: 'complex_vowel', sampleWord: '얘기', sampleMeaning: 'Câu chuyện' },
  { char: 'ㅔ', name: 'E', romanization: 'e', vietnameseGuide: 'Phát âm giống âm "Ê" nhẹ nhàng', type: 'complex_vowel', sampleWord: '가게', sampleMeaning: 'Cửa hàng' },
  { char: 'ㅖ', name: 'Ye', romanization: 'ye', vietnameseGuide: 'Âm "I" lướt sang "Ê" (Yê)', type: 'complex_vowel', sampleWord: '시계', sampleMeaning: 'Đồng hồ' },
  { char: 'ㅘ', name: 'Wa', romanization: 'wa', vietnameseGuide: 'Âm ㅗ(o) + ㅏ(a) = Oa / Wa', type: 'complex_vowel', sampleWord: '과자', sampleMeaning: 'Bánh kẹo' },
  { char: 'ㅙ', name: 'Wae', romanization: 'wae', vietnameseGuide: 'Âm ㅗ(o) + ㅐ(ae) = Oe / We', type: 'complex_vowel', sampleWord: '왜', sampleMeaning: 'Tại sao' },
  { char: 'ㅚ', name: 'Oe', romanization: 'oe', vietnameseGuide: 'Thường đọc là Ue / We', type: 'complex_vowel', sampleWord: '회사', sampleMeaning: 'Công ty' },
  { char: 'ㅝ', name: 'Wo', romanization: 'wo', vietnameseGuide: 'Âm ㅜ(u) + ㅓ(eo) = Uơ / Wo', type: 'complex_vowel', sampleWord: '월요일', sampleMeaning: 'Thứ hai' },
  { char: 'ㅞ', name: 'We', romanization: 'we', vietnameseGuide: 'Âm ㅜ(u) + ㅔ(e) = Uê / We', type: 'complex_vowel', sampleWord: '웨딩', sampleMeaning: 'Đám cưới' },
  { char: 'ㅟ', name: 'Wi', romanization: 'wi', vietnameseGuide: 'Âm ㅜ(u) + ㅣ(i) = Uy / Wi', type: 'complex_vowel', sampleWord: '귀', sampleMeaning: 'Cái tai' },
  { char: 'ㅢ', name: 'Ui', romanization: 'ui', vietnameseGuide: 'Âm ㅡ(eu) + ㅣ(i) = Ưi / Ê / I', type: 'complex_vowel', sampleWord: '의사', sampleMeaning: 'Bác sĩ' },

  // --- 14 PHỤ ÂM CƠ BẢN ---
  { char: 'ㄱ', name: 'Gi-yeok', romanization: 'g / k', vietnameseGuide: 'Đầu từ đọc là K nhẹ, giữa từ đọc là G', type: 'basic_consonant', sampleWord: '가방', sampleMeaning: 'Cặp sách' },
  { char: 'ㄴ', name: 'Ni-eun', romanization: 'n', vietnameseGuide: 'Phát âm giống âm "N" tiếng Việt', type: 'basic_consonant', sampleWord: '나무', sampleMeaning: 'Cái cây' },
  { char: 'ㄷ', name: 'Di-geut', romanization: 'd / t', vietnameseGuide: 'Đầu từ đọc là T nhẹ, giữa từ đọc là Đ', type: 'basic_consonant', sampleWord: '다리', sampleMeaning: 'Cái chân / Cây cầu' },
  { char: 'ㄹ', name: 'Ri-eul', romanization: 'r / l', vietnameseGuide: 'Đầu từ đọc là R lướt, cuối từ là L uốn lưỡi', type: 'basic_consonant', sampleWord: '라면', sampleMeaning: 'Mì gói' },
  { char: 'ㅁ', name: 'Mi-eum', romanization: 'm', vietnameseGuide: 'Phát âm giống âm "M" tiếng Việt', type: 'basic_consonant', sampleWord: '모자', sampleMeaning: 'Cái mũ' },
  { char: 'ㅂ', name: 'Bi-eup', romanization: 'b / p', vietnameseGuide: 'Đầu từ đọc là P nhẹ, giữa từ đọc là B', type: 'basic_consonant', sampleWord: '바지', sampleMeaning: 'Cái quần' },
  { char: 'ㅅ', name: 'Si-ot', romanization: 's / sh', vietnameseGuide: 'Đọc là S nhẹ, khi đi với i/ya/yeo đọc là Xh', type: 'basic_consonant', sampleWord: '사과', sampleMeaning: 'Quả táo / Xin lỗi' },
  { char: 'ㅇ', name: 'I-eung', romanization: 'câm / ng', vietnameseGuide: 'Đứng đầu là âm câm, đứng cuối là âm NG (Patchim)', type: 'basic_consonant', sampleWord: '안녕', sampleMeaning: 'Xin chào' },
  { char: 'ㅈ', name: 'Ji-eut', romanization: 'j / ch', vietnameseGuide: 'Đầu từ là Ch nhẹ, giữa từ là J/D', type: 'basic_consonant', sampleWord: '지갑', sampleMeaning: 'Cái ví' },
  { char: 'ㅊ', name: 'Chi-eut', romanization: 'ch (bật hơi)', vietnameseGuide: 'Bật hơi mạnh luồng gió khi phát âm âm Ch', type: 'basic_consonant', sampleWord: '친구', sampleMeaning: 'Bạn bè' },
  { char: 'ㅋ', name: 'Khi-euk', romanization: 'k (bật hơi)', vietnameseGuide: 'Bật hơi mạnh luồng gió như âm Kh/K', type: 'basic_consonant', sampleWord: '커피', sampleMeaning: 'Cà phê' },
  { char: 'ㅌ', name: 'Thi-eut', romanization: 't (bật hơi)', vietnameseGuide: 'Bật hơi mạnh luồng gió như âm Th/T', type: 'basic_consonant', sampleWord: '토마토', sampleMeaning: 'Cà chua' },
  { char: 'ㅍ', name: 'Phi-eup', romanization: 'p (bật hơi)', vietnameseGuide: 'Bật hơi mạnh luồng gió như âm Ph/P', type: 'basic_consonant', sampleWord: '피자', sampleMeaning: 'Pizza' },
  { char: 'ㅎ', name: 'Hi-eut', romanization: 'h', vietnameseGuide: 'Phát âm giống âm "H" nhẹ nhàng', type: 'basic_consonant', sampleWord: '하늘', sampleMeaning: 'Bầu trời' },

  // --- 5 PHỤ ÂM CĂNG / KÉP ---
  { char: 'ㄲ', name: 'Ssang-giyeok', romanization: 'kk', vietnameseGuide: 'Căng cơ họng phát âm âm K đanh chắc', type: 'tense_consonant', sampleWord: '꽃', sampleMeaning: 'Bông hoa' },
  { char: 'ㄸ', name: 'Ssang-digeut', romanization: 'tt', vietnameseGuide: 'Căng cơ họng phát âm âm T đanh chắc', type: 'tense_consonant', sampleWord: '떡볶이', sampleMeaning: 'Bánh gạo cay' },
  { char: 'ㅃ', name: 'Ssang-bieup', romanization: 'pp', vietnameseGuide: 'Căng cơ môi phát âm âm P đanh chắc', type: 'tense_consonant', sampleWord: '빵', sampleMeaning: 'Bánh mì' },
  { char: 'ㅆ', name: 'Ssang-siot', romanization: 'ss', vietnameseGuide: 'Căng cơ phát âm âm X/S sắc sảo', type: 'tense_consonant', sampleWord: '싸다', sampleMeaning: 'Rẻ (tiền)' },
  { char: 'ㅉ', name: 'Ssang-jieut', romanization: 'jj', vietnameseGuide: 'Căng cơ họng phát âm âm Ch đanh chắc', type: 'tense_consonant', sampleWord: '짜다', sampleMeaning: 'Mặn (vị)' },
];

// Mảng phục vụ bộ ghép vần (Syllable Builder Unicode Algorithm)
export const INITIAL_CONSONANTS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

export const MEDIAL_VOWELS = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];

export const FINAL_CONSONANTS = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

/**
 * Hàm ghép chữ Hangeul theo chuẩn Unicode:
 * charCode = 0xAC00 + (initialIndex * 21 + medialIndex) * 28 + finalIndex
 */
export function composeHangeul(initial: string, medial: string, finalChar: string = ''): string {
  const initIdx = INITIAL_CONSONANTS.indexOf(initial);
  const medIdx = MEDIAL_VOWELS.indexOf(medial);
  const finIdx = FINAL_CONSONANTS.indexOf(finalChar);

  if (initIdx === -1 || medIdx === -1) return '';
  const code = 0xac00 + (initIdx * 21 + medIdx) * 28 + (finIdx >= 0 ? finIdx : 0);
  return String.fromCharCode(code);
}

// ==========================================
// 2. KHO TỪ VỰNG TOPIK 1 CỐT LÕI (8 CHỦ ĐỀ)
// ==========================================
export const KOREAN_TOPICS = [
  { key: 'greetings', nameVi: 'Chào hỏi & Xã giao', icon: '🙋' },
  { key: 'numbers', nameVi: 'Số đếm & Thời gian', icon: '🔢' },
  { key: 'food', nameVi: 'Ẩm thực & Nhà hàng', icon: '🍜' },
  { key: 'family', nameVi: 'Gia đình & Con người', icon: '👨‍👩‍👧' },
  { key: 'daily', nameVi: 'Đồ vật & Đời sống', icon: '🏠' },
  { key: 'school_work', nameVi: 'Trường học & Công việc', icon: '🏫' },
  { key: 'places', nameVi: 'Địa điểm & Mua sắm', icon: '🗺️' },
  { key: 'feelings', nameVi: 'Tính từ & Cảm xúc', icon: '💖' },
];

export const KOREAN_VOCAB_LIST: KoreanVocabWord[] = [
  // --- CHỦ ĐỀ: CHÀO HỎI & XÃ GIAO ---
  {
    id: 'ko-1',
    hangeul: '안녕하세요',
    romanization: 'an-nyeong-ha-se-yo',
    meaningVi: 'Xin chào (lịch sự thông dụng)',
    hanjaVi: 'An Ninh (安寧)',
    partOfSpeech: 'phrase',
    topic: 'greetings',
    level: 'TOPIK 1',
    exampleKo: '안녕하세요! 만나서 반갑습니다.',
    exampleVi: 'Xin chào! Rất vui được gặp bạn.',
  },
  {
    id: 'ko-2',
    hangeul: '감사합니다',
    romanization: 'gam-sa-ham-ni-da',
    meaningVi: 'Cảm ơn bạn (trang trọng)',
    hanjaVi: 'Cảm Tạ (感謝)',
    partOfSpeech: 'phrase',
    topic: 'greetings',
    level: 'TOPIK 1',
    exampleKo: '도와주셔서 감사합니다.',
    exampleVi: 'Cảm ơn vì đã giúp đỡ tôi.',
  },
  {
    id: 'ko-3',
    hangeul: '죄송합니다',
    romanization: 'joe-song-ham-ni-da',
    meaningVi: 'Xin lỗi (chân thành, trang trọng)',
    hanjaVi: 'Tội Tung (罪悚)',
    partOfSpeech: 'phrase',
    topic: 'greetings',
    level: 'TOPIK 1',
    exampleKo: '늦어서 죄송합니다.',
    exampleVi: 'Tôi xin lỗi vì đã đến muộn.',
  },
  {
    id: 'ko-4',
    hangeul: '안녕히 가세요',
    romanization: 'an-nyeong-hi ga-se-yo',
    meaningVi: 'Tạm biệt (chúc người đi bình an)',
    hanjaVi: 'Khứ (Đi)',
    partOfSpeech: 'phrase',
    topic: 'greetings',
    level: 'TOPIK 1',
    exampleKo: '오늘 즐거웠습니다. 안녕히 가세요!',
    exampleVi: 'Hôm nay rất vui. Tạm biệt bạn nhé!',
  },
  {
    id: 'ko-5',
    hangeul: '안녕히 계세요',
    romanization: 'an-nyeong-hi gye-se-yo',
    meaningVi: 'Tạm biệt (chúc người ở lại bình an)',
    hanjaVi: 'Giai (Ở lại)',
    partOfSpeech: 'phrase',
    topic: 'greetings',
    level: 'TOPIK 1',
    exampleKo: '먼저 갈게요. 안녕히 계세요!',
    exampleVi: 'Tôi xin phép về trước. Ở lại mạnh khỏe nhé!',
  },
  {
    id: 'ko-6',
    hangeul: '이름',
    romanization: 'i-reum',
    meaningVi: 'Tên, danh tính',
    partOfSpeech: 'noun',
    topic: 'greetings',
    level: 'TOPIK 1',
    exampleKo: '이름이 무엇입니까?',
    exampleVi: 'Tên của bạn là gì?',
  },

  // --- CHỦ ĐỀ: SỐ ĐẾM & THỜI GIAN ---
  {
    id: 'ko-7',
    hangeul: '일, 이, 삼, 사, 오',
    romanization: 'il, i, sam, sa, o',
    meaningVi: '1, 2, 3, 4, 5 (Số Hán Hàn dùng tính tiền, số điện thoại, ngày tháng)',
    hanjaVi: 'Nhất, Nhị, Tam, Tứ, Ngũ (一, 二, 三, 四, 五)',
    partOfSpeech: 'number',
    topic: 'numbers',
    level: 'TOPIK 1',
    exampleKo: '삼 번 버스를 타세요.',
    exampleVi: 'Hãy đón xe buýt số 3 nhé.',
  },
  {
    id: 'ko-8',
    hangeul: '하나, 둘, 셋, 넷, 다섯',
    romanization: 'ha-na, dul, set, net, da-seot',
    meaningVi: '1, 2, 3, 4, 5 (Số Thuần Hàn dùng đếm đồ vật, đếm người, đếm giờ)',
    partOfSpeech: 'number',
    topic: 'numbers',
    level: 'TOPIK 1',
    exampleKo: '사과 두 개 주세요.',
    exampleVi: 'Cho tôi xin 2 quả táo nhé.',
  },
  {
    id: 'ko-9',
    hangeul: '오늘',
    romanization: 'o-neul',
    meaningVi: 'Hôm nay',
    partOfSpeech: 'noun',
    topic: 'numbers',
    level: 'TOPIK 1',
    exampleKo: '오늘 날씨가 정말 좋아요.',
    exampleVi: 'Thời tiết hôm nay thật sự rất đẹp.',
  },
  {
    id: 'ko-10',
    hangeul: '지금',
    romanization: 'ji-geum',
    meaningVi: 'Bây giờ, hiện tại',
    hanjaVi: 'Chỉ Kim (只今)',
    partOfSpeech: 'noun',
    topic: 'numbers',
    level: 'TOPIK 1',
    exampleKo: '지금 몇 시예요?',
    exampleVi: 'Bây giờ là mấy giờ rồi?',
  },

  // --- CHỦ ĐỀ: ẨM THỰC & NHÀ HÀNG ---
  {
    id: 'ko-11',
    hangeul: '밥',
    romanization: 'bap',
    meaningVi: 'Cơm, bữa ăn',
    partOfSpeech: 'noun',
    topic: 'food',
    level: 'TOPIK 1',
    exampleKo: '밥 먹었어요?',
    exampleVi: 'Bạn đã ăn cơm chưa? (câu hỏi thăm rất quen thuộc ở Hàn)',
  },
  {
    id: 'ko-12',
    hangeul: '물',
    romanization: 'mul',
    meaningVi: 'Nước uống',
    partOfSpeech: 'noun',
    topic: 'food',
    level: 'TOPIK 1',
    exampleKo: '물 좀 주세요.',
    exampleVi: 'Làm ơn cho tôi xin chút nước.',
  },
  {
    id: 'ko-13',
    hangeul: '김치',
    romanization: 'gim-chi',
    meaningVi: 'Kim chi (món dưa muối truyền thống)',
    partOfSpeech: 'noun',
    topic: 'food',
    level: 'TOPIK 1',
    exampleKo: '한국 김치는 아주 맛있어요.',
    exampleVi: 'Kim chi Hàn Quốc rất là ngon.',
  },
  {
    id: 'ko-14',
    hangeul: '식당',
    romanization: 'sik-dang',
    meaningVi: 'Nhà hàng, quán ăn',
    hanjaVi: 'Thực Đường (食堂)',
    partOfSpeech: 'noun',
    topic: 'food',
    level: 'TOPIK 1',
    exampleKo: '근처에 맛있는 식당이 있어요?',
    exampleVi: 'Gần đây có quán ăn nào ngon không?',
  },
  {
    id: 'ko-15',
    hangeul: '맛있다',
    romanization: 'ma-sit-da',
    meaningVi: 'Ngon, hợp khẩu vị',
    partOfSpeech: 'adjective',
    topic: 'food',
    level: 'TOPIK 1',
    exampleKo: '이 불고기가 정말 맛있어요!',
    exampleVi: 'Món thịt bò Bulgogi này ngon thật đấy!',
  },

  // --- CHỦ ĐỀ: GIA ĐÌNH & CON NGƯỜI ---
  {
    id: 'ko-16',
    hangeul: '가족',
    romanization: 'ga-jok',
    meaningVi: 'Gia đình',
    hanjaVi: 'Gia Tộc (家族)',
    partOfSpeech: 'noun',
    topic: 'family',
    level: 'TOPIK 1',
    exampleKo: '우리 가족은 네 명이에요.',
    exampleVi: 'Gia đình chúng tôi có bốn người.',
  },
  {
    id: 'ko-17',
    hangeul: '아버지',
    romanization: 'a-beo-ji',
    meaningVi: 'Bố, cha (gọi thân mật: 아빠 - Appa)',
    partOfSpeech: 'noun',
    topic: 'family',
    level: 'TOPIK 1',
    exampleKo: '아버지는 회사원입니다.',
    exampleVi: 'Bố tôi là nhân viên công ty.',
  },
  {
    id: 'ko-18',
    hangeul: '어머니',
    romanization: 'eo-meo-ni',
    meaningVi: 'Mẹ (gọi thân mật: 엄마 - Eomma)',
    partOfSpeech: 'noun',
    topic: 'family',
    level: 'TOPIK 1',
    exampleKo: '어머니는 요리를 잘하세요.',
    exampleVi: 'Mẹ tôi nấu ăn rất giỏi.',
  },
  {
    id: 'ko-19',
    hangeul: '친구',
    romanization: 'chin-gu',
    meaningVi: 'Bạn bè, bạn thân',
    hanjaVi: 'Thân Cựu (親舊)',
    partOfSpeech: 'noun',
    topic: 'family',
    level: 'TOPIK 1',
    exampleKo: '주말에 친구를 만나요.',
    exampleVi: 'Tôi gặp gỡ bạn bè vào cuối tuần.',
  },

  // --- CHỦ ĐỀ: TRƯỜNG HỌC & CÔNG VIỆC ---
  {
    id: 'ko-20',
    hangeul: '학생',
    romanization: 'hak-saeng',
    meaningVi: 'Học sinh, sinh viên',
    hanjaVi: 'Học Sinh (學生)',
    partOfSpeech: 'noun',
    topic: 'school_work',
    level: 'TOPIK 1',
    exampleKo: '저는 베트남 학생이에요.',
    exampleVi: 'Tôi là học sinh Việt Nam.',
  },
  {
    id: 'ko-21',
    hangeul: '선생님',
    romanization: 'seon-saeng-nim',
    meaningVi: 'Thầy giáo / Cô giáo (kính ngữ)',
    hanjaVi: 'Tiên Sinh (先生)',
    partOfSpeech: 'noun',
    topic: 'school_work',
    level: 'TOPIK 1',
    exampleKo: '선생님, 질문이 있습니다.',
    exampleVi: 'Thưa thầy/cô, em có một câu hỏi.',
  },
  {
    id: 'ko-22',
    hangeul: '회사',
    romanization: 'hoe-sa',
    meaningVi: 'Công ty, cơ quan làm việc',
    hanjaVi: 'Hội Xã (會社)',
    partOfSpeech: 'noun',
    topic: 'school_work',
    level: 'TOPIK 1',
    exampleKo: '매일 아침 회사에 가요.',
    exampleVi: 'Mỗi sáng tôi đều đến công ty làm việc.',
  },
  {
    id: 'ko-23',
    hangeul: '한국어',
    romanization: 'han-gu-geo',
    meaningVi: 'Tiếng Hàn Quốc',
    hanjaVi: 'Hàn Quốc Ngữ (韓國語)',
    partOfSpeech: 'noun',
    topic: 'school_work',
    level: 'TOPIK 1',
    exampleKo: '저는 한국어를 열심히 공부해요.',
    exampleVi: 'Tôi đang chăm chỉ học tiếng Hàn.',
  },

  // --- CHỦ ĐỀ: ĐỊA ĐIỂM & MUA SẮM ---
  {
    id: 'ko-24',
    hangeul: '돈',
    romanization: 'don',
    meaningVi: 'Tiền bạc',
    partOfSpeech: 'noun',
    topic: 'places',
    level: 'TOPIK 1',
    exampleKo: '돈이 얼마 있어요?',
    exampleVi: 'Bạn có bao nhiêu tiền?',
  },
  {
    id: 'ko-25',
    hangeul: '얼마예요?',
    romanization: 'eol-ma-ye-yo',
    meaningVi: 'Cái này bao nhiêu tiền ạ?',
    partOfSpeech: 'phrase',
    topic: 'places',
    level: 'TOPIK 1',
    exampleKo: '이 옷 얼마예요?',
    exampleVi: 'Bộ quần áo này giá bao nhiêu tiền vậy ạ?',
  },
  {
    id: 'ko-26',
    hangeul: '어디',
    romanization: 'eo-di',
    meaningVi: 'Ở đâu, chỗ nào',
    partOfSpeech: 'pronoun',
    topic: 'places',
    level: 'TOPIK 1',
    exampleKo: '화장실이 어디에 있어요?',
    exampleVi: 'Nhà vệ sinh ở đâu vậy ạ?',
  },
  {
    id: 'ko-27',
    hangeul: '화장실',
    romanization: 'hwa-jang-sil',
    meaningVi: 'Nhà vệ sinh, toilet',
    hanjaVi: 'Hóa Trang Thất (化粧室)',
    partOfSpeech: 'noun',
    topic: 'places',
    level: 'TOPIK 1',
    exampleKo: '화장실은 저쪽에 있습니다.',
    exampleVi: 'Nhà vệ sinh ở phía đằng kia kìa.',
  },

  // --- CHỦ ĐỀ: TÍNH TỪ & CẢM XÚC ---
  {
    id: 'ko-28',
    hangeul: '좋다',
    romanization: 'jo-ta',
    meaningVi: 'Tốt, thích',
    partOfSpeech: 'adjective',
    topic: 'feelings',
    level: 'TOPIK 1',
    exampleKo: '한국 드라마가 정말 좋아요.',
    exampleVi: 'Tôi thật sự rất thích phim truyền hình Hàn Quốc.',
  },
  {
    id: 'ko-29',
    hangeul: '예쁘다',
    romanization: 'ye-ppeu-da',
    meaningVi: 'Đẹp, xinh xắn',
    partOfSpeech: 'adjective',
    topic: 'feelings',
    level: 'TOPIK 1',
    exampleKo: '그 꽃이 참 예뻐요.',
    exampleVi: 'Bông hoa đó thật là xinh đẹp.',
  },
  {
    id: 'ko-30',
    hangeul: '재미있다',
    romanization: 'jae-mi-it-da',
    meaningVi: 'Thú vị, vui nhộn',
    hanjaVi: 'Tư Vị (滋味) + Có',
    partOfSpeech: 'adjective',
    topic: 'feelings',
    level: 'TOPIK 1',
    exampleKo: '한국어 공부가 재미있어요!',
    exampleVi: 'Học tiếng Hàn thú vị thật đấy!',
  },
];

// ==========================================
// 3. SỔ TAY NGỮ PHÁP SƠ CẤP (8 CHỦ ĐIỂM)
// ==========================================
export const KOREAN_GRAMMAR_LIST: KoreanGrammarPoint[] = [
  {
    id: 'g-1',
    title: 'Trật tự câu cơ bản: SOV (Chủ - Tân - Động)',
    koreanPattern: 'Chủ ngữ + Tân ngữ + Động từ',
    formula: '[S] + [O] + [V]',
    explanation: 'Khác với tiếng Việt (SVO: Tôi ăn cơm), tiếng Hàn luôn đặt động từ/vị ngữ ở CUỐI CÙNG của câu (SOV: Tôi cơm ăn).',
    tips: 'Quy tắc vàng: Luôn dịch động từ cuối câu trước, rồi dịch ngược lại phía trước.',
    examples: [
      { korean: '저는 사과를 먹어요.', vietnamese: 'Tôi ăn táo. (Theo nghĩa gốc: Tôi [S] + táo [O] + ăn [V])', breakdown: '저(Tôi) + 는(Trợ từ) + 사과(Táo) + 를(Trợ từ) + 먹어요(Ăn)' },
      { korean: '민수 씨는 책을 읽어요.', vietnamese: 'Bạn Min-su đọc sách.', breakdown: '민수 씨(Min-su) + 는 + 책(Sách) + 을 + 읽어요(Đọc)' },
    ],
  },
  {
    id: 'g-2',
    title: 'Trợ từ Chủ đề: 은 / 는',
    koreanPattern: 'Danh từ + 은 / 는',
    formula: 'Có patchim + 은 | Không patchim + 는',
    explanation: 'Gắn sau danh từ để biến danh từ đó thành "Chủ đề chính" đang được nhắc tới hoặc nhấn mạnh sự so sánh đối chiếu.',
    tips: 'Nếu danh từ kết thúc bằng phụ âm cuối (patchim) -> chọn 은 (để nối âm). Không có patchim -> chọn 는.',
    examples: [
      { korean: '저는 학생이에요.', vietnamese: 'Tôi là học sinh. (저 không có patchim -> 는)', breakdown: '저 + 는' },
      { korean: '선생님은 친절해요.', vietnamese: 'Thầy giáo thì rất thân thiện. (선생님 có patchim ㅁ -> 은)', breakdown: '선생님 + 은' },
    ],
  },
  {
    id: 'g-3',
    title: 'Trợ từ Chủ ngữ: 이 / 가',
    koreanPattern: 'Danh từ + 이 / 가',
    formula: 'Có patchim + 이 | Không patchim + 가',
    explanation: 'Gắn sau danh từ để xác định cụ thể danh từ đó là "Chủ ngữ" thực hiện hành động, thường dùng để trả lời câu hỏi "Ai? Cái gì?".',
    tips: 'Có patchim -> chọn 이. Không có patchim -> chọn 가.',
    examples: [
      { korean: '날씨가 좋아요.', vietnamese: 'Thời tiết đẹp. (날씨 không patchim -> 가)', breakdown: '날씨 + 가' },
      { korean: '시간이 없어요.', vietnamese: 'Tôi không có thời gian. (시간 có patchim ㄴ -> 이)', breakdown: '시간 + 이' },
    ],
  },
  {
    id: 'g-4',
    title: 'Trợ từ Tân ngữ: 을 / 를',
    koreanPattern: 'Danh từ + 을 / 를',
    formula: 'Có patchim + 을 | Không patchim + 를',
    explanation: 'Gắn sau danh từ để biểu thị danh từ đó là "Tân ngữ" trực tiếp chịu tác động của hành động.',
    tips: 'Có patchim -> chọn 을. Không có patchim -> chọn 를.',
    examples: [
      { korean: '커피를 마셔요.', vietnamese: 'Tôi uống cà phê. (커피 không patchim -> 를)', breakdown: '커피 + 를' },
      { korean: '한국어를 배워요.', vietnamese: 'Tôi học tiếng Hàn. (한국어 không patchim -> 를)', breakdown: '한국어 + 를' },
      { korean: '밥을 먹어요.', vietnamese: 'Tôi ăn cơm. (밥 có patchim ㅂ -> 을)', breakdown: '밥 + 을' },
    ],
  },
  {
    id: 'g-5',
    title: 'Trợ từ Thời gian & Nơi chốn: 에 / 에서',
    koreanPattern: 'Danh từ + 에 / 에서',
    formula: 'Nơi chốn/Thời gian + 에 (ở/vào lúc) | Nơi chốn + 에서 (tại nơi diễn ra hành động)',
    explanation: '• 에: Điểm đến (đến đâu: 가다/오다) hoặc thời điểm (vào lúc mấy giờ). • 에서: Nơi đang diễn ra hành động cụ thể (học ở đâu, ăn ở đâu).',
    tips: 'Nhớ nhanh: "Đi ĐẾN đâu dùng 에", "LÀM GÌ TẠI đâu dùng 에서".',
    examples: [
      { korean: '학교에 가요.', vietnamese: 'Tôi đi đến trường học.', breakdown: '학교(Trường) + 에(đến) + 가요(Đi)' },
      { korean: '식당에서 밥을 먹어요.', vietnamese: 'Tôi ăn cơm tại nhà hàng.', breakdown: '식당(Nhà hàng) + 에서(tại) + 밥을 먹어요(Ăn cơm)' },
    ],
  },
  {
    id: 'g-6',
    title: 'Đuôi câu thân mật lịch sự: -아요 / -어요 / -여요',
    koreanPattern: 'Thân động/tính từ + 아요/어요',
    formula: 'Nguyên âm cuối ㅏ, ㅗ -> + 아요 | Các nguyên âm còn lại -> + 어요 | Đuôi 하다 -> 해요',
    explanation: 'Đây là đuôi câu phổ biến nhất trong tiếng Hàn đời thường, dùng giao tiếp hàng ngày vừa thân thiện vừa tôn trọng người nghe.',
    tips: 'Cứ thấy 하다 là lập tức biến thành 해요 (ví dụ: 공부하다 -> 공부해요, 사랑하다 -> 사랑해요).',
    examples: [
      { korean: '가다 -> 가요', vietnamese: 'Đi (가 có nguyên âm ㅏ + 아요 -> 가요)', breakdown: '가 + 아요 = 가요' },
      { korean: '먹다 -> 먹어요', vietnamese: 'Ăn (먹 có nguyên âm ㅓ + 어요 -> 먹어요)', breakdown: '먹 + 어요 = 먹어요' },
      { korean: '공부하다 -> 공부해요', vietnamese: 'Học tập (하다 -> 해요)', breakdown: '공부하 + 여요 = 공부해요' },
    ],
  },
  {
    id: 'g-7',
    title: 'Đuôi câu trang trọng: -ㅂ니다 / -습니다',
    koreanPattern: 'Thân động/tính từ + ㅂ니다/습니다',
    formula: 'Không patchim + ㅂ니다 | Có patchim + 습니다',
    explanation: 'Dùng trong môi trường công sở, phỏng vấn, tin tức thời sự, hoặc khi lần đầu gặp người lớn tuổi để biểu lộ sự tôn kính tối đa.',
    tips: 'Câu hỏi tương ứng đổi đuôi 다 thành 까? (-ㅂ니까? / -습니까?).',
    examples: [
      { korean: '감사하다 -> 감사합니다', vietnamese: 'Xin cảm ơn (trang trọng)', breakdown: '감사하 + ㅂ니다' },
      { korean: '반갑다 -> 반갑습니다', vietnamese: 'Rất hân hạnh được gặp bạn', breakdown: '반갑 + 습니다' },
    ],
  },
  {
    id: 'g-8',
    title: 'Đuôi câu Mong Muốn: -고 싶다 (Muốn làm gì)',
    koreanPattern: 'Động từ bỏ 다 + 고 싶어요',
    formula: '[V] + -고 싶어요',
    explanation: 'Biểu thị ý muốn làm một việc gì đó của bản thân ("Tôi muốn..."). Cực kỳ dễ dùng vì không cần quan tâm có patchim hay không!',
    tips: 'Chỉ cần bỏ đuôi "다" của động từ rồi gắn trực tiếp "-고 싶어요" vào sau.',
    examples: [
      { korean: '한국에 가고 싶어요.', vietnamese: 'Tôi muốn đi Hàn Quốc.', breakdown: '가다(Đi) bỏ 다 + 고 싶어요' },
      { korean: '커피를 마시고 싶어요.', vietnamese: 'Tôi muốn uống cà phê.', breakdown: '마시다(Uống) bỏ 다 + 고 싶어요' },
    ],
  },
];

// ==========================================
// 4. MẪU CÂU HỘI THOẠI GIAO TIẾP SỐNG CÒN
// ==========================================
export const KOREAN_DIALOGUES: KoreanDialogueItem[] = [
  // --- CHÀO HỎI & LÀM QUEN ---
  {
    id: 'd-1',
    category: 'chao_hoi',
    korean: '만나서 반갑습니다.',
    romanization: 'man-na-seo ban-gap-seum-ni-da',
    vietnamese: 'Rất vui được gặp bạn.',
    situation: 'Khi chào hỏi, làm quen lần đầu',
  },
  {
    id: 'd-2',
    category: 'chao_hoi',
    korean: '저는 베트남 사람입니다.',
    romanization: 'jeo-neun be-teu-nam sa-ram-im-ni-da',
    vietnamese: 'Tôi là người Việt Nam.',
    situation: 'Giới thiệu quốc tịch',
  },
  {
    id: 'd-3',
    category: 'chao_hoi',
    korean: '잘 부탁드립니다.',
    romanization: 'jal bu-tak-deu-rim-ni-da',
    vietnamese: 'Rất mong nhận được sự giúp đỡ của bạn.',
    situation: 'Câu cửa miệng khi vào làm việc hoặc làm quen',
  },

  // --- GỌI MÓN QUÁN ĂN ---
  {
    id: 'd-4',
    category: 'nha_hang',
    korean: '여기요! 주문할게요.',
    romanization: 'yeo-gi-yo! ju-mun-hal-ge-yo',
    vietnamese: 'Em ơi / Bạn phục vụ ơi! Cho mình gọi món với.',
    situation: 'Gọi nhân viên phục vụ khi ở quán ăn Hàn',
  },
  {
    id: 'd-5',
    category: 'nha_hang',
    korean: '이거 하나 주세요.',
    romanization: 'i-geo ha-na ju-se-yo',
    vietnamese: 'Làm ơn cho tôi 1 phần món này nhé.',
    situation: 'Chỉ tay vào menu và gọi 1 món',
  },
  {
    id: 'd-6',
    category: 'nha_hang',
    korean: '덜 맵게 해 주세요.',
    romanization: 'deol maep-ge hae ju-se-yo',
    vietnamese: 'Làm bớt cay giùm tôi với ạ.',
    situation: 'Đồ ăn Hàn hay cay, dùng câu này để xin giảm cay',
  },
  {
    id: 'd-7',
    category: 'nha_hang',
    korean: '계산해 주세요.',
    romanization: 'gye-san-hae ju-se-yo',
    vietnamese: 'Làm ơn tính tiền cho tôi nhé.',
    situation: 'Khi dùng bữa xong và xin hóa đơn',
  },

  // --- MUA SẮM & TRẢ GIÁ ---
  {
    id: 'd-8',
    category: 'mua_sam',
    korean: '이거 얼마예요?',
    romanization: 'i-geo eol-ma-ye-yo',
    vietnamese: 'Cái này bao nhiêu tiền vậy ạ?',
    situation: 'Hỏi giá tiền món đồ',
  },
  {
    id: 'd-9',
    category: 'mua_sam',
    korean: '조금만 깎아 주세요.',
    romanization: 'jo-geum-man kka-kka ju-se-yo',
    vietnamese: 'Bớt cho tôi một chút được không ạ?',
    situation: 'Mặc cả, xin giảm giá ở chợ truyền thống',
  },
  {
    id: 'd-10',
    category: 'mua_sam',
    korean: '카드로 계산할 수 있어요?',
    romanization: 'ka-deu-ro gye-san-hal su it-eo-yo',
    vietnamese: 'Tôi có thể thanh toán bằng thẻ được không?',
    situation: 'Hỏi thanh toán thẻ hay tiền mặt',
  },

  // --- HỎI ĐƯỜNG & ĐI LẠI ---
  {
    id: 'd-11',
    category: 'di_lai',
    korean: '지하철역이 어디예요?',
    romanization: 'ji-ha-cheol-yeo-gi eo-di-ye-yo',
    vietnamese: 'Ga tàu điện ngầm ở đâu vậy ạ?',
    situation: 'Tìm đường đến ga tàu điện ngầm',
  },
  {
    id: 'd-12',
    category: 'di_lai',
    korean: '이 주소로 가 주세요.',
    romanization: 'i ju-so-ro ga ju-se-yo',
    vietnamese: 'Làm ơn chở tôi đến địa chỉ này với ạ.',
    situation: 'Đi taxi, đưa địa chỉ trên điện thoại cho tài xế',
  },

  // --- KHẨN CẤP & CẦN GIÚP ĐỠ ---
  {
    id: 'd-13',
    category: 'khan_cap',
    korean: '도와주세요!',
    romanization: 'do-wa-ju-se-yo',
    vietnamese: 'Hãy giúp tôi với!',
    situation: 'Cần sự giúp đỡ khẩn cấp',
  },
  {
    id: 'd-14',
    category: 'khan_cap',
    korean: '한국어를 잘 못해요.',
    romanization: 'han-gu-geo-reul jal mot-hae-yo',
    vietnamese: 'Tôi không giỏi tiếng Hàn lắm.',
    situation: 'Giải thích để người Hàn nói chậm lại',
  },
  {
    id: 'd-15',
    category: 'khan_cap',
    korean: '천천히 말씀해 주세요.',
    romanization: 'cheon-cheon-hi mal-sseum-hae ju-se-yo',
    vietnamese: 'Làm ơn nói chậm lại một chút giùm tôi ạ.',
    situation: 'Khi người bản xứ nói quá nhanh',
  },
];

/**
 * Hàm phát âm tiếng Hàn chuẩn dùng Web Speech API (ko-KR)
 */
export function speakKorean(text: string, rate: number = 0.85) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = rate; // Đọc tốc độ chậm rãi hơn một chút cho người mới dễ nghe
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Phát âm tiếng Hàn thất bại:', err);
  }
}
