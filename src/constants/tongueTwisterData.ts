export interface TongueTwisterItem {
  id: string;
  level: 'easy' | 'medium' | 'hard' | 'boss';
  levelNumber: number;
  levelName: string;
  levelColor: string;
  title: string;
  korean: string;
  romanization: string;
  vietnamese: string;
  trickyPhonetics: string;
  pronunciationTip: string;
  targetSounds: string[];
  rewardBadge: string;
}

export const TONGUE_TWISTERS: TongueTwisterItem[] = [
  {
    id: 'tt-soy-sauce',
    level: 'easy',
    levelNumber: 1,
    levelName: 'Cấp 1 - Làm Quen (Khởi Động)',
    levelColor: '#10b981',
    title: 'Xưởng Xì Dầu & Xưởng Tương Đậu (간장 공장)',
    korean: '간장 공장 공장장은 강 공장장이고, 된장 공장 공장장은 공 공장장이다.',
    romanization: 'Ganjang gongjang gongjangjangeun gang gongjangjang-igo, doenjang gongjang gongjangjangeun gong gongjangjang-ida.',
    vietnamese: 'Ông quản đốc xưởng xì dầu là ông quản đốc Kang, còn ông quản đốc xưởng tương đậu là ông quản đốc Kong.',
    trickyPhonetics: 'Luyện phụ âm đầu ㄱ / ㄷ và patchim ㅇ (ng) lặp đi lặp lại liên tục.',
    pronunciationTip: 'Mẹo: Giữ khẩu hình mở tròn âm [gong] và ngắt nhịp sau mỗi chữ "공장장". Tránh nhầm giữa họ Kang (강) và họ Kong (공).',
    targetSounds: ['ㄱ (g/k)', 'ㅇ (ng)', '장 (jang)'],
    rewardBadge: '🌱 Khẩu Hình Chuẩn',
  },
  {
    id: 'tt-giraffe',
    level: 'medium',
    levelNumber: 2,
    levelName: 'Cấp 2 - Thách Thức (Khẩu Hình Rộng)',
    levelColor: '#38bdf8',
    title: 'Bức Tranh Chú Hươu Cao Cổ (기린 그림)',
    korean: '내가 그린 기린 그림은 잘 그린 기린 그림이고, 네가 그린 기린 그림은 못 그린 기린 그림이다.',
    romanization: 'Naega geurin girin geurimeun jal geurin girin geurim-igo, nega geurin girin geurimeun mot geurin girin geurim-ida.',
    vietnamese: 'Bức tranh hươu cao cổ tôi vẽ là bức tranh hươu vẽ đẹp, còn bức tranh hươu cao cổ bạn vẽ là bức tranh hươu vẽ không đẹp.',
    trickyPhonetics: 'Âm [geu-rin] và [gi-rin] đảo qua đảo lại giữa nguyên âm ㅡ (eu - khép bẹt) và ㅣ (i - kéo mép).',
    pronunciationTip: 'Mẹo: Miệng chuyển đổi nhanh giữa cười mỉm [gi-rin] sang bẹt môi [geu-rin]. Đừng để bị líu thành [gi-rim]!',
    targetSounds: ['그린 (geurin)', '기린 (girin)', '그림 (geurim)'],
    rewardBadge: '🐇 Cơ Miệng Linh Hoạt',
  },
  {
    id: 'tt-police-bars',
    level: 'hard',
    levelNumber: 3,
    levelName: 'Cấp 3 - Chuyên Nghiệp (Âm Bật Hơi & Căng)',
    levelColor: '#f59e0b',
    title: 'Song Sắt Trụ Sở Cảnh Sát (경찰청 쇠창살)',
    korean: '경찰청 쇠창살 외철창살, 검찰청 쇠창살 쌍철창살.',
    romanization: 'Gyeongchalcheong soechangsal oecheolchangsal, geomchalcheong soechangsal ssangcheolchangsal.',
    vietnamese: 'Song sắt trụ sở cảnh sát là song sắt đơn, song sắt trụ sở viện kiểm sát là song sắt kép.',
    trickyPhonetics: 'Thử thách cực đại giữa âm bật hơi ㅊ (ch) và âm căng ㅆ (ssang-siot).',
    pronunciationTip: 'Mẹo: Bật hơi dứt khoát luồng gió ở [cheol-chang-sal], sau đó lập tức căng cứng cơ môi ở [ssang-cheol].',
    targetSounds: ['ㅊ (ch bật hơi)', 'ㅆ (ss căng)', '살 (sal)'],
    rewardBadge: '🔥 Bậc Thầy Bật Hơi',
  },
  {
    id: 'tt-acorn-jelly',
    level: 'medium',
    levelNumber: 2,
    levelName: 'Cấp 2 - Dẻo Lưỡi (Uốn Âm ㄹ)',
    levelColor: '#38bdf8',
    title: 'Món Thạch Hạt Sồi Khô (도토리묵)',
    korean: '도토리묵 도토리묵 말린 도토리묵, 껍질 깐 깐 도토리묵.',
    romanization: 'Dotorimuk dotorimuk mallin dotorimuk, kkeopjil kkan kkan dotorimuk.',
    vietnamese: 'Thạch hạt sồi, thạch hạt sồi khô, thạch hạt sồi đã bóc sạch vỏ.',
    trickyPhonetics: 'Luyện phụ âm kép ㄲ (kk) căng môi và âm uốn lưỡi ㄹ (r/l).',
    pronunciationTip: 'Mẹo: Chú ý âm [mallin] có nối âm kép ㄹ-ㄹ (đọc giống âm L tiếng Việt: man-lin ➔ mal-lin).',
    targetSounds: ['도토리 (dotori)', '말린 (mallin)', '깐 (kkan)'],
    rewardBadge: '🌰 Lưỡi Uốn Mượt Mà',
  },
  {
    id: 'tt-central-park',
    level: 'hard',
    levelNumber: 3,
    levelName: 'Cấp 3 - Âm Konglish (Tiếng Anh Phiên Hàn)',
    levelColor: '#f59e0b',
    title: 'Công Viên Trung Tâm New York (센트럴 파크)',
    korean: '뉴욕 센트럴 파크에서 초코칩 쿠키를 먹고 있는 척하는 사람.',
    romanization: 'Nyuyok senteureol pakeueseo chokochip kukireul meokgo inneun cheokaneun saram.',
    vietnamese: 'Người đang giả vờ ăn bánh quy sô-cô-la chip ở công viên trung tâm New York.',
    trickyPhonetics: 'Luyện các âm mượn tiếng Anh Konglish: ㅋ, ㅊ, ㅍ kết hợp quy tắc biến âm [meok-go ➔ meok-ko].',
    pronunciationTip: 'Mẹo: Bật hơi mạnh ở âm [pakeu] và [choko-chip], giữ nhịp điệu tự nhiên.',
    targetSounds: ['센트럴 (senteureol)', '초코칩 (chokochip)', '쿠키 (kuki)'],
    rewardBadge: '🗽 Phát Âm Chuẩn Seoul',
  },
  {
    id: 'tt-seoul-patent-boss',
    level: 'boss',
    levelNumber: 4,
    levelName: 'Cấp 4 - Trùm Cuối (Boss Đài Truyền Hình KBS)',
    levelColor: '#f43f5e',
    title: 'Trưởng Phòng Cấp Phép Sáng Chế Seoul (특허허가과)',
    korean: '서울특별시 특허허가과 허가과장 강허가과장, 특허청 특허허가과 허가과장 박허가과장.',
    romanization: 'Seoulteukbyeolsi teukheoheogagwa heogagwajang gangheogagwajang, teukheocheong teukheoheogagwa heogagwajang bakheogagwajang.',
    vietnamese: 'Trưởng phòng cấp phép cục cấp phép sáng chế Seoul là trưởng phòng Kang, còn trưởng phòng cục sáng chế là trưởng phòng Park.',
    trickyPhonetics: 'Bài tập sát hạch thực tế của phát thanh viên thời sự Hàn Quốc với cụm âm [heo-ga-gwa-jang] lặp lại 6 lần.',
    pronunciationTip: 'Mẹo: Đừng cố đọc nhanh ngay! Hãy đọc ngắt nhịp: [Seoul-teuk-byeol-si] / [teuk-heo-heo-ga-gwa] / [heo-ga-gwa-jang] / [Gang-heo-ga-gwa-jang].',
    targetSounds: ['특허 (teukheo)', '허가과 (heogagwa)', '과장 (gwajang)'],
    rewardBadge: '👑 HUY HIỆU PHÁT THANH VIÊN KBS',
  },
];
