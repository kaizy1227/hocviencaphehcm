-- Bước 1: Tạo bảng (nếu chưa có)
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stt integer DEFAULT 0,
  name text NOT NULL,
  unit text DEFAULT '',
  price integer DEFAULT 0,
  image_url text DEFAULT '',
  category text DEFAULT 'Nguyên liệu',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON products;
CREATE POLICY "Public read" ON products FOR SELECT USING (active = true);
DROP POLICY IF EXISTS "Auth write" ON products;
CREATE POLICY "Auth write" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Bước 2: Thêm 120 sản phẩm (9 danh mục)
INSERT INTO products (stt, name, unit, price, category, image_url, active) VALUES

-- ── BỘT ──
(1,  'Bột Kem Không Sữa Mộc Lam (Truyền Thống)', 'Túi 1kg',  86000,  'Bột', '', true),
(2,  'Bột Sữa Kem Béo Hiện đại Mộc Lam',          'Túi 1kg',  118000, 'Bột', '', true),
(3,  'Bột matcha trà xanh Bạch Dương',             'Túi 250g', 218000, 'Bột', '', true),
(4,  'Bột matcha nhật Maya',                        'Túi 100g', 148000, 'Bột', '', true),
(5,  'Bột Frappe Luave',                            'Túi 1kg',  142000, 'Bột', '', true),
(6,  'Bột KEM trứng Bạch Dương',                   'Túi 1kg',  145000, 'Bột', '', true),
(9,  'Bột khoai môn Binbaoli',                      'Túi 1kg',  132000, 'Bột', '', true),
(10, 'Bột khoai môn Wonderful',                     'Túi 1kg',  145000, 'Bột', '', true),
(11, 'Bột Socola đen sữa dừa',                      'Hộp 1kg',  150000, 'Bột', '', true),
(12, 'Bột Pudding trứng Lermao',                    'Túi 1kg',  178000, 'Bột', '', true),
(13, 'Bột Pudding trứng Mole',                      'Túi 1kg',  205000, 'Bột', '', true),
(14, 'Bột Pudding tàu hũ vị phô mai',               'Túi 800g', 115000, 'Bột', '', true),
(15, 'Bột đậu xanh Minh Ngọc',                      'Hộp 1kg',  53000,  'Bột', '', true),

-- ── CAFE - CACAO ──
(1, 'Bột cacao nguyên chất Bạch Dương 500g',        'Túi 500g', 165000, 'Cafe - Cacao', '', true),
(2, 'Cacao nguyên chất RICH',                       'Túi 100g', 120000, 'Cafe - Cacao', '', true),
(3, 'Cafe phin rang xay số 5 Mộc Lam (xay sẵn)',   'Túi 1kg',  258000, 'Cafe - Cacao', '', true),
(4, 'Cafe hạt Blend (Pha Máy)',                     'Túi 1kg',  325000, 'Cafe - Cacao', '', true),
(5, 'Cafe hạt tổng hợp nguyên chất (chưa xay)',    'Túi 1kg',  245000, 'Cafe - Cacao', '', true),
(6, 'Cafe hạt Arabica',                             'Túi 1kg',  360000, 'Cafe - Cacao', '', true),
(7, 'Cafe hạt Robusta',                             'Túi 1kg',  300000, 'Cafe - Cacao', '', true),

-- ── ĐỒ ĐÔNG LẠNH ──
(1,  'Anchor whipping',                                   'Hộp 1L',   168000, 'Đồ đông lạnh', '', true),
(2,  'Kem Béo Thực Vật Ice Hot Rich',                     'Hộp 454g', 32000,  'Đồ đông lạnh', '', true),
(3,  'Kem béo VỊ SỮA ICE HOT',                           'Hộp 454g', 43000,  'Đồ đông lạnh', '', true),
(4,  'Kem pha chế đa năng ONTOP (ĐỒ ĐÔNG LẠNH)',         'Hộp 907g', 73000,  'Đồ đông lạnh', '', true),
(5,  'Kem LÁ DỨA phô mai Nhật Hương (ĐỒ ĐÔNG LẠNH)',    'Hộp 454g', 47000,  'Đồ đông lạnh', '', true),
(6,  'Kem phô mai CHEDDAR Nhật Hương',                   'Hộp 500g', 47000,  'Đồ đông lạnh', '', true),
(7,  'Trân châu đen nấu nhanh (ĐỒ ĐÔNG LẠNH)',           'Túi 1kg',  68000,  'Đồ đông lạnh', '', true),
(8,  'Trân châu Ô Long nhài (ĐỒ ĐÔNG LẠNH)',             'Túi 500g', 48000,  'Đồ đông lạnh', '', true),
(9,  'Trân Châu Thanh Mai (ĐỒ ĐÔNG LẠNH)',               'Túi 500g', 54000,  'Đồ đông lạnh', '', true),
(10, 'Trân châu khoai môn nhân QUẾ HOA',                 'Túi 500g', 59000,  'Đồ đông lạnh', '', true),
(11, 'Trân châu khoai môn 500gr (ĐỒ ĐÔNG LẠNH)',         'Túi 500g', 50000,  'Đồ đông lạnh', '', true),
(12, 'Trân Châu Nhân Phô Mai (ĐỒ ĐÔNG LẠNH)',            'Túi 500g', 59000,  'Đồ đông lạnh', '', true),
(13, 'Trân châu MATCHA nhân phô mai',                    'Túi 500g', 60000,  'Đồ đông lạnh', '', true),
(14, 'Trân châu củ năng hồng Mao Mao',                   'Túi 500g', 55000,  'Đồ đông lạnh', '', true),
(15, 'Khoai môn nghiền (ĐỒ ĐÔNG LẠNH)',                  'Túi 500g', 57000,  'Đồ đông lạnh', '', true),
(16, 'Trân châu đường đen Bánh bò',                      'Túi 1kg',  75000,  'Đồ đông lạnh', '', true),

-- ── MỨT ──
(1,  'Mứt Vải Hoa hồng ColoMix',             'Hộp 900g',   125000, 'Mứt', '', true),
(2,  'Mứt Bưởi mật ong ColoMix',             'Hộp 1,25kg', 168000, 'Mứt', '', true),
(3,  'Mứt Dưa lưới ColoMix',                 'Hộp 1,2kg',  115000, 'Mứt', '', true),
(4,  'Mứt Yuzu mật ong Lermao',              'Hộp 1,2kg',  138000, 'Mứt', '', true),
(5,  'Mứt Dâu Đan Đông',                     'Túi 1kg',    115000, 'Mứt', '', true),
(6,  'Mứt Dâu Mao Mao',                      'Hộp 1,3kg',  115000, 'Mứt', '', true),
(7,  'Mứt Nhãn Lermao',                      'Túi 1kg',    142000, 'Mứt', '', true),
(8,  'Mứt Lá Dứa Lermao',                   'Túi 1kg',    130000, 'Mứt', '', true),
(9,  'Mứt Quế hoa Lermao',                   'Túi 1kg',    120000, 'Mứt', '', true),
(10, 'Mứt Lê Lermao',                        'Túi 1kg',    110000, 'Mứt', '', true),
(11, 'Mứt Nho Xanh Lermao',                  'Túi 1kg',    110000, 'Mứt', '', true),
(12, 'Mứt Dứa (thơm) Lermao',               'Túi 1kg',    120000, 'Mứt', '', true),
(13, 'Mứt Việt Quất Lermao',                 'Túi 1kg',    110000, 'Mứt', '', true),
(14, 'Mứt Mật Ong Đào Mao Mao',             'Hộp 1,36kg', 118000, 'Mứt', '', true),
(15, 'Mứt Xoài Mao Mao',                     'Hộp 1,36kg', 110000, 'Mứt', '', true),
(16, 'Mứt Ổi hồng',                          'Hộp 1kg',    120000, 'Mứt', '', true),
(17, 'Mứt Mãng Cầu La Fresh',                'Hũ 1kg',     128000, 'Mứt', '', true),
(18, 'Mứt Mãng Cầu Good Heart',              'Hộp 1kg',    142000, 'Mứt', '', true),
(19, 'Mứt Hibicus Good Heart',               'Hộp 1kg',    130000, 'Mứt', '', true),
(20, 'Mứt đào ICE HOT',                      'Túi 1kg',    125000, 'Mứt', '', true),
(21, 'Mứt vải & hoa hồng ANDROS CHUNKY 1KG','Túi 1kg',    179000, 'Mứt', '', true),
(22, 'Mứt Vải Boduo',                        'Hộp 1kg',    138000, 'Mứt', '', true),

-- ── NGUYÊN LIỆU LẺ ──
(1, 'Đường phèn Đằng Thư',          'Bao 12kg',  620000, 'Nguyên liệu lẻ', '', true),
(2, 'Siro hương mật ong Tây Bắc',   'Chai 600ml', 38000, 'Nguyên liệu lẻ', '', true),
(3, 'Mật ong Eurodeli',              'Chai 3kg',  210000, 'Nguyên liệu lẻ', '', true),
(4, 'Mật ong Gấu Xuân Lộc',         'Chai 650ml', 54000, 'Nguyên liệu lẻ', '', true),
(5, 'Nước cốt dừa Vico',            'Hộp 330ml',  23000, 'Nguyên liệu lẻ', '', true),
(6, 'Chanh nước hoa Nam Dương',     '1kg',         80000, 'Nguyên liệu lẻ', '', true),

-- ── SIRO ──
(1,  'Siro mâm xôi ColoMix',        'Chai 750ml',  120000, 'Siro', '', true),
(2,  'Siro đường đen Chanti',       'Chai 1,3kg',   85000, 'Siro', '', true),
(3,  'Siro Lựu ColoMix',            'Chai 1kg',    128000, 'Siro', '', true),
(4,  'Siro nhiệt đới Mao Mao',      'Chai 1,3kg',  155000, 'Siro', '', true),
(5,  'Siro bí đao Bạch Dương',      'Chai 2,5kg',  155000, 'Siro', '', true),
(6,  'Siro Davinci Hạt Dẻ',        'Chai 750ml',  178000, 'Siro', '', true),
(7,  'Siro Davinci Hạnh nhân',      'Chai 750ml',  178000, 'Siro', '', true),
(8,  'Syrup Torani Vải (Lychee)',   'Chai 750ml',  185000, 'Siro', '', true),
(9,  'Siro TORANI Vanila',          'Chai 700ml',  185000, 'Siro', '', true),
(10, 'Siro Teissiere Vanila',       'Chai 700ml',  190000, 'Siro', '', true),
(11, 'Siro monin matcha',           'Chai 700ml',  230000, 'Siro', '', true),
(12, 'Siro Bưởi Đỏ Wonderfull',    'Chai 1,3kg',  135000, 'Siro', '', true),
(13, 'Siro Caramel Maulin',         'Chai 1,3kg',  218000, 'Siro', '', true),
(14, 'Siro Boduo Việt Quất',        'Chai 2L',     125000, 'Siro', '', true),
(15, 'Socola chocolate hershey',    'Chai 1,36kg', 145000, 'Siro', '', true),
(16, 'Sốt Caramel ICE HOT',        'Chai 1kg',    162000, 'Siro', '', true),
(17, 'Sốt nướng Koca',             'Chai 1kg',     82000, 'Siro', '', true),

-- ── SỮA ──
(1, 'Sữa yến mạch Oatside',                              'Hộp 1L',     39000, 'Sữa', '', true),
(2, 'Sữa nước Amo không chất béo',                       'Hộp 1L',    120000, 'Sữa', '', true),
(3, 'Sữa đặc Ngôi Sao Phương Nam',                       'Hộp 1,284kg', 65000,'Sữa', '', true),
(4, 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan không đường', 'Hộp 1L',     30000, 'Sữa', '', true),
(5, 'Sữa dừa Amo Pastel',                                'Chai 1L',    65000, 'Sữa', '', true),

-- ── TOPPING ──
(1,  'Hạt sen KT Food',                    'Lon 600g', 59000,  'Topping', '', true),
(2,  'Hạt sen NIF',                        'Lon 600g', 62000,  'Topping', '', true),
(3,  'Vải ngâm Pogi',                      'Lon 565g', 34000,  'Topping', '', true),
(4,  'Đào ngâm Countree',                  'Lon 820g', 35000,  'Topping', '', true),
(5,  'Hạt nổ củ năng ánh HỒNG Mao Mao',  'Lon 850g', 75000,  'Topping', '', true),
(6,  'Hạt nổ yến mạch Mao Mao',          'Lon 850g', 99000,  'Topping', '', true),
(7,  'Đậu Đỏ Ngâm Đường Đóng Hộp Mao Mao','Lon 930g', 55000, 'Topping', '', true),
(8,  'Nhãn Ngâm Phương Linh',             'Lon 565g', 35000,  'Topping', '', true),
(9,  'Trân châu đen 3A Wonderfull',       'Túi 3kg',  95000,  'Topping', '', true),
(10, 'Thạch Trân Châu Đen Nâu 3Q Zion',  'Túi 2kg',  50000,  'Topping', '', true),
(11, 'Thạch Trân châu trắng 3Q Zion',    'Túi 2kg',  50000,  'Topping', '', true),
(12, 'Thạch nổ phô mai chảy',            'Lon 850g', 135000, 'Topping', '', true),
(13, 'Vụn dừa nướng',                    'Túi 500g', 55000,  'Topping', '', true),
(14, 'Tép Bưởi Nước Đường Wonderful',    'Lon',      85000,  'Topping', '', true),
(15, 'Nha đam Xuân Thịnh',               'Túi 1kg',  36000,  'Topping', '', true),

-- ── TRÀ ──
(1,  'Trà Kombucha',                       'Chai 1L',  51000,  'Trà', '', true),
(2,  'Lục Trà Nhài Mộc Lam',             'Túi 1kg',  365000, 'Trà', '', true),
(3,  'Hồng Trà Truyền Thống Mộc Lam',    'Túi 1kg',  180000, 'Trà', '', true),
(4,  'Trà Ô Long Truyền Thống Mộc Lam',  'Túi 1kg',  250000, 'Trà', '', true),
(5,  'Trà Shan Tuyết Mộc Lam',           'Túi 1kg',  359000, 'Trà', '', true),
(6,  'Trà Pha Máy - Hồng Trà Mộc Lam',  'Túi 1kg',  348000, 'Trà', '', true),
(7,  'Trà Ô Long pha máy Mộc Lam',      'Túi 1kg',  365000, 'Trà', '', true),
(8,  'Trà Pha Máy - Shan tuyết Mộc Lam','Túi 1kg',  370000, 'Trà', '', true),
(9,  'Hồng trà Sài Gòn',                 'Túi 1kg',  266000, 'Trà', '', true),
(10, 'Trà Ô Long Quế Hoa',              'Túi 1kg',  385000, 'Trà', '', true),
(11, 'Trà Ô long nhài đậm vị',          'Túi 1kg',  390000, 'Trà', '', true),
(12, 'Trà Long Tỉnh',                    'Túi 1kg',  415000, 'Trà', '', true),
(13, 'Trà Đại Hồng Bào',                'Túi 1kg',  335000, 'Trà', '', true),
(14, 'Ô Long Sơn trà',                   'Túi 1kg',  365000, 'Trà', '', true),
(15, 'Hồng trà thủ công Đài Loan',      'Túi 1kg',  490000, 'Trà', '', true),
(16, 'Trà Thiết quan âm sấy Mộc Lam',  'Túi 1kg',  325000, 'Trà', '', true),
(17, 'Trà Gạo Rang',                     'Túi 1kg',  360000, 'Trà', '', true),
(18, 'Trà Ô Long kiều mạch',            'Túi 1kg',  360000, 'Trà', '', true),
(19, 'Trà Ô Long Phong Lan',            'Túi 500g', 195000, 'Trà', '', true);
