import type { StudyAdviceItem } from '../types/korean';

export const STUDY_ADVICE_LIST: StudyAdviceItem[] = [
  // 1. TÂM LÝ & ĐỘNG LỰC HỌC (MINDSET & HABITS)
  {
    id: 'mindset-15min-habit',
    category: 'mindset',
    categoryLabel: 'Tâm Lý & Động Lực',
    icon: '⏳',
    title: 'Quy Tắc 15 Phút Vàng (Consistent > Intense)',
    shortSnippet: 'Đều đặn 15 phút mỗi ngày hiệu quả gấp 10 lần học dồn 3 tiếng cuối tuần.',
    proverbKo: '천 리 길도 한 걸음부터',
    proverbVi: 'Đường ngàn dặm bắt đầu từ một bước chân đầu tiên',
    audioText: '천 리 길도 한 걸음부터',
    coreAdvice:
      'Đừng cố ép mình học 3 tiếng dồn vào chủ nhật rồi kiệt sức và bỏ cuộc cả tuần sau. Não bộ củng cố synap thần kinh mạnh nhất trong giấc ngủ sau những kích thích nhẹ nhàng hàng ngày. Chỉ 15 phút đều đặn mỗi ngày, sau 1 tháng bạn đã tích lũy hơn 7.5 tiếng học chất lượng cao mà không hề thấy mệt mỏi.',
    actionItem:
      'Chọn 1 khung giờ cố định trong ngày (ngay sau khi thức dậy hoặc sau bữa tối), mở TaskFlow lật 8 thẻ từ vựng hoặc học 1 bài chữ cái.',
    badge: 'Thói quen vàng',
  },
  {
    id: 'mindset-embrace-forgetting',
    category: 'mindset',
    categoryLabel: 'Tâm Lý & Động Lực',
    icon: '🧠',
    title: 'Quên Là Cơ Chế Sinh Học Tự Nhiên – Đừng Tự Trách Mình!',
    shortSnippet: 'Quên không phải vì bạn kém, mà là não bộ đang sàng lọc thông tin.',
    proverbKo: '시작이 반이다',
    proverbVi: 'Bắt đầu là đã hoàn thành được một nửa chặng đường',
    audioText: '시작이 반이다',
    coreAdvice:
      'Đường cong lãng quên của Ebbinghaus chứng minh não người sẽ quên 70% thông tin mới sau 24h nếu không ôn lại. Khi bạn quên một từ vựng, hãy vui vẻ đón nhận. Thuật toán Spaced Repetition (SRS) trong TaskFlow sẽ nhắc lại đúng khoảnh khắc từ đó sắp phai mờ. Chính lần "vực dậy" đó sẽ neo từ vựng vào trí nhớ dài hạn vĩnh viễn.',
    actionItem:
      'Mạnh dạn bấm "Again/Quên" khi không nhớ thẻ flashcard mà không cảm thấy thất vọng. Mỗi lần quên và gặp lại là một lần khắc sâu hơn.',
    badge: 'Khoa học trí nhớ',
  },
  {
    id: 'mindset-dont-fear-mistakes',
    category: 'mindset',
    categoryLabel: 'Tâm Lý & Động Lực',
    icon: '🗣️',
    title: 'Đừng Sợ Nói Sai: Người Bản Xứ Rất Trân Trọng Bạn!',
    shortSnippet: 'Mục tiêu giao tiếp là trao đổi cảm xúc và suy nghĩ, không phải thi hoa hậu ngữ pháp.',
    proverbKo: '실패는 성공의 어머니',
    proverbVi: 'Thất bại là mẹ của thành công',
    audioText: '실패는 성공의 어머니',
    coreAdvice:
      'Người Hàn Quốc cực kỳ cảm kích và thấy đáng yêu khi người nước ngoài cố gắng mở lời bằng tiếng Hàn, dù phát âm chưa chuẩn hay trợ từ bị lộn xộn. Ngoài đời thực không có giám khảo cầm bút chấm điểm bạn. Người dám nói 10 câu sai sẽ tiến bộ nhanh gấp 5 lần người biết 100 câu nhưng giấu trong lòng.',
    actionItem:
      'Mở tab "Hội Thoại Nhập Vai 🎭", bật mic lên và nói to theo từng câu thoại. Đừng ngại đọc sai, hãy tận hưởng việc nói!',
    badge: 'Phá vỡ rào cản',
  },
  {
    id: 'mindset-celebrate-micro-wins',
    category: 'mindset',
    categoryLabel: 'Tâm Lý & Động Lực',
    icon: '🔥',
    title: 'Nuôi Dưỡng Động Lực: Ghi Nhận Từng Tiến Bộ Nhỏ',
    shortSnippet: 'Tự hào ngay cả khi bạn vừa nhận ra 1 chữ cái trên biển hiệu hay bài hát.',
    proverbKo: '티끌 모아 태산',
    proverbVi: 'Tích tiểu thành đại (Gom từng hạt cát thành núi Thái Sơn)',
    audioText: '티끌 모아 태산',
    coreAdvice:
      'Đừng đợi đến khi thi đỗ TOPIK hay nói như người Seoul mới cho phép mình vui mừng. Cảm giác bạn vừa tự đọc được chữ "커피" (Coffee) hay hiểu nghĩa của "감사합니다" chính là một chiến thắng vẻ vang. Não bộ nghiện cảm giác thành công này và sẽ tiết dopamine thôi thúc bạn học tiếp ngày mai.',
    actionItem:
      'Duy trì chuỗi ngọn lửa Streak 🔥 trên thanh Header. Khi đạt mốc 3 ngày, 7 ngày, hãy tự thưởng cho mình một cốc trà sữa hoặc bài hát K-Pop yêu thích.',
    badge: 'Nuôi dưỡng động lực',
  },

  // 2. BẢNG CHỮ CÁI & PHÁT ÂM (HANGEUL & PRONUNCIATION)
  {
    id: 'pronun-vietnamese-advantage',
    category: 'pronunciation',
    categoryLabel: 'Chữ Cái & Phát Âm',
    icon: '🇻🇳',
    title: 'Lợi Thế Vàng Của Người Việt Khi Học Patchim',
    shortSnippet: '7 âm phụ âm cuối tiếng Hàn tương đồng 95% với vần tiếng Việt.',
    proverbKo: '아는 것이 힘이다',
    proverbVi: 'Hiểu biết và tri thức chính là sức mạnh',
    audioText: '아는 것이 힘이다',
    coreAdvice:
      'Người phương Tây mất cả tháng trời để khép khẩu hình phụ âm cuối, nhưng người Việt chúng ta có sẵn bản năng âm tiết: ㄱ tương đương -c (như bắp cúc), ㄷ tương đương -t (như mắt ớt), ㅂ tương đương -p (như kẹp cơm), ㅁ là -m, ㄴ là -n, ㅇ là -ng. Hãy tận dụng vốn tiếng mẹ đẻ để đọc chuẩn xác ngay từ bài học đầu tiên.',
    actionItem:
      'Khi gặp từ có patchim, hãy nhẩm liên tưởng đến đuôi vần tiếng Việt tương ứng: 밥 (bắp), 국 (cúc), 산 (san), 김 (kim).',
    badge: 'Lợi thế người Việt',
  },
  {
    id: 'pronun-quit-romaja',
    category: 'pronunciation',
    categoryLabel: 'Chữ Cái & Phát Âm',
    icon: '👁️',
    title: 'Cai Romaja (Phiên Âm Latin) Càng Sớm Càng Tốt',
    shortSnippet: 'Romaja là "chiếc nạng gỗ" khiến não bạn lười đọc hình khối Hangeul.',
    proverbKo: '백문이 불여일견',
    proverbVi: 'Trăm nghe không bằng một lần tận mắt thấy',
    audioText: '백문이 불여일견',
    coreAdvice:
      'Romaja như "gimbap", "annyeonghaseyo" chỉ có tác dụng hỗ trợ trong 24 giờ đầu tiên. Nếu phụ thuộc vào nó, mắt bạn sẽ tự động lướt qua hàng chữ Latin thay vì nhìn vào hình khối Hangeul. Điều này khiến phản xạ nhận diện chữ của bạn bị kìm hãm nghiêm trọng và phát âm bị lai giọng phương Tây.',
    actionItem:
      'Bấm nút [👁️ Hiện/Ẩn Phiên Âm] để ẩn toàn bộ Romaja Latin. Hãy để đôi mắt quen nhìn thẳng vào hình khối chữ Hangeul.',
    badge: 'Đột phá nhận diện',
  },
  {
    id: 'pronun-vowel-geometry',
    category: 'pronunciation',
    categoryLabel: 'Chữ Cái & Phát Âm',
    icon: '📐',
    title: 'Mẹo Khẩu Hình Học: Nét Đứng Đứng Cạnh, Nét Ngang Nằm Dưới',
    shortSnippet: 'Quy luật hình học của Vua Sejong giúp bạn không bao giờ xếp nhầm vị trí chữ.',
    proverbKo: '호랑이에게 물려가도 정신만 차리면 산다',
    proverbVi: 'Dù gặp khó khăn đến đâu, chỉ cần giữ bình tĩnh là sẽ vượt qua',
    audioText: '호랑이에게 물려가도 정신만 차리면 산다',
    coreAdvice:
      'Hangeul là bảng chữ cái duy nhất được thiết kế theo triết lý Âm Dương Ngũ Hành và khẩu hình học: Nguyên âm có nét chính thẳng đứng dài (ㅏ, ㅓ, ㅣ, ㅐ, ㅔ) tượng trưng cho Con người đứng thẳng, LUÔN đứng bên phải phụ âm. Nguyên âm có nét ngang dài (ㅗ, ㅜ, ㅡ) tượng trưng cho Mặt đất, LUÔN nằm bên dưới phụ âm.',
    actionItem:
      'Vào tab "Ghép Vần Khối 🧩" trong Bảng Chữ Cái, thử ghép âm đầu + nguyên âm ngang/dọc để thấy khối chữ tự co giãn tuyệt đẹp.',
    badge: 'Mẹo hình học',
  },
  {
    id: 'pronun-tissue-paper-test',
    category: 'pronunciation',
    categoryLabel: 'Chữ Cái & Phát Âm',
    icon: '🧻',
    title: 'Thử Thách Tờ Giấy Ăn: Phân Biệt Âm Thường, Bật Hơi & Âm Căng',
    shortSnippet: 'Mẹo vật lý kiểm tra luồng khí giúp phân biệt hoàn hảo ㅂ - ㅍ - ㅃ.',
    proverbKo: '고생 끝에 낙이 온다',
    proverbVi: 'Khổ tận cam lai (Hết gian nan khổ cực thì niềm vui ắt tới)',
    audioText: '고생 끝에 낙이 온다',
    coreAdvice:
      'Cầm một mẩu giấy ăn mỏng cách miệng 5cm: Khi phát âm âm thường (ㅂ, ㄷ, ㄱ), tờ giấy hơi lay nhẹ. Khi phát âm âm bật hơi (ㅍ, ㅌ, ㅋ), đẩy luồng khí thật mạnh từ lồng ngực làm tờ giấy bay ngang. Khi phát âm âm căng (ㅃ, ㄸ, ㄲ), nén chặt thanh quản rồi bật dứt khoát không để lọt khí, tờ giấy hoàn toàn đứng yên!',
    actionItem:
      'Mở tab "Cặp Âm Tối Thiểu 🎯" trong Hangeul, bật loa nghe thử bộ ba 불 (lửa) - 풀 (cỏ) - 뿔 (sừng) và làm thử nghiệm với tờ giấy.',
    badge: 'Mẹo vật lý',
  },

  // 3. TỪ VỰNG & GỐC HÁN-HÀN (VOCABULARY HACKS)
  {
    id: 'vocab-hanja-goldmine',
    category: 'vocab',
    categoryLabel: 'Gốc Hán & Từ Vựng',
    icon: '🌳',
    title: 'Mỏ Vàng Gốc Hán-Hàn: "Học 1 Biết 10" Từ Siêu Tốc',
    shortSnippet: 'Hơn 60% từ vựng tiếng Hàn là gốc Hán, chia sẻ cùng cội nguồn Hán-Việt.',
    proverbKo: '일석이조',
    proverbVi: 'Một mũi tên trúng hai đích (Nhất cử lưỡng tiện)',
    audioText: '일석이조',
    coreAdvice:
      'Người Việt có siêu năng lực học từ vựng tiếng Hàn nhờ kho từ Hán-Việt khổng lồ. Chỉ cần học 1 gốc "학" (Học), bạn tự động suy luận ra hàng chục từ ghép: 학생 (Học sinh), 학교 (Học hiệu/Trường học), 학자 (Học giả), 학비 (Học phí), 유학 (Du học). Nắm chắc 15 gốc Hán cốt lõi là bạn đã mở khóa hơn 200 từ vựng TOPIK!',
    actionItem:
      'Mở tab "Gốc Hán-Hàn 🌳" trong mục Từ Vựng TOPIK 1, xem sơ đồ cây phả hệ và chơi thử Mini-Game ghép 2 gốc chữ sinh từ mới.',
    badge: 'Lợi thế tiếng Việt',
  },
  {
    id: 'vocab-active-recall-technique',
    category: 'vocab',
    categoryLabel: 'Gốc Hán & Từ Vựng',
    icon: '⚡',
    title: 'Active Recall: Ép Não "Vắt Óc" Trước Khi Lật Thẻ',
    shortSnippet: 'Đừng nhìn lướt qua rồi tự nhủ "mình biết từ này rồi" – hãy tự thử thách!',
    proverbKo: '노력은 배신하지 않는다',
    proverbVi: 'Mọi nỗ lực chân thành không bao giờ phản bội bạn',
    audioText: '노력은 배신하지 않는다',
    coreAdvice:
      'Đọc thụ động là kẻ thù số 1 của trí nhớ. Khi nhìn thấy mặt chữ Hàn, ĐỪNG vội lật thẻ ngay. Hãy dừng lại 3 giây, ép não bộ lục lọi ký ức để tìm nghĩa và phát âm. Chính cảm giác hơi "vất vả" trong 3 giây đó là lúc các nơ-ron thần kinh đang dày đặc liên kết với nhau.',
    actionItem:
      'Sử dụng 4 đáp án trắc nghiệm khách quan trên mặt trước Flashcard của TaskFlow để kiểm tra trí nhớ trước khi lật thẻ.',
    badge: 'Kỹ thuật não bộ',
  },
  {
    id: 'vocab-learn-in-chunks',
    category: 'vocab',
    categoryLabel: 'Gốc Hán & Từ Vựng',
    icon: '🧩',
    title: 'Học Cụm Cố Định (Collocations) Thay Vì Học Từ Đơn Lập',
    shortSnippet: 'Học cả cụm "커피를 마셔요" thay vì chỉ học mỗi chữ "커피".',
    proverbKo: '우물 안 개구리',
    proverbVi: 'Ếch ngồi đáy giếng (Đừng nhìn từ vựng một cách cô lập)',
    audioText: '우물 안 개구리',
    coreAdvice:
      'Khi nói, não bạn không có thời gian để lục từ điển: từ A + trợ từ B + động từ C. Hãy nạp sẵn nguyên cả cụm: 약을 먹어요 (Uống thuốc - người Hàn dùng động từ Ăn thuốc), 사진을 찍어요 (Chụp ảnh), 버스를 타요 (Đi xe bus). Khi cần phản xạ, cả cụm sẽ bật ra tự nhiên như một phản xạ có điều kiện.',
    actionItem:
      'Luôn đọc to câu ví dụ mẫu và cụm động từ đi kèm trong mỗi thẻ bài học của Lộ Trình 30 Ngày.',
    badge: 'Nói tự nhiên',
  },
  {
    id: 'vocab-24h-golden-rule',
    category: 'vocab',
    categoryLabel: 'Gốc Hán & Từ Vựng',
    icon: '⏰',
    title: 'Quy Tắc 24 Giờ Vàng: Ôn Ngay Trước Khi Ký Ức Xóa Sổ',
    shortSnippet: 'Lướt lại 8 từ của hôm qua chỉ mất 60 giây nhưng cứu được 100% công sức đã học.',
    proverbKo: '쇠뿔도 단김에 빼라',
    proverbVi: 'Rèn sắt khi còn đang nóng (Hành động ngay lúc còn nhiệt huyết)',
    audioText: '쇠뿔도 단김에 빼라',
    coreAdvice:
      'Nếu không kích hoạt lại trong 24h đầu tiên, 70% từ mới sẽ biến mất và bạn sẽ phải học lại từ đầu như người mới. Nhưng nếu bạn lướt qua chúng dù chỉ 1 phút trong ngày kế tiếp, não sẽ đánh dấu "À, thông tin này quan trọng!" và chuyển thẳng vào ngăn lưu trữ dài hạn.',
    actionItem:
      'Mỗi ngày trước khi bắt đầu bài học mới, hãy bấm vào thẻ "Xem lại bài hôm qua" để lướt nhanh 8 từ của ngày hôm trước.',
    badge: 'Chống trôi kiến thức',
  },

  // 4. NGỮ PHÁP & PHẢN XẠ NÓI (GRAMMAR & FLUENCY)
  {
    id: 'grammar-sov-mindset',
    category: 'grammar',
    categoryLabel: 'Ngữ Pháp & Phản Xạ',
    icon: '🔄',
    title: 'Tư Duy Ngược SOV: Động Từ Luôn Đứng Cuối Cùng!',
    shortSnippet: 'Tiếng Việt: "Tôi ăn cơm" ➔ Tiếng Hàn: "Tôi Cơm Ăn".',
    proverbKo: '급할수록 돌아가라',
    proverbVi: 'Càng vội vàng càng phải đi đường vòng (Chậm mà chắc chắn)',
    audioText: '급할수록 돌아가라',
    coreAdvice:
      'Người Việt có thói quen vừa nghĩ vừa nói động từ ngay sau chủ ngữ. Trong tiếng Hàn, động từ luôn là thành phần chốt hạ ở cuối câu. Bạn phải gom hết: Ai (Chủ ngữ) + Khi nào (Thời gian) + Ở đâu (Địa điểm) + Cái gì (Tân ngữ) rồi cuối cùng mới đưa ra Động từ. Hãy rèn thói quen hoàn thiện các thành phần phụ trước khi kết câu bằng động từ!',
    actionItem:
      'Thực hành 3 câu trong tab "Lắp Ráp Câu SOV 🧩" để não quen với phản xạ trật tự câu đảo ngược.',
    badge: 'Tư duy SOV',
  },
  {
    id: 'grammar-particle-hack',
    category: 'grammar',
    categoryLabel: 'Ngữ Pháp & Phản Xạ',
    icon: '🎯',
    title: 'Bí Kíp Trợ Từ: -은/는 (Chủ Đề) vs -이/가 (Nhấn Mạnh)',
    shortSnippet: 'Nỗi sợ lớn nhất của người mới học tiếng Hàn được giải mã cực dễ hiểu.',
    proverbKo: '돌다리도 두들겨 보고 건너라',
    proverbVi: 'Cầu đá dẫu vững cũng gõ thử rồi mới bước (Cẩn trọng từng tiểu tiết)',
    audioText: '돌다리도 두들겨 보고 건너라',
    coreAdvice:
      'Rất đơn giản: Dùng -은/는 khi muốn giới thiệu chủ đề chung chung hoặc so sánh đối chiếu ("Tôi thì thích táo, còn bạn thì sao?"). Dùng -이/가 khi muốn trả lời câu hỏi "AI LÀ NGƯỜI LÀM VIỆC ĐÓ?" ("Chính tôi là người ăn, không phải ai khác!"), hoặc khi thông báo một sự việc bất ngờ vừa đập vào mắt ("Mưa rơi kìa! - 비가 와요").',
    actionItem:
      'Vào "Sổ Tay Ngữ Pháp" bài Trợ Từ Nền Tảng, làm thử bài tập điền khuyết tự động chấm để nắm chắc 100%.',
    badge: 'Gỡ rối ngữ pháp',
  },
  {
    id: 'grammar-shadowing-secret',
    category: 'grammar',
    categoryLabel: 'Ngữ Pháp & Phản Xạ',
    icon: '🎧',
    title: 'Kỹ Thuật Shadowing: Đọc Đuổi Cùng Lúc Với Người Bản Xứ',
    shortSnippet: 'Phương pháp hiệu quả của các thông dịch viên để rèn luyện ngữ điệu tự nhiên.',
    proverbKo: '원숭이도 나무에서 떨어진다',
    proverbVi: 'Khỉ giỏi leo trèo cũng có lúc sẩy chân (Đừng sợ phát âm chưa chuẩn, hãy cứ luyện tập)',
    audioText: '원숭이도 나무에서 떨어진다',
    coreAdvice:
      'Bật phát âm giọng đọc bản xứ và đọc đuổi theo cùng một lúc, với độ trễ chỉ khoảng 0.5 giây. Không cần nhìn chữ, chỉ cần bắt chước ngữ điệu, hơi thở và điểm ngắt câu. Khẩu hình và cơ miệng của bạn sẽ hình thành phản xạ cơ bắp (muscle memory), giúp ngữ điệu nói tự nhiên và trôi chảy hơn.',
    actionItem:
      'Trong phần "Hội Thoại Tình Huống", bấm nghe từng câu của người bản xứ và nhại theo 3 lần liên tiếp trước khi bấm câu tiếp theo.',
    badge: 'Phản xạ bản xứ',
  },
  {
    id: 'grammar-daily-selftalk',
    category: 'grammar',
    categoryLabel: 'Ngữ Pháp & Phản Xạ',
    icon: '💬',
    title: 'Tự Độc Thoại Bằng Tiếng Hàn: Biến Phòng Ngủ Thành Seoul',
    shortSnippet: 'Miêu tả những hành động thường ngày bằng những câu tiếng Hàn đơn giản nhất.',
    proverbKo: '뜻이 있는 곳에 길이 있다',
    proverbVi: 'Nơi nào có ý chí và quyết tâm, nơi đó sẽ mở ra con đường',
    audioText: '뜻이 있는 곳에 길이 있다',
    coreAdvice:
      'Bạn không cần phải sang Hàn Quốc hay thuê gia sư đắt tiền để luyện nói. Mỗi khi ở một mình: Uống nước nhẩm "물 마셔요", dọn phòng nhẩm "청소해요", trời nắng nhẩm "날씨가 더워요". Khi biến tiếng Hàn thành tiếng nói nội tâm hàng ngày, phản xạ ngôn ngữ của bạn sẽ tăng vọt mà không hề tốn kém.',
    actionItem:
      'Hôm nay hãy chọn ra 3 hành động quen thuộc và nói to thành câu tiếng Hàn đơn giản đuôi -아요/어요.',
    badge: 'Độc thoại tự nhiên',
  },
];
