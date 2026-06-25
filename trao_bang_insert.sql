-- INSERT đầy đủ 18 học viên trao bằng — ảnh từ thư mục local public/
DELETE FROM trao_bang WHERE lark_id LIKE 'local_%';

INSERT INTO trao_bang (lark_id, name, date, course, photo_url)
VALUES
  ('local_bui_ngoc_hang',       'Bùi Ngọc Hằng',        '09/06/2026', 'Khóa học hiện đại',         '/images/gallery/Trao-bang/bui-ngoc-hang.png'),
  ('local_duong_thi_minh_hong', 'Dương Thị Minh Hồng',  '03/06/2026', 'Khóa học truyền thống',     '/images/gallery/Trao-bang/duong-thi-minh-hong.png'),
  ('local_phan_thi_kim_xuong',  'Phan Thị Kim Xương',   '21/05/2026', 'Khóa học hiện đại',         '/images/gallery/Trao-bang/phan-thi-kim-xuong.jpg'),
  ('local_pham_nhut_tan',       'Phạm Nhựt Tân',         '21/05/2026', 'Khóa học hiện đại',         '/images/gallery/Trao-bang/pham-nhut-tan.jpg'),
  ('local_truong_thi_thuy_dung','Trương Thị Thúy Dung', '28/03/2026', 'Khóa học hiện đại',         '/images/gallery/Trao-bang/truong-thi-thuy-dung.jpg'),
  ('local_tran_hoang_thinh',    'Trần Hoàng Thịnh',      '04/02/2026', 'Khóa học Barista nâng cao', '/images/gallery/Trao-bang/tran-hoang-thinh.jpg'),
  ('local_nguyen_van_thao',     'Nguyễn Văn Thảo',       '26/01/2026', 'Khóa học hiện đại',         '/images/gallery/Trao-bang/nguyen-van-thao.jpg'),
  ('local_le_thi_ngoc_trang',   'Lê Thị Ngọc Trang',    '21/01/2026', 'Khóa học hiện đại',         '/images/gallery/Trao-bang/le-thi-ngoc-trang.jpg'),
  ('local_lyda_sokpov',         'Lyda Sokpov',           '06/09/2025', 'Khóa học hiện đại',         '/images/gallery/Trao-bang/lyda-sokpov.jpg'),
  ('local_miss_phou_aster',     'Miss Phou Aster',       '03/09/2025', 'Khóa học hiện đại',         '/images/gallery/Trao-bang/miss-phou-aster.jpg'),
  ('local_vo_thi_nhat_hoa',     'Võ Thị Nhật Hòa',      '21/08/2025', 'Khóa học truyền thống',     '/images/gallery/Trao-bang/vo-thi-nhat-hoa.jpg'),
  ('local_hy_quay_mui',         'Hỷ Quay Mùi',           '30/07/2025', 'Khóa học truyền thống',     '/images/gallery/Trao-bang/hy-quay-mui.jpg'),
  ('local_le_trong_nghia',      'Lê Trọng Nghĩa',        '29/05/2025', 'Khóa học hiện đại',         '/images/gallery/Trao-bang/le-trong-nghia.jpg'),
  ('local_nguyen_thi_ut_tham',  'Nguyễn Thị Út Thẩm',   '19/05/2025', 'Khóa học truyền thống',     '/images/gallery/Trao-bang/nguyen-thi-ut-tham.jpg'),
  ('local_le_the_phong',        'Lê Thế Phong',          '15/05/2025', 'Khóa học hiện đại',         '/images/gallery/Trao-bang/le-the-phong.jpg'),
  ('local_tran_nhat_dien',      'Trần Nhật Điền',        '19/04/2025', 'Khóa học Barista nâng cao', '/images/gallery/Trao-bang/tran-nhat-dien.jpg'),
  ('local_nguyen_phuong_hong',  'Nguyễn Phượng Hồng',   '17/04/2025', 'Khóa học hiện đại',         '/images/gallery/Trao-bang/nguyen-phuong-hong.jpg'),
  ('local_tran_nhu_ngoc',       'Trần Như Ngọc',         '03/04/2025', 'Khóa học hiện đại',         '/images/gallery/Trao-bang/tran-nhu-ngoc.jpg')
ON CONFLICT (lark_id) DO UPDATE SET
  name      = EXCLUDED.name,
  date      = EXCLUDED.date,
  course    = EXCLUDED.course,
  photo_url = EXCLUDED.photo_url;
