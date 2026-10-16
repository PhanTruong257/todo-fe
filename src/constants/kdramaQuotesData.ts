export interface WordBreakdown {
  word: string;
  meaning: string;
  role?: string;
}

export interface KDramaQuoteItem {
  id: string;
  category: 'kpop' | 'kdrama';
  sourceTitle: string;
  artistOrActor: string;
  year?: string;
  badgeIcon: string;
  korean: string;
  romanization: string;
  vietnamese: string;
  emotionalContext: string;
  grammarTip: string;
  breakdown: WordBreakdown[];
  audioText?: string;
}

export const KDRAMA_QUOTES: KDramaQuoteItem[] = [
  // ==========================================
  // 1. K-POP HITS (LỜI BÀI HÁT ĐÌNH ĐÁM)
  // ==========================================
  {
    id: 'kpop-bts-spring-day',
    category: 'kpop',
    sourceTitle: '봄날 (Spring Day)',
    artistOrActor: 'BTS (방탄소년단)',
    year: '2017',
    badgeIcon: '🌸',
    korean: '보고 싶다. 이렇게 말하니까 더 보고 싶다.',
    romanization: 'Bogo sipda. Ireoke malhanikka deo bogo sipda.',
    vietnamese: 'Nhớ bạn quá... Càng nói ra thì lại càng thấy nhớ nhiều hơn.',
    emotionalContext: 'Câu hát mở đầu bất hủ của Spring Day diễn tả nỗi nhớ da diết một người bạn thân thiết trong mùa đông lạnh giá.',
    grammarTip: 'Cấu trúc đuôi câu mong muốn "-고 싶다" (muốn) kết hợp liên từ nguyên nhân "-(으)니까" (vì... nên).',
    breakdown: [
      { word: '보고 싶다', meaning: 'Nhớ, muốn gặp', role: 'Động từ + -고 싶다' },
      { word: '이렇게', meaning: 'Thế này, như thế này', role: 'Phó từ' },
      { word: '말하니까', meaning: 'Vì nói ra', role: '말하다 + -(으)니까' },
      { word: '더', meaning: 'Càng, nhiều hơn nữa', role: 'Phó từ so sánh' },
    ],
  },
  {
    id: 'kpop-blackpink-last',
    category: 'kpop',
    sourceTitle: '마지막처럼 (As If It\'s Your Last)',
    artistOrActor: 'BLACKPINK',
    year: '2017',
    badgeIcon: '🖤',
    korean: '마지막처럼 내일 따윈 없는 것처럼 사랑해줘.',
    romanization: 'Majimakcheoreom naeil ttawin eomneun geotcheoreom saranghaejwo.',
    vietnamese: 'Hãy yêu em như thể là lần cuối cùng, như thể chẳng còn có ngày mai.',
    emotionalContext: 'Giai điệu bùng nổ của BLACKPINK truyền cảm hứng sống và yêu hết mình, không chút do dự hay tiếc nuối.',
    grammarTip: 'Trợ từ so sánh "-처럼" (như thể, giống như) và đuôi câu nhờ vả tha thiết "-아/어 줘" (hãy làm gì đó cho em).',
    breakdown: [
      { word: '마지막', meaning: 'Lần cuối cùng', role: 'Danh từ' },
      { word: '-처럼', meaning: 'Như thể, giống như', role: 'Trợ từ so sánh' },
      { word: '내일', meaning: 'Ngày mai', role: 'Danh từ' },
      { word: '사랑해줘', meaning: 'Hãy yêu em', role: '사랑하다 + -아/어 줘' },
    ],
  },
  {
    id: 'kpop-newjeans-ditto',
    category: 'kpop',
    sourceTitle: 'Ditto',
    artistOrActor: 'NewJeans',
    year: '2022',
    badgeIcon: '💿',
    korean: '말해줘 say it back, oh, say it ditto.',
    romanization: 'Malhaejwo say it back, oh, say it ditto.',
    vietnamese: 'Hãy nói với mình đi, hãy đáp lại đi, nói rằng cậu cũng có cùng cảm xúc nhé.',
    emotionalContext: 'Bản hit hoài niệm mùa đông của NewJeans, thể hiện tâm trạng rung động ngọt ngào và mong muốn được người thương đồng điệu.',
    grammarTip: 'Động từ "말하다" (nói) chia dạng thân mật khẩn cầu "-아/어 줘" (hãy nói cho mình nghe đi).',
    breakdown: [
      { word: '말하다', meaning: 'Nói, trò chuyện', role: 'Động từ gốc' },
      { word: '말해줘', meaning: 'Hãy nói với mình', role: '말하다 + -아/어 줘' },
      { word: 'ditto', meaning: 'Mình cũng vậy / Đồng ý', role: 'Từ mượn tiếng Anh' },
    ],
  },
  {
    id: 'kpop-iu-through-night',
    category: 'kpop',
    sourceTitle: '밤편지 (Through the Night)',
    artistOrActor: 'IU (아이유)',
    year: '2017',
    badgeIcon: '🌙',
    korean: '이 밤 그날의 반딧불을 당신의 창 가까이 보낼게요.',
    romanization: 'I bam geunarui banditbureul dangsinui chang gakkai bonaelgeyo.',
    vietnamese: 'Đêm nay, em sẽ gửi ánh đom đóm của ngày hôm ấy đến bên ô cửa sổ của người.',
    emotionalContext: 'Bản tình ca acoustic dịu dàng của IU như một lá thư tình thì thầm chúc ngủ ngon người mình thương yêu nhất.',
    grammarTip: 'Đuôi câu hứa hẹn lịch sự "-(으)ㄹ게요" (tôi sẽ... - thể hiện lời hứa chân thành đối phương).',
    breakdown: [
      { word: '이 밤', meaning: 'Đêm nay', role: 'Định từ + Danh từ' },
      { word: '반딧불', meaning: 'Ánh đom đóm', role: 'Danh từ' },
      { word: '당신', meaning: 'Bạn, người ấy (thân thương)', role: 'Đại từ' },
      { word: '창 가까이', meaning: 'Gần ô cửa sổ', role: 'Danh từ + Phó từ' },
      { word: '보낼게요', meaning: 'Em sẽ gửi tới', role: '보내다 + -(으)ㄹ게요' },
    ],
  },
  {
    id: 'kpop-taeyeon-fine',
    category: 'kpop',
    sourceTitle: 'Fine',
    artistOrActor: 'Taeyeon (태연)',
    year: '2017',
    badgeIcon: '✨',
    korean: '나는 아니야. 쉽지 않을 것 같아.',
    romanization: 'Naneun aniya. Swipji aneul geot gata.',
    vietnamese: 'Em thì không ổn chút nào... Có lẽ quên anh sẽ chẳng hề dễ dàng đâu.',
    emotionalContext: 'Khúc cao trào đầy cảm xúc khi Taeyeon thừa nhận nỗi đau hậu chia tay, dù ngoài mặt luôn tỏ ra bản thân vẫn ổn.',
    grammarTip: 'Đuôi phỏng đoán tương lai "-(으)ㄹ 것 같다" (có vẻ như, dường như) kết hợp phủ định tính từ "-지 않다".',
    breakdown: [
      { word: '나는', meaning: 'Tôi thì, còn tôi', role: 'Đại từ + Trợ từ 은/는' },
      { word: '아니야', meaning: 'Không phải đâu', role: 'Động từ 아니다' },
      { word: '쉽다', meaning: 'Dễ dàng', role: 'Tính từ gốc' },
      { word: '쉽지 않다', meaning: 'Không dễ dàng', role: 'Phủ định -지 않다' },
      { word: '것 같다', meaning: 'Có vẻ như là...', role: 'Cấu trúc phỏng đoán' },
    ],
  },
  {
    id: 'kpop-ive-love-dive',
    category: 'kpop',
    sourceTitle: 'LOVE DIVE',
    artistOrActor: 'IVE',
    year: '2022',
    badgeIcon: '💘',
    korean: '망설일 시간은 3초면 돼.',
    romanization: 'Mangseoril siganeun samchomyeon dwae.',
    vietnamese: 'Thời gian để đắn đo chỉ cần 3 giây thôi là đủ rồi.',
    emotionalContext: 'Tuyên ngôn tình yêu tự tin và táo bạo của thế hệ Gen Z: dám bước vào tình yêu mà không ngần ngại.',
    grammarTip: 'Cấu trúc điều kiện "-(으)면 되다" (chỉ cần... là được/đủ) cực kỳ thông dụng trong giao tiếp hàng ngày.',
    breakdown: [
      { word: '망설이다', meaning: 'Do dự, đắn đo', role: 'Động từ' },
      { word: '시간', meaning: 'Thời gian', role: 'Danh từ' },
      { word: '3초', meaning: '3 giây', role: 'Số Hán-Hàn + 초' },
      { word: '-면 돼', meaning: 'Chỉ cần... là đủ', role: '-(으)면 되다' },
    ],
  },

  // ==========================================
  // 2. K-DRAMA CLASSICS (LỜI THOẠI PHIM KINH ĐIỂN)
  // ==========================================
  {
    id: 'kdrama-queen-of-tears',
    category: 'kdrama',
    sourceTitle: 'Queen of Tears (Nữ Hoàng Nước Mắt)',
    artistOrActor: 'Kim Soo Hyun & Kim Ji Won',
    year: '2024',
    badgeIcon: '👑',
    korean: '내가 옆에 있을게. 무슨 일이 있어도.',
    romanization: 'Naega yeope isseulge. Museun iri isseodo.',
    vietnamese: 'Anh sẽ luôn ở bên cạnh em. Cho dù có bất kỳ chuyện gì xảy ra đi chăng nữa.',
    emotionalContext: 'Lời hứa cảm động của Baek Hyun-woo dành cho Hong Hae-in giữa những giông bão thử thách hôn nhân và căn bệnh nan y.',
    grammarTip: 'Cấu trúc nhượng bộ "-(아/어)도" (dù... đi nữa) và đuôi hứa hẹn "-(으)ㄹ게" (anh sẽ...).',
    breakdown: [
      { word: '내가', meaning: 'Anh, tôi (chủ ngữ)', role: 'Đại từ 나 + -가' },
      { word: '옆에', meaning: 'Ở bên cạnh', role: 'Danh từ vị trí + -에' },
      { word: '있을게', meaning: 'Anh sẽ ở đây', role: '있다 + -(으)ㄹ게' },
      { word: '무슨 일', meaning: 'Bất cứ chuyện gì', role: 'Định từ + Danh từ' },
      { word: '있어도', meaning: 'Dù có xảy ra', role: '있다 + -아/어도' },
    ],
  },
  {
    id: 'kdrama-crash-landing',
    category: 'kdrama',
    sourceTitle: 'Crash Landing on You (Hạ Cánh Nơi Anh)',
    artistOrActor: 'Hyun Bin & Son Ye Jin',
    year: '2020',
    badgeIcon: '🪂',
    korean: '바람은 지나가려고 부는 거지, 머물려고 부는 게 아니야.',
    romanization: 'Barameun jinagaryeogo buneun geoji, meomullyeogo buneun ge aniya.',
    vietnamese: 'Gió thổi là để đi qua, chứ không phải để ở lại đâu.',
    emotionalContext: 'Lời triết lý sâu sắc của đại úy Ri Jeong-hyeok nhắc nhở Yoon Se-ri rằng mọi nghịch cảnh và nỗi buồn rồi cũng sẽ qua đi.',
    grammarTip: 'Cấu trúc chỉ mục đích "-(으)려고" (để, có ý định) và câu khẳng định "-는 거지" / phủ định "게 아니야".',
    breakdown: [
      { word: '바람', meaning: 'Cơn gió', role: 'Danh từ' },
      { word: '지나가다', meaning: 'Đi qua, thổi qua', role: 'Động từ' },
      { word: '-(으)려고', meaning: 'Để làm gì đó', role: 'Ngữ pháp mục đích' },
      { word: '불다', meaning: 'Thổi (gió)', role: 'Động từ' },
      { word: '머물다', meaning: 'Dừng lại, lưu lại', role: 'Động từ' },
    ],
  },
  {
    id: 'kdrama-goblin',
    category: 'kdrama',
    sourceTitle: 'Goblin (Yêu Tinh)',
    artistOrActor: 'Gong Yoo & Kim Go Eun',
    year: '2016',
    badgeIcon: '🗡️',
    korean: '너와 함께한 시간 모두 눈부셨다. 날이 좋아서, 날이 좋지 않아서, 모든 날이 좋았다.',
    romanization: 'Neowa hamkkehan sigan modu nunbusyeotta. Nari joaseo, nari joji anaseo, modeun nari joatta.',
    vietnamese: 'Khoảng thời gian ở bên em, tất cả đều thật rực rỡ. Vì ngày đẹp trời, vì ngày thời tiết không tốt, mọi ngày đều thật tuyệt vời.',
    emotionalContext: 'Bức thư độc thoại kinh điển của chàng Yêu Tinh 939 tuổi trước khi tan biến vào cõi hư vô, để lại dư âm bất hủ trong lòng khán giả.',
    grammarTip: 'Cấu trúc chỉ nguyên nhân lý do "-아서/어서" (bởi vì) và quá khứ của tính từ "-았/었다".',
    breakdown: [
      { word: '너와 함께', meaning: 'Cùng với em', role: 'Đại từ + Trợ từ 와' },
      { word: '시간', meaning: 'Khoảng thời gian', role: 'Danh từ' },
      { word: '눈부시다', meaning: 'Chói lóa, rực rỡ', role: 'Tính từ gốc' },
      { word: '날이 좋아서', meaning: 'Vì ngày đẹp trời', role: '좋다 + -아서' },
      { word: '모든 날', meaning: 'Mọi ngày, tất cả các ngày', role: 'Định từ + Danh từ' },
    ],
  },
  {
    id: 'kdrama-reply-1988',
    category: 'kdrama',
    sourceTitle: 'Reply 1988 (Lời Hồi Đáp 1988)',
    artistOrActor: 'Hyeri & Ryu Jun Yeol',
    year: '2015',
    badgeIcon: '📻',
    korean: '어쩌면 가족이 가장 모른다. 하지만 아는 게 뭐가 중요할까.',
    romanization: 'Eojjeomyeon gajogi gajang moreunda. Hajiman aneun ge mwoga jungyohalkka.',
    vietnamese: 'Có lẽ người trong gia đình lại là người ít thấu hiểu ta nhất. Nhưng hiểu hay không, liệu có còn quan trọng...',
    emotionalContext: 'Lời tự sự đẫm nước mắt về tình cảm gia đình xóm Ssangmun-dong: Dù có lúc không hiểu hết tâm tư của nhau, tình thân vẫn là chỗ dựa vững chắc nhất.',
    grammarTip: 'Phó từ ướm chừng "어쩌면" (có lẽ), so sánh nhất "가장" (nhất) và liên từ đối lập "하지만" (nhưng).',
    breakdown: [
      { word: '어쩌면', meaning: 'Có lẽ, có khi', role: 'Phó từ' },
      { word: '가족', meaning: 'Gia đình', role: 'Danh từ gốc Hán' },
      { word: '가장', meaning: 'Nhất (bậc nhất)', role: 'Phó từ' },
      { word: '모르다', meaning: 'Không biết, không hiểu', role: 'Động từ' },
      { word: '중요하다', meaning: 'Quan trọng', role: 'Tính từ' },
    ],
  },
  {
    id: 'kdrama-descendants-sun',
    category: 'kdrama',
    sourceTitle: 'Descendants of the Sun (Hậu Duệ Mặt Trời)',
    artistOrActor: 'Song Joong Ki & Song Hye Kyo',
    year: '2016',
    badgeIcon: '☀️',
    korean: '사과할까요, 고백할까요?',
    romanization: 'Sagwahalkkayo, gobaekhalkkayo?',
    vietnamese: 'Tôi nên xin lỗi, hay là nên tỏ tình với em đây?',
    emotionalContext: 'Câu thoại tán tỉnh nổi tiếng bậc nhất màn ảnh nhỏ Hàn Quốc của đại úy Yoo Shi-jin dưới đêm trăng Uruk.',
    grammarTip: 'Đuôi câu hỏi ý kiến đối phương "-(으)ㄹ까요?" (tôi nên làm gì đây? / chúng ta cùng làm nhé?).',
    breakdown: [
      { word: '사과하다', meaning: 'Xin lỗi (Tạ Quá)', role: 'Động từ gốc Hán' },
      { word: '고백하다', meaning: 'Tỏ tình, bộc bạch (Cáo Bạch)', role: 'Động từ gốc Hán' },
      { word: '-(으)ㄹ까요?', meaning: 'Nên... hay là...?', role: 'Đuôi câu hỏi ý kiến' },
    ],
  },
  {
    id: 'kdrama-itaewon-class',
    category: 'kdrama',
    sourceTitle: 'Itaewon Class (Tầng Lớp Itaewon)',
    artistOrActor: 'Park Seo Joon',
    year: '2020',
    badgeIcon: '🔥',
    korean: '내 가치를 네가 정하지 마. 내 인생 이제 시작이야.',
    romanization: 'Nae gachireul nega jeonghaji ma. Nae insaeng ije sijagiya.',
    vietnamese: 'Giá trị của tôi, cậu không có quyền định đoạt. Cuộc đời tôi giờ mới chỉ bắt đầu thôi.',
    emotionalContext: 'Tuyên ngôn đanh thép của Park Sae-ro-yi khi kiên định đi theo lý tưởng sống của chính mình, truyền lửa vượt khó cho giới trẻ.',
    grammarTip: 'Đuôi câu mệnh lệnh cấm đoán thân mật "-지 마" (đừng làm gì đó) và đuôi nhận định "-이야" (là...).',
    breakdown: [
      { word: '가치', meaning: 'Giá trị', role: 'Danh từ gốc Hán' },
      { word: '정하다', meaning: 'Quyết định, định đoạt', role: 'Động từ' },
      { word: '-지 마', meaning: 'Đừng (cấm đoán)', role: 'Ngữ pháp mệnh lệnh' },
      { word: '인생', meaning: 'Cuộc đời (Nhân Sinh)', role: 'Danh từ gốc Hán' },
      { word: '이제', meaning: 'Bây giờ, từ giờ', role: 'Phó từ' },
      { word: '시작', meaning: 'Bắt đầu (Khởi đầu)', role: 'Danh từ' },
    ],
  },
];
