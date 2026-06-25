-- Migration: Update cong_thuc courses + khoa_hoc from Excel
-- Chạy trong Supabase SQL Editor

-- 1. Đảm bảo cột courses đã tồn tại (text[])
ALTER TABLE cong_thuc ADD COLUMN IF NOT EXISTS courses text[] DEFAULT '{}';

-- 2. Tạo cột khoa_hoc (text, comma-separated) nếu chưa có
ALTER TABLE cong_thuc ADD COLUMN IF NOT EXISTS khoa_hoc text DEFAULT '';

-- 3. Update khoa_hoc theo tên món (ILIKE match)

UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'AMERICANO NÓNG (Ly 250ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'AMERICANO ĐÁ (Ly 400ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Khóa truyền thống'], khoa_hoc = 'Khóa hiện đại, Khóa truyền thống' WHERE TRIM(name) ILIKE 'BÒNG BƯỞI';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Khóa truyền thống', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa hiện đại, Khóa truyền thống, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'BẠC XỈU NÓNG ( Cốc quai 300ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa hiện đại, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'BẠC XỈU ĐÁ ( cốc 350ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'BẠC XỈU ĐÁ (cốc 400ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'CA CAO KEM TRỨNG NÓNG ( CỐC QUAI 300ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'CA CAO KEM TRỨNG ĐÁ ( 350ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Đá xay & Sinh tố', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa hiện đại, Đá xay & Sinh tố, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'CAFÉ CỐT DỪA ( 400ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Đá xay & Sinh tố'], khoa_hoc = 'Khóa truyền thống, Đá xay & Sinh tố' WHERE TRIM(name) ILIKE 'CAFÉ CỐT DỪA ( 500ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'CAFÉ HẠT RANG XAY PHA PHIN ( cốc có quai 200ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'CAFÉ HẠT RANG XAY PHA SẴN PHIN TO ( 200g ) ( Chuẩn bị trước )';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa hiện đại, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'CAFÉ KEM MUỐI (Cốc café đá 200ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'CAFÉ KEM MUỐI (Cốc café đá 350ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'CAFÉ KEM TRỨNG NÓNG (Cốc café đá 200ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'CAFÉ KEM TRỨNG NÓNG (Cốc có quai 200ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'CAFÉ KEM TRỨNG ĐÁ (Cốc café đá 200ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'CAFÉ KEM TRỨNG ĐÁ (Cốc café đá 200ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'CAFÉ LATTE NÓNG (Ly 220ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'CAFÉ LATTE ĐÁ (Ly 400ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'CAFÉ NÂU PHA SẴN ( cốc 200ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'CAFÉ SỐ 5 PHA SẴN PHIN TO ( 200g ) ( Chuẩn bị trước )';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'CAFÉ ĐEN / NÂU PHA PHIN ( cốc có quai 200ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'CAFÉ ĐEN PHA SẴN ( cốc 200ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'CAPPUCCINO NÓNG (Ly 220ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'CAPPUCCINO ĐÁ (Ly 400ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Đá xay & Sinh tố'], khoa_hoc = 'Khóa hiện đại, Đá xay & Sinh tố' WHERE TRIM(name) ILIKE 'CARAMEL FREEZE';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Trà trái cây & Matcha'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Trà trái cây & Matcha' WHERE TRIM(name) ILIKE 'CHANH LEO';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Đá xay & Sinh tố', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Đá xay & Sinh tố, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'CHANH TUYẾT ( 400ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Đá xay & Sinh tố'], khoa_hoc = 'Khóa hiện đại, Đá xay & Sinh tố' WHERE TRIM(name) ILIKE 'COOKIES CHOCOLATE';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Khóa truyền thống'], khoa_hoc = 'Khóa hiện đại, Khóa truyền thống' WHERE TRIM(name) ILIKE 'CÁC LOẠI TOPPING NẤU NHANH';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'CÁCH LÀM BÌNH KHÍ KOMBUCHA SODA';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'CÁCH LÀM CỐT GỪNG TƯƠI';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại' WHERE TRIM(name) ILIKE 'CÁCH LÀM CỐT SẢ';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'CÁCH LÀM KEM XỊT Khoảng ~ 13 cốc Dùng bình 0,5 lít';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại' WHERE TRIM(name) ILIKE 'CÁCH LÀM ĐƯỜNG NƯỚC Loại đường : Đường phèn Tỷ lệ : 1kg + 600ml nước sôi';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'CÁCH ĐÁNH KEM CHEESE Pha ~ 10 cốc ( 1 cốc dùng 2 thìa định lượng )';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'CÁCH ĐÁNH KEM LÁ DỨA Pha ~ 13 cốc ( 1 cốc dùng 2 thìa định lượng đầy )';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại' WHERE TRIM(name) ILIKE 'CÁCH ĐÁNH KEM MUỐI Pha ~ 10 cốc (35gr / cốc ) ( 1 cốc dùng ~3 thìa định lượng đầy )';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại' WHERE TRIM(name) ILIKE 'CÁCH ĐÁNH KEM TRỨNG Pha ~ 15 cốc ( 1 cốc dùng 2 thìa định lượng )';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'CÁCH Ủ HỒNG TRÀ SHAN TUYẾT ( 45g ) Pha ~6 cốc Thành phẩm ~ 850ml';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại' WHERE TRIM(name) ILIKE 'CÁCH Ủ LỤC TRÀ Tỷ lệ : 30g + 1000ml nước sôi Thành Phẩm ~ 900ml cốt lục trà';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'CÁCH Ủ TRÀ OLONG';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Đá xay & Sinh tố'], khoa_hoc = 'Khóa hiện đại, Đá xay & Sinh tố' WHERE TRIM(name) ILIKE 'CỐT DỪA CỐM XANH ( 400ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Trà trái cây & Matcha'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Trà trái cây & Matcha' WHERE TRIM(name) ILIKE 'DÂU TÂY';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại' WHERE TRIM(name) ILIKE 'DƯA LƯỚI';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Khóa truyền thống'], khoa_hoc = 'Khóa hiện đại, Khóa truyền thống' WHERE TRIM(name) ILIKE 'ESPRESSO';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'Hot Chocolate ( CỐC QUAI 300ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Đá xay & Sinh tố', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Đá xay & Sinh tố, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'KEM BƠ DỪA NON ( 350ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Đá xay & Sinh tố'], khoa_hoc = 'Khóa hiện đại, Đá xay & Sinh tố' WHERE TRIM(name) ILIKE 'KHOAI MÔN SỮA DỪA (CỐC 500ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'Kombucha Lựu Hồng Ngọc';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Trà trái cây & Matcha'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Trà trái cây & Matcha' WHERE TRIM(name) ILIKE 'LỰU CAM VÀNG';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Trà trái cây & Matcha'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Trà trái cây & Matcha' WHERE TRIM(name) ILIKE 'MATCHA DƯA LƯỚI';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Trà trái cây & Matcha'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Trà trái cây & Matcha' WHERE TRIM(name) ILIKE 'MATCHA DỪA NON';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Đá xay & Sinh tố'], khoa_hoc = 'Khóa hiện đại, Đá xay & Sinh tố' WHERE TRIM(name) ILIKE 'MATCHA FREEZE';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Trà trái cây & Matcha'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Trà trái cây & Matcha' WHERE TRIM(name) ILIKE 'MATCHA LATTE (YẾN MẠCH)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Đá xay & Sinh tố'], khoa_hoc = 'Khóa hiện đại, Đá xay & Sinh tố' WHERE TRIM(name) ILIKE 'MATCHA SỮA DỪA (CỐC 500ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Trà trái cây & Matcha'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Trà trái cây & Matcha' WHERE TRIM(name) ILIKE 'MATCHA ĐẬU ĐỎ';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Khóa truyền thống'], khoa_hoc = 'Khóa hiện đại, Khóa truyền thống' WHERE TRIM(name) ILIKE 'MÂM XÔI HỒNG';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Trà trái cây & Matcha'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Trà trái cây & Matcha' WHERE TRIM(name) ILIKE 'MÃNG CẦU';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa hiện đại, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'NÂU ĐÁ';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại' WHERE TRIM(name) ILIKE 'NẤU TRÂN CHÂU ĐƯỜNG ĐEN ( 400g ) Pha ~ 15 cốc';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Trà sữa truyền thống'], khoa_hoc = 'Khóa truyền thống, Trà sữa truyền thống' WHERE TRIM(name) ILIKE 'OLONG BÍ ĐAO ĐẬM VỊ (Cốc 500ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Trà sữa hiện đại'], khoa_hoc = 'Khóa hiện đại, Trà sữa hiện đại' WHERE TRIM(name) ILIKE 'OLONG BƯỞI MẬT ONG';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Trà sữa hiện đại'], khoa_hoc = 'Khóa hiện đại, Trà sữa hiện đại' WHERE TRIM(name) ILIKE 'OLONG CHANH VÀNG';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Trà sữa hiện đại'], khoa_hoc = 'Khóa hiện đại, Trà sữa hiện đại' WHERE TRIM(name) ILIKE 'OLONG KEM MUỐI';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'OLONG KHOAI MÔN';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Trà sữa truyền thống'], khoa_hoc = 'Khóa truyền thống, Trà sữa truyền thống' WHERE TRIM(name) ILIKE 'OLONG NGUYÊN VỊ (Cốc 500ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Trà sữa hiện đại'], khoa_hoc = 'Khóa hiện đại, Trà sữa hiện đại' WHERE TRIM(name) ILIKE 'OLONG NITRO TEA';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Trà sữa truyền thống'], khoa_hoc = 'Khóa truyền thống, Trà sữa truyền thống' WHERE TRIM(name) ILIKE 'OLONG SEN VÀNG (Cốc 500ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'SHAN TUYẾT NITROGEN';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Trà sữa truyền thống'], khoa_hoc = 'Khóa truyền thống, Trà sữa truyền thống' WHERE TRIM(name) ILIKE 'SHAN TUYẾT BÍ ĐAO';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Trà sữa truyền thống', 'Trà sữa hiện đại'], khoa_hoc = 'Khóa truyền thống, Trà sữa truyền thống, Trà sữa hiện đại' WHERE TRIM(name) ILIKE 'SHAN TUYẾT GỪNG';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Trà sữa hiện đại'], khoa_hoc = 'Khóa hiện đại, Trà sữa hiện đại' WHERE TRIM(name) ILIKE 'SHAN TUYẾT KEM MUỐI';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Trà sữa truyền thống', 'Trà sữa hiện đại'], khoa_hoc = 'Khóa truyền thống, Trà sữa truyền thống, Trà sữa hiện đại' WHERE TRIM(name) ILIKE 'SHAN TUYẾT SỮA';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Đá xay & Sinh tố', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Đá xay & Sinh tố, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'SINH TỐ BƠ ( 350ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Đá xay & Sinh tố', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Đá xay & Sinh tố, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'SINH TỐ CAM XOÀI ( 350ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Đá xay & Sinh tố', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Đá xay & Sinh tố, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'SINH TỐ MÃNG CẦU ( 350ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Đá xay & Sinh tố'], khoa_hoc = 'Khóa hiện đại, Đá xay & Sinh tố' WHERE TRIM(name) ILIKE 'SOCOLA DỪA NON (CỐC 350ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'SOCOLA DỪA NÓNG ( CỐC QUAI 300ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'SOCOLA DỪA ĐÁ ( CỐC QUAI 300ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại'], khoa_hoc = 'Khóa hiện đại' WHERE TRIM(name) ILIKE 'SỮA BÉO (8 cốc với hồng trà sữa)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'SỮA CHUA CHANH DÂY NHIỆT ĐỚI';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'THẠCH BI / TRÁI CÂY';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại' WHERE TRIM(name) ILIKE 'THẠCH TRỨNG (PUDDING TRỨNG)';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Trà trái cây & Matcha'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Trà trái cây & Matcha' WHERE TRIM(name) ILIKE 'TRÀ BÒNG BƯỞI';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Trà trái cây & Matcha'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Trà trái cây & Matcha' WHERE TRIM(name) ILIKE 'TRÀ CHANH HOÀNG KIM';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Trà sữa hiện đại'], khoa_hoc = 'Khóa hiện đại, Trà sữa hiện đại' WHERE TRIM(name) ILIKE 'TRÀ SỮA NƯỚNG';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Trà sữa truyền thống'], khoa_hoc = 'Khóa truyền thống, Trà sữa truyền thống' WHERE TRIM(name) ILIKE 'TRÀ SỮA SOCOLA';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Trà sữa truyền thống', 'Trà sữa hiện đại'], khoa_hoc = 'Khóa truyền thống, Trà sữa truyền thống, Trà sữa hiện đại' WHERE TRIM(name) ILIKE 'TRÀ SỮA TRÂN CHÂU ĐƯỜNG ĐEN';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Trà sữa truyền thống', 'Trà sữa hiện đại'], khoa_hoc = 'Khóa truyền thống, Trà sữa truyền thống, Trà sữa hiện đại' WHERE TRIM(name) ILIKE 'TRÀ SỮA ĐẶC BIỆT FULL TOPPING';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Trà trái cây & Matcha'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Trà trái cây & Matcha' WHERE TRIM(name) ILIKE 'TRÀ VẢI HOA HỒNG';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại', 'Trà trái cây & Matcha'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại, Trà trái cây & Matcha' WHERE TRIM(name) ILIKE 'TRÀ ĐÀO CAM SẢ';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại' WHERE TRIM(name) ILIKE 'TRÀ ỔI HỒNG';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống'], khoa_hoc = 'Khóa truyền thống' WHERE TRIM(name) ILIKE 'Thạch Lá Nếp';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Đá xay & Sinh tố'], khoa_hoc = 'Khóa hiện đại, Đá xay & Sinh tố' WHERE TRIM(name) ILIKE 'VIỆT QUẤT ICEBLEND';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Đá xay & Sinh tố'], khoa_hoc = 'Khóa hiện đại, Đá xay & Sinh tố' WHERE TRIM(name) ILIKE 'XOÀI DỪA LÁ NẾP (CỐC 500ml)';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa hiện đại, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'ĐEN ĐÁ';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Khóa hiện đại'], khoa_hoc = 'Khóa truyền thống, Khóa hiện đại' WHERE TRIM(name) ILIKE 'ĐÀO NHIỆT ĐỚI';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Cà phê phin - Đá xay & Sữa chua'], khoa_hoc = 'Khóa truyền thống, Cà phê phin - Đá xay & Sữa chua' WHERE TRIM(name) ILIKE 'ĐÁNH ĐÁ NGUYÊN VỊ';
UPDATE cong_thuc SET courses = ARRAY['Khóa truyền thống', 'Đá xay & Sinh tố'], khoa_hoc = 'Khóa truyền thống, Đá xay & Sinh tố' WHERE TRIM(name) ILIKE 'ĐẬU XANH SỮA DỪA ( 400ml )';
UPDATE cong_thuc SET courses = ARRAY['Khóa hiện đại', 'Trà trái cây & Matcha', 'Khóa truyền thống'], khoa_hoc = 'Khóa hiện đại, Trà trái cây & Matcha, Khóa truyền thống' WHERE TRIM(name) ILIKE 'ỔI HỒNG';

-- 4. Cập nhật tên món (nếu có thay đổi spacing/format)
-- UPDATE cong_thuc SET name = 'BẠC XỈU NÓNG ( Cốc quai 300ml )' WHERE name = 'BẠC XỈU NÓNG  ( Cốc quai 300ml )';
-- UPDATE cong_thuc SET name = 'CA CAO KEM TRỨNG ĐÁ ( 350ml )' WHERE name = 'CA CAO KEM TRỨNG ĐÁ  ( 350ml )';
-- UPDATE cong_thuc SET name = 'CAFÉ HẠT RANG XAY PHA PHIN ( cốc có quai 200ml)' WHERE name = 'CAFÉ HẠT RANG XAY  PHA PHIN ( cốc có quai 200ml)';
-- UPDATE cong_thuc SET name = 'CAFÉ HẠT RANG XAY PHA SẴN PHIN TO ( 200g ) ( Chuẩn bị trước )' WHERE name = 'CAFÉ HẠT RANG XAY PHA SẴN PHIN TO   ( 200g ) ( Chuẩn bị trước )';
-- UPDATE cong_thuc SET name = 'CAFÉ NÂU PHA SẴN ( cốc 200ml)' WHERE name = 'CAFÉ NÂU PHA SẴN  ( cốc 200ml)';
-- UPDATE cong_thuc SET name = 'CAFÉ SỐ 5 PHA SẴN PHIN TO ( 200g ) ( Chuẩn bị trước )' WHERE name = 'CAFÉ SỐ 5 PHA SẴN PHIN TO   ( 200g ) ( Chuẩn bị trước )';
-- UPDATE cong_thuc SET name = 'CAFÉ ĐEN / NÂU PHA PHIN ( cốc có quai 200ml)' WHERE name = 'CAFÉ ĐEN / NÂU  PHA PHIN ( cốc có quai 200ml)';
-- UPDATE cong_thuc SET name = 'CAFÉ ĐEN PHA SẴN ( cốc 200ml)' WHERE name = 'CAFÉ ĐEN PHA SẴN  ( cốc 200ml)';
-- UPDATE cong_thuc SET name = 'CÁCH LÀM KEM XỊT Khoảng ~ 13 cốc Dùng bình 0,5 lít' WHERE name = 'CÁCH LÀM KEM XỊT  Khoảng ~ 13 cốc  Dùng bình 0,5 lít';
-- UPDATE cong_thuc SET name = 'CÁCH LÀM ĐƯỜNG NƯỚC Loại đường : Đường phèn Tỷ lệ : 1kg + 600ml nước sôi' WHERE name = 'CÁCH LÀM ĐƯỜNG NƯỚC Loại đường : Đường phèn  Tỷ lệ : 1kg + 600ml nước sôi';
-- UPDATE cong_thuc SET name = 'CÁCH ĐÁNH KEM CHEESE Pha ~ 10 cốc ( 1 cốc dùng 2 thìa định lượng )' WHERE name = 'CÁCH ĐÁNH KEM CHEESE  Pha  ~ 10 cốc  ( 1 cốc dùng 2 thìa định lượng )';
-- UPDATE cong_thuc SET name = 'CÁCH ĐÁNH KEM LÁ DỨA Pha ~ 13 cốc ( 1 cốc dùng 2 thìa định lượng đầy )' WHERE name = 'CÁCH ĐÁNH KEM LÁ DỨA  Pha  ~ 13 cốc  ( 1 cốc dùng 2 thìa định lượng đầy )';
-- UPDATE cong_thuc SET name = 'CÁCH ĐÁNH KEM MUỐI Pha ~ 10 cốc (35gr / cốc ) ( 1 cốc dùng ~3 thìa định lượng đầy )' WHERE name = 'CÁCH ĐÁNH KEM MUỐI  Pha  ~ 10 cốc (35gr / cốc ) ( 1 cốc dùng ~3 thìa định lượng đầy )';
-- UPDATE cong_thuc SET name = 'CÁCH ĐÁNH KEM TRỨNG Pha ~ 15 cốc ( 1 cốc dùng 2 thìa định lượng )' WHERE name = 'CÁCH ĐÁNH KEM TRỨNG   Pha  ~ 15 cốc  ( 1 cốc dùng 2 thìa định lượng )';
-- UPDATE cong_thuc SET name = 'CÁCH Ủ HỒNG TRÀ SHAN TUYẾT ( 45g ) Pha ~6 cốc Thành phẩm ~ 850ml' WHERE name = 'CÁCH Ủ HỒNG TRÀ SHAN TUYẾT ( 45g ) Pha  ~6 cốc  Thành phẩm ~ 850ml';
-- UPDATE cong_thuc SET name = 'SHAN TUYẾT NITROGEN' WHERE name = 'SHAN TUYẾT  NITROGEN';
-- UPDATE cong_thuc SET name = 'THẠCH TRỨNG (PUDDING TRỨNG)' WHERE name = 'THẠCH TRỨNG  (PUDDING TRỨNG)';

-- End migration