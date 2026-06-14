'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const HERO_IMGS = [
  'images/gallery/Life-styles-with-person/~12321.webp',
  'images/gallery/Life-styles-with-person/~12405.webp',
  'images/gallery/Life-styles-with-person/~12432.webp',
  'images/gallery/Life-styles-with-person/~12498.webp',
  'images/gallery/Life-styles-with-person/~12555.webp',
  'images/gallery/Life-styles-with-person/~12573.webp',
  'images/gallery/Life-styles-with-person/~12720.webp',
  'images/gallery/Life-styles-with-person/~12816.webp',
  'images/gallery/Life-styles-with-person/~12930.webp',
];

const STUDENTS = [
  { img: 'images/students/tran-hoang-thinh.jpg',     name: 'Anh Trần Hoàng Thịnh',        review: 'Ban đầu mình còn lo lắng không theo kịp, nhưng thầy cô dạy rất cặn kẽ, thực hành ngay tại lớp. Khóa học bổ ích hơn mình nghĩ nhiều!' },
  { img: 'images/students/nguyen-phuong-hong.jpg',   name: 'Chị Nguyễn Phượng Hồng',      review: 'Mình đã thử nhiều chỗ học pha chế nhưng ở đây dạy bài bản và tâm huyết nhất. Học xong là tự tin hẳn, không còn lo khi đứng bar nữa.' },
  { img: 'images/students/le-trong-nghia.jpg',       name: 'Anh Lê Trọng Nghĩa',          review: 'Chất lượng đào tạo thực sự ổn, không qua loa hay hời hợt. Mình học xong là mở quán được luôn, không phải loay hoay gì thêm nữa.' },
  { img: 'images/students/nguyen-nhat-dien.jpg',     name: 'Anh Nguyễn Nhật Điền',        review: 'Cảm ơn thầy cô đã kiên nhẫn hướng dẫn! Từ người chưa biết gì về pha chế, giờ mình tự tin làm menu cà phê cho quán của mình rồi.' },
  { img: 'images/students/nguyen-thi-ut-tham.jpg',   name: 'Chị Nguyễn Thị Út Thắm',     review: 'Từ cách pha đến cách trình bày, thầy cô đều hướng dẫn rất chi tiết. Khóa học ngắn mà hiệu quả, đáng để đầu tư cho nghề của mình.' },
  { img: 'images/students/le-the-phong.jpg',         name: 'Anh Lê Thế Phong',            review: 'Mình học khóa cà phê máy, thầy cô hướng dẫn rất nhiệt tình, tận tâm từng động tác nhỏ. Ra về là tự pha được ngay, rất đáng tiền!' },
  { img: 'images/students/nguyen-van-thao.jpg',      name: 'Anh Nguyễn Văn Thảo',         review: 'Học ở đây không chỉ học công thức mà còn hiểu cách tính cost, quản lý nguyên liệu. Kiến thức thực chiến, áp dụng được ngay vào quán.' },
  { img: 'images/students/pham-nhut-tan.jpg',        name: 'Anh Phạm Nhựt Tân',           review: 'Khóa học vừa ngắn vừa đủ, không quá dài dòng nhưng vẫn đầy đủ kỹ năng. Giảng viên chia sẻ kinh nghiệm thực tế rất hay!' },
  { img: 'images/students/hy-quay-mui.jpg',          name: 'Chị Hỷ Quay Mùi',             review: 'Học xong là mở quán được ngay, từ menu đến pha chế đều rất chuẩn. Chị rất hài lòng với dịch vụ tư vấn và hỗ trợ sau khóa học.' },
  { img: 'images/students/lay-sivmey.jpg',           name: 'Chị Lay Sivmey',               review: 'Mình từ Campuchia sang học, thầy cô rất kiên nhẫn và tận tình. Giờ mình pha trà sữa chuẩn lắm, cảm ơn Học Viện Cà Phê nhiều!' },
  { img: 'images/students/lyda-sokpov.jpg',          name: 'Chị Lyda Sokpov',              review: 'Công thức rõ ràng, dễ hiểu, về nhà là pha được ngay cho gia đình. Đây là lần đầu mình học pha chế chuyên nghiệp và rất vui vì chọn đúng chỗ.' },
  { img: 'images/students/le-thi-ngoc-trang.jpg',   name: 'Chị Lê Thị Ngọc Trang',       review: 'Chị học khóa trà sữa hiện đại, thấy công thức sáng tạo và thực tế lắm. Mở quán mấy tháng rồi, khách khen đồ uống ngon, chị vui lắm!' },
  { img: 'images/students/phan-thi-kim-xuong.jpg',  name: 'Chị Phan Thị Kim Xương',      review: 'Mình học gói khởi nghiệp, được tư vấn rất kỹ từ menu đến cách tính giá. Mở quán rồi mà vẫn được hỗ trợ, không cảm giác bị bỏ rơi.' },
  { img: 'images/students/phou-lay-duo.jpg',         name: 'Chị Phou Sivchou & Lay Sivmey', review: 'Hai chị em cùng nhau học khóa tổng hợp, vui lắm! Về quê mở quán cùng nhau, nhờ kiến thức từ đây mà tự tin hơn rất nhiều.' },
  { img: 'images/students/phou-sivchou.jpg',         name: 'Chị Phou Sivchou',             review: 'Thầy cô rất tốt bụng và kiên nhẫn, chỉ dẫn từng bước tỉ mỉ. Bây giờ chị pha được trà sữa ngon đúng chuẩn và rất tự tin rồi!' },
  { img: 'images/students/truong-thi-thuy-dung.jpg', name: 'Chị Trương Thị Thùy Dung',   review: 'Chị học khóa đá xay và sinh tố, tưởng đơn giản nhưng có nhiều bí quyết hay. Thầy cô chia sẻ kinh nghiệm thực tế, không giấu nghề.' },
  { img: 'images/students/tran-nhu-ngoc.jpg',        name: 'Chị Trần Như Ngọc',           review: 'Mình là người mới hoàn toàn nhưng sau khóa học thấy tự tin lắm. Thực hành trực tiếp tại lớp giúp mình nhớ lâu, không bị quên công thức.' },
  { img: 'images/students/vo-thi-nhat-hoa.jpg',      name: 'Chị Võ Thị Nhật Hòa',        review: 'Đầu tư vào khóa học này là quyết định đúng đắn nhất của chị. Từ chưa biết gì đến tự làm menu trà sữa cho quán, thầy cô hỗ trợ rất nhiệt tình.' },
];

const MENU_ROW1: [string, string][] = [
  ['2. Cung hỷ phát tài bg.webp','Cung Hỷ Phát Tài'],['3. Lục ngọc thiên hương bg.webp','Lục Ngọc Thiên Hương'],
  ['4. Túy lựu đào hoa bg.webp','Túy Lựu Đào Hoa'],['5. Kim lý hoa quế bg.webp','Kim Lý Hoa Quế'],
  ['6. Oolong nhãn thanh trà bg.webp','Oolong Nhãn Thanh Trà'],['7. Hồng trà vàng son sủi bọt bg.webp','Hồng Trà Vàng Son'],
  ['8. Oolong lài sữa bg.webp','Oolong Lài Sữa'],['9. Hồng trà sữa bg.webp','Hồng Trà Sữa'],
  ['10. Khoai môn kem lá dứa bg.webp','Khoai Môn Kem Lá Dứa'],['11. Trà sữa hạt dẻ bg.webp','Trà Sữa Hạt Dẻ'],
  ['12. Sầu riêng kem lá dứa bg.webp','Sầu Riêng Kem Lá Dứa'],['13. Hồng ngọc matcha bg.webp','Hồng Ngọc Matcha'],
  ['14. Matcha latte bg.webp','Matcha Latte'],['15. Matcha creamy (1) bg.webp','Matcha Creamy'],
  ['16. Matcha milktea bg.webp','Matcha Milktea'],['17. Đen đá bg.webp','Đen Đá'],
  ['18. Matcha Ice blended bg.webp','Matcha Ice Blended'],['19. Oreo Ice Blended bg.webp','Oreo Ice Blended'],
  ['20. Caramel Ice Blended bg.webp','Caramel Ice Blended'],['21. Sữa đá bg.webp','Sữa Đá'],
  ['22. Bạc xỉu bg.webp','Bạc Xỉu'],['23. Cà phê muối bg.webp','Cà Phê Muối'],
  ['24. Americano đá bg.webp','Americano Đá'],['25. Matcha coco ice blended bg.webp','Matcha Coco'],
];

const MENU_ROW2: [string, string][] = [
  ['26. Matcha taro ice blended bg.webp','Matcha Taro'],['27. Cà phê cốt dừa bg.webp','Cà Phê Cốt Dừa'],
  ['28. Latte nóng bg.webp','Latte Nóng'],['29. Latte nóng bg.webp','Latte Nóng'],
  ['30. Cappuccino nóng bg.webp','Cappuccino Nóng'],['31. Americano đào bg.webp','Americano Đào'],
  ['32. Bơ già dừa non bg.webp','Bơ Già Dừa Non'],['33. Cà phê sữa bg.webp','Cà Phê Sữa'],
  ['34. Coldbrew cam bg.webp','Coldbrew Cam'],['35. Coldbrew Kombucha ổi bg.webp','Coldbrew Kombucha Ổi'],
  ['36. Đào xoài macchiato bg.webp','Đào Xoài Macchiato'],['37. Kombucha chanh dâu bg.webp','Kombucha Chanh Dâu'],
  ['38. Kombucha chanh vàng bg.webp','Kombucha Chanh Vàng'],['39. Kombucha táo đào bg.webp','Kombucha Táo Đào'],
  ['40. Kombucha xoài chanh leo bg.webp','Kombucha Xoài'],['41. Matcha Creamy (2) bg.webp','Matcha Creamy'],
  ['42. Matcha đậu đỏ bg.webp','Matcha Đậu Đỏ'],['43. Trà đào cam sả bg.webp','Trà Đào Cam Sả'],
  ['44. Trà sen vàng bg.webp','Trà Sen Vàng'],['45. Trà sữa bơ bg.webp','Trà Sữa Bơ'],
  ['46. Trà sữa chôm chôm bg.webp','Trà Sữa Chôm Chôm'],['47. Trà sữa dâu bg.webp','Trà Sữa Dâu'],
  ['48. Trà sữa kem trứng nướng bg.webp','Kem Trứng Nướng'],['49. Trà sữa trân châu đen bg.webp','Trân Châu Đen'],
  ['50. Trà vải bg.webp','Trà Vải'],
];

const LE_COURSES = [
  { img:'ca-phe-may-co-ban.png', name:'Cà Phê Máy Cơ Bản', desc:'Pha espresso, cà phê sữa, bạc xỉu, americano, cappuccino, latte và hot chocolate. Phù hợp người mới muốn vận hành máy pha cà phê chuyên nghiệp.', price:'2.500.000đ', time:'1 ngày · 2 buổi' },
  { img:'tra-sua-hien-dai.png', name:'Trà Sữa Hiện Đại', desc:'Shan tuyết phủ topping, olong nitro tea, olong trái cây và topping trân châu, phô mai, đường đen. Menu trà sữa hiện đại được ưa chuộng nhất hiện nay.', price:'2.500.000đ', time:'1 ngày · 2 buổi' },
  { img:'tra-trai-cay-matcha.png', name:'Trà Trái Cây & Matcha', desc:'Hơn 15 công thức trà trái cây soda, trà tươi và 4 loại matcha latte. Dễ làm, chi phí thấp — phù hợp mọi loại hình quán.', price:'2.500.000đ', time:'1 ngày · 2 buổi' },
  { img:'da-xay-sinh-to.png', name:'Đá Xay & Sinh Tố', desc:'Đá xay cocomilk, cookies chocolate, matcha freeze, việt quất iceblend, caramel freeze và 6 loại sinh tố. Thu hút khách mùa hè, áp dụng ngay vào menu.', price:'2.500.000đ', time:'1 ngày · 2 buổi' },
  { img:'tra-sua-truyen-thong.png', name:'Trà Sữa Truyền Thống', desc:'Shan tuyết thăng hoa, olong, topping trân châu 3Q, đường đen, phô mai, kem bánh. Nền tảng cho menu trà sữa truyền thống hoàn chỉnh.', price:'2.200.000đ', time:'1 ngày · 2 buổi' },
  { img:'ca-phe-phin.png', name:'Cà Phê Phin – Đá Xay & Sữa Chua', desc:'Cà phê phin, cacao & socola, sữa chua lắc kết hợp đá xay. Chi phí thấp, dễ triển khai — phù hợp quán nhỏ và xe đẩy.', price:'2.200.000đ', time:'1 ngày · 2 buổi' },
  { img:'nitro-soda.png', name:'Nâng Cấp Menu Nitro Soda', desc:'Trà, cà phê, kombucha & soda nitro bằng hệ thống Nitro 4 vòi hiện đại. Tạo hương vị độc đáo — điểm nhận diện khác biệt cho quán.', price:'2.500.000đ', time:'1 ngày · 2 buổi' },
  { img:'chon-mon-kem-1-1.png', name:'Khóa Chọn Món Kèm 1–1', desc:'Tự chọn 15 món, học kèm 1-1 cùng giảng viên. Phù hợp muốn nâng cấp hoặc thay đổi menu mà không cần học cả khóa tổng hợp.', price:'3.000.000đ', time:'Linh hoạt' },
];

const SERVICES = [
  { img:'khoi-nghiep-v2.png', name:'Khóa Khởi Nghiệp', desc:'Nền tảng mở quán, quản lý chi phí, vận hành hiệu quả — 1 ngày (2 buổi). Hỗ trợ online 1 tháng sau khai trương.', price:'4.000.000đ' },
  { img:'setup-menu-7tr.png', name:'Gói Set Up Menu', desc:'Menu nhỏ gọn dưới 10 món: xây dựng 2–3 signature, thiết kế menu, hướng dẫn cost, tư vấn thiết bị và test món 2 lần.', price:'7.000.000đ' },
  { img:'setup-menu-15-20-mon.png', name:'Setup Menu 15–20 Món', desc:'Menu độc quyền 15–20 món: 3–5 signature, tính cost toàn bộ, tư vấn nguyên liệu & thiết bị, test món 2 buổi tại Học Viện.', price:'15.000.000đ' },
  { img:'dao-tao-van-hanh-v2.png', name:'Đào Tạo Vận Hành', desc:'Vận hành chuẩn, quản trị chặt: xây dựng chính sách, quản lý nhân sự, kiểm soát chi phí & doanh thu. Hỗ trợ online 1 tháng sau khai trương.', price:'15.000.000đ' },
  { img:'dao-tao-tai-quan.png', name:'Đào Tạo Tại Quán', desc:'Giảng viên đến trực tiếp quán đào tạo nhân viên pha chế, thiết lập quy trình bar & hỗ trợ sắp xếp thiết bị phù hợp với thực tế quán.', price:'Từ 2.300.000đ/ngày' },
];

export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [lb, setLb] = useState<{ src: string; alt: string } | null>(null);
  const [fanIdx, setFanIdx] = useState(0);
  const [formDone, setFormDone] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const fanTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const courseRef = useRef<HTMLSelectElement>(null);
  const locationRef = useRef<HTMLSelectElement>(null);
  const marqueeRef1 = useRef<HTMLDivElement>(null);
  const marqueeRef2 = useRef<HTMLDivElement>(null);
  const masonryRef = useRef<HTMLDivElement>(null);

  const n = STUDENTS.length;

  const openLb = (src: string, alt: string) => {
    setLb({ src, alt });
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => {
    setLb(null);
    document.body.style.overflow = '';
  };

  const resetFanTimer = () => {
    if (fanTimerRef.current) clearInterval(fanTimerRef.current);
    fanTimerRef.current = setInterval(() => setFanIdx(i => (i + 1) % n), 3800);
  };

  const dangKy = (course: string) => {
    document.getElementById('dangky')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      setSelectedCourse(course);
      if (courseRef.current) {
        courseRef.current.focus();
        courseRef.current.style.borderColor = '#B05A10';
        courseRef.current.style.boxShadow = '0 0 0 3px rgba(176,90,16,0.12)';
        setTimeout(() => {
          if (courseRef.current) {
            courseRef.current.style.borderColor = '';
            courseRef.current.style.boxShadow = '';
          }
        }, 2200);
      }
    }, 700);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value.trim();
    const phone = phoneRef.current?.value.trim();
    const course = courseRef.current?.value;
    const location = locationRef.current?.value;
    if (!name || !phone || !course || !location) { setFormError('Vui lòng điền đầy đủ thông tin.'); return; }
    setFormSubmitting(true);
    setFormError('');
    const supabase = createClient();
    const { error } = await supabase.from('leads').insert({ name, phone, course, location });
    setFormSubmitting(false);
    if (error) { setFormError('Có lỗi xảy ra, vui lòng thử lại hoặc liên hệ Zalo.'); return; }
    setFormDone(true);
  };

  useEffect(() => {
    const interval = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMGS.length), 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    resetFanTimer();
    return () => { if (fanTimerRef.current) clearInterval(fanTimerRef.current); };
  }, []);

  useEffect(() => {
    const initTrack = (track: HTMLDivElement | null, isRight: boolean) => {
      if (!track) return;
      const items = track.querySelectorAll<HTMLElement>('.mi');
      if (!items.length) return;
      const half = items.length / 2;
      const iw = items[0].getBoundingClientRect().width || 130;
      const cs = window.getComputedStyle(track);
      const gap = parseFloat(cs.columnGap) || parseFloat(cs.gap) || 12;
      const halfW = half * (iw + gap);
      track.style.width = `${halfW * 2}px`;
      if (isRight) track.style.transform = `translateX(-${halfW}px)`;
      const outer = track.parentElement;
      if (outer && window.matchMedia('(hover: hover)').matches) {
        outer.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
        outer.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
      }
      track.classList.add('ready');
    };
    initTrack(marqueeRef1.current, false);
    initTrack(marqueeRef2.current, true);
  }, []);

  useEffect(() => {
    const els = masonryRef.current?.querySelectorAll<HTMLElement>('.ls-img');
    if (!els) return;
    els.forEach((el, i) => { el.style.transitionDelay = `${(i % 6) * 0.07}s`; });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLb(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const fanPositions = [-2, -1, 0, 1, 2];

  return (
    <>
      {lb && (
        <div className="lightbox active" onClick={e => { if (e.target === e.currentTarget) closeLb(); }}>
          <button className="lb-close" onClick={closeLb}>&#x2715;</button>
          <img src={lb.src} alt={lb.alt} onClick={closeLb} />
        </div>
      )}

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-shape">
          {HERO_IMGS.map((src, i) => (
            <img key={src} className={`hs-img${i === heroIdx ? ' active' : ''}`} src={`/${src}`} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
          ))}
        </div>
        <div className="container">
          <div className="hero-body">
            <div className="hero-badge"><span className="hero-dot"></span>Nơi Khởi Nguồn Kinh Doanh Của Bạn</div>
            <h1>Học Pha Chế<br /><em>&amp; Kinh Doanh</em><br />Quán Cà Phê</h1>
            <p className="hero-sub">Đào tạo pha chế cà phê, trà sữa và tư vấn mở quán bài bản — từ công thức, set up menu đến vận hành kinh doanh.</p>
            <div className="hero-btns">
              <Link href="#courses" className="btn btn-primary"><i className="ti ti-book-2"></i> Xem Khóa Học</Link>
              <Link href="#dangky" className="btn btn-outline">Đăng Ký Tư Vấn</Link>
            </div>
            <div className="hero-stats">
              <div className="h-stat"><div className="h-stat-n">11</div><div className="h-stat-l">Khóa &amp; chuyên đề</div></div>
              <div className="h-stat"><div className="h-stat-n">60<sup>+</sup></div><div className="h-stat-l">Công thức đồ uống</div></div>
              <div className="h-stat"><div className="h-stat-n">1–1</div><div className="h-stat-l">Kèm cặp tận tay</div></div>
              <div className="h-stat"><div className="h-stat-n">A–Z</div><div className="h-stat-l">Tư vấn mở quán</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div className="features">
        <div className="container">
          <div className="feat-grid">
            <div className="feat-item"><div className="feat-ico"><i className="ti ti-cup"></i></div><div><div className="feat-t">Khóa Pha Chế Đa Dạng</div><div className="feat-s">Cà phê, trà sữa, matcha…</div></div></div>
            <div className="feat-item"><div className="feat-ico"><i className="ti ti-user-check"></i></div><div><div className="feat-t">Kèm Cặp 1–1</div><div className="feat-s">Thực hành tận tay</div></div></div>
            <div className="feat-item"><div className="feat-ico"><i className="ti ti-clipboard-list"></i></div><div><div className="feat-t">Set Up Menu</div><div className="feat-s">Tối ưu chi phí mở quán</div></div></div>
            <div className="feat-item"><div className="feat-ico"><i className="ti ti-building-store"></i></div><div><div className="feat-t">Đào Tạo Vận Hành</div><div className="feat-s">Kinh doanh bền vững</div></div></div>
          </div>
        </div>
      </div>

      {/* STORY STRIP */}
      <div className="story-strip">
        <div className="container">
          <div className="strip-grid">
            <div className="strip-text">
              <span className="tag">Câu Chuyện Của Chúng Tôi</span>
              <p className="strip-lead">Học Viện Cà Phê HCM ra đời từ một trăn trở thực tế — có quá nhiều người đam mê mở quán cà phê, nhưng chỉ sau vài tháng phải đóng cửa vì thiếu nền tảng kiến thức đúng. Không phải thiếu vốn, không phải thiếu địa điểm đẹp — mà thiếu người đồng hành đúng cách.</p>
              <span className="strip-quote">Chúng tôi muốn rút ngắn hành trình đó — để bạn bắt đầu đúng, đi xa hơn và bền vững hơn.</span>
              <Link href="/gioi-thieu" className="btn btn-outline">Xem Thêm Về Chúng Tôi →</Link>
            </div>
            <div className="strip-img">
              <img src="/images/gallery/Life-styles-with-person/~12816.webp" alt="Học viên Học Viện Cà Phê HCM" loading="lazy" />
            </div>
          </div>
        </div>
      </div>

      {/* COURSES */}
      <section className="section courses" id="courses">
        <div className="container">
          <div className="courses-head">
            <div><span className="tag">Khóa Pha Chế Tổng Hợp</span><h2 className="title">Các Khóa Học Pha Chế</h2></div>
            <Link href="#dangky" className="btn btn-outline">Tư Vấn Thêm →</Link>
          </div>
          <div className="course-grid">
            <div className="card">
              <div className="card-img ci1" onClick={() => openLb('/images/courses/Bang-gia-khoa-tong-hop/menu-truyen-thong.png','Menu Khóa Học Pha Chế Truyền Thống')}>
                🧋<img className="ph-img" src="/images/courses/Bang-gia-khoa-tong-hop/menu-truyen-thong.png" alt="Tổng Hợp Truyền Thống" onError={e => { e.currentTarget.style.display='none'; }} />
              </div>
              <div className="card-body">
                <div className="card-meta"><span><i className="ti ti-clock" style={{fontSize:'0.88rem'}}></i> 3 ngày</span><span><i className="ti ti-cup" style={{fontSize:'0.88rem'}}></i> Trà sữa, cà phê phin…</span></div>
                <div className="card-name">Tổng Hợp Truyền Thống</div>
                <div className="card-desc">Trọn bộ công thức trà sữa truyền thống, trà trái cây &amp; matcha, cà phê phin, đá xay &amp; sữa chua — học trong 3 ngày.</div>
                <div className="card-foot"><div className="card-price">5.200.000đ<small>Khóa 3 ngày</small></div><button className="btn-reg" onClick={() => dangKy('Tổng Hợp Truyền Thống')}>Đăng Ký</button></div>
              </div>
            </div>
            <div className="card">
              <div className="card-img ci2" onClick={() => openLb('/images/courses/Bang-gia-khoa-tong-hop/menu-hien-dai.png','Menu Khóa Học Pha Chế Hiện Đại')}>
                🍵<span className="card-pill">Phổ Biến</span><img className="ph-img" src="/images/courses/Bang-gia-khoa-tong-hop/menu-hien-dai.png" alt="Tổng Hợp Hiện Đại" onError={e => { e.currentTarget.style.display='none'; }} />
              </div>
              <div className="card-body">
                <div className="card-meta"><span><i className="ti ti-clock" style={{fontSize:'0.88rem'}}></i> 4 ngày</span><span><i className="ti ti-cup" style={{fontSize:'0.88rem'}}></i> Cà phê máy, nitro…</span></div>
                <div className="card-name">Tổng Hợp Hiện Đại</div>
                <div className="card-desc">Cà phê máy cơ bản, trà sữa hiện đại, oolong nitro tea, trà trái cây &amp; matcha, đá xay &amp; sinh tố — học trong 4 ngày.</div>
                <div className="card-foot"><div className="card-price">7.500.000đ<small>Khóa 4 ngày</small></div><button className="btn-reg" onClick={() => dangKy('Tổng Hợp Hiện Đại')}>Đăng Ký</button></div>
              </div>
            </div>
            <div className="card">
              <div className="card-img ci4" onClick={() => openLb('/images/courses/Bang-gia-khoa-le/ca-phe-may-nang-cao.png','Cà Phê Máy Nâng Cao')}>
                ☕<span className="card-pill">Chuyên Sâu</span><img className="ph-img" src="/images/courses/Bang-gia-khoa-le/ca-phe-may-nang-cao.png" alt="Cà Phê Máy Nâng Cao" onError={e => { e.currentTarget.style.display='none'; }} />
              </div>
              <div className="card-body">
                <div className="card-meta"><span><i className="ti ti-clock" style={{fontSize:'0.88rem'}}></i> 3 ngày</span><span><i className="ti ti-cup" style={{fontSize:'0.88rem'}}></i> Espresso chuyên sâu</span></div>
                <div className="card-name">Cà Phê Máy Nâng Cao</div>
                <div className="card-desc">Khóa chuyên sâu về cà phê máy: chiết xuất espresso, tạo bọt sữa, latte art và vận hành máy pha chuyên nghiệp.</div>
                <div className="card-foot"><div className="card-price">8.300.000đ<small>Khóa 3 ngày</small></div><button className="btn-reg" onClick={() => dangKy('Cà Phê Máy Nâng Cao')}>Đăng Ký</button></div>
              </div>
            </div>
          </div>

          <div style={{marginTop:'48px'}}>
            <h3 className="card-name" style={{fontSize:'1.15rem', marginBottom:'6px'}}>Chuyên đề lẻ tự chọn</h3>
            <p className="sub" style={{marginBottom:'20px'}}>Học đúng món bạn cần — mỗi chuyên đề 1 ngày, riêng Cà Phê Máy Nâng Cao 3 ngày.</p>
            <div className="le-grid">
              {LE_COURSES.map(c => (
                <div className="le-card" key={c.name}>
                  <div className="le-img" onClick={() => openLb(`/images/courses/Bang-gia-khoa-le/${c.img}`, c.name)}>
                    <img src={`/images/courses/Bang-gia-khoa-le/${c.img}`} alt={c.name} loading="lazy" onError={e => { const card = e.currentTarget.closest('.le-card') as HTMLElement; if (card) card.style.display='none'; }} />
                  </div>
                  <div className="le-body">
                    <div className="le-meta"><span><i className="ti ti-clock"></i>{c.time}</span><span className="le-price">{c.price}</span></div>
                    <div className="le-name">{c.name}</div>
                    <div className="le-desc">{c.desc}</div>
                    <div className="le-foot"><span className="le-price">{c.price}</span><button className="btn-reg" onClick={() => dangKy(c.name)}>Đăng Ký</button></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section about" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-vis">
              ☕
              <img className="ph-img" src="/images/about.jpg" alt="Về Học Viện Cà Phê" onError={e => { e.currentTarget.remove(); }} />
              <div className="about-badge">
                <span style={{fontSize:'1.5rem'}}>📍</span>
                <div><div className="about-badge-t">Tân Bình, TP.HCM</div><div className="about-badge-s">T2–T7 · 8h30–17h30</div></div>
              </div>
            </div>
            <div>
              <span className="tag">Về Chúng Tôi</span>
              <h2 className="title">Đồng Hành Cùng Bạn Mở Quán</h2>
              <p className="sub">Học Viện Cà Phê là nơi khởi nguồn kinh doanh của bạn — đào tạo pha chế bài bản và đồng hành từ công thức, set up menu đến vận hành quán cà phê, trà sữa hiệu quả.</p>
              <div className="checks">
                {['Khóa pha chế đa dạng: cà phê, trà sữa, trà trái cây, matcha, đá xay…','Học thực hành trực tiếp, có lớp kèm cặp 1–1 theo nhu cầu','Tư vấn set up menu signature, tối ưu chi phí mở quán','Đào tạo vận hành & hỗ trợ online 1 tháng sau khai trương'].map(t => (
                  <div className="check-row" key={t}><div className="check-dot"><i className="ti ti-check" style={{fontSize:'0.7rem'}}></i></div><span>{t}</span></div>
                ))}
              </div>
              <Link href="#dangky" className="btn btn-primary"><i className="ti ti-phone"></i> Liên Hệ Tư Vấn</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services" style={{background:'var(--bg-alt)'}}>
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'4px'}}><span className="tag">Gói Kinh Doanh</span></div>
          <h2 className="title" style={{textAlign:'center'}}>Đồng Hành Mở &amp; Vận Hành Quán</h2>
          <p className="sub" style={{textAlign:'center', maxWidth:'560px', margin:'0 auto 44px'}}>Không chỉ pha chế — chúng tôi đồng hành cùng bạn từ khởi nghiệp, set up menu đến vận hành quán hiệu quả.</p>
          <div className="poster-grid">
            {SERVICES.map(s => (
              <div className="poster-card" key={s.name}>
                <div className="poster-img" onClick={() => openLb(`/images/services/${s.img}`, s.name)}>
                  <img src={`/images/services/${s.img}`} alt={s.name} loading="lazy" />
                </div>
                <div className="poster-body">
                  <div className="poster-name">{s.name}</div>
                  <p className="poster-desc">{s.desc}</p>
                  <div className="poster-foot"><div className="card-price">{s.price}</div><button className="btn-reg" onClick={() => dangKy(s.name)}>Đăng Ký</button></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENU GALLERY */}
      <section className="section" id="menu" style={{background:'var(--white)'}}>
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'4px'}}><span className="tag">Menu Đồ Uống</span></div>
          <h2 className="title" style={{textAlign:'center'}}>Hơn 60 Công Thức Bạn Sẽ Học</h2>
          <p className="sub" style={{textAlign:'center', maxWidth:'540px', margin:'0 auto'}}>Từ cà phê, trà sữa, trà trái cây, matcha đến đá xay — toàn bộ công thức được hướng dẫn chi tiết tại khóa học.</p>
        </div>
        <div className="marquee-outer">
          <div className="marquee-track go-left" ref={marqueeRef1}>
            {[...MENU_ROW1, ...MENU_ROW1].map(([file, cap], i) => (
              <div className="mi" key={`r1-${i}`}><div className="mi-thumb"><img src={`/images/gallery/Concept-studio-with-products/${file}`} alt={cap} loading="eager" /></div><div className="mi-cap">{cap}</div></div>
            ))}
          </div>
          <div className="marquee-track go-right" ref={marqueeRef2}>
            {[...MENU_ROW2, ...MENU_ROW2].map(([file, cap], i) => (
              <div className="mi" key={`r2-${i}`}><div className="mi-thumb"><img src={`/images/gallery/Concept-studio-with-products/${file}`} alt={cap} loading="eager" /></div><div className="mi-cap">{cap}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* FAN CAROUSEL */}
      <section className="section" id="hoc-vien" style={{background:'var(--white)', overflow:'hidden'}}>
        <div className="container" style={{textAlign:'center'}}>
          <span className="tag">Học Viên</span>
          <h2 className="title">Học Viên Nhận Chứng Nhận</h2>
          <p className="sub" style={{maxWidth:'540px', margin:'0 auto'}}>Mỗi học viên hoàn thành khóa học đều nhận chứng nhận từ Học Viện Cà Phê — bước đầu trên hành trình kinh doanh của riêng bạn.</p>
        </div>
        <div className="fan-wrap">
          <div className="fan-stage">
            {fanPositions.map(p => {
              const idx = (fanIdx + p + n) % n;
              const s = STUDENTS[idx];
              return (
                <div key={`fan-${p}`} className="fan-card" data-pos={p} onClick={p !== 0 ? () => { setFanIdx(idx); resetFanTimer(); } : undefined}>
                  <div className="fan-photo">
                    <img src={`/${s.img}`} alt={s.name} loading="lazy" onError={e => { const c = e.currentTarget.closest('.fan-card') as HTMLElement; if (c) c.style.display='none'; }} />
                  </div>
                  <div className="fan-info">
                    <div className="fan-name">{s.name}</div>
                    {p === 0 && s.review && <div className="fan-review">&ldquo;{s.review}&rdquo;</div>}
                    <div className="fan-badge"><i className="ti ti-certificate"></i> Chứng Nhận Hoàn Thành</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="fan-nav">
            <button className="fan-btn" onClick={() => { setFanIdx(i => (i - 1 + n) % n); resetFanTimer(); }} aria-label="Trước"><i className="ti ti-chevron-left"></i></button>
            <button className="fan-btn" onClick={() => { setFanIdx(i => (i + 1) % n); resetFanTimer(); }} aria-label="Sau"><i className="ti ti-chevron-right"></i></button>
          </div>
        </div>
      </section>

      {/* MASONRY */}
      <section className="section" style={{background:'var(--white)'}}>
        <div className="container">
          <div style={{textAlign:'center'}}>
            <span className="tag">Trải Nghiệm Thực Tế</span>
            <h2 className="title">Học Từ Công Thức Thật<br />Làm Từ Nguyên Liệu Thật</h2>
            <p className="sub" style={{maxWidth:'560px', margin:'0 auto'}}>Mỗi buổi học là một trải nghiệm thực chiến — bạn tự tay pha từng ly, nắm vững công thức và mang về bí quyết kinh doanh của riêng mình.</p>
          </div>
          <div className="ls-grid" ref={masonryRef}>
            {['~11447.webp','~11594_1.webp','~11783.webp','~11900.webp','~12219.webp','~12609.webp','~11675.webp'].map(f => (
              <div className="ls-img" key={f}><img src={`/images/gallery/Life-styles/${f}`} alt="" loading="lazy" /></div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="section" id="dangky">
        <div className="container">
          <div style={{textAlign:'center'}}>
            <span className="tag">Đăng Ký Tư Vấn</span>
            <h2 className="title">Bắt Đầu Hành Trình Kinh Doanh</h2>
            <p className="sub" style={{maxWidth:'520px', margin:'0 auto'}}>Để lại thông tin — đội ngũ tư vấn sẽ liên hệ trong vòng <strong>30 phút</strong> để giải đáp mọi thắc mắc và đặt lịch học thử miễn phí.</p>
          </div>
          <div className="form-card">
            {!formDone ? (
              <>
                <p className="form-hed">Thông tin đăng ký</p>
                <p className="form-sub">Vui lòng điền đầy đủ để nhận tư vấn hoàn toàn miễn phí.</p>
                <form onSubmit={submitForm} noValidate>
                  <div className="fg">
                    <label className="fl-lbl" htmlFor="f-name">Họ và Tên <em>*</em></label>
                    <input className="fi" type="text" id="f-name" placeholder="Ví dụ: Nguyễn Văn An" required ref={nameRef} />
                  </div>
                  <div className="fg">
                    <label className="fl-lbl" htmlFor="f-phone">Số Điện Thoại <em>*</em></label>
                    <input className="fi" type="tel" id="f-phone" placeholder="Ví dụ: 0901 234 567" required ref={phoneRef} />
                  </div>
                  <div className="fg">
                    <label className="fl-lbl" htmlFor="f-location">Khu vực của bạn <em>*</em></label>
                    <select className="fs" id="f-location" required ref={locationRef} defaultValue="">
                      <option value="" disabled>-- Chọn tỉnh / thành phố --</option>
                      <optgroup label="Chi nhánh Học Viện Cà Phê">
                        <option value="Hồ Chí Minh">🏙 Hồ Chí Minh (Chi nhánh HCM)</option>
                        <option value="Hà Nội">🏛 Hà Nội (Chi nhánh Hà Nội)</option>
                      </optgroup>
                      <optgroup label="Miền Nam">
                        <option value="Bình Dương">Bình Dương</option>
                        <option value="Đồng Nai">Đồng Nai</option>
                        <option value="Long An">Long An</option>
                        <option value="Tiền Giang">Tiền Giang</option>
                        <option value="Vũng Tàu">Vũng Tàu</option>
                        <option value="Cần Thơ">Cần Thơ</option>
                      </optgroup>
                      <optgroup label="Miền Trung">
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        <option value="Huế">Huế</option>
                        <option value="Nha Trang">Nha Trang</option>
                        <option value="Đà Lạt">Đà Lạt</option>
                        <option value="Quy Nhơn">Quy Nhơn</option>
                      </optgroup>
                      <optgroup label="Miền Bắc">
                        <option value="Hải Phòng">Hải Phòng</option>
                        <option value="Hải Dương">Hải Dương</option>
                        <option value="Bắc Ninh">Bắc Ninh</option>
                        <option value="Nam Định">Nam Định</option>
                      </optgroup>
                      <option value="Tỉnh / Thành khác">Tỉnh / Thành khác</option>
                    </select>
                  </div>
                  <div className="fg">
                    <label className="fl-lbl" htmlFor="f-course">Bạn quan tâm đến khóa học / dịch vụ nào? <em>*</em></label>
                    <select className="fs" id="f-course" required ref={courseRef} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                      <option value="" disabled>-- Chọn khóa học hoặc dịch vụ --</option>
                      <optgroup label="Khóa pha chế tổng hợp">
                        <option value="Tổng Hợp Truyền Thống">🧋 Tổng Hợp Truyền Thống (3 ngày · 5.2tr)</option>
                        <option value="Tổng Hợp Hiện Đại">🍵 Tổng Hợp Hiện Đại (4 ngày · 7.5tr)</option>
                        <option value="Cà Phê Máy Nâng Cao">☕ Cà Phê Máy Nâng Cao (3 ngày · 8.3tr)</option>
                      </optgroup>
                      <optgroup label="Chuyên đề lẻ (1 ngày)">
                        <option value="Cà Phê Máy Cơ Bản">Cà Phê Máy Cơ Bản (2.5tr)</option>
                        <option value="Trà Sữa Hiện Đại">Trà Sữa Hiện Đại (2.5tr)</option>
                        <option value="Trà Trái Cây & Matcha">Trà Trái Cây &amp; Matcha (2.5tr)</option>
                        <option value="Đá Xay & Sinh Tố">Đá Xay &amp; Sinh Tố (2.5tr)</option>
                        <option value="Trà Sữa Truyền Thống">Trà Sữa Truyền Thống (2.2tr)</option>
                        <option value="Cà Phê Phin – Đá Xay & Sữa Chua">Cà Phê Phin – Đá Xay &amp; Sữa Chua (2.2tr)</option>
                        <option value="Nâng Cấp Menu Nitro Soda">Nâng Cấp Menu Nitro Soda (2.5tr)</option>
                        <option value="Khóa Chọn Món Kèm 1-1">Khóa Chọn Món Kèm 1–1 (3tr)</option>
                      </optgroup>
                      <optgroup label="Gói kinh doanh">
                        <option value="Khóa Khởi Nghiệp">🚀 Khóa Khởi Nghiệp (4tr)</option>
                        <option value="Gói Set Up Menu">📋 Gói Set Up Menu (7tr)</option>
                        <option value="Đào Tạo Vận Hành">🏪 Đào Tạo Vận Hành (15tr)</option>
                      </optgroup>
                      <option value="Khác / Tư vấn thêm">💬 Khác / Tư vấn thêm</option>
                    </select>
                  </div>
                  {formError && <p className="f-error"><i className="ti ti-alert-circle"></i> {formError}</p>}
                  <button type="submit" className="f-submit" disabled={formSubmitting}>
                    {formSubmitting ? <><i className="ti ti-loader-2 spin"></i> Đang gửi...</> : <><i className="ti ti-send"></i> Tư Vấn Miễn Phí</>}
                  </button>
                  <p className="f-note"><i className="ti ti-shield-check" style={{fontSize:'0.8rem',verticalAlign:'middle'}}></i> Thông tin được bảo mật tuyệt đối — không chia sẻ với bên thứ ba.</p>
                </form>
              </>
            ) : (
              <div className="f-ok" style={{display:'block'}}>
                <div className="f-ok-ico">🎉</div>
                <h3>Đăng ký thành công!</h3>
                <p>Cảm ơn bạn. Tư vấn viên sẽ liên hệ trong vòng <strong>30 phút</strong>.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
