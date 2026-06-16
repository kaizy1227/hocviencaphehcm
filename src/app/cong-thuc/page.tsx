'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';

type Recipe = {
  id: number; name: string; shortName: string; cat: string;
  steps: string[]; ingredients: string[]; cost: string;
  img: string; ingPreview: string[]; course: string;
  linkedProductNames: string[];
};

type Product = {
  id: string; name: string; unit: string; price: number; image_url: string; category: string;
};

const RECIPES: Recipe[] = [
  {id:1,name:'Kombucha Gừng Mật Ong',shortName:'Gừng Mật Ong',cat:'Kombucha',steps:['Pha kombucha base 200ml','Thêm 20ml siro gừng','Thêm 15ml mật ong','Thêm đá, khuấy đều','Trang trí lát gừng'],ingredients:['Kombucha base','Siro gừng','Mật ong','Đá viên','Gừng tươi'],cost:'18.000đ',img:'35. Coldbrew Kombucha ổi bg.webp',ingPreview:['Kombucha base','Siro gừng','Mật ong'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha','Mật ong Gấu Xuân Lộc','Mật ong Eurodeli']},
  {id:2,name:'Kombucha Dâu Tây',shortName:'Dâu Tây',cat:'Kombucha',steps:['Pha kombucha base 200ml','Thêm 30ml siro dâu','Thêm đá, khuấy đều','Trang trí dâu tươi'],ingredients:['Kombucha base','Siro dâu','Dâu tươi','Đá viên'],cost:'20.000đ',img:'37. Kombucha chanh dâu bg.webp',ingPreview:['Kombucha base','Siro dâu','Dâu tươi'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha','Mứt Dâu Mao Mao','Mứt Dâu Đan Đông']},
  {id:3,name:'Kombucha Chanh Leo',shortName:'Chanh Leo',cat:'Kombucha',steps:['Pha kombucha base 200ml','Vắt 1/2 chanh','Thêm 20ml siro chanh leo','Thêm đá, khuấy đều'],ingredients:['Kombucha base','Chanh tươi','Siro chanh leo','Đá viên'],cost:'18.000đ',img:'38. Kombucha chanh vàng bg.webp',ingPreview:['Kombucha base','Chanh tươi','Siro chanh leo'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha','Chanh nước hoa Nam Dương']},
  {id:4,name:'Kombucha Việt Quất',shortName:'Việt Quất',cat:'Kombucha',steps:['Pha kombucha base 200ml','Thêm 25ml siro việt quất','Thêm đá, khuấy đều','Trang trí việt quất'],ingredients:['Kombucha base','Siro việt quất','Việt quất tươi','Đá viên'],cost:'22.000đ',img:'3. Lục ngọc thiên hương bg.webp',ingPreview:['Kombucha base','Siro việt quất','Việt quất'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha','Siro Boduo Việt Quất','Mứt Việt Quất Lermao']},
  {id:5,name:'Kombucha Đào',shortName:'Đào',cat:'Kombucha',steps:['Pha kombucha base 200ml','Thêm 25ml siro đào','Thêm đá, khuấy đều','Trang trí lát đào'],ingredients:['Kombucha base','Siro đào','Đá viên'],cost:'19.000đ',img:'39. Kombucha táo đào bg.webp',ingPreview:['Kombucha base','Siro đào'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha','Mứt Mật Ong Đào Mao Mao','Mứt đào ICE HOT']},
  {id:6,name:'Kombucha Lựu',shortName:'Lựu',cat:'Kombucha',steps:['Pha kombucha base 200ml','Thêm 20ml nước lựu','Thêm 10ml siro','Thêm đá, khuấy đều'],ingredients:['Kombucha base','Nước lựu','Siro đường','Đá viên'],cost:'21.000đ',img:'4. Túy lựu đào hoa bg.webp',ingPreview:['Kombucha base','Nước lựu','Siro đường'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha','Siro Lựu ColoMix']},
  {id:7,name:'Kombucha Xoài',shortName:'Xoài',cat:'Kombucha',steps:['Pha kombucha base 200ml','Thêm 25ml puree xoài','Thêm đá, khuấy đều','Trang trí lát xoài'],ingredients:['Kombucha base','Puree xoài','Đá viên'],cost:'19.000đ',img:'40. Kombucha xoài chanh leo bg.webp',ingPreview:['Kombucha base','Puree xoài'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha','Mứt Xoài Mao Mao']},
  {id:8,name:'Kombucha Bưởi Hồng',shortName:'Bưởi Hồng',cat:'Kombucha',steps:['Pha kombucha base 200ml','Thêm 25ml siro bưởi','Thêm đá, khuấy đều','Vắt bưởi tươi'],ingredients:['Kombucha base','Siro bưởi hồng','Bưởi tươi','Đá viên'],cost:'20.000đ',img:'7. Hồng trà vàng son sủi bọt bg.webp',ingPreview:['Kombucha base','Siro bưởi','Bưởi tươi'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha','Siro Bưởi Đỏ Wonderfull','Mứt Bưởi mật ong ColoMix']},
  {id:9,name:'Kombucha Dưa Hấu',shortName:'Dưa Hấu',cat:'Kombucha',steps:['Pha kombucha base 200ml','Thêm 30ml nước dưa hấu','Thêm đá, khuấy đều'],ingredients:['Kombucha base','Nước dưa hấu','Đá viên'],cost:'18.000đ',img:'2. Cung hỷ phát tài bg.webp',ingPreview:['Kombucha base','Nước dưa hấu'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha']},
  {id:10,name:'Kombucha Ổi',shortName:'Ổi',cat:'Kombucha',steps:['Pha kombucha base 200ml','Thêm 25ml siro ổi','Thêm đá, khuấy đều','Trang trí lát ổi'],ingredients:['Kombucha base','Siro ổi','Đá viên'],cost:'18.000đ',img:'35. Coldbrew Kombucha ổi bg.webp',ingPreview:['Kombucha base','Siro ổi'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha','Mứt Ổi hồng']},
  {id:11,name:'Kombucha Nho Đen',shortName:'Nho Đen',cat:'Kombucha',steps:['Pha kombucha base 200ml','Thêm 25ml nước nho đen','Thêm đá, khuấy đều','Trang trí nho'],ingredients:['Kombucha base','Nước nho đen','Đá viên'],cost:'21.000đ',img:'9. Hồng trà sữa bg.webp',ingPreview:['Kombucha base','Nước nho đen'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha','Mứt Nho Xanh Lermao']},
  {id:12,name:'Sinh Tố Bơ',shortName:'Sinh Tố Bơ',cat:'Sinh tố',steps:['Cho bơ 150g vào máy','Thêm 100ml sữa tươi','Thêm 2 thìa đường','Thêm đá, xay nhuyễn'],ingredients:['Bơ chín','Sữa tươi','Đường','Đá'],cost:'25.000đ',img:'32. Bơ già dừa non bg.webp',ingPreview:['Bơ','Sữa tươi','Đường'],course:'Tổng hợp hiện đại',linkedProductNames:['Sữa tươi tiệt trùng HAPPY BARN Ba Lan không đường','Sữa yến mạch Oatside','Đường phèn Đằng Thư']},
  {id:13,name:'Matcha Latte Đá',shortName:'Matcha Latte',cat:'Matcha',steps:['Hòa 3g matcha với 30ml nước nóng','Thêm 15ml siro đường','Thêm đá vào ly','Rót 150ml sữa','Đổ matcha lên trên'],ingredients:['Matcha bột','Nước nóng','Siro đường','Đá viên','Sữa tươi'],cost:'22.000đ',img:'14. Matcha latte bg.webp',ingPreview:['Matcha bột','Sữa tươi','Siro đường'],course:'Tổng hợp hiện đại',linkedProductNames:['Bột matcha trà xanh Bạch Dương','Bột matcha nhật Maya','Sữa tươi tiệt trùng HAPPY BARN Ba Lan không đường','Sữa yến mạch Oatside']},
  {id:14,name:'Matcha Espresso',shortName:'Matcha Espresso',cat:'Matcha',steps:['Pha 1 shot espresso','Hòa 3g matcha với 30ml nước','Thêm đá vào ly','Rót sữa 100ml','Đổ matcha rồi espresso lên'],ingredients:['Matcha bột','Espresso','Sữa tươi','Đá','Siro đường'],cost:'28.000đ',img:'13. Hồng ngọc matcha bg.webp',ingPreview:['Matcha','Espresso','Sữa'],course:'Tổng hợp hiện đại',linkedProductNames:['Bột matcha trà xanh Bạch Dương','Cafe hạt Arabica','Sữa tươi tiệt trùng HAPPY BARN Ba Lan không đường']},
  {id:15,name:'Matcha Dừa',shortName:'Matcha Dừa',cat:'Matcha',steps:['Hòa 3g matcha với nước nóng','Thêm đá vào ly','Rót 150ml nước cốt dừa','Đổ matcha lên trên','Trang trí dừa bào'],ingredients:['Matcha bột','Nước cốt dừa','Đá viên','Siro đường'],cost:'24.000đ',img:'15. Matcha creamy (1) bg.webp',ingPreview:['Matcha','Nước cốt dừa','Siro'],course:'Tổng hợp hiện đại',linkedProductNames:['Bột matcha trà xanh Bạch Dương','Nước cốt dừa Vico','Sữa dừa Amo Pastel']},
  {id:16,name:'Matcha Hồng Trà',shortName:'Matcha Hồng Trà',cat:'Matcha',steps:['Pha 150ml hồng trà','Hòa 3g matcha riêng','Thêm đá vào ly','Rót hồng trà','Đổ matcha lên trên'],ingredients:['Matcha bột','Hồng trà','Đá viên','Siro đường'],cost:'23.000đ',img:'16. Matcha milktea bg.webp',ingPreview:['Matcha','Hồng trà','Siro'],course:'Tổng hợp hiện đại',linkedProductNames:['Bột matcha trà xanh Bạch Dương','Hồng Trà Truyền Thống Mộc Lam']},
  {id:17,name:'Cà Phê Sữa Đá',shortName:'Cà Phê Sữa Đá',cat:'Cafe',steps:['Pha phin 30ml cà phê đậm','Thêm 20ml sữa đặc','Khuấy tan','Thêm đá vào ly','Rót cà phê sữa'],ingredients:['Cà phê robusta','Sữa đặc','Đá viên'],cost:'15.000đ',img:'21. Sữa đá bg.webp',ingPreview:['Cà phê robusta','Sữa đặc','Đá'],course:'Tổng hợp truyền thống',linkedProductNames:['Cafe phin rang xay số 5 Mộc Lam (xay sẵn)','Cafe hạt Robusta','Sữa đặc Ngôi Sao Phương Nam']},
  {id:18,name:'Bạc Xỉu',shortName:'Bạc Xỉu',cat:'Cafe',steps:['Pha phin 15ml cà phê nhạt','Thêm 30ml sữa đặc','Thêm 50ml sữa tươi','Khuấy đều','Thêm đá'],ingredients:['Cà phê','Sữa đặc','Sữa tươi','Đá'],cost:'18.000đ',img:'22. Bạc xỉu bg.webp',ingPreview:['Cà phê','Sữa đặc','Sữa tươi'],course:'Tổng hợp truyền thống',linkedProductNames:['Cafe phin rang xay số 5 Mộc Lam (xay sẵn)','Sữa đặc Ngôi Sao Phương Nam','Sữa tươi tiệt trùng HAPPY BARN Ba Lan không đường']},
  {id:19,name:'Cold Brew',shortName:'Cold Brew',cat:'Cafe',steps:['Ngâm 50g cà phê trong 500ml nước lạnh','Ngâm 12-18 giờ trong tủ lạnh','Lọc qua vải lọc','Rót vào ly đá','Có thể thêm sữa'],ingredients:['Cà phê arabica xay thô','Nước lọc lạnh','Đá viên'],cost:'28.000đ',img:'34. Coldbrew cam bg.webp',ingPreview:['Cà phê arabica','Nước lạnh'],course:'Tổng hợp truyền thống',linkedProductNames:['Cafe hạt Arabica','Cafe hạt tổng hợp nguyên chất (chưa xay)']},
  {id:20,name:'Espresso Tonic',shortName:'Espresso Tonic',cat:'Cafe',steps:['Pha 1 shot espresso để nguội','Cho đá vào ly','Rót 150ml nước tonic','Nhẹ nhàng đổ espresso lên','Trang trí lát chanh'],ingredients:['Espresso','Nước tonic','Đá viên','Chanh'],cost:'32.000đ',img:'31. Americano đào bg.webp',ingPreview:['Espresso','Nước tonic','Chanh'],course:'Tổng hợp truyền thống',linkedProductNames:['Cafe hạt Arabica','Cafe hạt Blend (Pha Máy)','Chanh nước hoa Nam Dương']},
  {id:21,name:'Cappuccino',shortName:'Cappuccino',cat:'Cafe',steps:['Pha 1 shot espresso','Steam sữa tạo foam dày','Rót sữa vào espresso','Thêm foam phủ lên trên','Rắc bột cacao'],ingredients:['Espresso','Sữa tươi','Bột cacao'],cost:'35.000đ',img:'30. Cappuccino nóng bg.webp',ingPreview:['Espresso','Sữa tươi','Foam'],course:'Tổng hợp truyền thống',linkedProductNames:['Cafe hạt Blend (Pha Máy)','Sữa tươi tiệt trùng HAPPY BARN Ba Lan không đường','Bột cacao nguyên chất Bạch Dương 500g']},
  {id:22,name:'Latte Art',shortName:'Latte Art',cat:'Cafe',steps:['Pha 1-2 shot espresso','Steam sữa tạo microfoam mịn','Rót sữa tạo latte art','Vẽ hoa/tim/rosetta'],ingredients:['Espresso','Sữa tươi'],cost:'38.000đ',img:'28. Latte nóng bg.webp',ingPreview:['Espresso','Sữa tươi','Kỹ thuật'],course:'Tổng hợp truyền thống',linkedProductNames:['Cafe hạt Blend (Pha Máy)','Sữa tươi tiệt trùng HAPPY BARN Ba Lan không đường','Sữa nước Amo không chất béo']},
  {id:23,name:'Americano',shortName:'Americano',cat:'Cafe',steps:['Pha 1-2 shot espresso','Thêm 150ml nước nóng','Khuấy nhẹ','Có thể dùng nóng hoặc lạnh'],ingredients:['Espresso','Nước nóng'],cost:'25.000đ',img:'24. Americano đá bg.webp',ingPreview:['Espresso','Nước nóng'],course:'Tổng hợp truyền thống',linkedProductNames:['Cafe hạt Blend (Pha Máy)','Cafe hạt Arabica']},
  {id:24,name:'Cà Phê Trứng',shortName:'Cà Phê Trứng',cat:'Cafe',steps:['Pha phin 40ml cà phê đậm','Đánh 1 lòng đỏ trứng + đường + sữa đặc','Đánh đến khi bông xốp','Đổ hỗn hợp trứng lên cà phê'],ingredients:['Cà phê','Lòng đỏ trứng','Sữa đặc','Đường'],cost:'22.000đ',img:'17. Đen đá bg.webp',ingPreview:['Cà phê','Trứng','Sữa đặc'],course:'Tổng hợp truyền thống',linkedProductNames:['Cafe phin rang xay số 5 Mộc Lam (xay sẵn)','Sữa đặc Ngôi Sao Phương Nam','Đường phèn Đằng Thư']},
  {id:25,name:'Cà Phê Muối',shortName:'Cà Phê Muối',cat:'Cafe',steps:['Pha phin 40ml cà phê','Đánh kem sữa + muối + đường','Đánh đến khi bông nhẹ','Rót cà phê vào ly','Đổ kem muối lên trên'],ingredients:['Cà phê','Sữa tươi','Muối hồng','Đường'],cost:'25.000đ',img:'23. Cà phê muối bg.webp',ingPreview:['Cà phê','Kem sữa','Muối hồng'],course:'Tổng hợp truyền thống',linkedProductNames:['Cafe phin rang xay số 5 Mộc Lam (xay sẵn)','Anchor whipping','Sữa tươi tiệt trùng HAPPY BARN Ba Lan không đường']},
  {id:26,name:'Flat White',shortName:'Flat White',cat:'Cafe',steps:['Pha 2 shot espresso ristretto','Steam sữa tạo microfoam rất mịn','Rót sữa vào espresso','Lớp foam mỏng 5mm'],ingredients:['Espresso ristretto','Sữa tươi nguyên chất'],cost:'38.000đ',img:'29. Latte nóng bg.webp',ingPreview:['Espresso','Sữa tươi'],course:'Tổng hợp truyền thống',linkedProductNames:['Cafe hạt Blend (Pha Máy)','Sữa tươi tiệt trùng HAPPY BARN Ba Lan không đường']},
  {id:27,name:'Cold Brew Tonic',shortName:'Cold Brew Tonic',cat:'Cafe',steps:['Chuẩn bị cold brew concentrate','Cho đá vào ly','Rót 120ml nước tonic','Đổ 60ml cold brew','Trang trí cam/chanh'],ingredients:['Cold brew concentrate','Nước tonic','Đá viên','Cam hoặc chanh'],cost:'35.000đ',img:'36. Đào xoài macchiato bg.webp',ingPreview:['Cold brew','Nước tonic','Cam'],course:'Tổng hợp truyền thống',linkedProductNames:['Cafe hạt Arabica','Cafe hạt tổng hợp nguyên chất (chưa xay)','Chanh nước hoa Nam Dương']},
  {id:28,name:'Trà Sữa Trân Châu',shortName:'Trà Sữa Trân Châu',cat:'Trà sữa',steps:['Pha 200ml hồng trà đặc','Thêm 40ml sữa đặc','Thêm 20ml sữa tươi','Cho trân châu vào ly','Thêm đá, rót trà sữa'],ingredients:['Hồng trà','Sữa đặc','Sữa tươi','Trân châu đen','Đá'],cost:'28.000đ',img:'49. Trà sữa trân châu đen bg.webp',ingPreview:['Hồng trà','Sữa','Trân châu'],course:'Tổng hợp hiện đại',linkedProductNames:['Hồng Trà Truyền Thống Mộc Lam','Sữa đặc Ngôi Sao Phương Nam','Trân châu đen nấu nhanh (ĐỒ ĐÔNG LẠNH)','Trân châu đen 3A Wonderfull']},
  {id:29,name:'Đá Xay Matcha',shortName:'Đá Xay Matcha',cat:'Đá xay',steps:['Hòa 5g matcha với 30ml nước','Thêm 15ml siro đường','Cho vào máy xay với đá và sữa','Xay nhuyễn mịn','Rót ra ly, trang trí kem'],ingredients:['Matcha bột','Sữa tươi','Đá','Siro đường','Kem tươi'],cost:'30.000đ',img:'18. Matcha Ice blended bg.webp',ingPreview:['Matcha','Sữa','Kem tươi'],course:'Tổng hợp hiện đại',linkedProductNames:['Bột matcha trà xanh Bạch Dương','Sữa tươi tiệt trùng HAPPY BARN Ba Lan không đường','Anchor whipping']},
  {id:30,name:'Đá Xay Cà Phê',shortName:'Đá Xay Cà Phê',cat:'Đá xay',steps:['Pha 40ml espresso để nguội','Cho vào máy xay với đá và sữa','Thêm 15ml siro cà phê','Xay nhuyễn','Rót ra ly, trang trí kem'],ingredients:['Espresso','Sữa tươi','Đá','Siro cà phê','Kem tươi'],cost:'32.000đ',img:'20. Caramel Ice Blended bg.webp',ingPreview:['Espresso','Sữa','Kem tươi'],course:'Tổng hợp hiện đại',linkedProductNames:['Cafe hạt Blend (Pha Máy)','Sữa tươi tiệt trùng HAPPY BARN Ba Lan không đường','Anchor whipping','Siro Caramel Maulin']},
  {id:31,name:'Đá Xay Dâu',shortName:'Đá Xay Dâu',cat:'Đá xay',steps:['Cho 100g dâu tươi vào máy','Thêm sữa 100ml','Thêm siro dâu 20ml','Thêm đá','Xay nhuyễn'],ingredients:['Dâu tươi','Sữa tươi','Siro dâu','Đá'],cost:'28.000đ',img:'47. Trà sữa dâu bg.webp',ingPreview:['Dâu tươi','Sữa','Siro dâu'],course:'Tổng hợp hiện đại',linkedProductNames:['Mứt Dâu Mao Mao','Sữa tươi tiệt trùng HAPPY BARN Ba Lan không đường','Siro mâm xôi ColoMix']},
  {id:32,name:'Đá Xay Xoài',shortName:'Đá Xay Xoài',cat:'Đá xay',steps:['Cho puree xoài 80ml vào máy','Thêm sữa 100ml','Thêm đá','Xay nhuyễn','Trang trí lát xoài'],ingredients:['Puree xoài','Sữa tươi','Đá','Siro đường'],cost:'28.000đ',img:'26. Matcha taro ice blended bg.webp',ingPreview:['Puree xoài','Sữa','Đá'],course:'Tổng hợp hiện đại',linkedProductNames:['Mứt Xoài Mao Mao','Sữa tươi tiệt trùng HAPPY BARN Ba Lan không đường']},
  {id:33,name:'Cocomilk Trân Châu',shortName:'Cocomilk',cat:'Cocomilk',steps:['Pha 150ml nước cốt dừa','Thêm 20ml sữa đặc','Thêm trân châu đen vào ly','Thêm đá','Rót nước cốt dừa vào'],ingredients:['Nước cốt dừa','Sữa đặc','Trân châu đen','Đá'],cost:'26.000đ',img:'27. Cà phê cốt dừa bg.webp',ingPreview:['Nước cốt dừa','Sữa đặc','Trân châu'],course:'Tổng hợp hiện đại',linkedProductNames:['Nước cốt dừa Vico','Sữa dừa Amo Pastel','Sữa đặc Ngôi Sao Phương Nam','Trân châu đen nấu nhanh (ĐỒ ĐÔNG LẠNH)']},
  {id:34,name:'Kombucha Soda Gừng',shortName:'Soda Gừng',cat:'Kombucha Soda',steps:['Cho 30ml siro gừng vào ly','Thêm đá','Rót 100ml kombucha','Rót 80ml soda','Khuấy nhẹ, trang trí gừng'],ingredients:['Kombucha','Soda','Siro gừng','Đá','Gừng tươi'],cost:'22.000đ',img:'5. Kim lý hoa quế bg.webp',ingPreview:['Kombucha','Soda','Siro gừng'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha','Mật ong Gấu Xuân Lộc']},
  {id:35,name:'Kombucha Soda Chanh Muối',shortName:'Soda Chanh Muối',cat:'Kombucha Soda',steps:['Cho muối hồng vào ly','Thêm siro đường và chanh vắt','Thêm đá','Rót kombucha','Rót soda lên trên'],ingredients:['Kombucha','Soda','Chanh tươi','Muối hồng','Siro đường'],cost:'22.000đ',img:'38. Kombucha chanh vàng bg.webp',ingPreview:['Kombucha','Soda','Chanh muối'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha','Chanh nước hoa Nam Dương']},
  {id:36,name:'Kombucha Soda Dứa',shortName:'Soda Dứa',cat:'Kombucha Soda',steps:['Cho 25ml puree dứa vào ly','Thêm siro đường 10ml','Thêm đá','Rót kombucha 100ml','Rót soda 80ml lên trên'],ingredients:['Kombucha','Soda','Puree dứa','Siro đường','Đá'],cost:'22.000đ',img:'40. Kombucha xoài chanh leo bg.webp',ingPreview:['Kombucha','Soda','Dứa'],course:'Tổng hợp hiện đại',linkedProductNames:['Trà Kombucha','Mứt Dứa (thơm) Lermao']},
];

const CATS = ['Tất cả','Kombucha','Cà Phê','Matcha','Đá Xay','Kombucha Soda','Trà Sữa','Sinh Tố','Cocomilk'];
const COURSES = ['Tất cả khóa','Tổng hợp hiện đại','Tổng hợp truyền thống'];
const CAT_CLASS: Record<string,string> = {
  'Kombucha':'cat-kombucha','Cafe':'cat-cafe','Matcha':'cat-matcha',
  'Đá xay':'cat-da-xay','Kombucha Soda':'cat-kombucha-soda',
  'Sinh tố':'cat-sinh-to','Trà sữa':'cat-tra-sua','Cocomilk':'cat-cocomilk',
};
const CAT_MAP: Record<string,string> = {
  'Cà Phê':'Cafe','Đá Xay':'Đá xay','Trà Sữa':'Trà sữa','Sinh Tố':'Sinh tố',
};

export default function CongThucPage() {
  const [activeCat, setActiveCat] = useState('Tất cả');
  const [activeCourse, setActiveCourse] = useState('Tất cả khóa');
  const [searchQ, setSearchQ] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [courseAccess, setCourseAccess] = useState<string[] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const { addItem, openCart } = useCart();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setIsLoggedIn(false); setCourseAccess([]); return; }
      setIsLoggedIn(true);
      if (user.app_metadata?.role === 'admin') { setIsAdmin(true); setCourseAccess(null); return; }
      const { data } = await supabase
        .from('students')
        .select('course_access')
        .eq('auth_user_id', user.id)
        .maybeSingle();
      setCourseAccess((data?.course_access as string[]) ?? []);
    });
    // Fetch all products once
    supabase.from('products').select('id,name,unit,price,image_url,category').eq('active', true).then(({ data }) => {
      if (data) setAllProducts(data);
    });
  }, []);

  const canView = (course: string) => isAdmin || (courseAccess?.includes(course) ?? false);
  // noAccess banner chỉ hiện với người ĐÃ đăng nhập nhưng chưa được cấp quyền khóa học
  const noAccess = isLoggedIn === true && !isAdmin && courseAccess !== null && courseAccess.length === 0;

  const filterKey = CAT_MAP[activeCat] ?? activeCat;
  const filtered = RECIPES.filter(r => {
    const matchCat = activeCat === 'Tất cả' || r.cat === filterKey;
    const matchCourse = activeCourse === 'Tất cả khóa' || r.course === activeCourse;
    const q = searchQ.toLowerCase();
    const matchQ = !q || r.name.toLowerCase().includes(q) || r.cat.toLowerCase().includes(q);
    return matchCat && matchCourse && matchQ;
  });

  const openModal = (r: Recipe) => { setSelectedRecipe(r); setModalOpen(true); setAddedIds(new Set()); };
  const closeModal = () => { setModalOpen(false); setSelectedRecipe(null); };

  const linkedProducts = selectedRecipe
    ? allProducts.filter(p => selectedRecipe.linkedProductNames.includes(p.name))
    : [];

  const handleAddToCart = useCallback((p: Product) => {
    addItem({ id: p.id, name: p.name, price: p.price, image_url: p.image_url, unit: p.unit });
    setAddedIds(prev => new Set([...prev, p.id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n; }), 1500);
  }, [addItem]);

  return (
    <>
      {/* HERO */}
      <section className="ct-hero">
        <div className="ct-hero-bg">
          <img src="/images/gallery/Concept-studio-with-products/43. Trà đào cam sả bg.webp" alt="Công Thức Đồ Uống" loading="eager" />
        </div>
        <div className="ct-hero-ov"></div>
        <div className="container">
          <div className="ct-hero-body">
            <div className="ct-hero-crumb">
              <Link href="/">Trang Chủ</Link>
              <i className="ti ti-chevron-right" style={{fontSize:'.75rem'}}></i>
              <span>Công Thức</span>
            </div>
            <h1>Kho Công Thức<br /><em>Đồ Uống</em></h1>
            <p className="ct-hero-sub">Hơn 36 công thức từ cà phê, trà sữa, matcha đến kombucha — độc quyền dành cho học viên Học Viện Cà Phê.</p>
            <div className="ct-hero-badges">
              <span className="ct-badge"><i className="ti ti-lock"></i> Nội dung độc quyền</span>
              <span className="ct-badge"><i className="ti ti-star"></i> 36+ công thức</span>
              <span className="ct-badge"><i className="ti ti-refresh"></i> Cập nhật thường xuyên</span>
            </div>
          </div>
        </div>
      </section>

      {/* ACCESS BANNER */}
      {noAccess && (
        <div className="ct-access-banner">
          <i className="ti ti-lock-access"></i>
          <div>
            <strong>Tài khoản chưa được cấp quyền xem công thức.</strong>
            <span> Vui lòng liên hệ Học Viện qua{' '}
              <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer">Zalo 0834 790 555</a>
              {' '}để được kích hoạt sau khi đăng ký khóa học.
            </span>
          </div>
        </div>
      )}

      {/* CONTROLS */}
      <div className="ct-controls-wrap">
        <div className="container">
          <div className="ct-controls">
            <div className="ct-cats">
              {CATS.map(c => (
                <button key={c} className={`ct-btn${activeCat===c?' active':''}`} onClick={() => setActiveCat(c)}>{c}</button>
              ))}
            </div>
            <div className="ct-course-row">
              <span className="ct-course-label"><i className="ti ti-book"></i> Khóa học:</span>
              <div className="ct-courses">
                {COURSES.map(c => (
                  <button key={c} className={`ct-course-btn${activeCourse===c?' active':''}`} onClick={() => setActiveCourse(c)}>{c}</button>
                ))}
              </div>
            </div>
            <div className="ct-search-wrap">
              <i className="ti ti-search"></i>
              <input
                className="ct-search"
                type="text"
                placeholder="Tìm công thức..."
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
              />
              {searchQ && <button className="ct-search-clear" onClick={() => setSearchQ('')} aria-label="Xóa"><i className="ti ti-x"></i></button>}
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <section className="section" style={{background:'var(--bg)'}}>
        <div className="container">
          {filtered.length === 0 ? (
            <div className="ct-empty">
              <i className="ti ti-mood-sad"></i>
              <p>Không tìm thấy công thức phù hợp</p>
              <button className="btn btn-outline" onClick={() => { setActiveCat('Tất cả'); setSearchQ(''); }}>Xem tất cả</button>
            </div>
          ) : (
            <div className="ct-grid">
              {filtered.map(r => (
                <div key={r.id} className={`ct-card ${CAT_CLASS[r.cat]??''}`} onClick={() => openModal(r)}>
                  <div className="ct-card-img">
                    <img src={`/images/gallery/Concept-studio-with-products/${r.img}`} alt={r.name} loading="lazy"
                      onError={e => { (e.currentTarget as HTMLImageElement).src='/images/logo.png'; }} />
                    <div className="ct-card-lock"><i className="ti ti-lock"></i></div>
                  </div>
                  <div className="ct-card-body">
                    <span className="ct-card-cat">{r.cat}</span>
                    <h3 className="ct-card-name">{r.name}</h3>
                    <div className="ct-card-preview">
                      {r.ingPreview.map((ing,i) => <span key={i} className="ct-ing-tag">{ing}</span>)}
                    </div>
                    <div className="ct-card-foot">
                      <span className="ct-cost"><i className="ti ti-coin"></i> {r.cost}</span>
                      <span className="ct-view-btn">Xem công thức <i className="ti ti-arrow-right"></i></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL */}
      {modalOpen && selectedRecipe && (
        <div className="ct-modal-bg" onClick={closeModal}>
          <div className="ct-modal" onClick={e => e.stopPropagation()}>
            <button className="ct-modal-close" onClick={closeModal} aria-label="Đóng"><i className="ti ti-x"></i></button>
            <div className="ct-modal-img">
              <img src={`/images/gallery/Concept-studio-with-products/${selectedRecipe.img}`} alt={selectedRecipe.name}
                onError={e => { (e.currentTarget as HTMLImageElement).src='/images/logo.png'; }} />
              {isLoggedIn === false ? (
                <div className="ct-modal-lock-ov">
                  <div className="ct-modal-lock-box">
                    <div className="ct-lock-ico"><i className="ti ti-user-circle"></i></div>
                    <h3>Đăng Nhập Để Xem</h3>
                    <p>Chỉ học viên Học Viện Cà Phê mới xem được công thức chi tiết.</p>
                    <Link href="/login" className="btn btn-primary" onClick={closeModal}>
                      <i className="ti ti-login"></i> Đăng Nhập Ngay
                    </Link>
                    <Link href="/dang-ky-hoc-vien" className="ct-modal-gate-sub" onClick={closeModal}>
                      Chưa có tài khoản? Đăng ký học viên
                    </Link>
                  </div>
                </div>
              ) : !canView(selectedRecipe.course) ? (
                <div className="ct-modal-lock-ov">
                  <div className="ct-modal-lock-box">
                    <div className="ct-lock-ico"><i className="ti ti-lock"></i></div>
                    <h3>Nội Dung Độc Quyền</h3>
                    <p>Công thức này thuộc khóa <strong>{selectedRecipe.course}</strong> — dành cho học viên đã đăng ký.</p>
                    <Link href="/dang-ky" className="btn btn-primary" onClick={closeModal}>
                      <i className="ti ti-calendar-check"></i> Đăng Ký Khóa Học
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="ct-modal-body">
              <span className="ct-card-cat">{selectedRecipe.cat}</span>
              <h2>{selectedRecipe.name}</h2>
              <div className="ct-modal-meta">
                <span><i className="ti ti-coin"></i> Giá thành: {selectedRecipe.cost}</span>
                <span><i className="ti ti-book"></i> Khóa: {selectedRecipe.course}</span>
              </div>
              {canView(selectedRecipe.course) ? (
                <>
                  <div className="ct-modal-section">
                    <h4><i className="ti ti-list"></i> Nguyên liệu</h4>
                    <ul className="ct-ing-list">
                      {selectedRecipe.ingredients.map((ing,i) => <li key={i}>{ing}</li>)}
                    </ul>
                  </div>
                  <div className="ct-modal-section">
                    <h4><i className="ti ti-steps"></i> Các bước thực hiện</h4>
                    <ol className="ct-steps-list">
                      {selectedRecipe.steps.map((s,i) => <li key={i}>{s}</li>)}
                    </ol>
                  </div>
                </>
              ) : isLoggedIn === false ? (
                <>
                  <div className="ct-modal-section">
                    <h4><i className="ti ti-list"></i> Nguyên liệu</h4>
                    <ul className="ct-ing-list">
                      {selectedRecipe.ingredients.map((ing,i) => <li key={i} className="ct-locked-item"><i className="ti ti-lock" style={{fontSize:'0.7rem', opacity:0.5}}></i> {ing}</li>)}
                    </ul>
                  </div>
                  <div className="ct-modal-section">
                    <h4><i className="ti ti-steps"></i> Các bước thực hiện</h4>
                    <ol className="ct-steps-list">
                      {selectedRecipe.steps.map((s,i) => <li key={i} className="ct-locked-item"><i className="ti ti-lock" style={{fontSize:'0.7rem', opacity:0.5}}></i> {s}</li>)}
                    </ol>
                  </div>
                  <div className="ct-modal-cta">
                    <Link href="/login" className="btn btn-primary" onClick={closeModal}>
                      <i className="ti ti-login"></i> Đăng Nhập Để Xem
                    </Link>
                    <Link href="/dang-ky-hoc-vien" className="btn btn-outline" onClick={closeModal}>
                      <i className="ti ti-user-plus"></i> Đăng Ký Học Viên
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="ct-modal-section">
                    <h4><i className="ti ti-list"></i> Nguyên liệu</h4>
                    <ul className="ct-ing-list">
                      {selectedRecipe.ingredients.map((ing,i) => <li key={i} className="ct-locked-item"><i className="ti ti-lock" style={{fontSize:'0.7rem', opacity:0.5}}></i> {ing}</li>)}
                    </ul>
                  </div>
                  <div className="ct-modal-section">
                    <h4><i className="ti ti-steps"></i> Các bước thực hiện</h4>
                    <ol className="ct-steps-list">
                      {selectedRecipe.steps.map((s,i) => <li key={i} className="ct-locked-item"><i className="ti ti-lock" style={{fontSize:'0.7rem', opacity:0.5}}></i> {s}</li>)}
                    </ol>
                  </div>
                  <div className="ct-modal-cta">
                    <Link href="/dang-ky" className="btn btn-primary" onClick={closeModal}>
                      <i className="ti ti-calendar-check"></i> Đăng Ký Để Xem Đầy Đủ
                    </Link>
                  </div>
                </>
              )}

              {/* LINKED PRODUCTS */}
              {linkedProducts.length > 0 && (
                <div className="ct-modal-section ct-linked-products">
                  <h4><i className="ti ti-package"></i> Nguyên liệu sử dụng</h4>
                  <div className="ct-prod-list">
                    {linkedProducts.map(p => (
                      <div key={p.id} className="ct-prod-item">
                        <div className="ct-prod-img">
                          {p.image_url
                            ? <img src={p.image_url} alt={p.name} loading="lazy" />
                            : <div className="ct-prod-img-ph"><i className="ti ti-package"></i></div>}
                        </div>
                        <div className="ct-prod-info">
                          <p className="ct-prod-name">{p.name}</p>
                          <p className="ct-prod-meta">{p.unit} · <strong>{p.price.toLocaleString('vi-VN')}đ</strong></p>
                        </div>
                        <div className="ct-prod-btns">
                          <Link href="/nguyen-lieu" className="ct-prod-view" onClick={closeModal}>Xem</Link>
                          <button
                            className={`ct-prod-add${addedIds.has(p.id) ? ' added' : ''}`}
                            onClick={() => handleAddToCart(p)}
                          >
                            {addedIds.has(p.id)
                              ? <><i className="ti ti-check"></i> Đã thêm</>
                              : <><i className="ti ti-shopping-cart-plus"></i> Thêm</>}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="ct-view-cart-btn" onClick={() => { closeModal(); openCart(); }}>
                    <i className="ti ti-shopping-cart"></i> Xem giỏ hàng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
