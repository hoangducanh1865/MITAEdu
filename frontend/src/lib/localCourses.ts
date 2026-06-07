// Dữ liệu khoá học local (không cần backend)
// Các file PDF được serve từ /public/courses/...

export interface LocalLesson {
  id: string;
  title: string;
  videoUrl?: string;
  pdfUrl?: string;            // File đề
  handwrittenPdfUrl?: string; // File viết tay
  content?: { level: string; text: string }[]; // Nội dung lộ trình
  // ── Media bảo mật (lưu trên Viettel Cloud Object Storage) ──
  // Chỉ là id tham chiếu; URL thật do backend ký presigned khi xem.
  videoMediaId?: string;
  pdfMediaId?: string;
  handwrittenMediaId?: string;
}

export interface LocalSession {
  id: string;
  title: string;
  lessons: LocalLesson[];
}

export interface LocalCourse {
  id: string;           // slug dạng string, ví dụ "hhkg-2k9"
  name: string;
  category: "TSA" | "HSA" | "THPT";
  teacher?: string;
  thumbnailGradient?: string;
  thumbnailLabel?: string;
  description?: string;
  sessions: LocalSession[];
}

export const LOCAL_COURSES: LocalCourse[] = [
  // ── TSA ────────────────────────────────────────────
  {
    id: "hhkg-2k9",
    name: "Khoá Nền Tảng HHKG 2K9",
    category: "TSA",
    teacher: "Hoàng Đức Anh",
    thumbnailGradient: "linear-gradient(135deg,#b71c1c,#880e4f)",
    thumbnailLabel: "NỀN TẢNG\nHHKG",
    description:
      "Khoá học nền tảng Hình học không gian dành cho học sinh 2K9, bao gồm tài liệu PDF và video bài giảng chi tiết.",
    sessions: [
      {
        id: "buoi6",
        title: "Buổi 6 - Tỉ lệ thể tích của hình chóp tứ giác có đáy là hình bình hành - Tỉ lệ thể tích của khối lăng trụ",
        lessons: [
          {
            id: "buoi6-de",
            title: "File đề - Buổi 6",
            pdfUrl: "/courses/hhkg-2k9/buoi6-de.pdf",
          },
          {
            id: "buoi6-viet-tay",
            title: "Bản viết tay - Buổi 6",
            handwrittenPdfUrl: "/courses/hhkg-2k9/buoi6-viet-tay.pdf",
          },
          {
            id: "buoi6-video",
            title: "Video bài giảng",
            videoUrl: "https://www.youtube.com/watch?v=OXTBiczG-6k",
          },
        ],
      },
    ],
  },

  // ── HSA ────────────────────────────────────────────
  {
    id: "toan-vact-hsa",
    name: "Lộ Trình Toán VACT – ĐHQG HCM",
    category: "HSA",
    teacher: "Giáo viên MITA",
    thumbnailGradient: "linear-gradient(135deg,#1565c0,#0d47a1)",
    thumbnailLabel: "TOÁN\nVACT",
    description:
      "Lộ trình học Toán đầy đủ cho kỳ thi Đánh giá Năng lực ĐHQG TP.HCM – 59 bài chia theo 3 khối lớp, từ nền tảng đến nâng cao.",
    sessions: [
      {
        id: "lop12",
        title: "📘 Lớp 12 — Bài 1 đến Bài 30",
        lessons: [
          {
            id: "b1",
            title: "Bài 1 · Tính đơn điệu & Cực trị hàm số",
            videoMediaId: "toan-vact-hsa-b1-video",
            pdfMediaId: "toan-vact-hsa-b1-pdf",
            handwrittenMediaId: "toan-vact-hsa-b1-handwritten",
            content: [
              { level: "Cơ bản", text: "Dạng 1. Xét tính đơn điệu, cực trị của hàm số cho bởi công thức (bậc 3, phân thức hữu tỉ)." },
              { level: "Cơ bản", text: "Dạng 2. Xét tính đơn điệu, tìm cực trị dựa vào BBT và đồ thị cho sẵn." },
            ],
          },
          {
            id: "b2",
            title: "Bài 2 · Tính đơn điệu & Cực trị hàm số",
            content: [
              { level: "VD/VDC", text: "Dạng 3. Tìm tham số m để hàm số đơn điệu trên toàn tập xác định." },
              { level: "VD/VDC", text: "Dạng 4. Tìm tham số m để hàm số đơn điệu trên khoảng con của ℝ." },
            ],
          },
          {
            id: "b3",
            title: "Bài 3 · Giá trị lớn nhất – Giá trị nhỏ nhất",
            content: [
              { level: "Cơ bản", text: "Dạng 1. Tìm GTLN và GTNN dựa vào BBT và đồ thị." },
              { level: "Cơ bản", text: "Dạng 2. Tìm GTLN và GTNN của hàm số trên đoạn [a; b]." },
              { level: "Cơ bản", text: "Dạng 3. GTLN, GTNN trên khoảng (a;b), nửa khoảng (a;b]; [a;b)." },
              { level: "Cơ bản", text: "Dạng 4. Ứng dụng GTLN, GTNN vào bài toán thực tế cơ bản." },
            ],
          },
          {
            id: "b4",
            title: "Bài 4 · Đường tiệm cận đồ thị hàm số",
            content: [
              { level: "Cơ bản", text: "Dạng 1. Tiệm cận ngang & đứng của hàm phân thức hữu tỉ." },
              { level: "Cơ bản", text: "Dạng 2. Tiệm cận của hàm vô tỉ." },
              { level: "Cơ bản", text: "Dạng 3. Bài toán tiệm cận có chứa tham số." },
              { level: "Cơ bản", text: "Dạng 4. Xác định tiệm cận dựa vào đồ thị hoặc BBT." },
            ],
          },
          {
            id: "b5",
            title: "Bài 5 · Khảo sát & Vẽ đồ thị hàm số",
            content: [
              { level: "Cơ bản", text: "Dạng 1. Hàm số bậc ba y = ax³+bx²+cx+d và các bài toán liên quan đến đồ thị." },
            ],
          },
          {
            id: "b6",
            title: "Bài 6 · Khảo sát & Vẽ đồ thị hàm số",
            content: [
              { level: "Cơ bản", text: "Dạng 2. Hàm phân thức hữu tỉ y=(ax+b)/(cx+d) và bài toán liên quan." },
              { level: "Cơ bản", text: "Dạng 3. Nhận dạng đồ thị hàm bậc 3, phân thức hữu tỉ từ hình vẽ hoặc BBT." },
              { level: "Cơ bản", text: "Dạng 4. Hàm số hữu tỉ bậc 2 trên bậc 1 và bài toán liên quan." },
            ],
          },
          {
            id: "b7",
            title: "Bài 7 · Toán thực tế – Hàm số",
            content: [
              { level: "Cơ bản", text: "Lý thuyết và bài tập cơ bản làm quen toán thực tế (lợi nhuận, chi phí, tốc độ…)." },
            ],
          },
          {
            id: "b8",
            title: "Bài 8 · Véctơ & Phép toán trong không gian",
            content: [
              { level: "Cơ bản", text: "Dạng 1. Chứng minh đẳng thức véctơ trong không gian." },
              { level: "VD/VDC", text: "Dạng 2. Phân tích véctơ theo các véctơ cơ sở; tính độ dài đoạn thẳng, c/m thẳng hàng, song song." },
            ],
          },
          {
            id: "b9",
            title: "Bài 9 · Véctơ & Phép toán trong không gian",
            content: [
              { level: "Cơ bản", text: "Dạng 3. Góc giữa hai véctơ. Tích vô hướng của hai véctơ." },
              { level: "Cơ bản", text: "Dạng 4. Toán thực tế liên quan đến véctơ (lực, vận tốc, công)." },
            ],
          },
          {
            id: "b10",
            title: "Bài 10 · Tọa độ véctơ & Phép toán trong KG",
            content: [
              { level: "Cơ bản", text: "Dạng 1. Tọa độ phép toán véctơ; tọa độ điểm trong không gian Oxyz." },
            ],
          },
          {
            id: "b11",
            title: "Bài 11 · Tọa độ véctơ & Phép toán trong KG",
            content: [
              { level: "Cơ bản", text: "Dạng 2. Tìm tọa độ điểm đặc biệt trong tam giác: trực tâm, tâm nội/ngoại tiếp, chân đường cao, chân phân giác." },
            ],
          },
          {
            id: "b12",
            title: "Bài 12 · Tọa độ véctơ & Phép toán trong KG",
            content: [
              { level: "Cơ bản", text: "Dạng 3. Tích vô hướng và ứng dụng (góc, chiều dài, chiếu)." },
            ],
          },
          {
            id: "b13",
            title: "Bài 13 · Tọa độ véctơ & Phép toán trong KG",
            content: [
              { level: "VD/VDC", text: "Dạng 4. Tâm tỉ cự – Tìm điểm chia đoạn theo tỉ số k." },
            ],
          },
          {
            id: "b14",
            title: "Bài 14 · Phương trình mặt phẳng",
            content: [
              { level: "Cơ bản", text: "Dạng 1. Viết PTMP khi biết VTPT và điểm thuộc mp; 3 điểm không thẳng hàng; song song/vuông góc." },
            ],
          },
          {
            id: "b15",
            title: "Bài 15 · Phương trình mặt phẳng",
            content: [
              { level: "VD/VDC", text: "Dạng 2. Viết PTMP liên quan đến khoảng cách d(M, mp) = k." },
              { level: "VD/VDC", text: "Dạng 3. Viết PTMP liên quan đến góc giữa hai mặt phẳng." },
            ],
          },
          {
            id: "b16",
            title: "Bài 16 · Phương trình mặt phẳng",
            content: [
              { level: "Cơ bản", text: "Dạng 4. Ứng dụng tọa độ hóa để giải hình học không gian (phương pháp tọa độ)." },
            ],
          },
          {
            id: "b17",
            title: "Bài 17 · Phương trình đường thẳng trong KG",
            content: [
              { level: "Cơ bản", text: "Dạng 1. Viết PTĐT dạng tham số và dạng chính tắc." },
            ],
          },
          {
            id: "b18",
            title: "Bài 18 · Phương trình đường thẳng trong KG",
            content: [
              { level: "Cơ bản", text: "Dạng 2. Vị trí tương đối giữa hai đường thẳng (song song, cắt nhau, chéo nhau)." },
              { level: "VD/VDC", text: "Dạng 3. Lập PTĐT liên quan đến góc tạo với mp và khoảng cách đến điểm/mp." },
            ],
          },
          {
            id: "b19",
            title: "Bài 19 · Phương trình đường thẳng trong KG",
            content: [
              { level: "Cơ bản", text: "Dạng 4. Tìm hình chiếu vuông góc của điểm lên đường thẳng/mp; điểm đối xứng." },
            ],
          },
          {
            id: "b20",
            title: "Bài 20 · Phương trình đường thẳng trong KG",
            content: [
              { level: "VD/VDC", text: "Dạng 5. Bài toán cực trị trong không gian – Tâm tỉ cự nâng cao." },
            ],
          },
          {
            id: "b21",
            title: "Bài 21 · Phương trình mặt cầu",
            content: [
              { level: "Cơ bản", text: "Xác định tâm I, bán kính R từ phương trình mặt cầu. Viết PTMC khi biết tâm-bán kính, đường kính, qua 4 điểm." },
            ],
          },
          {
            id: "b22",
            title: "Bài 22 · Phương trình mặt cầu",
            content: [
              { level: "Cơ bản", text: "Vị trí tương đối mặt cầu với mặt phẳng (cắt, tiếp xúc, không giao) và với đường thẳng." },
            ],
          },
          {
            id: "b23",
            title: "Bài 23 · Nguyên hàm",
            content: [
              { level: "Cơ bản", text: "Dạng 1. Tính nguyên hàm bằng định nghĩa – các công thức cơ bản (lũy thừa, mũ, loga, lượng giác)." },
              { level: "Cơ bản", text: "Dạng 2. Nguyên hàm bằng phương pháp đổi biến số / tích phân từng phần." },
            ],
          },
          {
            id: "b24",
            title: "Bài 24 · Nguyên hàm",
            content: [
              { level: "Cơ bản", text: "Dạng 3. Nguyên hàm của hàm phân thức hữu tỉ (tách phân thức)." },
              { level: "Cơ bản", text: "Dạng 4. Nguyên hàm của hàm số lượng giác (hạ bậc, công thức nhân đôi)." },
              { level: "Cơ bản", text: "Dạng 5. Nguyên hàm của hàm mũ và logarit." },
            ],
          },
          {
            id: "b25",
            title: "Bài 25 · Tích phân",
            content: [
              { level: "Cơ bản", text: "Dạng 1. Áp dụng tính chất cơ bản của tích phân (tuyến tính, đổi cận, phân tích)." },
              { level: "Cơ bản", text: "Dạng 2. Tích phân hàm luỹ thừa." },
              { level: "Cơ bản", text: "Dạng 3. Tích phân hàm phân thức hữu tỉ." },
              { level: "Cơ bản", text: "Dạng 4. Tích phân hàm lượng giác." },
              { level: "Cơ bản", text: "Dạng 5. Tích phân hàm số mũ." },
              { level: "Cơ bản", text: "Dạng 6. Tích phân hàm có trị tuyệt đối |f(x)|." },
              { level: "Cơ bản", text: "Tính diện tích hình phẳng giới hạn bởi đồ thị hàm số và trục hoành." },
            ],
          },
          {
            id: "b26",
            title: "Bài 26 · Tích phân – Nâng cao",
            content: [
              { level: "VD/VDC", text: "Toán thực tế – Ứng dụng tích phân trong bài toán chuyển động: quãng đường, vận tốc." },
              { level: "VD/VDC", text: "Toán thực tế – Diện tích hình phẳng nâng cao (2 đồ thị cắt nhau, tham số)." },
            ],
          },
          {
            id: "b27",
            title: "Bài 27 · Ứng dụng tích phân – Thể tích",
            content: [
              { level: "Cơ bản", text: "Dạng 1. Tính thể tích vật thể tròn xoay dựa vào định nghĩa." },
              { level: "Cơ bản", text: "Dạng 2. Tính thể tích khối tròn xoay quanh trục Ox hoặc Oy." },
            ],
          },
          {
            id: "b28",
            title: "Bài 28 · Ứng dụng tích phân – Thể tích nâng cao",
            content: [
              { level: "VD/VDC", text: "Toán thực tế – Tích phân tính thể tích nâng cao (thùng chứa, bình, vật thể đặc biệt)." },
              { level: "VD/VDC", text: "Toán thực tế – Bài toán tốc độ dâng nước." },
            ],
          },
          {
            id: "b29",
            title: "Bài 29 · Số đặc trưng – Mẫu số liệu ghép nhóm",
            content: [
              { level: "Cơ bản", text: "Tính khoảng biến thiên, tứ phân vị Q₁/Q₂/Q₃, phương sai s², độ lệch chuẩn s cho mẫu ghép nhóm." },
            ],
          },
          {
            id: "b30",
            title: "Bài 30 · Xác suất có điều kiện & Công thức Bayes",
            content: [
              { level: "Cơ bản", text: "Dạng 1. Tính P(A|B) bằng công thức: P(A|B) = P(A∩B)/P(B)." },
              { level: "Cơ bản", text: "Dạng 2. Tính xác suất có điều kiện bằng sơ đồ cây." },
              { level: "Cơ bản", text: "Công thức xác suất toàn phần P(B) = ΣP(Aᵢ)·P(B|Aᵢ); công thức Bayes P(Aᵢ|B)." },
            ],
          },
        ],
      },
      {
        id: "lop11",
        title: "📗 Lớp 11 — Bài 31 đến Bài 45",
        lessons: [
          {
            id: "b31",
            title: "Bài 31 · Lượng giác",
            content: [
              { level: "Cơ bản", text: "Ôn tập công thức lượng giác: cung liên kết, công thức cộng, nhân đôi, hạ bậc – Hiểu về vòng tròn lượng giác." },
              { level: "Cơ bản", text: "Tìm tập xác định của hàm số lượng giác; xét tính chẵn lẻ; tính tuần hoàn." },
            ],
          },
          {
            id: "b32",
            title: "Bài 32 · Lượng giác – Nâng cao",
            content: [
              { level: "Cơ bản", text: "Tìm GTLN và GTNN của hàm số lượng giác (biến đổi về dạng sin/cos chuẩn)." },
              { level: "VD/VDC", text: "Giải phương trình lượng giác cơ bản; PT LG có chứa tham số (nghiệm tổng quát)." },
            ],
          },
          {
            id: "b33",
            title: "Bài 33 · Cấp số cộng – Cấp số nhân",
            content: [
              { level: "Cơ bản", text: "Ôn tập toàn bộ: định nghĩa, số hạng tổng quát uₙ, tổng n số hạng đầu Sₙ – Cả CSC và CSN." },
            ],
          },
          {
            id: "b34",
            title: "Bài 34 · Cấp số cộng – Cấp số nhân – Thực tế",
            content: [
              { level: "Cơ bản", text: "Toán thực tế – Ứng dụng CSC/CSN: tiền gửi lãi kép, lãi đơn, trả góp đều." },
            ],
          },
          {
            id: "b35",
            title: "Bài 35 · Giới hạn dãy số",
            content: [
              { level: "VD/VDC", text: "Giới hạn dãy số – Các dạng vô định: ∞/∞, ∞−∞, 1^∞; kỹ thuật chia bậc cao nhất." },
            ],
          },
          {
            id: "b36",
            title: "Bài 36 · Giới hạn hàm số & Liên tục",
            content: [
              { level: "VD/VDC", text: "Giới hạn hàm số – Các dạng 0/0, ∞/∞, ∞−∞; giới hạn một phía; giới hạn vô cực." },
              { level: "VD/VDC", text: "Hàm số liên tục tại điểm, trên khoảng – Định lý Bolzano (chứng minh phương trình có nghiệm)." },
            ],
          },
          {
            id: "b37",
            title: "Bài 37 · Đạo hàm & Phương trình tiếp tuyến",
            content: [
              { level: "Cơ bản", text: "Ôn tập công thức đạo hàm – Đạo hàm hàm hợp [f(g(x))]' = f'(g(x))·g'(x)." },
              { level: "Cơ bản", text: "Phương trình tiếp tuyến tại điểm M(x₀, y₀); tiếp tuyến có hệ số góc k cho trước." },
            ],
          },
          {
            id: "b38",
            title: "Bài 38 · Hình học KG – Góc đường thẳng & mặt phẳng",
            content: [
              { level: "Cơ bản", text: "Góc giữa đường thẳng và mặt phẳng." },
            ],
          },
          {
            id: "b39",
            title: "Bài 39 · Hình học KG – Góc hai mặt phẳng",
            content: [
              { level: "Cơ bản", text: "Góc giữa hai mặt phẳng (góc nhị diện)." },
            ],
          },
          {
            id: "b40",
            title: "Bài 40 · Hình học KG – Khoảng cách điểm–mp",
            content: [
              { level: "Cơ bản", text: "Khoảng cách từ một điểm đến một mặt phẳng." },
            ],
          },
          {
            id: "b41",
            title: "Bài 41 · Hình học KG – Khoảng cách hai đường chéo nhau",
            content: [
              { level: "Cơ bản", text: "Khoảng cách giữa hai đường thẳng chéo nhau." },
            ],
          },
          {
            id: "b42",
            title: "Bài 42 · Thể tích hình chóp & Lăng trụ",
            content: [
              { level: "Cơ bản", text: "Thể tích hình chóp V=⅓·S·h; Thể tích hình lăng trụ V=S·h." },
            ],
          },
          {
            id: "b43",
            title: "Bài 43 · Tỉ lệ thể tích hình chóp & Lăng trụ",
            content: [
              { level: "Cơ bản", text: "Tỉ lệ thể tích hình chóp tam giác và tứ giác." },
            ],
          },
          {
            id: "b44",
            title: "Bài 44 · Hàm số mũ & Logarit",
            content: [
              { level: "Cơ bản", text: "Logarit: định nghĩa logₐb, tính chất (đổi cơ số, tích, thương, lũy thừa) – Bài toán tính toán cơ bản." },
            ],
          },
          {
            id: "b45",
            title: "Bài 45 · Phương trình & Bất phương trình mũ/log",
            content: [
              { level: "Cơ bản", text: "Phương trình và bất phương trình mũ, logarit – Đưa về cùng cơ số hoặc đặt ẩn phụ." },
            ],
          },
        ],
      },
      {
        id: "lop10",
        title: "📕 Lớp 10 — Bài 46 đến Bài 59",
        lessons: [
          {
            id: "b46",
            title: "Bài 46 · Mệnh đề & Tập hợp",
            content: [
              { level: "Cơ bản", text: "Mệnh đề." },
              { level: "Cơ bản", text: "Tập hợp và các phép toán trên tập hợp." },
            ],
          },
          {
            id: "b47",
            title: "Bài 47 · Hệ thức lượng trong tam giác",
            content: [
              { level: "Cơ bản", text: "Giá trị lượng giác của góc từ 0° đến 180°." },
              { level: "Cơ bản", text: "Hệ thức lượng trong tam giác: định lý sin, định lý cos, công thức diện tích S=½absinC." },
            ],
          },
          {
            id: "b48",
            title: "Bài 48 · Véctơ & Hàm số bậc 2",
            content: [
              { level: "Cơ bản", text: "Các phép toán cơ bản của véctơ." },
              { level: "Cơ bản", text: "Tích vô hướng a⃗·b⃗ = |a⃗||b⃗|cosθ và ứng dụng." },
              { level: "Cơ bản", text: "Hàm số bậc 2 y=ax²+bx+c: đỉnh, trục đối xứng, bảng biến thiên, đồ thị parabol." },
            ],
          },
          {
            id: "b49",
            title: "Bài 49 · Tam thức bậc hai",
            content: [
              { level: "Cơ bản", text: "Dấu của tam thức bậc hai ax²+bx+c." },
            ],
          },
          {
            id: "b50",
            title: "Bài 50 · Phương trình quy về bậc hai",
            content: [
              { level: "Cơ bản", text: "Phương trình quy về phương trình bậc hai: đặt ẩn phụ t, bậc 4 trùng phương, PT chứa căn." },
            ],
          },
          {
            id: "b51",
            title: "Bài 51 · Đại số tổ hợp – Quy tắc đếm",
            content: [
              { level: "VD/VDC", text: "Các quy tắc đếm: Quy tắc cộng (lựa chọn), Quy tắc nhân (kết hợp) – Phân biệt và áp dụng đúng." },
            ],
          },
          {
            id: "b52",
            title: "Bài 52 · Hoán vị – Chỉnh hợp – Tổ hợp",
            content: [
              { level: "Cơ bản", text: "Hoán vị Pₙ=n!; Chỉnh hợp A(n,k)=n!/(n−k)!; Tổ hợp C(n,k)=n!/(k!(n−k)!) – Phân biệt chỉnh hợp và tổ hợp." },
            ],
          },
          {
            id: "b53",
            title: "Bài 53 · Nhị thức Newton",
            content: [
              { level: "Cơ bản", text: "Khai triển nhị thức Newton (a+b)ⁿ – Tìm hệ số của số hạng chứa xᵐ (số hạng tổng quát T_{k+1})." },
            ],
          },
          {
            id: "b54",
            title: "Bài 54 · Nhị thức Newton – Nâng cao",
            content: [
              { level: "VD/VDC", text: "Tính tổng, giá trị biểu thức, rút gọn, chứng minh đẳng thức tổ hợp (dùng khai triển nhị thức)." },
            ],
          },
          {
            id: "b55",
            title: "Bài 55 · Tổ hợp – Lập số",
            content: [
              { level: "VD/VDC", text: "Tổ hợp liên quan đến lập số." },
            ],
          },
          {
            id: "b56",
            title: "Bài 56 · Tổ hợp – Hình học",
            content: [
              { level: "VD/VDC", text: "Tổ hợp liên quan đến hình học." },
            ],
          },
          {
            id: "b57",
            title: "Bài 57 · Bài toán vách ngăn",
            content: [
              { level: "Cơ bản", text: "Bài toán vách ngăn (chia n vật giống nhau vào k hộp phân biệt) – Bài toán chia kẹo Euler: C(n+k−1, k−1)." },
            ],
          },
          {
            id: "b58",
            title: "Bài 58 · Xác suất – Định nghĩa cổ điển",
            content: [
              { level: "Cơ bản", text: "Biến cố và định nghĩa xác suất cổ điển." },
            ],
          },
          {
            id: "b59_60",
            title: "Bài 59-60 · Xác suất – Ôn tập tổng hợp",
            content: [
              { level: "Cơ bản", text: "Ôn tập và luyện tập tổng hợp các dạng bài xác suất cổ điển." },
            ],
          },
        ],
      },
    ],
  },
];

/** Tìm khoá học local theo id */
export function findLocalCourse(id: string): LocalCourse | undefined {
  return LOCAL_COURSES.find((c) => c.id === id);
}
