-- V13: Full idempotent seed for HSA course (covers cases where V11 failed)
-- Uses PostgreSQL ON CONFLICT syntax + full lesson re-seed

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS description TEXT;

-- Upsert course
INSERT INTO courses (name, slug, category, teacher, description)
VALUES ('Khóa Nền Tảng - Tư Duy Toàn Diện ĐGNL TP HCM 2027 (V-ACT)',
        'khoa-nen-tang-vact-2027', 'HSA', 'MITA Education',
        'Khóa học toàn diện 8 môn: Toán, Tiếng Việt, Tiếng Anh, Hóa, Sinh học, Sử, Địa, Lí cho kỳ thi ĐGNL TP HCM (V-ACT) 2027')
ON CONFLICT (slug) DO NOTHING;

-- Re-seed lessons (idempotent delete + insert)
DELETE FROM lessons WHERE course_id = (SELECT id FROM courses WHERE slug = 'khoa-nen-tang-vact-2027');
-- Toán
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 1: Tính đơn điệu & Cực trị hàm số', 'Dạng 1. Xét tính đơn điệu, cực trị của hàm số cho bởi công thức (bậc 3, phân thức hữu tỉ). | Dạng 2. Xét tính đơn điệu, tìm cực trị dựa vào BBT và đồ thị cho sẵn.', 1 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 2: Tính đơn điệu & Cực trị hàm số', 'Dạng 3. Tìm tham số m để hàm số đơn điệu trên toàn tập xác định. | Dạng 4. Tìm tham số m để hàm số đơn điệu trên khoảng con của ℝ.', 2 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 3: Giá trị lớn nhất – Giá trị nhỏ nhất', 'Dạng 1. Tìm GTLN và GTNN dựa vào BBT và đồ thị. | Dạng 2. Tìm GTLN và GTNN của hàm số trên đoạn [a; b]. | Dạng 3. GTLN, GTNN trên khoảng (a;b), nửa khoảng (a;b]; [a;b). | Dạng 4. Ứng dụng GTLN, GTNN vào bài toán thực tế cơ bản.', 3 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 4: Đường tiệm cận đồ thị hàm số', 'Dạng 1. Tiệm cận ngang & đứng của hàm phân thức hữu tỉ. | Dạng 2. Tiệm cận của hàm vô tỉ. | Dạng 3. Bài toán tiệm cận có chứa tham số. | Dạng 4. Xác định tiệm cận dựa vào đồ thị hoặc BBT.', 4 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 5: Khảo sát & Vẽ đồ thị hàm số', 'Dạng 1. Hàm số bậc ba y = ax³+bx²+cx+d và các bài toán liên quan đến đồ thị.', 5 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 6: Khảo sát & Vẽ đồ thị hàm số', 'Dạng 2. Hàm phân thức hữu tỉ y=(ax+b)/(cx+d) và bài toán liên quan. | Dạng 3. Nhận dạng đồ thị hàm bậc 3, phân thức hữu tỉ từ hình vẽ hoặc BBT. | Dạng 4. Hàm số hữu tỉ bậc 2 trên bậc 1 và bài toán liên quan.', 6 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 7: Toán thực tế (Hàm số)', 'Lý thuyết và bài tập cơ bản làm quen toán thực tế (lợi nhuận, chi phí, tốc độ…).', 7 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 8: Véctơ & Phép toán trong không gian', 'Dạng 1. Chứng minh đẳng thức véctơ trong không gian. | Dạng 2. Phân tích véctơ theo các véctơ cơ sở; tính độ dài đoạn thẳng, c/m thẳng hàng, song song.', 8 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 9: Véctơ & Phép toán trong không gian', 'Dạng 3. Góc giữa hai véctơ. Tích vô hướng của hai véctơ. | Dạng 4. Toán thực tế liên quan đến véctơ (lực, vận tốc, công).', 9 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 10: Tọa độ véctơ & Phép toán trong KG', 'Dạng 1. Tọa độ phép toán véctơ; tọa độ điểm trong không gian Oxyz.', 10 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 11: Tọa độ véctơ & Phép toán trong KG', 'Dạng 2. Tìm tọa độ điểm đặc biệt trong tam giác: trực tâm, tâm nội/ngoại tiếp, chân đường cao, chân phân giác.', 11 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 12: Tọa độ véctơ & Phép toán trong KG', 'Dạng 3. Tích vô hướng và ứng dụng (góc, chiều dài, chiếu).', 12 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 13: Tọa độ véctơ & Phép toán trong KG', 'Dạng 4. Tâm tỉ cự – Tìm điểm chia đoạn theo tỉ số k.', 13 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 14: Phương trình mặt phẳng', 'Dạng 1. Viết PTMP khi biết VTPT và điểm thuộc mp; 3 điểm không thẳng hàng; song song/vuông góc.', 14 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 15: Phương trình mặt phẳng', 'Dạng 2. Viết PTMP liên quan đến khoảng cách d(M, mp) = k. | Dạng 3. Viết PTMP liên quan đến góc giữa hai mặt phẳng.', 15 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 16: Phương trình mặt phẳng', 'Dạng 4. Ứng dụng tọa độ hóa để giải hình học không gian (phương pháp tọa độ).', 16 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 17: Phương trình đường thẳng trong KG', 'Dạng 1. Viết PTĐT dạng tham số và dạng chính tắc.', 17 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 18: Phương trình đường thẳng trong KG', 'Dạng 2. Vị trí tương đối giữa hai đường thẳng (song song, cắt nhau, chéo nhau). | Dạng 3. Lập PTĐT liên quan đến góc tạo với mp và khoảng cách đến điểm/mp.', 18 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 19: Phương trình đường thẳng trong KG', 'Dạng 4. Tìm hình chiếu vuông góc của điểm lên đường thẳng/mp; điểm đối xứng.', 19 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 20: Phương trình đường thẳng trong KG', 'Dạng 5. Bài toán cực trị trong không gian – Tâm tỉ cự nâng cao.', 20 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 21: Phương trình mặt cầu', 'Xác định tâm I, bán kính R từ phương trình mặt cầu. Viết PTMC khi biết tâm-bán kính, đường kính, qua 4 điểm.', 21 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 22: Phương trình mặt cầu', 'Vị trí tương đối mặt cầu với mặt phẳng (cắt, tiếp xúc, không giao) và với đường thẳng.', 22 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 23: Nguyên hàm', 'Dạng 1. Tính nguyên hàm bằng định nghĩa – các công thức cơ bản (lũy thừa, mũ, loga, lượng giác). | Dạng 2. Nguyên hàm bằng phương pháp đổi biến số / tích phân từng phần.', 23 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 24: Nguyên hàm', 'Dạng 3. Nguyên hàm của hàm phân thức hữu tỉ (tách phân thức). | Dạng 4. Nguyên hàm của hàm số lượng giác (hạ bậc, công thức nhân đôi). | Dạng 5. Nguyên hàm của hàm mũ và logarit.', 24 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 25: Tích phân', 'Dạng 1. Áp dụng tính chất cơ bản của tích phân (tuyến tính, đổi cận, phân tích). | Dạng 2. Tích phân hàm luỹ thừa. | Dạng 3. Tích phân hàm phân thức hữu tỉ. | Dạng 4. Tích phân hàm lượng giác. | Dạng 5. Tích phân hàm số mũ. | Dạng 6. Tích phân hàm có trị tuyệt đối |f(x)|. | Tính diện tích hình phẳng giới hạn bởi đồ thị hàm số và trục hoành.', 25 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 26: Tích phân', 'Toán thực tế – Ứng dụng tích phân trong bài toán chuyển động: quãng đường, vận tốc. | Toán thực tế – Diện tích hình phẳng nâng cao (2 đồ thị cắt nhau, tham số).', 26 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 27: Ứng dụng tích phân – Thể tích', 'Dạng 1. Tính thể tích vật thể tròn xoay dựa vào định nghĩa | Dạng 2. Tính thể tích khối tròn xoay quanh trục Ox hoặc Oy.', 27 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 28: Ứng dụng tích phân – Thể tích', 'Toán thực tế – Tích phân tính thể tích nâng cao (thùng chứa, bình, vật thể đặc biệt). | Toán thực tế – Bài toán tốc độ dâng nước', 28 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 29: Số đặc trưng – Mẫu số liệu ghép nhóm', 'Tính khoảng biến thiên, tứ phân vị Q₁/Q₂/Q₃, phương sai s², độ lệch chuẩn s cho mẫu ghép nhóm.', 29 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 30: Xác suất có điều kiện', 'Dạng 1. Tính P(A|B) bằng công thức: P(A|B) = P(A∩B)/P(B). | Dạng 2. Tính xác suất có điều kiện bằng sơ đồ cây | Công thức xác suất toàn phần P(B) = ΣP(Aᵢ)·P(B|Aᵢ); công thức Bayes P(Aᵢ|B).', 30 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 31: Lượng giác', 'Ôn tập công thức lượng giác: cung liên kết, công thức cộng, nhân đôi, hạ bậc – Hiểu về vòng tròn lượng giác. | Tìm tập xác định của hàm số lượng giác; xét tính chẵn lẻ; tính tuần hoàn.', 31 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 32: Lượng giác', 'Tìm GTLN và GTNN của hàm số lượng giác (biến đổi về dạng sin/cos chuẩn). | Giải phương trình lượng giác cơ bản; PT LG có chứa tham số (nghiệm tổng quát).', 32 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 33: Cấp số cộng – Cấp số nhân', 'Ôn tập toàn bộ: định nghĩa, số hạng tổng quát uₙ, tổng n số hạng đầu Sₙ – Cả CSC và CSN.', 33 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 34: Cấp số cộng – Cấp số nhân', 'Toán thực tế – Ứng dụng CSC/CSN: tiền gửi lãi kép, lãi đơn, trả góp đều.', 34 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 35: Giới hạn', 'Giới hạn dãy số – Các dạng vô định: ∞/∞, ∞−∞, 1^∞; kỹ thuật chia bậc cao nhất.', 35 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 36: Giới hạn', 'Giới hạn hàm số – Các dạng 0/0, ∞/∞, ∞−∞; giới hạn một phía; giới hạn vô cực. | Hàm số liên tục tại điểm, trên khoảng – Định lý Bolzano (chứng minh phương trình có nghiệm).', 36 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 37: Đạo hàm', 'Ôn tập công thức đạo hàm – Đạo hàm hàm hợp [f(g(x))]'' = f''(g(x))·g''(x). | Phương trình tiếp tuyến tại điểm M(x₀, y₀); tiếp tuyến có hệ số góc k cho trước.', 37 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 38: Hình học không gian', 'Góc giữa đường thẳng và mặt phẳng', 38 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 39: Hình học không gian', 'Góc giữa hai mặt phẳng (góc nhị diện)', 39 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 40: Hình học không gian', 'Khoảng cách từ một điểm đến một mặt phẳng', 40 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 41: Hình học không gian', 'Khoảng cách giữa hai đường thẳng chéo nhau', 41 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 42: Hình học không gian', 'Thể tích hình chóp V=⅓·S·h; Thể tích hình lăng trụ V=S·h.', 42 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 43: Hình học không gian', 'Tỉ lệ thể tích hình chóp tam giác và tứ giác', 43 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 44: Hàm số mũ & Logarit', 'Logarit: định nghĩa logₐb, tính chất (đổi cơ số, tích, thương, lũy thừa) – Bài toán tính toán cơ bản.', 44 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 45: Hàm số mũ & Logarit', 'Phương trình và bất phương trình mũ, logarit – Đưa về cùng cơ số hoặc đặt ẩn phụ.', 45 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 46: Mệnh đề & Tập hợp', 'Mệnh đề | Tập hợp và các phép toán trên tập hợp', 46 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 47: Hệ thức lượng trong tam giác', 'Giá trị lượng giác của góc từ 0° đến 180° | Hệ thức lượng trong tam giác: định lý sin, định lý cos, công thức diện tích S=½absinC.', 47 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 48: Véctơ', 'Các phép toán cơ bản của véctơ | Tích vô hướng a⃗·b⃗ = |a⃗||b⃗|cosθ và ứng dụng | Hàm số – Hàm số bậc 2 y=ax²+bx+c: đỉnh, trục đối xứng, bảng biến thiên, đồ thị parabol.', 48 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 49: Véctơ', 'Dấu của tam thức bậc hai ax²+bx+c', 49 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 50: Véctơ', 'Phương trình quy về phương trình bậc hai: đặt ẩn phụ t, bậc 4 trùng phương, PT chứa căn.', 50 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 51: Đại số tổ hợp', 'Các quy tắc đếm: Quy tắc cộng (lựa chọn), Quy tắc nhân (kết hợp) – Phân biệt và áp dụng đúng.', 51 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 52: Đại số tổ hợp', 'Hoán vị Pₙ=n!; Chỉnh hợp A(n,k)=n!/(n−k)!; Tổ hợp C(n,k)=n!/(k!(n−k)!) – Phân biệt chỉnh hợp và tổ hợp', 52 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 53: Đại số tổ hợp', 'Khai triển nhị thức Newton (a+b)ⁿ – Tìm hệ số của số hạng chứa xᵐ (số hạng tổng quát T_{k+1}).', 53 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 54: Đại số tổ hợp', 'Tính tổng, giá trị biểu thức, rút gọn, chứng minh đẳng thức tổ hợp (dùng khai triển nhị thức).', 54 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 55: Đại số tổ hợp', 'Tổ hợp liên quan đến lập số', 55 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 56: Đại số tổ hợp', 'Tổ hợp liên quan đến hình học', 56 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 57: Đại số tổ hợp', 'Bài toán vách ngăn (chia n vật giống nhau vào k hộp phân biệt) – Bài toán chia kẹo Euler: C(n+k−1, k−1).', 57 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Toán · Bài 58: Xác suất (Định nghĩa cổ điển)', 'Biến cố và định nghĩa xác suất cổ điển', 58 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
-- Tiếng Việt
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 0: Phân tích đề', NULL, 59 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 1: Đặc điểm cấu tạo của từ', NULL, 60 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 2: Phân loại từ và lỗi dùng từ', NULL, 61 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 3: Nghĩa của từ, hệ thống ý nghĩa từ vựng và các lớp từ trong từ vựng', NULL, 62 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 4: Chính tả - một số lỗi chính tả thường gặp', NULL, 63 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 5: Câu văn và đoạn văn', NULL, 64 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 6: Biện pháp tu từ 1', NULL, 65 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 7: Biện pháp tu từ 2', NULL, 66 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 8: Phong cách ngôn ngữ', NULL, 67 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 9: Phương thức biểu đạt', NULL, 68 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 10: Văn học dân gian (đặc trưng, giá trị)', NULL, 69 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 11: Đặc trưng văn học trung đại', NULL, 70 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 12: Đặc trưng văn học hiện đại 30-45', NULL, 71 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 13: Đặc trưng văn học hiện đại 45-75 và sau 75', NULL, 72 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 14: Đặc trưng một số thể loại văn học dân gian (sử thi, thần thoại, ca dao, chèo...)', NULL, 73 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 15: Đặc trưng văn bản trữ tình (thơ trung đại, thơ hiện đại)', NULL, 74 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 16: Luyện tập về văn bản trữ tình', NULL, 75 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 17: Đặc trưng văn bản truyện (truyện truyền kỳ, truyện ngắn, tiểu thuyết)', NULL, 76 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 18: Luyện tập về văn bản truyện', NULL, 77 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 19: Đặc trưng thể loại ký (truyện ký, tùy bút, tản văn)', NULL, 78 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 20: Đặc trưng văn bản kịch (bi kịch, hài kịch) + kịch dân gian', NULL, 79 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 21: Đặc trưng văn bản nghị luận (NLXH + NLVH)', NULL, 80 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Việt · Bài 22: Đặc trưng văn bản thông tin', NULL, 81 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
-- Tiếng Anh
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 1: SỰ TƯƠNG HỢP CHỦ NGỮ VÀ ĐỘNG TỪ', NULL, 82 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 2: CÂU ĐIỀU KIỆN', NULL, 83 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 3: CÂU ƯỚC MUỐN', NULL, 84 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 4: CÂU SO SÁNH', NULL, 85 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 5: ĐẢO NGỮ', NULL, 86 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 6: GERUND AND INFINITIVE', NULL, 87 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 7: CÂU BỊ ĐỘNG', NULL, 88 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 8: DẠNG CỦA ĐỘNG TỪ: V, TO V, V-ING, HAVE P2 , TO HAVE P2 , HAVING P2', NULL, 89 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 9: MỆNH ĐỀ QUAN HỆ', NULL, 90 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 10: MODAL VERBS', NULL, 91 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 11: PAST MODAL VERBS', NULL, 92 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 12: MAKE - DO', NULL, 93 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 13: HỆ THỐNG CÁC THÌ TRONG TIẾNG ANH (BUỔI 1)', NULL, 94 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 14: HỆ THỐNG CÁC THÌ TRONG TIẾNG ANH (BUỔI 2)', NULL, 95 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 15: CÁCH SỬ DỤNG “GET” VÀ "THERE" TRONG MỘT SỐ TRƯỜNG HỢP', NULL, 96 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 16: MỆNH ĐỀ CHỈ KẾT QUẢ (CLAUSES OF RESULTS)', NULL, 97 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 17: CÁCH SỬ DỤNG ANOTHER, OTHER, OTHERS, THE OTHER(S), ANY OTHER, …', NULL, 98 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 18: LƯỢNG TỪ - MẠO TỪ - SỞ HỮU', NULL, 99 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 19: CÂU HỎI ĐUÔI', NULL, 100 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 20: CÂU GIÁN TIẾP', NULL, 101 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 21: ĐỌC HIỂU (BUỔI 1)', NULL, 102 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Tiếng Anh · Bài 22: ĐỌC HIỂU (BUỔI 2)', NULL, 103 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
-- Hóa
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 1: Ester', NULL, 104 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 2: Lipid', NULL, 105 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 3: Xà phòng và chất giặt rửa', NULL, 106 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 4: Carbohydrate - Glucose - Fructose', NULL, 107 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 5: Saccharose - Maltose', NULL, 108 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 6: Tinh bột - Cellulose', NULL, 109 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 7: Amine', NULL, 110 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 8: Amino acid', NULL, 111 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 9: Peptide - Protein - Enzyme', NULL, 112 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 10: Đại cương polymer', NULL, 113 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 11: Vật liệu polymer', NULL, 114 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 12: Pin điện', NULL, 115 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 13: Điện phân', NULL, 116 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 14: Cấu tạo và tính chất vật lí của kim loại', NULL, 117 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 15: Tính chất hóa học của kim loại', NULL, 118 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 16: Kim loại trong tự nhiên và phương pháp tách kim loại', NULL, 119 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 17: Hợp kim', NULL, 120 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 18: Sự ăn mòn kim loại', NULL, 121 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 19: Nguyên tố nhóm IA', NULL, 122 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 20: Nguyên tố nhóm IIA', NULL, 123 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 21: Đại cương về kim loại chuyển tiếp dãy thứ nhất', NULL, 124 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 22: Sơ lược về phức chất', NULL, 125 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Hóa · Bài 23: Tính chất và ứng dụng của phức chất', NULL, 126 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
-- Sinh học
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 1: Giới thiệu nội dung sinh học trong đề thi VACT', NULL, 127 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 2: Khái quát về vật chất nặng và năng lượng', NULL, 128 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 3: Dinh dưỡng và tiêu hoá ở động vật', NULL, 129 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 4: Cảm ứng ở thực vật và động vật', NULL, 130 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 5: Sinh trưởng - Phát triển, sinh sản ở sinh vật', NULL, 131 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 6: Gene và quá trình truyền thông tin di truyền; Điều hoà biểu hiện gene; Đột biến gene', NULL, 132 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 7: Hệ gene, công nghệ gen; Nhiễm sắc thể và đột biến nhiễm sắc thể', NULL, 133 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 8: Các quy luật di truyền', NULL, 134 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 9: Quy luật di truyền liên kết gene, Hoán vị gene và quy luật di truyền liên kết giới tính', NULL, 135 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 10: Di truyền gene ngoài nhân - MQH giữa kiểu gene, môi trường và kiểu hình', NULL, 136 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 11: Di truyền học quần thể, di truyền học người', NULL, 137 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 12: Tiến hóa', NULL, 138 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 13: Môi trường, Sinh thái học quần thể', NULL, 139 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sinh học · Bài 14: Quần xã sinh vật; Hệ sinh thái; Sinh thái học bảo tồn; phục hồi và phát triển bền vững (Bài cuối)', NULL, 140 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
-- Sử
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 1: Trật tự thế giới trong và sau chiến tranh lạnh: Chiến tranh và hòa bình', NULL, 141 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 2: Chủ nghĩa xã hội từ 1917 đến nay', NULL, 142 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 3: Đông Nam Á & ASEAN', NULL, 143 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 4: Một số cuộc cải cách lớn trong lịch sử', NULL, 144 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 5: Chiến tranh giải phóng dân tộc trước 1858', NULL, 145 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 6: Cách Mạng Tháng Tám', NULL, 146 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 7: Cuộc Kháng Chiến Chống Thực Dân Pháp', NULL, 147 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 8: Kháng chiến chống Mỹ', NULL, 148 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 9: Công cuộc Đổi mới từ năm 1986 đến nay', NULL, 149 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 10: Lịch sử đối ngoại Việt Nam thời cận hiện đại', NULL, 150 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 11: Hồ Chí Minh trong lịch sử Việt Nam', NULL, 151 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 12: Lịch sử bảo vệ chủ quyền, các quyền và lợi ích hợp pháp của Việt Nam ở Biển Đông', NULL, 152 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 13: Một số nền văn minh trong lịch sử thế giới', NULL, 153 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 14: Cách mạng tư sản và sự phát triển của chủ nghĩa tư bản', NULL, 154 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 15: Một số nền văn minh trên đất nước Việt Nam (trước năm 1858)', NULL, 155 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Sử · Bài 16: Một số nền văn minh trên đất nước Việt Nam (Tiếp) và Cộng đồng các dân tộc Việt Nam - BÀI CUỐI', NULL, 156 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
-- Địa
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 1: Giới thiệu tổng quan về môn Địa lí trong bài đánh giá năng lực chung', NULL, 157 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 2: Các công thức tính toán trong môn Địa lí, Kĩ năng biểu đồ, bảng số liệu, khai thác thông tin từ bản đồ', NULL, 158 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 3: Địa lý tự nhiên đại cương', NULL, 159 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 4: Địa lý kinh tế - xã hội đại cương', NULL, 160 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 5: Một số vấn đề về kinh tế - xã hội thế giới', NULL, 161 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 6: Địa lí một số khu vực trên thế giới (1)', NULL, 162 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 7: Địa lí một số khu vực trên thế giới (2)', NULL, 163 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 8: Địa lí một số quốc gia trên thế giới (1)', NULL, 164 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 9: Địa lí một số quốc gia trên thế giới (2)', NULL, 165 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 10: Địa lí tự nhiên Việt Nam (1)', NULL, 166 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 11: Địa lí tự nhiên Việt Nam (2)', NULL, 167 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 12: Địa lí dân cư Việt Nam', NULL, 168 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 13: Địa lí ngành kinh tế Việt Nam', NULL, 169 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 14: Địa lí vùng kinh tế Việt Nam (1)', NULL, 170 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 15: Địa lí vùng kinh tế Việt Nam (2)', NULL, 171 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Địa · Bài 16: Địa lí vùng kinh tế Việt Nam (3)', NULL, 172 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
-- Lí
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Lí · Bài 1: Động lực học chất điểm', NULL, 173 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Lí · Bài 2: Năng lượng và bảo toàn năng lượng', NULL, 174 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Lí · Bài 3: Động lượng và bảo toàn động lượng', NULL, 175 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Lí · Bài 4: Dao động', NULL, 176 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Lí · Bài 5: Sóng', NULL, 177 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Lí · Bài 6: Trường Điện, Dòng Điện, Mạch Điện', NULL, 178 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';
INSERT INTO lessons (course_id, title, description, sort_order) SELECT id, 'Lí · Bài 7: Nhiệt', NULL, 179 FROM courses WHERE slug = 'khoa-nen-tang-vact-2027';

-- Wire Toán Bài 1 to existing V6 media_assets
UPDATE lessons SET video_media_id='toan-vact-hsa-b1-video', pdf_media_id='toan-vact-hsa-b1-pdf', handwritten_media_id='toan-vact-hsa-b1-handwritten'
WHERE course_id=(SELECT id FROM courses WHERE slug='khoa-nen-tang-vact-2027') AND sort_order=1;
-- Total: 179 lessons