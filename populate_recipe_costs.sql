-- ============================================================
-- Populate recipe_ingredient_items tu Excel tong cost
-- Recipes matched: 101/113 | Lines: 399
-- Cho phep ingredient_id NULL (dong khong khop catalog van luu dung cost)
-- ============================================================
ALTER TABLE recipe_ingredient_items ALTER COLUMN ingredient_id DROP NOT NULL;

-- Cot tra pha san (30g la / 900ml). cost_per_unit tu tinh = price/quantity.
INSERT INTO external_ingredients (name, quantity_per_pack, price_per_pack, unit)
SELECT 'Cốt Lục Trà Nhài', 900, 10950, 'ml'
WHERE NOT EXISTS (SELECT 1 FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài');
INSERT INTO external_ingredients (name, quantity_per_pack, price_per_pack, unit)
SELECT 'Cốt Trà Olong Truyền Thống', 900, 7500, 'ml'
WHERE NOT EXISTS (SELECT 1 FROM external_ingredients WHERE name = 'Cốt Trà Olong Truyền Thống');
INSERT INTO external_ingredients (name, quantity_per_pack, price_per_pack, unit)
SELECT 'Cốt Trà Oolong Búp Sen', 900, 10800, 'ml'
WHERE NOT EXISTS (SELECT 1 FROM external_ingredients WHERE name = 'Cốt Trà Oolong Búp Sen');

-- BÒNG BƯỞI
DELETE FROM recipe_ingredient_items WHERE recipe_id = '1382ba99-8e4d-4f52-8302-af3feb3e2a56';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1382ba99-8e4d-4f52-8302-af3feb3e2a56', 'internal', '7807cc63-4808-453f-9ee6-fc2aadb072d3', 'Mứt Bưởi mật ong ColoMix', 45.0, 'g', 134.4);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1382ba99-8e4d-4f52-8302-af3feb3e2a56', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 5.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1382ba99-8e4d-4f52-8302-af3feb3e2a56', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1382ba99-8e4d-4f52-8302-af3feb3e2a56', 'external', '5c4f18c9-ad54-4e5d-b73c-3c41f7e27766', 'Kombucha Soda', 160.0, 'ml', 19.3);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1382ba99-8e4d-4f52-8302-af3feb3e2a56', 'external', 'd7fee01f-0efe-4308-a99c-61803ebd231b', 'Chanh vàng (lát)', 1.0, 'lát', 800.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1382ba99-8e4d-4f52-8302-af3feb3e2a56', 'external', '878bdbbb-a226-429e-a451-a7f96692801c', 'Bạc hà', 1.0, 'lá', 80.0);
UPDATE cong_thuc SET total_cost = 10678 WHERE id = '1382ba99-8e4d-4f52-8302-af3feb3e2a56';

-- ỔI HỒNG
DELETE FROM recipe_ingredient_items WHERE recipe_id = '4574f08b-60d4-4ba3-8169-2a0b0397f231';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('4574f08b-60d4-4ba3-8169-2a0b0397f231', 'internal', 'ad919856-de26-4751-8f6e-3fc1f67f4914', 'Mứt Ổi hồng', 45.0, 'g', 115.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('4574f08b-60d4-4ba3-8169-2a0b0397f231', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 5.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('4574f08b-60d4-4ba3-8169-2a0b0397f231', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('4574f08b-60d4-4ba3-8169-2a0b0397f231', 'external', '5c4f18c9-ad54-4e5d-b73c-3c41f7e27766', 'Kombucha Soda', 160.0, 'ml', 19.3);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('4574f08b-60d4-4ba3-8169-2a0b0397f231', 'external', 'd7fee01f-0efe-4308-a99c-61803ebd231b', 'Chanh vàng (lát)', 1.0, 'lát', 800.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('4574f08b-60d4-4ba3-8169-2a0b0397f231', 'external', '878bdbbb-a226-429e-a451-a7f96692801c', 'Bạc hà', 1.0, 'lá', 80.0);
UPDATE cong_thuc SET total_cost = 9805 WHERE id = '4574f08b-60d4-4ba3-8169-2a0b0397f231';

-- MÂM XÔI HỒNG
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'b932b675-e83d-4b99-aeb9-580bebce8222';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b932b675-e83d-4b99-aeb9-580bebce8222', 'external', '806c7cba-d28f-4aff-afaf-63df1fc20df6', 'Cam vàng (lát)', 1.0, 'lát', 1000.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b932b675-e83d-4b99-aeb9-580bebce8222', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 10.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b932b675-e83d-4b99-aeb9-580bebce8222', 'internal', '682507ab-c2ba-4f5e-92c9-e8666fd2a468', 'Siro mâm xôi ColoMix', 30.0, 'ml', 160.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b932b675-e83d-4b99-aeb9-580bebce8222', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b932b675-e83d-4b99-aeb9-580bebce8222', 'external', '5c4f18c9-ad54-4e5d-b73c-3c41f7e27766', 'Kombucha Soda', 160.0, 'ml', 19.3);
UPDATE cong_thuc SET total_cost = 9725 WHERE id = 'b932b675-e83d-4b99-aeb9-580bebce8222';

-- CÁCH LÀM BÌNH KHÍ KOMBUCHA SODA Loại bình : Dùng bình ~ 20L Thành phẩm : ~ 100 cốc
DELETE FROM recipe_ingredient_items WHERE recipe_id = '7fe33067-5043-4250-b9ec-1bb3d62e6d5c';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('7fe33067-5043-4250-b9ec-1bb3d62e6d5c', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 6000.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('7fe33067-5043-4250-b9ec-1bb3d62e6d5c', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 8000.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('7fe33067-5043-4250-b9ec-1bb3d62e6d5c', 'external', 'cd789600-2722-4b9a-95cb-6fb69b17fdf5', 'Đá viên', 3000.0, 'g', 2.5);
UPDATE cong_thuc SET total_cost = 309500 WHERE id = '7fe33067-5043-4250-b9ec-1bb3d62e6d5c';

-- XOÀI DỪA LÁ NẾP (CỐC 500ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '40b614d3-9528-41ad-983f-3367b7f12477';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('40b614d3-9528-41ad-983f-3367b7f12477', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('40b614d3-9528-41ad-983f-3367b7f12477', 'internal', '37b41c9b-4142-4558-a3d9-07a0e723c3ba', 'Kem Béo Thực Vật Ice Hot Rich', 10.0, 'ml', 70.5);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('40b614d3-9528-41ad-983f-3367b7f12477', 'external', 'b9ef36be-9a43-4f4b-835a-5e94c8c50466', 'Mứt lá dứa', 15.0, 'ml', 130.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('40b614d3-9528-41ad-983f-3367b7f12477', 'internal', '788da4ab-1812-402b-b07b-5d635d509d25', 'Sữa dừa Amo Pastel', 100.0, 'ml', 68.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('40b614d3-9528-41ad-983f-3367b7f12477', 'internal', '33aa10ca-61da-47b1-8838-e869426e3ed2', 'Mứt Xoài Mao Mao', 30.0, 'ml', 80.9);
UPDATE cong_thuc SET total_cost = 11932 WHERE id = '40b614d3-9528-41ad-983f-3367b7f12477';

-- SOCOLA DỪA NON (CỐC 350ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'd2ca9e9e-0e03-467b-bb66-f9adea208f64';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d2ca9e9e-0e03-467b-bb66-f9adea208f64', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d2ca9e9e-0e03-467b-bb66-f9adea208f64', 'internal', 'a32115d6-0f64-4757-856e-e772ccbf4eb7', 'Bột Socola đen sữa dừa', 25.0, 'g', 150.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d2ca9e9e-0e03-467b-bb66-f9adea208f64', 'internal', '788da4ab-1812-402b-b07b-5d635d509d25', 'Sữa dừa Amo Pastel', 50.0, 'ml', 68.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d2ca9e9e-0e03-467b-bb66-f9adea208f64', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 20.0, 'ml', 50.6);
UPDATE cong_thuc SET total_cost = 8212 WHERE id = 'd2ca9e9e-0e03-467b-bb66-f9adea208f64';

-- MATCHA SỮA DỪA (CỐC 500ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '60da202b-7168-47cb-8ff7-7232c9f864ca';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('60da202b-7168-47cb-8ff7-7232c9f864ca', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 30.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('60da202b-7168-47cb-8ff7-7232c9f864ca', 'external', 'c5754309-6ef5-46aa-a5e4-4eeb07568100', 'Sữa béo', 40.0, 'ml', 51.9);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('60da202b-7168-47cb-8ff7-7232c9f864ca', 'internal', '788da4ab-1812-402b-b07b-5d635d509d25', 'Sữa dừa Amo Pastel', 60.0, 'ml', 68.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('60da202b-7168-47cb-8ff7-7232c9f864ca', 'internal', 'eff0bedc-60d5-4f2b-8b3d-1411661c1840', 'Bột matcha trà xanh Bạch Dương', 2.0, 'g', 872.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('60da202b-7168-47cb-8ff7-7232c9f864ca', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 40.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 8990 WHERE id = '60da202b-7168-47cb-8ff7-7232c9f864ca';

-- KHOAI MÔN SỮA DỪA (CỐC 500ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'b4b48a0a-b025-4b7a-bd57-ba08c6cfc94f';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b4b48a0a-b025-4b7a-bd57-ba08c6cfc94f', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b4b48a0a-b025-4b7a-bd57-ba08c6cfc94f', 'internal', 'd11a786e-261e-4337-92a3-b80c0fc33072', 'Bột khoai môn Binbaoli', 17.0, 'g', 132.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b4b48a0a-b025-4b7a-bd57-ba08c6cfc94f', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 15.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b4b48a0a-b025-4b7a-bd57-ba08c6cfc94f', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 30.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b4b48a0a-b025-4b7a-bd57-ba08c6cfc94f', 'internal', '788da4ab-1812-402b-b07b-5d635d509d25', 'Sữa dừa Amo Pastel', 100.0, 'ml', 68.0);
UPDATE cong_thuc SET total_cost = 10519 WHERE id = 'b4b48a0a-b025-4b7a-bd57-ba08c6cfc94f';

-- CAFÉ CỐT DỪA ( 400ml )
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'cd10d84d-4d97-4089-a270-df7835585af3';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('cd10d84d-4d97-4089-a270-df7835585af3', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 20.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('cd10d84d-4d97-4089-a270-df7835585af3', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 70.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('cd10d84d-4d97-4089-a270-df7835585af3', 'internal', 'b65d9af0-2111-4693-9a46-e65f4ff40d5d', 'Nước cốt dừa Vico', 60.0, 'ml', 69.7);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('cd10d84d-4d97-4089-a270-df7835585af3', 'external', '20349f6d-2a5f-4996-8d1b-a24e1d05763b', 'Cốt cafe', 25.0, 'ml', 255.0);
UPDATE cong_thuc SET total_cost = 14699 WHERE id = 'cd10d84d-4d97-4089-a270-df7835585af3';

-- CỐT DỪA CỐM XANH ( 400ml )
DELETE FROM recipe_ingredient_items WHERE recipe_id = '0a8f5400-cf7f-4436-95e4-9e398bb03be9';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0a8f5400-cf7f-4436-95e4-9e398bb03be9', 'internal', 'b65d9af0-2111-4693-9a46-e65f4ff40d5d', 'Nước cốt dừa Vico', 50.0, 'ml', 69.7);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0a8f5400-cf7f-4436-95e4-9e398bb03be9', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 30.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0a8f5400-cf7f-4436-95e4-9e398bb03be9', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 50.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0a8f5400-cf7f-4436-95e4-9e398bb03be9', 'external', 'e84ee500-19c9-4591-b429-00626709104f', 'Bánh cốm', 1.0, 'cái', 8000.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0a8f5400-cf7f-4436-95e4-9e398bb03be9', 'internal', 'ef893cb4-a307-4cb7-9d11-b135e83093bc', 'Vụn dừa nướng', 10.0, 'g', 110.0);
UPDATE cong_thuc SET total_cost = 16015 WHERE id = '0a8f5400-cf7f-4436-95e4-9e398bb03be9';

-- CARAMEL FREEZE
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'ca1e1b72-2fb5-45fe-8eba-db2a7ec0a81b';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ca1e1b72-2fb5-45fe-8eba-db2a7ec0a81b', 'internal', 'f3c7017d-d5a7-439d-8303-cdc7f70a7755', 'Cafe hạt tổng hợp nguyên chất (chưa xay)', 10.0, 'g', 245.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ca1e1b72-2fb5-45fe-8eba-db2a7ec0a81b', 'internal', '8c5863b6-dc4b-4a22-92fe-378a11d5b088', 'Sốt Caramel ICE HOT', 30.0, 'ml', 170.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ca1e1b72-2fb5-45fe-8eba-db2a7ec0a81b', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 20.0, 'g', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ca1e1b72-2fb5-45fe-8eba-db2a7ec0a81b', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 20.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ca1e1b72-2fb5-45fe-8eba-db2a7ec0a81b', 'internal', 'b3afc4f0-be9d-463c-800f-65d7fab8ba44', 'Bột Frappe Luave', 30.0, 'g', 142.0);
UPDATE cong_thuc SET total_cost = 13422 WHERE id = 'ca1e1b72-2fb5-45fe-8eba-db2a7ec0a81b';

-- MATCHA FREEZE
DELETE FROM recipe_ingredient_items WHERE recipe_id = '8567310d-f6e9-4641-b533-b37d9ba38380';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('8567310d-f6e9-4641-b533-b37d9ba38380', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 30.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('8567310d-f6e9-4641-b533-b37d9ba38380', 'internal', '22a4d6c8-9e81-4b19-808d-d62a00604d79', 'Siro monin matcha', 30.0, 'ml', 314.3);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('8567310d-f6e9-4641-b533-b37d9ba38380', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 30.0, 'g', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('8567310d-f6e9-4641-b533-b37d9ba38380', 'internal', 'b3afc4f0-be9d-463c-800f-65d7fab8ba44', 'Bột Frappe Luave', 30.0, 'g', 142.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('8567310d-f6e9-4641-b533-b37d9ba38380', 'internal', 'eff0bedc-60d5-4f2b-8b3d-1411661c1840', 'Bột matcha trà xanh Bạch Dương', 5.0, 'g', 872.0);
UPDATE cong_thuc SET total_cost = 20467 WHERE id = '8567310d-f6e9-4641-b533-b37d9ba38380';

-- COOKIES CHOCOLATE
DELETE FROM recipe_ingredient_items WHERE recipe_id = '3a871700-f77a-460c-a25b-30b3a2115a41';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3a871700-f77a-460c-a25b-30b3a2115a41', 'external', '6033a27c-ded1-49bb-848f-75ed3cdc980f', 'Bánh Oreo vị nguyên bản', 2.0, 'cái', 1500.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3a871700-f77a-460c-a25b-30b3a2115a41', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 30.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3a871700-f77a-460c-a25b-30b3a2115a41', 'internal', 'b6e15959-1251-4f7f-850c-e16e1c779a4d', 'Sốt chocolate hershey', 25.0, 'ml', 106.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3a871700-f77a-460c-a25b-30b3a2115a41', 'internal', '3a2a0d84-76fe-4155-9716-b048677a8f33', 'Cacao nguyên chất Bạch Dương', 5.0, 'g', 330.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3a871700-f77a-460c-a25b-30b3a2115a41', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 30.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3a871700-f77a-460c-a25b-30b3a2115a41', 'internal', 'b3afc4f0-be9d-463c-800f-65d7fab8ba44', 'Bột Frappe Luave', 30.0, 'g', 142.0);
UPDATE cong_thuc SET total_cost = 13993 WHERE id = '3a871700-f77a-460c-a25b-30b3a2115a41';

-- VIỆT QUẤT ICEBLEND
DELETE FROM recipe_ingredient_items WHERE recipe_id = '2ed1d72c-6be6-406b-bfc2-039d0a475320';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('2ed1d72c-6be6-406b-bfc2-039d0a475320', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 30.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('2ed1d72c-6be6-406b-bfc2-039d0a475320', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 30.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('2ed1d72c-6be6-406b-bfc2-039d0a475320', 'internal', 'e13e1fd2-ea93-49f1-9a06-231e854b28a3', 'Mứt Việt Quất Lermao', 70.0, 'g', 110.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('2ed1d72c-6be6-406b-bfc2-039d0a475320', 'internal', 'b3afc4f0-be9d-463c-800f-65d7fab8ba44', 'Bột Frappe Luave', 30.0, 'g', 142.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('2ed1d72c-6be6-406b-bfc2-039d0a475320', 'external', '9f32b0a0-1172-45a0-a558-229068c8e61c', 'Kem xịt', 20.0, 'g', 83.2);
UPDATE cong_thuc SET total_cost = 16042 WHERE id = '2ed1d72c-6be6-406b-bfc2-039d0a475320';

-- CÁCH LÀM KEM XỊT Khoảng ~ 13 cốc Dùng bình 0,5 lít
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'e768825e-7fb8-4028-81aa-9cd16485fdba';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e768825e-7fb8-4028-81aa-9cd16485fdba', 'internal', 'a69615a8-814c-40f5-bcd6-8847e241f828', 'Kem pha chế đa năng ONTOP Ice Hot', 400.0, 'g', 82.7);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e768825e-7fb8-4028-81aa-9cd16485fdba', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 10.0, 'ml', 35.0);
UPDATE cong_thuc SET total_cost = 33430 WHERE id = 'e768825e-7fb8-4028-81aa-9cd16485fdba';

-- SHAN TUYẾT KEM MUỐI
DELETE FROM recipe_ingredient_items WHERE recipe_id = '1b267c5d-b614-4fd4-9a24-296dec779f54';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1b267c5d-b614-4fd4-9a24-296dec779f54', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 45.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1b267c5d-b614-4fd4-9a24-296dec779f54', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 60.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1b267c5d-b614-4fd4-9a24-296dec779f54', 'external', '18cf18e1-a946-444e-bf23-b9fab742abb6', 'OLong Nitro Tea', 140.0, 'ml', 32.1);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1b267c5d-b614-4fd4-9a24-296dec779f54', 'external', '22b35055-5cf3-4450-bbe9-896fd3fa8bd7', 'Kem muối', 3.0, 'thìa', 100.0);
UPDATE cong_thuc SET total_cost = 6429 WHERE id = '1b267c5d-b614-4fd4-9a24-296dec779f54';

-- TRÀ SỮA NƯỚNG
DELETE FROM recipe_ingredient_items WHERE recipe_id = '3538314d-4f1b-4769-8e6c-c2e809e36eb1';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3538314d-4f1b-4769-8e6c-c2e809e36eb1', 'external', 'c5754309-6ef5-46aa-a5e4-4eeb07568100', 'Sữa béo', 55.0, 'ml', 51.9);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3538314d-4f1b-4769-8e6c-c2e809e36eb1', 'internal', 'f8fdf711-e103-4462-b9f0-358e02ea4077', 'Siro bí đao Bạch Dương', 35.0, 'ml', 62.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3538314d-4f1b-4769-8e6c-c2e809e36eb1', 'external', '53450c3e-cca4-4d89-88a7-5856ff0c44c7', 'Shan Tuyết Nitro Tea', 140.0, 'ml', 19.0);
UPDATE cong_thuc SET total_cost = 7684 WHERE id = '3538314d-4f1b-4769-8e6c-c2e809e36eb1';

-- SHAN TUYẾT NITROGEN
DELETE FROM recipe_ingredient_items WHERE recipe_id = '1307f9f6-05c0-4a2a-9160-6a289c23dd5e';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1307f9f6-05c0-4a2a-9160-6a289c23dd5e', 'external', 'c5754309-6ef5-46aa-a5e4-4eeb07568100', 'Sữa béo', 55.0, 'ml', 51.9);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1307f9f6-05c0-4a2a-9160-6a289c23dd5e', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 40.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1307f9f6-05c0-4a2a-9160-6a289c23dd5e', 'external', '53450c3e-cca4-4d89-88a7-5856ff0c44c7', 'Shan Tuyết Nitro Tea', 140.0, 'ml', 19.0);
UPDATE cong_thuc SET total_cost = 6914 WHERE id = '1307f9f6-05c0-4a2a-9160-6a289c23dd5e';

-- OLONG BƯỞI MẬT ONG
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'f0746133-bfdf-4fee-b298-d66e1934eeb6';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f0746133-bfdf-4fee-b298-d66e1934eeb6', 'internal', '7807cc63-4808-453f-9ee6-fc2aadb072d3', 'Mứt Bưởi mật ong ColoMix', 50.0, 'g', 134.4);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f0746133-bfdf-4fee-b298-d66e1934eeb6', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 5.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f0746133-bfdf-4fee-b298-d66e1934eeb6', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 120.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f0746133-bfdf-4fee-b298-d66e1934eeb6', 'external', '18cf18e1-a946-444e-bf23-b9fab742abb6', 'OLong Nitro Tea', 60.0, 'ml', 32.1);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f0746133-bfdf-4fee-b298-d66e1934eeb6', 'external', 'd7fee01f-0efe-4308-a99c-61803ebd231b', 'Chanh vàng (lát)', 1.0, 'lát', 800.0);
UPDATE cong_thuc SET total_cost = 9741 WHERE id = 'f0746133-bfdf-4fee-b298-d66e1934eeb6';

-- OLONG CHANH VÀNG
DELETE FROM recipe_ingredient_items WHERE recipe_id = '87b211c0-681d-4223-9c1a-04d209e2b480';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('87b211c0-681d-4223-9c1a-04d209e2b480', 'external', '6619d20f-9301-4c73-bea8-0cb0e4540edd', 'Chanh vàng', 30.0, 'g', 65.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('87b211c0-681d-4223-9c1a-04d209e2b480', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 40.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('87b211c0-681d-4223-9c1a-04d209e2b480', 'internal', 'd43a7098-db12-4ee3-a4d1-b385b76a73c7', 'Siro nhiệt đới Mao Mao', 10.0, 'ml', 119.2);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('87b211c0-681d-4223-9c1a-04d209e2b480', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 120.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('87b211c0-681d-4223-9c1a-04d209e2b480', 'external', '18cf18e1-a946-444e-bf23-b9fab742abb6', 'OLong Nitro Tea', 60.0, 'ml', 32.1);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('87b211c0-681d-4223-9c1a-04d209e2b480', 'external', 'd7fee01f-0efe-4308-a99c-61803ebd231b', 'Chanh vàng (lát)', 1.0, 'lát', 800.0);
UPDATE cong_thuc SET total_cost = 7388 WHERE id = '87b211c0-681d-4223-9c1a-04d209e2b480';

-- OLONG KEM MUỐI
DELETE FROM recipe_ingredient_items WHERE recipe_id = '437d7ff5-1f3a-4c16-a396-2174de3ab492';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('437d7ff5-1f3a-4c16-a396-2174de3ab492', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 45.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('437d7ff5-1f3a-4c16-a396-2174de3ab492', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 60.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('437d7ff5-1f3a-4c16-a396-2174de3ab492', 'external', '18cf18e1-a946-444e-bf23-b9fab742abb6', 'OLong Nitro Tea', 120.0, 'ml', 32.1);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('437d7ff5-1f3a-4c16-a396-2174de3ab492', 'external', '22b35055-5cf3-4450-bbe9-896fd3fa8bd7', 'Kem muối', 3.0, 'thìa', 100.0);
UPDATE cong_thuc SET total_cost = 5787 WHERE id = '437d7ff5-1f3a-4c16-a396-2174de3ab492';

-- OLONG NITRO TEA
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'f2d94881-f40c-43a7-abf0-d4ebbb3346e8';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f2d94881-f40c-43a7-abf0-d4ebbb3346e8', 'external', 'c5754309-6ef5-46aa-a5e4-4eeb07568100', 'Sữa béo', 45.0, 'ml', 51.9);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f2d94881-f40c-43a7-abf0-d4ebbb3346e8', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 40.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f2d94881-f40c-43a7-abf0-d4ebbb3346e8', 'external', '18cf18e1-a946-444e-bf23-b9fab742abb6', 'OLong Nitro Tea', 140.0, 'ml', 32.1);
UPDATE cong_thuc SET total_cost = 8230 WHERE id = 'f2d94881-f40c-43a7-abf0-d4ebbb3346e8';

-- SỮA BÉO (8 cốc với hồng trà sữa)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '9107c791-9680-41d0-9a15-ac5772f09eca';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('9107c791-9680-41d0-9a15-ac5772f09eca', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 300.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('9107c791-9680-41d0-9a15-ac5772f09eca', 'internal', 'a4ae8d4f-f6d8-40ef-9220-122829e1db4d', 'Bột Kem Không Sữa Mộc Lam ( Truyền Thống)', 300.0, 'g', 83.0);
UPDATE cong_thuc SET total_cost = 25200 WHERE id = '9107c791-9680-41d0-9a15-ac5772f09eca';

-- CÁCH LÀM BÌNH TRÀ OLONG NITRO TEA
DELETE FROM recipe_ingredient_items WHERE recipe_id = '13733c03-2f2d-48fb-bdea-1876f70e144a';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('13733c03-2f2d-48fb-bdea-1876f70e144a', 'internal', NULL, 'Trà Olong lài đậm vị', 60.0, 'g', 428.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('13733c03-2f2d-48fb-bdea-1876f70e144a', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 1000.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 26680 WHERE id = '13733c03-2f2d-48fb-bdea-1876f70e144a';

-- CÁCH LÀM BÌNH TRÀ SHAN TUYẾT NITRO TEA
DELETE FROM recipe_ingredient_items WHERE recipe_id = '53e91505-a962-4c3b-bef5-95b24496c236';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('53e91505-a962-4c3b-bef5-95b24496c236', 'internal', '5ef37617-fb89-42aa-b540-c3fceceb07ee', 'Trà Shan Tuyết Mộc Lam', 45.0, 'g', 359.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('53e91505-a962-4c3b-bef5-95b24496c236', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 1000.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 17155 WHERE id = '53e91505-a962-4c3b-bef5-95b24496c236';

-- CÁCH ĐÁNH KEM CHEESE Pha ~ 10 cốc ( 1 cốc dùng 2 thìa định lượng )
DELETE FROM recipe_ingredient_items WHERE recipe_id = '75d51432-a406-4de3-80b5-6cf28c1b04ae';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('75d51432-a406-4de3-80b5-6cf28c1b04ae', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 100.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('75d51432-a406-4de3-80b5-6cf28c1b04ae', 'internal', '37b41c9b-4142-4558-a3d9-07a0e723c3ba', 'Kem Béo Thực Vật Ice Hot Rich', 80.0, 'ml', 70.5);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('75d51432-a406-4de3-80b5-6cf28c1b04ae', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 10.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('75d51432-a406-4de3-80b5-6cf28c1b04ae', 'internal', '0e30982e-1448-4667-9ceb-1f2f2e049cda', 'Anchor whipping', 80.0, 'ml', 170.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('75d51432-a406-4de3-80b5-6cf28c1b04ae', 'internal', NULL, 'Bột kem phô mai Eurodeli', 30.0, 'g', 255.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('75d51432-a406-4de3-80b5-6cf28c1b04ae', 'external', '5a529f4c-ba55-4041-b29e-84e22dff4862', 'Muối', 1.0, 'g', 12.0);
UPDATE cong_thuc SET total_cost = 30252 WHERE id = '75d51432-a406-4de3-80b5-6cf28c1b04ae';

-- CÁCH ĐÁNH KEM LÁ DỨA Pha ~ 13 cốc ( 1 cốc dùng 2 thìa định lượng đầy )
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'e785afe4-de26-4586-8f7c-288bd66258a2';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e785afe4-de26-4586-8f7c-288bd66258a2', 'internal', 'd0805155-0b93-4c57-a601-b74a75f24903', 'Kem LÁ DỨA phô mai Nhất Hương', 300.0, 'ml', 103.5);
UPDATE cong_thuc SET total_cost = 31050 WHERE id = 'e785afe4-de26-4586-8f7c-288bd66258a2';

-- Hot Chocolate (CỐC QUAI 300ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '6b2dea91-e864-4955-9afc-c27ec0dc5fe7';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('6b2dea91-e864-4955-9afc-c27ec0dc5fe7', 'internal', 'b6e15959-1251-4f7f-850c-e16e1c779a4d', 'Sốt chocolate hershey', 15.0, 'ml', 106.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('6b2dea91-e864-4955-9afc-c27ec0dc5fe7', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 10.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('6b2dea91-e864-4955-9afc-c27ec0dc5fe7', 'internal', '3a2a0d84-76fe-4155-9716-b048677a8f33', 'Cacao nguyên chất Bạch Dương', 5.0, 'g', 330.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('6b2dea91-e864-4955-9afc-c27ec0dc5fe7', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 20.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('6b2dea91-e864-4955-9afc-c27ec0dc5fe7', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 240.0, 'ml', 30.0);
UPDATE cong_thuc SET total_cost = 10975 WHERE id = '6b2dea91-e864-4955-9afc-c27ec0dc5fe7';

-- CAFÉ KEM TRỨNG NÓNG (Cốc café đá 200ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '27ce0c33-edbe-4113-9100-cd77b22083bf';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('27ce0c33-edbe-4113-9100-cd77b22083bf', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 25.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('27ce0c33-edbe-4113-9100-cd77b22083bf', 'internal', 'bdada8c9-d5c4-4e0a-8612-e49d677a74c4', 'Cafe hạt Blend (Pha Máy)', 19.0, 'g', 325.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('27ce0c33-edbe-4113-9100-cd77b22083bf', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 70.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('27ce0c33-edbe-4113-9100-cd77b22083bf', 'external', 'ee84efa3-d67f-42dc-9628-019f72eb5dde', 'Kem trứng', 2.0, 'thìa', 86.7);
UPDATE cong_thuc SET total_cost = 7683 WHERE id = '27ce0c33-edbe-4113-9100-cd77b22083bf';

-- CAFÉ KEM TRỨNG ĐÁ (Cốc café đá 200ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'f096cbc5-441f-493c-aa43-cfee6fcdb02b';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f096cbc5-441f-493c-aa43-cfee6fcdb02b', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 25.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f096cbc5-441f-493c-aa43-cfee6fcdb02b', 'internal', 'bdada8c9-d5c4-4e0a-8612-e49d677a74c4', 'Cafe hạt Blend (Pha Máy)', 19.0, 'g', 325.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f096cbc5-441f-493c-aa43-cfee6fcdb02b', 'external', 'ee84efa3-d67f-42dc-9628-019f72eb5dde', 'Kem trứng', 2.0, 'thìa', 86.7);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f096cbc5-441f-493c-aa43-cfee6fcdb02b', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 25.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f096cbc5-441f-493c-aa43-cfee6fcdb02b', 'external', '20349f6d-2a5f-4996-8d1b-a24e1d05763b', 'Cốt cafe', 40.0, 'ml', 255.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f096cbc5-441f-493c-aa43-cfee6fcdb02b', 'external', 'ee84efa3-d67f-42dc-9628-019f72eb5dde', 'Kem trứng', 20.0, 'g', 86.7);
UPDATE cong_thuc SET total_cost = 20812 WHERE id = 'f096cbc5-441f-493c-aa43-cfee6fcdb02b';

-- CAFÉ LATTE ĐÁ (Ly 400ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '96e27380-76a4-4f20-87a5-4ea98032cbd2';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('96e27380-76a4-4f20-87a5-4ea98032cbd2', 'internal', 'bdada8c9-d5c4-4e0a-8612-e49d677a74c4', 'Cafe hạt Blend (Pha Máy)', 10.0, 'g', 325.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('96e27380-76a4-4f20-87a5-4ea98032cbd2', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 180.0, 'ml', 30.0);
UPDATE cong_thuc SET total_cost = 8650 WHERE id = '96e27380-76a4-4f20-87a5-4ea98032cbd2';

-- CAFÉ LATTE NÓNG (Ly 220ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '30ba5d99-df46-4367-86e4-365e3582c01a';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('30ba5d99-df46-4367-86e4-365e3582c01a', 'internal', 'bdada8c9-d5c4-4e0a-8612-e49d677a74c4', 'Cafe hạt Blend (Pha Máy)', 10.0, 'g', 325.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('30ba5d99-df46-4367-86e4-365e3582c01a', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 200.0, 'ml', 30.0);
UPDATE cong_thuc SET total_cost = 9250 WHERE id = '30ba5d99-df46-4367-86e4-365e3582c01a';

-- CAPPUCCINO ĐÁ (Ly 400ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'fd1840a9-b562-47fc-ab4b-61bb480302fc';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('fd1840a9-b562-47fc-ab4b-61bb480302fc', 'internal', 'bdada8c9-d5c4-4e0a-8612-e49d677a74c4', 'Cafe hạt Blend (Pha Máy)', 10.0, 'g', 325.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('fd1840a9-b562-47fc-ab4b-61bb480302fc', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 180.0, 'ml', 30.0);
UPDATE cong_thuc SET total_cost = 8650 WHERE id = 'fd1840a9-b562-47fc-ab4b-61bb480302fc';

-- CAPPUCCINO NÓNG (Ly 220ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'd251bd12-1065-4e61-a4b5-35916f406332';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d251bd12-1065-4e61-a4b5-35916f406332', 'internal', 'bdada8c9-d5c4-4e0a-8612-e49d677a74c4', 'Cafe hạt Blend (Pha Máy)', 19.0, 'g', 325.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d251bd12-1065-4e61-a4b5-35916f406332', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 200.0, 'ml', 30.0);
UPDATE cong_thuc SET total_cost = 12175 WHERE id = 'd251bd12-1065-4e61-a4b5-35916f406332';

-- AMERICANO ĐÁ (Ly 400ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'd8c000e4-d087-4c10-a452-7ab0198d2fe3';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d8c000e4-d087-4c10-a452-7ab0198d2fe3', 'internal', 'bdada8c9-d5c4-4e0a-8612-e49d677a74c4', 'Cafe hạt Blend (Pha Máy)', 19.0, 'g', 325.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d8c000e4-d087-4c10-a452-7ab0198d2fe3', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 180.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 6355 WHERE id = 'd8c000e4-d087-4c10-a452-7ab0198d2fe3';

-- AMERICANO NÓNG (Ly 250ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '8f0a93a0-2989-4b8e-8393-9537c5d5efc3';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('8f0a93a0-2989-4b8e-8393-9537c5d5efc3', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 180.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('8f0a93a0-2989-4b8e-8393-9537c5d5efc3', 'internal', 'bdada8c9-d5c4-4e0a-8612-e49d677a74c4', 'Cafe hạt Blend (Pha Máy)', 19.0, 'g', 325.0);
UPDATE cong_thuc SET total_cost = 6355 WHERE id = '8f0a93a0-2989-4b8e-8393-9537c5d5efc3';

-- BẠC XỈU NÓNG (Cốc quai 300ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '12f10682-51bd-4b33-965f-9a56f552c75e';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('12f10682-51bd-4b33-965f-9a56f552c75e', 'internal', '788da4ab-1812-402b-b07b-5d635d509d25', 'Sữa dừa Amo Pastel', 60.0, 'ml', 68.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('12f10682-51bd-4b33-965f-9a56f552c75e', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 30.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('12f10682-51bd-4b33-965f-9a56f552c75e', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 120.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('12f10682-51bd-4b33-965f-9a56f552c75e', 'internal', 'bdada8c9-d5c4-4e0a-8612-e49d677a74c4', 'Cafe hạt Blend (Pha Máy)', 19.0, 'g', 325.0);
UPDATE cong_thuc SET total_cost = 11893 WHERE id = '12f10682-51bd-4b33-965f-9a56f552c75e';

-- BẠC XỈU ĐÁ (cốc 350ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '0630c0ed-86fd-4e04-9653-4020ffb8e723';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0630c0ed-86fd-4e04-9653-4020ffb8e723', 'internal', '788da4ab-1812-402b-b07b-5d635d509d25', 'Sữa dừa Amo Pastel', 60.0, 'ml', 68.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0630c0ed-86fd-4e04-9653-4020ffb8e723', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 30.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0630c0ed-86fd-4e04-9653-4020ffb8e723', 'internal', 'bdada8c9-d5c4-4e0a-8612-e49d677a74c4', 'Cafe hạt Blend (Pha Máy)', 19.0, 'g', 325.0);
UPDATE cong_thuc SET total_cost = 11773 WHERE id = '0630c0ed-86fd-4e04-9653-4020ffb8e723';

-- CAFÉ KEM MUỐI (Cốc café đá 200ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'e499828c-1417-4520-996e-62b54dcc654c';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e499828c-1417-4520-996e-62b54dcc654c', 'internal', 'bdada8c9-d5c4-4e0a-8612-e49d677a74c4', 'Cafe hạt Blend (Pha Máy)', 19.0, 'g', 325.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e499828c-1417-4520-996e-62b54dcc654c', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 15.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e499828c-1417-4520-996e-62b54dcc654c', 'external', '22b35055-5cf3-4450-bbe9-896fd3fa8bd7', 'Kem muối', 3.0, 'thìa', 100.0);
UPDATE cong_thuc SET total_cost = 7234 WHERE id = 'e499828c-1417-4520-996e-62b54dcc654c';

-- NÂU ĐÁ
DELETE FROM recipe_ingredient_items WHERE recipe_id = '38c35789-9277-4609-8b03-82ad6281f37b';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('38c35789-9277-4609-8b03-82ad6281f37b', 'internal', 'bdada8c9-d5c4-4e0a-8612-e49d677a74c4', 'Cafe hạt Blend (Pha Máy)', 19.0, 'g', 325.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('38c35789-9277-4609-8b03-82ad6281f37b', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 20.0, 'ml', 50.6);
UPDATE cong_thuc SET total_cost = 7187 WHERE id = '38c35789-9277-4609-8b03-82ad6281f37b';

-- ĐEN ĐÁ
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'ee5df099-7041-45c6-ac87-cf4ab2433b45';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ee5df099-7041-45c6-ac87-cf4ab2433b45', 'internal', 'bdada8c9-d5c4-4e0a-8612-e49d677a74c4', 'Cafe hạt Blend (Pha Máy)', 19.0, 'g', 325.0);
UPDATE cong_thuc SET total_cost = 6175 WHERE id = 'ee5df099-7041-45c6-ac87-cf4ab2433b45';

-- ESPRESSO
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'd3b2a299-80a1-4b07-9a71-630e6459a653';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d3b2a299-80a1-4b07-9a71-630e6459a653', 'internal', 'b220bed2-4f47-4d1c-95df-7b92a045c060', 'Cafe phin rang xay số 5 Mộc Lam (xay sẵn)', 10.0, 'g', 258.0);
UPDATE cong_thuc SET total_cost = 2580 WHERE id = 'd3b2a299-80a1-4b07-9a71-630e6459a653';

-- SỮA CHUA CHANH DÂY NHIỆT ĐỚI
DELETE FROM recipe_ingredient_items WHERE recipe_id = '5f7ac851-5280-4c0f-8b2a-1bb96b7c8262';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5f7ac851-5280-4c0f-8b2a-1bb96b7c8262', 'external', 'a4b9edf1-c107-48de-bec5-fab2fe5e2f2e', 'Chanh leo', 1.0, 'quả', 70.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5f7ac851-5280-4c0f-8b2a-1bb96b7c8262', 'external', 'cd77d0da-3a4d-4170-be90-ca8c30775ebf', 'Sữa chua không đường', 1.0, 'hộp', 7000.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5f7ac851-5280-4c0f-8b2a-1bb96b7c8262', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 30.0, 'g', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5f7ac851-5280-4c0f-8b2a-1bb96b7c8262', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 20.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5f7ac851-5280-4c0f-8b2a-1bb96b7c8262', 'internal', 'd43a7098-db12-4ee3-a4d1-b385b76a73c7', 'Siro nhiệt đới Mao Mao', 5.0, 'ml', 119.2);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5f7ac851-5280-4c0f-8b2a-1bb96b7c8262', 'external', 'd7fee01f-0efe-4308-a99c-61803ebd231b', 'Chanh vàng (lát)', 1.0, 'lát', 800.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5f7ac851-5280-4c0f-8b2a-1bb96b7c8262', 'external', '0cdfd7fe-6916-459c-b813-0071926dbf16', 'Húng quế', 1.0, 'lá', 70.0);
UPDATE cong_thuc SET total_cost = 10654 WHERE id = '5f7ac851-5280-4c0f-8b2a-1bb96b7c8262';

-- ĐÁNH ĐÁ NGUYÊN VỊ
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'f87e26c2-8fa6-487d-85fb-2ef299191bbc';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f87e26c2-8fa6-487d-85fb-2ef299191bbc', 'external', 'cd77d0da-3a4d-4170-be90-ca8c30775ebf', 'Sữa chua không đường', 1.0, 'hộp', 7000.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f87e26c2-8fa6-487d-85fb-2ef299191bbc', 'external', '763d0dea-d33a-4a0d-a336-8c152695940c', 'Trái tắc', 1.0, 'quả', 1350.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f87e26c2-8fa6-487d-85fb-2ef299191bbc', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 30.0, 'g', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f87e26c2-8fa6-487d-85fb-2ef299191bbc', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 20.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f87e26c2-8fa6-487d-85fb-2ef299191bbc', 'external', 'd7fee01f-0efe-4308-a99c-61803ebd231b', 'Chanh vàng (lát)', 1.0, 'lát', 800.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f87e26c2-8fa6-487d-85fb-2ef299191bbc', 'external', '0cdfd7fe-6916-459c-b813-0071926dbf16', 'Húng quế', 1.0, 'lá', 70.0);
UPDATE cong_thuc SET total_cost = 11338 WHERE id = 'f87e26c2-8fa6-487d-85fb-2ef299191bbc';

-- MATCHA DƯA LƯỚI
DELETE FROM recipe_ingredient_items WHERE recipe_id = '36a30b16-4436-4e6a-86be-a94f03a99fee';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('36a30b16-4436-4e6a-86be-a94f03a99fee', 'internal', 'c6e944c6-6421-4e87-a1dc-0fd8c9118fa8', 'Mứt Dưa lưới ColoMix', 20.0, 'g', 95.8);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('36a30b16-4436-4e6a-86be-a94f03a99fee', 'internal', 'e339d262-b31a-4190-8cf8-a3bb02624b2a', 'Sữa yến mạch Oatside', 120.0, 'ml', 39.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('36a30b16-4436-4e6a-86be-a94f03a99fee', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 15.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('36a30b16-4436-4e6a-86be-a94f03a99fee', 'internal', '37b41c9b-4142-4558-a3d9-07a0e723c3ba', 'Kem Béo Thực Vật Ice Hot Rich', 10.0, 'ml', 70.5);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('36a30b16-4436-4e6a-86be-a94f03a99fee', 'internal', 'eff0bedc-60d5-4f2b-8b3d-1411661c1840', 'Bột matcha trà xanh Bạch Dương', 3.0, 'g', 872.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('36a30b16-4436-4e6a-86be-a94f03a99fee', 'internal', 'f81f175d-d8ff-4a4d-a101-b42bcbda48f0', 'Thạch Trân Châu Đen Nâu 3Q Zion', 1.0, 'thìa', 27.5);
UPDATE cong_thuc SET total_cost = 10470 WHERE id = '36a30b16-4436-4e6a-86be-a94f03a99fee';

-- MATCHA DỪA NON
DELETE FROM recipe_ingredient_items WHERE recipe_id = '6e7d9d8a-a80b-4c2a-aef8-2b1a22df8900';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('6e7d9d8a-a80b-4c2a-aef8-2b1a22df8900', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 120.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('6e7d9d8a-a80b-4c2a-aef8-2b1a22df8900', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 15.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('6e7d9d8a-a80b-4c2a-aef8-2b1a22df8900', 'internal', 'eff0bedc-60d5-4f2b-8b3d-1411661c1840', 'Bột matcha trà xanh Bạch Dương', 3.0, 'g', 872.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('6e7d9d8a-a80b-4c2a-aef8-2b1a22df8900', 'external', '5e5c25f4-81cf-45fc-a1de-0717cc546905', 'Kem dừa', 1.0, 'viên', 120.0);
UPDATE cong_thuc SET total_cost = 6861 WHERE id = '6e7d9d8a-a80b-4c2a-aef8-2b1a22df8900';

-- MATCHA ĐẬU ĐỎ
DELETE FROM recipe_ingredient_items WHERE recipe_id = '9bdc6da6-628a-4604-9277-650568a944c7';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('9bdc6da6-628a-4604-9277-650568a944c7', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 120.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('9bdc6da6-628a-4604-9277-650568a944c7', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 15.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('9bdc6da6-628a-4604-9277-650568a944c7', 'internal', 'eff0bedc-60d5-4f2b-8b3d-1411661c1840', 'Bột matcha trà xanh Bạch Dương', 3.0, 'g', 872.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('9bdc6da6-628a-4604-9277-650568a944c7', 'internal', '7584a9e8-54bc-49d3-9413-e89f946c118a', 'Đậu Đỏ Ngâm Đường Đóng Hộp Mao Mao', 30.0, 'g', 57.0);
UPDATE cong_thuc SET total_cost = 8451 WHERE id = '9bdc6da6-628a-4604-9277-650568a944c7';

-- MATCHA LATTE (YẾN MẠCH)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '1e4e5c92-64f0-424a-94cd-0cd8db76a8db';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1e4e5c92-64f0-424a-94cd-0cd8db76a8db', 'internal', 'e339d262-b31a-4190-8cf8-a3bb02624b2a', 'Sữa yến mạch Oatside', 120.0, 'ml', 39.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1e4e5c92-64f0-424a-94cd-0cd8db76a8db', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 15.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('1e4e5c92-64f0-424a-94cd-0cd8db76a8db', 'internal', 'eff0bedc-60d5-4f2b-8b3d-1411661c1840', 'Bột matcha trà xanh Bạch Dương', 3.0, 'g', 872.0);
UPDATE cong_thuc SET total_cost = 7821 WHERE id = '1e4e5c92-64f0-424a-94cd-0cd8db76a8db';

-- SINH TỐ CAM XOÀI ( 350ml )
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'b0891632-9aa8-4dfc-b102-2482163840ed';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b0891632-9aa8-4dfc-b102-2482163840ed', 'external', 'f81b64dc-9b3d-46ae-80b7-bc8a0d50177e', 'Xoài Tươi', 110.0, 'g', 50.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b0891632-9aa8-4dfc-b102-2482163840ed', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 40.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b0891632-9aa8-4dfc-b102-2482163840ed', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 15.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b0891632-9aa8-4dfc-b102-2482163840ed', 'external', '3ee3a3e8-ef35-4b93-90eb-17eb492e5dd4', 'Cam vàng', 15.0, 'ml', 50.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b0891632-9aa8-4dfc-b102-2482163840ed', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 20.0, 'ml', 35.0);
UPDATE cong_thuc SET total_cost = 9669 WHERE id = 'b0891632-9aa8-4dfc-b102-2482163840ed';

-- SINH TỐ MÃNG CẦU ( 350ml )
DELETE FROM recipe_ingredient_items WHERE recipe_id = '2c0cae65-5681-4c8a-a730-3c14a074350d';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('2c0cae65-5681-4c8a-a730-3c14a074350d', 'external', '26242ee9-51cb-4338-a471-3f52b88273c2', 'Mãng cầu', 100.0, 'g', 70.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('2c0cae65-5681-4c8a-a730-3c14a074350d', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 30.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('2c0cae65-5681-4c8a-a730-3c14a074350d', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 40.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('2c0cae65-5681-4c8a-a730-3c14a074350d', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 20.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('2c0cae65-5681-4c8a-a730-3c14a074350d', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 30.0, 'ml', 50.6);
UPDATE cong_thuc SET total_cost = 10728 WHERE id = '2c0cae65-5681-4c8a-a730-3c14a074350d';

-- KEM BƠ DỪA NON ( 350ml )
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'f41a724b-fb02-4053-8d3e-1c4ca95a26a2';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f41a724b-fb02-4053-8d3e-1c4ca95a26a2', 'external', '573af08d-8300-4ca1-8f3f-1331e2b60cdb', 'Bơ tươi', 90.0, 'ml', 65.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f41a724b-fb02-4053-8d3e-1c4ca95a26a2', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 30.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f41a724b-fb02-4053-8d3e-1c4ca95a26a2', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 50.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f41a724b-fb02-4053-8d3e-1c4ca95a26a2', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 40.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f41a724b-fb02-4053-8d3e-1c4ca95a26a2', 'external', '5e5c25f4-81cf-45fc-a1de-0717cc546905', 'Kem dừa', 1.0, 'viên', 120.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f41a724b-fb02-4053-8d3e-1c4ca95a26a2', 'internal', 'ef893cb4-a307-4cb7-9d11-b135e83093bc', 'Vụn dừa nướng', 10.0, 'g', 110.0);
UPDATE cong_thuc SET total_cost = 10540 WHERE id = 'f41a724b-fb02-4053-8d3e-1c4ca95a26a2';

-- SINH TỐ BƠ ( 350ml )
DELETE FROM recipe_ingredient_items WHERE recipe_id = '3d7c34d8-6ba9-41a5-9e3f-cedba9b19634';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3d7c34d8-6ba9-41a5-9e3f-cedba9b19634', 'external', '573af08d-8300-4ca1-8f3f-1331e2b60cdb', 'Bơ tươi', 90.0, 'ml', 65.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3d7c34d8-6ba9-41a5-9e3f-cedba9b19634', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 30.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3d7c34d8-6ba9-41a5-9e3f-cedba9b19634', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 50.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3d7c34d8-6ba9-41a5-9e3f-cedba9b19634', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 40.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 9320 WHERE id = '3d7c34d8-6ba9-41a5-9e3f-cedba9b19634';

-- CHANH TUYẾT ( 400ml )
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'ed41d53a-3b43-42bb-a532-db72a3b792aa';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ed41d53a-3b43-42bb-a532-db72a3b792aa', 'external', '6619d20f-9301-4c73-bea8-0cb0e4540edd', 'Chanh vàng', 20.0, 'ml', 65.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ed41d53a-3b43-42bb-a532-db72a3b792aa', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 20.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ed41d53a-3b43-42bb-a532-db72a3b792aa', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 60.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ed41d53a-3b43-42bb-a532-db72a3b792aa', 'external', 'd7fee01f-0efe-4308-a99c-61803ebd231b', 'Chanh vàng (lát)', 1.0, 'lát', 800.0);
UPDATE cong_thuc SET total_cost = 5836 WHERE id = 'ed41d53a-3b43-42bb-a532-db72a3b792aa';

-- CAFÉ CỐT DỪA ( 500ml )
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'e728076a-4c94-40c5-b182-94f9540aea3a';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e728076a-4c94-40c5-b182-94f9540aea3a', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 20.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e728076a-4c94-40c5-b182-94f9540aea3a', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 70.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e728076a-4c94-40c5-b182-94f9540aea3a', 'internal', 'b65d9af0-2111-4693-9a46-e65f4ff40d5d', 'Nước cốt dừa Vico', 50.0, 'ml', 69.7);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e728076a-4c94-40c5-b182-94f9540aea3a', 'external', '20349f6d-2a5f-4996-8d1b-a24e1d05763b', 'Cốt cafe', 25.0, 'ml', 255.0);
UPDATE cong_thuc SET total_cost = 14002 WHERE id = 'e728076a-4c94-40c5-b182-94f9540aea3a';

-- ĐẬU XANH SỮA DỪA ( 400ml )
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'ac368fb4-94ab-4818-975a-457401a50ca3';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ac368fb4-94ab-4818-975a-457401a50ca3', 'internal', 'b65d9af0-2111-4693-9a46-e65f4ff40d5d', 'Nước cốt dừa Vico', 50.0, 'ml', 69.7);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ac368fb4-94ab-4818-975a-457401a50ca3', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 30.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ac368fb4-94ab-4818-975a-457401a50ca3', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 60.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ac368fb4-94ab-4818-975a-457401a50ca3', 'internal', '707a6ab5-ec06-4993-9218-5b305a33007f', 'Bột đậu xanh Minh Ngọc', 20.0, 'g', 53.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ac368fb4-94ab-4818-975a-457401a50ca3', 'internal', 'ef893cb4-a307-4cb7-9d11-b135e83093bc', 'Vụn dừa nướng', 5.0, 'g', 110.0);
UPDATE cong_thuc SET total_cost = 9031 WHERE id = 'ac368fb4-94ab-4818-975a-457401a50ca3';

-- SOCOLA DỪA NÓNG ( CỐC QUAI 300ml )
DELETE FROM recipe_ingredient_items WHERE recipe_id = '0b108dfd-5108-4e85-a4f7-4cb10f837d7b';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0b108dfd-5108-4e85-a4f7-4cb10f837d7b', 'internal', 'a32115d6-0f64-4757-856e-e772ccbf4eb7', 'Bột Socola đen sữa dừa', 25.0, 'g', 150.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0b108dfd-5108-4e85-a4f7-4cb10f837d7b', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 40.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0b108dfd-5108-4e85-a4f7-4cb10f837d7b', 'internal', '788da4ab-1812-402b-b07b-5d635d509d25', 'Sữa dừa Amo Pastel', 30.0, 'ml', 68.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0b108dfd-5108-4e85-a4f7-4cb10f837d7b', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 150.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0b108dfd-5108-4e85-a4f7-4cb10f837d7b', 'external', 'ee84efa3-d67f-42dc-9628-019f72eb5dde', 'Kem trứng', 10.0, 'g', 86.7);
UPDATE cong_thuc SET total_cost = 8831 WHERE id = '0b108dfd-5108-4e85-a4f7-4cb10f837d7b';

-- SOCOLA DỪA ĐÁ ( CỐC QUAI 300ml )
DELETE FROM recipe_ingredient_items WHERE recipe_id = '29bfb801-9448-4223-8090-e24fc803eb6c';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('29bfb801-9448-4223-8090-e24fc803eb6c', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('29bfb801-9448-4223-8090-e24fc803eb6c', 'internal', 'a32115d6-0f64-4757-856e-e772ccbf4eb7', 'Bột Socola đen sữa dừa', 25.0, 'g', 150.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('29bfb801-9448-4223-8090-e24fc803eb6c', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 40.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('29bfb801-9448-4223-8090-e24fc803eb6c', 'internal', '788da4ab-1812-402b-b07b-5d635d509d25', 'Sữa dừa Amo Pastel', 30.0, 'ml', 68.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('29bfb801-9448-4223-8090-e24fc803eb6c', 'external', 'ee84efa3-d67f-42dc-9628-019f72eb5dde', 'Kem trứng', 10.0, 'g', 86.7);
UPDATE cong_thuc SET total_cost = 8731 WHERE id = '29bfb801-9448-4223-8090-e24fc803eb6c';

-- CA CAO KEM TRỨNG NÓNG ( CỐC QUAI 300ml )
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'df76c61e-8a29-4530-810a-3ffe8d5730e9';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('df76c61e-8a29-4530-810a-3ffe8d5730e9', 'internal', '3a2a0d84-76fe-4155-9716-b048677a8f33', 'Cacao nguyên chất Bạch Dương', 10.0, 'g', 330.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('df76c61e-8a29-4530-810a-3ffe8d5730e9', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 40.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('df76c61e-8a29-4530-810a-3ffe8d5730e9', 'internal', '37b41c9b-4142-4558-a3d9-07a0e723c3ba', 'Kem Béo Thực Vật Ice Hot Rich', 10.0, 'ml', 70.5);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('df76c61e-8a29-4530-810a-3ffe8d5730e9', 'internal', '788da4ab-1812-402b-b07b-5d635d509d25', 'Sữa dừa Amo Pastel', 30.0, 'ml', 68.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('df76c61e-8a29-4530-810a-3ffe8d5730e9', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 170.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('df76c61e-8a29-4530-810a-3ffe8d5730e9', 'external', 'ee84efa3-d67f-42dc-9628-019f72eb5dde', 'Kem trứng', 20.0, 'g', 86.7);
UPDATE cong_thuc SET total_cost = 9973 WHERE id = 'df76c61e-8a29-4530-810a-3ffe8d5730e9';

-- CA CAO KEM TRỨNG ĐÁ ( 350ml )
DELETE FROM recipe_ingredient_items WHERE recipe_id = '06c6fbdc-64f7-455e-9204-1a32bb6862e7';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('06c6fbdc-64f7-455e-9204-1a32bb6862e7', 'internal', '3a2a0d84-76fe-4155-9716-b048677a8f33', 'Cacao nguyên chất Bạch Dương', 10.0, 'g', 330.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('06c6fbdc-64f7-455e-9204-1a32bb6862e7', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 40.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('06c6fbdc-64f7-455e-9204-1a32bb6862e7', 'internal', '37b41c9b-4142-4558-a3d9-07a0e723c3ba', 'Kem Béo Thực Vật Ice Hot Rich', 10.0, 'ml', 70.5);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('06c6fbdc-64f7-455e-9204-1a32bb6862e7', 'internal', '788da4ab-1812-402b-b07b-5d635d509d25', 'Sữa dừa Amo Pastel', 30.0, 'ml', 68.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('06c6fbdc-64f7-455e-9204-1a32bb6862e7', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 170.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('06c6fbdc-64f7-455e-9204-1a32bb6862e7', 'external', 'ee84efa3-d67f-42dc-9628-019f72eb5dde', 'Kem trứng', 20.0, 'g', 86.7);
UPDATE cong_thuc SET total_cost = 9973 WHERE id = '06c6fbdc-64f7-455e-9204-1a32bb6862e7';

-- CAFÉ KEM TRỨNG NÓNG (Cốc có quai 200ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'c72c33f8-fd9c-45a1-a994-0c6cd292fbc5';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c72c33f8-fd9c-45a1-a994-0c6cd292fbc5', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 25.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c72c33f8-fd9c-45a1-a994-0c6cd292fbc5', 'external', '20349f6d-2a5f-4996-8d1b-a24e1d05763b', 'Cốt cafe', 40.0, 'ml', 255.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c72c33f8-fd9c-45a1-a994-0c6cd292fbc5', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 70.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c72c33f8-fd9c-45a1-a994-0c6cd292fbc5', 'external', 'ee84efa3-d67f-42dc-9628-019f72eb5dde', 'Kem trứng', 20.0, 'g', 86.7);
UPDATE cong_thuc SET total_cost = 13269 WHERE id = 'c72c33f8-fd9c-45a1-a994-0c6cd292fbc5';

-- CAFÉ KEM MUỐI (Cốc café đá 350ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '5d9fe4c4-3182-4e82-be52-c506397a04dc';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5d9fe4c4-3182-4e82-be52-c506397a04dc', 'external', '20349f6d-2a5f-4996-8d1b-a24e1d05763b', 'Cốt cafe', 40.0, 'ml', 255.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5d9fe4c4-3182-4e82-be52-c506397a04dc', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 20.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5d9fe4c4-3182-4e82-be52-c506397a04dc', 'external', 'ee84efa3-d67f-42dc-9628-019f72eb5dde', 'Kem trứng', 35.0, 'g', 86.7);
UPDATE cong_thuc SET total_cost = 14246 WHERE id = '5d9fe4c4-3182-4e82-be52-c506397a04dc';

-- CÁCH ĐÁNH KEM MUỐI Pha ~ 10 cốc (35gr / cốc ) ( 1 cốc dùng ~3 thìa định lượng đầy )
DELETE FROM recipe_ingredient_items WHERE recipe_id = '4000cd2f-0942-4299-abbc-a2c4342bc878';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('4000cd2f-0942-4299-abbc-a2c4342bc878', 'internal', '0e30982e-1448-4667-9ceb-1f2f2e049cda', 'Anchor whipping', 150.0, 'ml', 170.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('4000cd2f-0942-4299-abbc-a2c4342bc878', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 100.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('4000cd2f-0942-4299-abbc-a2c4342bc878', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 40.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('4000cd2f-0942-4299-abbc-a2c4342bc878', 'internal', '37b41c9b-4142-4558-a3d9-07a0e723c3ba', 'Kem Béo Thực Vật Ice Hot Rich', 50.0, 'ml', 70.5);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('4000cd2f-0942-4299-abbc-a2c4342bc878', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 20.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('4000cd2f-0942-4299-abbc-a2c4342bc878', 'external', '5a529f4c-ba55-4041-b29e-84e22dff4862', 'Muối', 4.0, 'g', 12.0);
UPDATE cong_thuc SET total_cost = 34797 WHERE id = '4000cd2f-0942-4299-abbc-a2c4342bc878';

-- BẠC XỈU ĐÁ (cốc 400ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'a22e70cb-cb57-49ca-8fe6-1084ba8dc1db';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('a22e70cb-cb57-49ca-8fe6-1084ba8dc1db', 'internal', '788da4ab-1812-402b-b07b-5d635d509d25', 'Sữa dừa Amo Pastel', 60.0, 'ml', 68.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('a22e70cb-cb57-49ca-8fe6-1084ba8dc1db', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 30.0, 'ml', 50.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('a22e70cb-cb57-49ca-8fe6-1084ba8dc1db', 'external', '20349f6d-2a5f-4996-8d1b-a24e1d05763b', 'Cốt cafe', 30.0, 'ml', 255.0);
UPDATE cong_thuc SET total_cost = 13248 WHERE id = 'a22e70cb-cb57-49ca-8fe6-1084ba8dc1db';

-- CAFÉ HẠT RANG XAY PHA PHIN (cốc có quai 200ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'b727f481-5e4e-4bb6-9f05-4a5ee4c6fa65';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b727f481-5e4e-4bb6-9f05-4a5ee4c6fa65', 'internal', 'b220bed2-4f47-4d1c-95df-7b92a045c060', 'Cafe phin rang xay số 5 Mộc Lam (xay sẵn)', 25.0, 'g', 258.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('b727f481-5e4e-4bb6-9f05-4a5ee4c6fa65', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 100.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 6550 WHERE id = 'b727f481-5e4e-4bb6-9f05-4a5ee4c6fa65';

-- CAFÉ ĐEN / NÂU PHA PHIN (cốc có quai 200ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'bad54d4e-7fe9-4821-9541-cf0d87e3513b';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('bad54d4e-7fe9-4821-9541-cf0d87e3513b', 'internal', 'b220bed2-4f47-4d1c-95df-7b92a045c060', 'Cafe phin rang xay số 5 Mộc Lam (xay sẵn)', 28.0, 'g', 258.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('bad54d4e-7fe9-4821-9541-cf0d87e3513b', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 80.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 7304 WHERE id = 'bad54d4e-7fe9-4821-9541-cf0d87e3513b';

-- CAFÉ NÂU PHA SẴN (cốc 200ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'bf2ab286-c235-4cb4-9ea0-5f56f183d6db';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('bf2ab286-c235-4cb4-9ea0-5f56f183d6db', 'external', '20349f6d-2a5f-4996-8d1b-a24e1d05763b', 'Cốt cafe', 50.0, 'ml', 255.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('bf2ab286-c235-4cb4-9ea0-5f56f183d6db', 'internal', '97dcb350-3433-4f62-9182-4e6c598feef5', 'Sữa đặc Ngôi Sao Phương Nam', 20.0, 'ml', 50.6);
UPDATE cong_thuc SET total_cost = 13762 WHERE id = 'bf2ab286-c235-4cb4-9ea0-5f56f183d6db';

-- CAFÉ ĐEN PHA SẴN (cốc 200ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'edaf3321-3b7d-453c-9a95-f6240656bc5a';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('edaf3321-3b7d-453c-9a95-f6240656bc5a', 'external', '20349f6d-2a5f-4996-8d1b-a24e1d05763b', 'Cốt cafe', 50.0, 'ml', 255.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('edaf3321-3b7d-453c-9a95-f6240656bc5a', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 10.0, 'ml', 35.0);
UPDATE cong_thuc SET total_cost = 13100 WHERE id = 'edaf3321-3b7d-453c-9a95-f6240656bc5a';

-- CAFÉ HẠT RANG XAY PHA SẴN PHIN TO (200g, Chuẩn bị trước)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '23371ec3-4901-4dcc-af43-4f85a7cfa3da';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('23371ec3-4901-4dcc-af43-4f85a7cfa3da', 'internal', 'f3c7017d-d5a7-439d-8303-cdc7f70a7755', 'Cafe hạt tổng hợp nguyên chất (chưa xay)', 200.0, 'g', 245.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('23371ec3-4901-4dcc-af43-4f85a7cfa3da', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 750.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 49750 WHERE id = '23371ec3-4901-4dcc-af43-4f85a7cfa3da';

-- CAFÉ SỐ 5 PHA SẴN PHIN TO (200g, Chuẩn bị trước)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'cddd49e9-29c3-4e72-b07c-e92748efda0e';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('cddd49e9-29c3-4e72-b07c-e92748efda0e', 'internal', 'b220bed2-4f47-4d1c-95df-7b92a045c060', 'Cafe phin rang xay số 5 Mộc Lam (xay sẵn)', 200.0, 'g', 258.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('cddd49e9-29c3-4e72-b07c-e92748efda0e', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 750.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 52350 WHERE id = 'cddd49e9-29c3-4e72-b07c-e92748efda0e';

-- OLONG KHOAI MÔN
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'e1f39e56-d662-44b2-a2a3-c0eff5e929d9';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e1f39e56-d662-44b2-a2a3-c0eff5e929d9', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e1f39e56-d662-44b2-a2a3-c0eff5e929d9', 'internal', 'a4ae8d4f-f6d8-40ef-9220-122829e1db4d', 'Bột Kem Không Sữa Mộc Lam ( Truyền Thống)', 25.0, 'g', 83.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e1f39e56-d662-44b2-a2a3-c0eff5e929d9', 'internal', 'd11a786e-261e-4337-92a3-b80c0fc33072', 'Bột khoai môn Binbaoli', 17.0, 'g', 132.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e1f39e56-d662-44b2-a2a3-c0eff5e929d9', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Trà Olong Truyền Thống'), 'Cốt Trà Olong Truyền Thống', 80.0, 'ml', 8.3333);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e1f39e56-d662-44b2-a2a3-c0eff5e929d9', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 20.0, 'ml', 35.0);
UPDATE cong_thuc SET total_cost = 5736 WHERE id = 'e1f39e56-d662-44b2-a2a3-c0eff5e929d9';

-- OLONG BÍ ĐAO ĐẬM VỊ (Cốc 500ml)
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'fff5c86d-e471-4f65-8dc6-3d76fbbf8b86';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('fff5c86d-e471-4f65-8dc6-3d76fbbf8b86', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 30.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('fff5c86d-e471-4f65-8dc6-3d76fbbf8b86', 'internal', 'a4ae8d4f-f6d8-40ef-9220-122829e1db4d', 'Bột Kem Không Sữa Mộc Lam ( Truyền Thống)', 25.0, 'g', 83.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('fff5c86d-e471-4f65-8dc6-3d76fbbf8b86', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Trà Olong Truyền Thống'), 'Cốt Trà Olong Truyền Thống', 130.0, 'ml', 8.3333);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('fff5c86d-e471-4f65-8dc6-3d76fbbf8b86', 'internal', 'f8fdf711-e103-4462-b9f0-358e02ea4077', 'Siro bí đao Bạch Dương', 35.0, 'ml', 62.0);
UPDATE cong_thuc SET total_cost = 5358 WHERE id = 'fff5c86d-e471-4f65-8dc6-3d76fbbf8b86';

-- CÁCH Ủ TRÀ OLONG
DELETE FROM recipe_ingredient_items WHERE recipe_id = '88888bd6-1f85-4d60-a10d-e798f8205129';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('88888bd6-1f85-4d60-a10d-e798f8205129', 'internal', NULL, 'Trà OLONG Truyền Thống Mộc Lam', 40.0, 'g', 250.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('88888bd6-1f85-4d60-a10d-e798f8205129', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 1000.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 11000 WHERE id = '88888bd6-1f85-4d60-a10d-e798f8205129';

-- SHAN TUYẾT GỪNG
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'e4286f9d-5402-4ae0-b94b-f71230c902f7';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e4286f9d-5402-4ae0-b94b-f71230c902f7', 'external', 'fafbb2bd-8b65-451b-84f2-35b473b0e580', 'Cốt trà sữa shan tuyết', 180.0, 'ml', 27.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e4286f9d-5402-4ae0-b94b-f71230c902f7', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 10.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e4286f9d-5402-4ae0-b94b-f71230c902f7', 'external', '82b378b0-e851-4032-a79f-4d1d2de47a24', 'Gừng tươi', 10.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e4286f9d-5402-4ae0-b94b-f71230c902f7', 'internal', 'f8fdf711-e103-4462-b9f0-358e02ea4077', 'Siro bí đao Bạch Dương', 35.0, 'ml', 62.0);
UPDATE cong_thuc SET total_cost = 7680 WHERE id = 'e4286f9d-5402-4ae0-b94b-f71230c902f7';

-- CÁCH LÀM CỐT GỪNG TƯƠI
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'cbf74ce5-ea8b-4796-ac19-e5f8934fa6c0';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('cbf74ce5-ea8b-4796-ac19-e5f8934fa6c0', 'external', '82b378b0-e851-4032-a79f-4d1d2de47a24', 'Gừng tươi', 50.0, 'g', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('cbf74ce5-ea8b-4796-ac19-e5f8934fa6c0', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 100.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 1600 WHERE id = 'cbf74ce5-ea8b-4796-ac19-e5f8934fa6c0';

-- SHAN TUYẾT BÍ ĐAO
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'f163b169-6573-4c16-9fff-ae9bcda0f5e3';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f163b169-6573-4c16-9fff-ae9bcda0f5e3', 'external', 'fafbb2bd-8b65-451b-84f2-35b473b0e580', 'Cốt trà sữa shan tuyết', 180.0, 'ml', 27.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f163b169-6573-4c16-9fff-ae9bcda0f5e3', 'internal', 'f8fdf711-e103-4462-b9f0-358e02ea4077', 'Siro bí đao Bạch Dương', 35.0, 'ml', 62.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f163b169-6573-4c16-9fff-ae9bcda0f5e3', 'external', '8fc2c13a-86f6-4173-8979-c0726e2e4eaa', 'Trân châu đường đen', 1.0, 'thìa', 96.3);
UPDATE cong_thuc SET total_cost = 7126 WHERE id = 'f163b169-6573-4c16-9fff-ae9bcda0f5e3';

-- TRÀ SỮA SOCOLA
DELETE FROM recipe_ingredient_items WHERE recipe_id = '86b67655-26e9-420e-9344-322ba2eab3fc';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('86b67655-26e9-420e-9344-322ba2eab3fc', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 30.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('86b67655-26e9-420e-9344-322ba2eab3fc', 'internal', 'a32115d6-0f64-4757-856e-e772ccbf4eb7', 'Bột Socola đen sữa dừa', 15.0, 'g', 150.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('86b67655-26e9-420e-9344-322ba2eab3fc', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 15.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('86b67655-26e9-420e-9344-322ba2eab3fc', 'internal', '37b41c9b-4142-4558-a3d9-07a0e723c3ba', 'Kem Béo Thực Vật Ice Hot Rich', 10.0, 'ml', 70.5);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('86b67655-26e9-420e-9344-322ba2eab3fc', 'internal', 'b6e15959-1251-4f7f-850c-e16e1c779a4d', 'Sốt chocolate hershey', 20.0, 'ml', 106.6);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('86b67655-26e9-420e-9344-322ba2eab3fc', 'external', 'fafbb2bd-8b65-451b-84f2-35b473b0e580', 'Cốt trà sữa shan tuyết', 100.0, 'ml', 27.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('86b67655-26e9-420e-9344-322ba2eab3fc', 'external', '8fc2c13a-86f6-4173-8979-c0726e2e4eaa', 'Trân châu đường đen', 1.0, 'thìa', 96.3);
UPDATE cong_thuc SET total_cost = 8438 WHERE id = '86b67655-26e9-420e-9344-322ba2eab3fc';

-- TRÀ SỮA TRÂN CHÂU ĐƯỜNG ĐEN
DELETE FROM recipe_ingredient_items WHERE recipe_id = '5ca02e25-7deb-443f-9909-7ef3b29bffb8';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5ca02e25-7deb-443f-9909-7ef3b29bffb8', 'internal', NULL, 'Siro đường đen ColoMix', 5.0, 'ml', 65.4);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5ca02e25-7deb-443f-9909-7ef3b29bffb8', 'external', '8fc2c13a-86f6-4173-8979-c0726e2e4eaa', 'Trân châu đường đen', 2.0, 'thìa', 96.3);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5ca02e25-7deb-443f-9909-7ef3b29bffb8', 'external', 'fafbb2bd-8b65-451b-84f2-35b473b0e580', 'Cốt trà sữa shan tuyết', 180.0, 'ml', 27.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5ca02e25-7deb-443f-9909-7ef3b29bffb8', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 30.0, 'ml', 35.0);
UPDATE cong_thuc SET total_cost = 6430 WHERE id = '5ca02e25-7deb-443f-9909-7ef3b29bffb8';

-- TRÀ SỮA ĐẶC BIỆT FULL TOPPING
DELETE FROM recipe_ingredient_items WHERE recipe_id = '79a06240-b853-4fd5-a0eb-1e2db426ce9d';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('79a06240-b853-4fd5-a0eb-1e2db426ce9d', 'external', 'fafbb2bd-8b65-451b-84f2-35b473b0e580', 'Cốt trà sữa shan tuyết', 180.0, 'ml', 27.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('79a06240-b853-4fd5-a0eb-1e2db426ce9d', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 25.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('79a06240-b853-4fd5-a0eb-1e2db426ce9d', 'internal', NULL, 'Siro đường đen ColoMix', 5.0, 'ml', 65.4);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('79a06240-b853-4fd5-a0eb-1e2db426ce9d', 'external', '8fc2c13a-86f6-4173-8979-c0726e2e4eaa', 'Trân châu đường đen', 1.0, 'thìa', 96.3);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('79a06240-b853-4fd5-a0eb-1e2db426ce9d', 'external', 'ee84efa3-d67f-42dc-9628-019f72eb5dde', 'Kem trứng', 1.0, 'thìa', 86.7);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('79a06240-b853-4fd5-a0eb-1e2db426ce9d', 'internal', 'ef893cb4-a307-4cb7-9d11-b135e83093bc', 'Vụn dừa nướng', 5.0, 'g', 110.0);
UPDATE cong_thuc SET total_cost = 6795 WHERE id = '79a06240-b853-4fd5-a0eb-1e2db426ce9d';

-- SHAN TUYẾT SỮA
DELETE FROM recipe_ingredient_items WHERE recipe_id = '71f4f362-44ad-46bf-a7d4-0ce6d6e29ad4';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('71f4f362-44ad-46bf-a7d4-0ce6d6e29ad4', 'external', 'fafbb2bd-8b65-451b-84f2-35b473b0e580', 'Cốt trà sữa shan tuyết', 180.0, 'ml', 27.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('71f4f362-44ad-46bf-a7d4-0ce6d6e29ad4', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 40.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('71f4f362-44ad-46bf-a7d4-0ce6d6e29ad4', 'external', '8fc2c13a-86f6-4173-8979-c0726e2e4eaa', 'Trân châu đường đen', 1.0, 'thìa', 96.3);
UPDATE cong_thuc SET total_cost = 6356 WHERE id = '71f4f362-44ad-46bf-a7d4-0ce6d6e29ad4';

-- CÁC LOẠI TOPPING NẤU NHANH
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'fe08b8d6-1ecf-4f6b-805b-ed07c8dc6fde';
UPDATE cong_thuc SET total_cost = 0 WHERE id = 'fe08b8d6-1ecf-4f6b-805b-ed07c8dc6fde';

-- THẠCH TRỨNG (PUDDING TRỨNG)
DELETE FROM recipe_ingredient_items WHERE recipe_id = '5149e2fc-244e-4048-ae76-7462f25b91df';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5149e2fc-244e-4048-ae76-7462f25b91df', 'internal', 'f405c10a-4a57-4ed9-9748-20997c363184', 'Bột Pudding trứng Lermao', 100.0, 'g', 168.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5149e2fc-244e-4048-ae76-7462f25b91df', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 20.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('5149e2fc-244e-4048-ae76-7462f25b91df', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 700.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 18200 WHERE id = '5149e2fc-244e-4048-ae76-7462f25b91df';

-- CÁCH ĐÁNH KEM TRỨNG Pha ~ 15 cốc ( 1 cốc dùng 2 thìa định lượng )
DELETE FROM recipe_ingredient_items WHERE recipe_id = '8245bcc8-e887-4b9c-90f5-067e33c70a40';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('8245bcc8-e887-4b9c-90f5-067e33c70a40', 'internal', 'eeb90b64-dab0-47be-9e04-760bd561fb7d', 'Bột kem trứng Bạch Dương', 100.0, 'g', 145.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('8245bcc8-e887-4b9c-90f5-067e33c70a40', 'internal', 'a3307afe-ca3e-45e8-92a9-53805c929adf', 'Sữa tươi tiệt trùng HAPPY BARN Ba Lan ( không đường)', 120.0, 'ml', 30.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('8245bcc8-e887-4b9c-90f5-067e33c70a40', 'internal', '37b41c9b-4142-4558-a3d9-07a0e723c3ba', 'Kem Béo Thực Vật Ice Hot Rich', 100.0, 'ml', 70.5);
UPDATE cong_thuc SET total_cost = 25150 WHERE id = '8245bcc8-e887-4b9c-90f5-067e33c70a40';

-- CÁCH LÀM ĐƯỜNG NƯỚC Loại đường : Đường phèn Tỷ lệ : 1kg + 600ml nước sôi
DELETE FROM recipe_ingredient_items WHERE recipe_id = '7d1fd3ce-c615-4e1e-85de-3f3198e434f2';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('7d1fd3ce-c615-4e1e-85de-3f3198e434f2', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 600.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('7d1fd3ce-c615-4e1e-85de-3f3198e434f2', 'internal', '484bc81a-c563-485d-a06f-1b33ba0d78d0', 'Đường phèn Đăng Thư', 1000.0, 'g', 54.2);
UPDATE cong_thuc SET total_cost = 54800 WHERE id = '7d1fd3ce-c615-4e1e-85de-3f3198e434f2';

-- NẤU TRÂN CHÂU ĐƯỜNG ĐEN ( 400g ) Pha ~ 15 cốc
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'da760913-6de2-44b9-882d-b58d8b00b9df';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('da760913-6de2-44b9-882d-b58d8b00b9df', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 2500.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('da760913-6de2-44b9-882d-b58d8b00b9df', 'internal', '4536788a-aadc-4df5-b341-3634c6ff2af8', 'Trân châu đen nấu nhanh Lermao', 400.0, 'g', 66.0);
UPDATE cong_thuc SET total_cost = 28900 WHERE id = 'da760913-6de2-44b9-882d-b58d8b00b9df';

-- CÁCH LÀM BÌNH KHÍ KOMBUCHA SODA
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'f7873d25-6956-483f-98cf-115dfab7b85f';
UPDATE cong_thuc SET total_cost = 0 WHERE id = 'f7873d25-6956-483f-98cf-115dfab7b85f';

-- MÃNG CẦU
DELETE FROM recipe_ingredient_items WHERE recipe_id = '77cba61d-aba1-4beb-b744-f4956d80557e';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('77cba61d-aba1-4beb-b744-f4956d80557e', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('77cba61d-aba1-4beb-b744-f4956d80557e', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 60.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('77cba61d-aba1-4beb-b744-f4956d80557e', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('77cba61d-aba1-4beb-b744-f4956d80557e', 'internal', 'f333d2e3-ae86-438b-a0ef-0b6b532c5cca', 'Mứt mãng cầu La Fresh', 50.0, 'g', 128.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('77cba61d-aba1-4beb-b744-f4956d80557e', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 10.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('77cba61d-aba1-4beb-b744-f4956d80557e', 'external', '878bdbbb-a226-429e-a451-a7f96692801c', 'Bạc hà', 1.0, 'lá', 80.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('77cba61d-aba1-4beb-b744-f4956d80557e', 'external', 'cdc8fa5f-02cb-4e10-be4a-3c16b079d2dd', 'Dâu tây', 1.0, 'quả', 95.0);
UPDATE cong_thuc SET total_cost = 10402 WHERE id = '77cba61d-aba1-4beb-b744-f4956d80557e';

-- CHANH LEO
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'ba787f2b-702c-4daa-a1e9-709b32212da7';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ba787f2b-702c-4daa-a1e9-709b32212da7', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ba787f2b-702c-4daa-a1e9-709b32212da7', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 60.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ba787f2b-702c-4daa-a1e9-709b32212da7', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ba787f2b-702c-4daa-a1e9-709b32212da7', 'external', 'a4b9edf1-c107-48de-bec5-fab2fe5e2f2e', 'Chanh leo', 30.0, 'g', 70.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('ba787f2b-702c-4daa-a1e9-709b32212da7', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 35.0, 'ml', 35.0);
UPDATE cong_thuc SET total_cost = 6802 WHERE id = 'ba787f2b-702c-4daa-a1e9-709b32212da7';

-- TRÀ ĐÀO CAM SẢ
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'f4d3117c-49c6-448b-8cac-c2bb93e15ebf';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f4d3117c-49c6-448b-8cac-c2bb93e15ebf', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f4d3117c-49c6-448b-8cac-c2bb93e15ebf', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 60.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f4d3117c-49c6-448b-8cac-c2bb93e15ebf', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 15.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f4d3117c-49c6-448b-8cac-c2bb93e15ebf', 'external', '9f65d03f-a547-4399-b368-3fc56af99132', 'Cốt sả', 30.0, 'ml', 15.2);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f4d3117c-49c6-448b-8cac-c2bb93e15ebf', 'external', '2e02e386-1d1a-4505-bb96-aea213f64f17', 'Nước cam', 30.0, 'ml', 10.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f4d3117c-49c6-448b-8cac-c2bb93e15ebf', 'external', 'd086d014-ee8e-4fff-ad62-12d754ec44a7', 'Chanh thơm', 5.0, 'ml', 90.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f4d3117c-49c6-448b-8cac-c2bb93e15ebf', 'internal', '12b3083a-aa7d-4106-9064-2778b12ba348', 'Mứt Mật Ong Đào Mao Mao', 40.0, 'ml', 80.9);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f4d3117c-49c6-448b-8cac-c2bb93e15ebf', 'external', '806c7cba-d28f-4aff-afaf-63df1fc20df6', 'Cam vàng (lát)', 1.0, 'lát', 1000.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('f4d3117c-49c6-448b-8cac-c2bb93e15ebf', 'internal', '22bdb92c-b872-4004-bc08-59131984c0ca', 'Đào ngâm Countree', 30.0, 'g', 39.0);
UPDATE cong_thuc SET total_cost = 10564 WHERE id = 'f4d3117c-49c6-448b-8cac-c2bb93e15ebf';

-- CÁCH LÀM CỐT SẢ
DELETE FROM recipe_ingredient_items WHERE recipe_id = '253791f9-d5b6-4ff3-9079-7ac9097ba373';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('253791f9-d5b6-4ff3-9079-7ac9097ba373', 'external', 'dc09be4f-aa4c-4704-98c0-f083080a710a', 'Sả Tươi', 20.0, 'g', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('253791f9-d5b6-4ff3-9079-7ac9097ba373', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 60.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 760 WHERE id = '253791f9-d5b6-4ff3-9079-7ac9097ba373';

-- ĐÀO NHIỆT ĐỚI
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'c739b3bd-ad86-4759-87e3-6bd73a67d55c';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c739b3bd-ad86-4759-87e3-6bd73a67d55c', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c739b3bd-ad86-4759-87e3-6bd73a67d55c', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 60.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c739b3bd-ad86-4759-87e3-6bd73a67d55c', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c739b3bd-ad86-4759-87e3-6bd73a67d55c', 'internal', '12b3083a-aa7d-4106-9064-2778b12ba348', 'Mứt Mật Ong Đào Mao Mao', 45.0, 'g', 80.9);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c739b3bd-ad86-4759-87e3-6bd73a67d55c', 'internal', '22bdb92c-b872-4004-bc08-59131984c0ca', 'Đào ngâm Countree', 50.0, 'g', 39.0);
UPDATE cong_thuc SET total_cost = 9067 WHERE id = 'c739b3bd-ad86-4759-87e3-6bd73a67d55c';

-- TRÀ ỔI HỒNG
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'd1b570da-2615-4fb5-b8b0-e88e04187f2d';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d1b570da-2615-4fb5-b8b0-e88e04187f2d', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d1b570da-2615-4fb5-b8b0-e88e04187f2d', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 60.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d1b570da-2615-4fb5-b8b0-e88e04187f2d', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d1b570da-2615-4fb5-b8b0-e88e04187f2d', 'internal', 'ad919856-de26-4751-8f6e-3fc1f67f4914', 'Mứt Ổi hồng', 45.0, 'g', 115.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d1b570da-2615-4fb5-b8b0-e88e04187f2d', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 15.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d1b570da-2615-4fb5-b8b0-e88e04187f2d', 'external', '878bdbbb-a226-429e-a451-a7f96692801c', 'Bạc hà', 1.0, 'lá', 80.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('d1b570da-2615-4fb5-b8b0-e88e04187f2d', 'external', 'd7fee01f-0efe-4308-a99c-61803ebd231b', 'Chanh vàng (lát)', 1.0, 'lát', 800.0);
UPDATE cong_thuc SET total_cost = 10057 WHERE id = 'd1b570da-2615-4fb5-b8b0-e88e04187f2d';

-- TRÀ VẢI HOA HỒNG
DELETE FROM recipe_ingredient_items WHERE recipe_id = '19710c6a-7806-47bf-af9a-0bf624ba1ddc';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('19710c6a-7806-47bf-af9a-0bf624ba1ddc', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('19710c6a-7806-47bf-af9a-0bf624ba1ddc', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 60.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('19710c6a-7806-47bf-af9a-0bf624ba1ddc', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('19710c6a-7806-47bf-af9a-0bf624ba1ddc', 'internal', 'aaf235eb-62aa-472d-b1b3-5585721dd970', 'Mứt Vải Hoa hồng ColoMix', 45.0, 'ml', 138.9);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('19710c6a-7806-47bf-af9a-0bf624ba1ddc', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 5.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('19710c6a-7806-47bf-af9a-0bf624ba1ddc', 'external', '878bdbbb-a226-429e-a451-a7f96692801c', 'Bạc hà', 1.0, 'lá', 80.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('19710c6a-7806-47bf-af9a-0bf624ba1ddc', 'external', 'd7fee01f-0efe-4308-a99c-61803ebd231b', 'Chanh vàng (lát)', 1.0, 'lát', 800.0);
UPDATE cong_thuc SET total_cost = 10782 WHERE id = '19710c6a-7806-47bf-af9a-0bf624ba1ddc';

-- TRÀ BÒNG BƯỞI
DELETE FROM recipe_ingredient_items WHERE recipe_id = '9b25fb69-b335-4657-a8cb-b8955f00b9fe';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('9b25fb69-b335-4657-a8cb-b8955f00b9fe', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('9b25fb69-b335-4657-a8cb-b8955f00b9fe', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 60.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('9b25fb69-b335-4657-a8cb-b8955f00b9fe', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('9b25fb69-b335-4657-a8cb-b8955f00b9fe', 'internal', '7807cc63-4808-453f-9ee6-fc2aadb072d3', 'Mứt Bưởi mật ong ColoMix', 45.0, 'ml', 134.4);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('9b25fb69-b335-4657-a8cb-b8955f00b9fe', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 5.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('9b25fb69-b335-4657-a8cb-b8955f00b9fe', 'external', '878bdbbb-a226-429e-a451-a7f96692801c', 'Bạc hà', 1.0, 'lá', 80.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('9b25fb69-b335-4657-a8cb-b8955f00b9fe', 'external', '806c7cba-d28f-4aff-afaf-63df1fc20df6', 'Cam vàng (lát)', 1.0, 'lát', 1000.0);
UPDATE cong_thuc SET total_cost = 10780 WHERE id = '9b25fb69-b335-4657-a8cb-b8955f00b9fe';

-- DÂU TÂY
DELETE FROM recipe_ingredient_items WHERE recipe_id = '67aff2bf-8b58-4d51-9f04-ebba9b78aa86';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('67aff2bf-8b58-4d51-9f04-ebba9b78aa86', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('67aff2bf-8b58-4d51-9f04-ebba9b78aa86', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 60.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('67aff2bf-8b58-4d51-9f04-ebba9b78aa86', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('67aff2bf-8b58-4d51-9f04-ebba9b78aa86', 'internal', NULL, 'Mứt dâu Lermao', 45.0, 'g', 84.6);
UPDATE cong_thuc SET total_cost = 7284 WHERE id = '67aff2bf-8b58-4d51-9f04-ebba9b78aa86';

-- LỰU CAM VÀNG
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'c4742522-74b4-43e6-a8df-fed6ace3a45f';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c4742522-74b4-43e6-a8df-fed6ace3a45f', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c4742522-74b4-43e6-a8df-fed6ace3a45f', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 60.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c4742522-74b4-43e6-a8df-fed6ace3a45f', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c4742522-74b4-43e6-a8df-fed6ace3a45f', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 10.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c4742522-74b4-43e6-a8df-fed6ace3a45f', 'internal', 'ec3372db-0bd6-4cc3-8434-88f7da9d5b5d', 'Siro Lựu ColoMix', 35.0, 'ml', 128.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c4742522-74b4-43e6-a8df-fed6ace3a45f', 'external', '878bdbbb-a226-429e-a451-a7f96692801c', 'Bạc hà', 1.0, 'lá', 80.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('c4742522-74b4-43e6-a8df-fed6ace3a45f', 'external', '806c7cba-d28f-4aff-afaf-63df1fc20df6', 'Cam vàng (lát)', 1.0, 'lát', 1000.0);
UPDATE cong_thuc SET total_cost = 9387 WHERE id = 'c4742522-74b4-43e6-a8df-fed6ace3a45f';

-- CÁCH Ủ LỤC TRÀ Tỷ lệ : 30g + 1000ml nước sôi Thành Phẩm ~ 900ml cốt lục trà
DELETE FROM recipe_ingredient_items WHERE recipe_id = '0455de48-18b9-40b8-b3ad-1e08c6dc092a';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0455de48-18b9-40b8-b3ad-1e08c6dc092a', 'internal', 'a2c02d5b-6cb5-4359-b04b-6cbb0b842187', 'Lục Trà Nhài Mộc Lam', 30.0, 'g', 365.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('0455de48-18b9-40b8-b3ad-1e08c6dc092a', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 1000.0, 'ml', 1.0);
UPDATE cong_thuc SET total_cost = 11950 WHERE id = '0455de48-18b9-40b8-b3ad-1e08c6dc092a';

-- Thạch Lá Nếp
DELETE FROM recipe_ingredient_items WHERE recipe_id = '3afe262c-c5ec-4574-90fd-8d73ddd482d2';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3afe262c-c5ec-4574-90fd-8d73ddd482d2', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 400.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3afe262c-c5ec-4574-90fd-8d73ddd482d2', 'internal', NULL, 'Bột thạch Jelly Power', 60.0, 'g', 120.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3afe262c-c5ec-4574-90fd-8d73ddd482d2', 'external', 'b9ef36be-9a43-4f4b-835a-5e94c8c50466', 'Mứt lá dứa', 15.0, 'ml', 130.0);
UPDATE cong_thuc SET total_cost = 9550 WHERE id = '3afe262c-c5ec-4574-90fd-8d73ddd482d2';

-- THẠCH BI / TRÁI CÂY
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'e2a052c4-997b-48eb-9a0f-53d352e39fd6';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e2a052c4-997b-48eb-9a0f-53d352e39fd6', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 400.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('e2a052c4-997b-48eb-9a0f-53d352e39fd6', 'internal', NULL, 'Bột thạch Jelly Power', 60.0, 'g', 120.0);
UPDATE cong_thuc SET total_cost = 7600 WHERE id = 'e2a052c4-997b-48eb-9a0f-53d352e39fd6';

-- TRÀ CHANH HOÀNG KIM
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'eedc6cf9-f3c8-4f4d-a27c-adcae88c66c6';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('eedc6cf9-f3c8-4f4d-a27c-adcae88c66c6', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('eedc6cf9-f3c8-4f4d-a27c-adcae88c66c6', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 60.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('eedc6cf9-f3c8-4f4d-a27c-adcae88c66c6', 'internal', 'd43a7098-db12-4ee3-a4d1-b385b76a73c7', 'Siro nhiệt đới Mao Mao', 5.0, 'ml', 119.2);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('eedc6cf9-f3c8-4f4d-a27c-adcae88c66c6', 'external', '43a31ae2-329f-4238-8053-421b56551b30', 'Đường', 30.0, 'ml', 35.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('eedc6cf9-f3c8-4f4d-a27c-adcae88c66c6', 'external', 'd086d014-ee8e-4fff-ad62-12d754ec44a7', 'Chanh thơm', 15.0, 'ml', 90.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('eedc6cf9-f3c8-4f4d-a27c-adcae88c66c6', 'external', 'd785c74a-8bc1-41b8-b73f-2f95c7805221', 'Nước lọc', 50.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('eedc6cf9-f3c8-4f4d-a27c-adcae88c66c6', 'external', 'd7fee01f-0efe-4308-a99c-61803ebd231b', 'Chanh vàng (lát)', 1.0, 'lát', 800.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('eedc6cf9-f3c8-4f4d-a27c-adcae88c66c6', 'external', '878bdbbb-a226-429e-a451-a7f96692801c', 'Bạc hà', 1.0, 'lá', 80.0);
UPDATE cong_thuc SET total_cost = 7353 WHERE id = 'eedc6cf9-f3c8-4f4d-a27c-adcae88c66c6';

-- DƯA LƯỚI
DELETE FROM recipe_ingredient_items WHERE recipe_id = '3da2f9ff-4b53-4f4a-bcca-ea1eb2a1f504';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3da2f9ff-4b53-4f4a-bcca-ea1eb2a1f504', 'external', (SELECT id FROM external_ingredients WHERE name = 'Cốt Lục Trà Nhài'), 'Cốt Lục Trà Nhài', 40.0, 'ml', 12.1667);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3da2f9ff-4b53-4f4a-bcca-ea1eb2a1f504', 'internal', '15ea5062-b84f-4079-a62e-1f4d09343637', 'Trà Kombucha ColoMix', 60.0, 'ml', 49.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3da2f9ff-4b53-4f4a-bcca-ea1eb2a1f504', 'internal', 'c6e944c6-6421-4e87-a1dc-0fd8c9118fa8', 'Mứt Dưa lưới ColoMix', 45.0, 'g', 95.8);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3da2f9ff-4b53-4f4a-bcca-ea1eb2a1f504', 'external', '878bdbbb-a226-429e-a451-a7f96692801c', 'Bạc hà', 1.0, 'lá', 80.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('3da2f9ff-4b53-4f4a-bcca-ea1eb2a1f504', 'external', 'd7fee01f-0efe-4308-a99c-61803ebd231b', 'Chanh vàng (lát)', 1.0, 'lát', 800.0);
UPDATE cong_thuc SET total_cost = 8618 WHERE id = '3da2f9ff-4b53-4f4a-bcca-ea1eb2a1f504';

-- CỐT TRÀ SỮA SHAN TUYẾT
DELETE FROM recipe_ingredient_items WHERE recipe_id = 'db5c8363-1f23-4149-b946-f3143339e225';
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('db5c8363-1f23-4149-b946-f3143339e225', 'internal', '5ef37617-fb89-42aa-b540-c3fceceb07ee', 'Trà Shan Tuyết Mộc Lam', 45.0, 'g', 359.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('db5c8363-1f23-4149-b946-f3143339e225', 'external', '418def02-e0ff-4936-9a1d-2e7cb99f63c0', 'Nước nóng', 1000.0, 'ml', 1.0);
INSERT INTO recipe_ingredient_items (recipe_id, source, ingredient_id, name, quantity, unit, cost_per_unit) VALUES ('db5c8363-1f23-4149-b946-f3143339e225', 'internal', 'a4ae8d4f-f6d8-40ef-9220-122829e1db4d', 'Bột Kem Không Sữa Mộc Lam ( Truyền Thống)', 130.0, 'g', 83.0);
UPDATE cong_thuc SET total_cost = 27945 WHERE id = 'db5c8363-1f23-4149-b946-f3143339e225';
