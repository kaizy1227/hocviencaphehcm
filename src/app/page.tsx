'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// Bảng giá khóa học & dịch vụ — HTML thật (đọc được trên mobile, tốt cho SEO)
const KHOA_TONG_HOP = [
  { name: 'Tổng Hợp Truyền Thống', meta: '3 ngày', price: '5.200.000đ', pill: '' },
  { name: 'Tổng Hợp Hiện Đại', meta: '4 ngày', price: '7.500.000đ', pill: 'Phổ biến' },
  { name: 'Cà Phê Máy Nâng Cao', meta: '3 ngày', price: '8.300.000đ', pill: 'Chuyên sâu' },
];
const DICH_VU_GIA = [
  { name: 'Khóa Khởi Nghiệp', meta: '1 ngày', price: '4.000.000đ' },
  { name: 'Gói Set Up Menu', meta: 'Dưới 10 món', price: '7.000.000đ' },
  { name: 'Setup Menu 15–20 Món', meta: 'Menu độc quyền', price: '15.000.000đ' },
  { name: 'Đào Tạo Vận Hành', meta: 'Quản trị chuẩn', price: '15.000.000đ' },
  { name: 'Đào Tạo Tại Quán', meta: 'Giảng viên tới quán', price: 'Từ 2.300.000đ/ngày' },
];

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
  { img: 'images/students/nguyen-phuong-hong.jpg',   name: 'Chị Nguyễn Phượng Hồng',   review: 'Mình đã thử nhiều chỗ học pha chế nhưng ở đây dạy bài bản và tâm huyết nhất. Học xong là tự tin hẳn, không còn lo khi đứng bar nữa.' },
  { img: 'images/students/le-trong-nghia.jpg',       name: 'Anh Lê Trọng Nghĩa',       review: 'Chất lượng đào tạo thực sự ổn, không qua loa hay hời hợt. Mình học xong là mở quán được luôn, không phải loay hoay gì thêm nữa.' },
  { img: 'images/students/nguyen-nhat-dien.jpg',     name: 'Anh Nguyễn Nhật Điền',     review: 'Cảm ơn thầy cô đã kiên nhẫn hướng dẫn! Từ người chưa biết gì về pha chế, giờ mình tự tin làm menu cà phê cho quán của mình rồi.' },
  { img: 'images/students/le-the-phong.jpg',         name: 'Anh Lê Thế Phong',         review: 'Mình học khóa cà phê máy, thầy cô hướng dẫn rất nhiệt tình, tận tâm từng động tác nhỏ. Ra về là tự pha được ngay, rất đáng tiền!' },
  { img: 'images/students/pham-nhut-tan.jpg',        name: 'Anh Phạm Nhựt Tân',        review: 'Khóa học vừa ngắn vừa đủ, không quá dài dòng nhưng vẫn đầy đủ kỹ năng. Giảng viên chia sẻ kinh nghiệm thực tế rất hay!' },
  { img: 'images/students/lay-sivmey.jpg',           name: 'Chị Lay Sivmey',            review: 'Mình từ Campuchia sang học, thầy cô rất kiên nhẫn và tận tình. Giờ mình pha trà sữa chuẩn lắm, cảm ơn Học Viện Cà Phê nhiều!' },
  { img: 'images/students/phan-thi-kim-xuong.jpg',  name: 'Chị Phan Thị Kim Xương',   review: 'Mình học gói khởi nghiệp, được tư vấn rất kỹ từ menu đến cách tính giá. Mở quán rồi mà vẫn được hỗ trợ, không cảm giác bị bỏ rơi.' },
  { img: 'images/students/phou-sivchou.jpg',         name: 'Chị Phou Sivchou',          review: 'Thầy cô rất tốt bụng và kiên nhẫn, chỉ dẫn từng bước tỉ mỉ. Bây giờ chị pha được trà sữa ngon đúng chuẩn và rất tự tin rồi!' },
  { img: 'images/students/truong-thi-thuy-dung.jpg', name: 'Chị Trương Thị Thùy Dung', review: 'Chị học khóa đá xay và sinh tố, tưởng đơn giản nhưng có nhiều bí quyết hay. Thầy cô chia sẻ kinh nghiệm thực tế, không giấu nghề.' },
  { img: 'images/students/tran-nhu-ngoc.jpg',        name: 'Chị Trần Như Ngọc',         review: 'Mình là người mới hoàn toàn nhưng sau khóa học thấy tự tin lắm. Thực hành trực tiếp tại lớp giúp mình nhớ lâu, không bị quên công thức.' },
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


// Transparent 1x1 placeholder — keeps the marquee layout intact before real images load
const IMG_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const FAQS = [
  {
    q: 'Chưa biết gì về pha chế, liệu có theo kịp không?',
    a: 'Đây là băn khoăn của hầu hết học viên khi đăng ký lần đầu — và câu trả lời là hoàn toàn theo kịp. Học Viện Cà Phê HCM thiết kế chương trình dành riêng cho người bắt đầu từ con số 0, đi từng bước từ lý thuyết cơ bản đến thực hành trực tiếp trên máy và nguyên liệu thật. Lớp học chỉ 3–4 học viên, giảng viên theo sát và chỉnh tay cho từng người — không ai bị bỏ lại phía sau.',
  },
  {
    q: 'Một khóa học mất bao nhiêu ngày? Có linh hoạt lịch không?',
    a: 'Khóa tổng hợp kéo dài 3–4 ngày liên tục (9h–16h, nghỉ trưa 1 tiếng), các chuyên đề lẻ học trong 1 ngày. Học Viện mở lớp liên tục, bạn có thể chọn ngày bắt đầu phù hợp với lịch cá nhân và đăng ký linh hoạt — không cần chờ khai giảng theo đợt cố định.',
  },
  {
    q: 'Học phí các khóa học là bao nhiêu?',
    a: 'Khóa pha chế tổng hợp 3–4 ngày dao động từ 5.200.000 – 7.500.000đ tùy chương trình. Các chuyên đề lẻ 1 ngày từ 2.200.000 – 3.000.000đ. Học phí đã bao gồm toàn bộ nguyên liệu thực hành, tài liệu công thức và bằng chứng nhận sau khóa học (đối với khóa tổng hợp và cà phê nâng cao).',
  },
  {
    q: 'Học xong có được hỗ trợ mở quán không?',
    a: 'Học Viện đồng hành cùng bạn không chỉ trong lớp học. Sau khi hoàn thành khóa, bạn được tư vấn trọn gói về thiết kế, thi công, setup quầy bar, cung cấp máy móc và nguyên liệu. Với dịch vụ Đào tạo Tại Quán, giảng viên còn đến tận nơi hướng dẫn thực tế và hỗ trợ vận hành — để bạn tự tin mở quán mà không phải loay hoay một mình.',
  },
  {
    q: 'Tuổi đã lớn, học có theo được không?',
    a: 'Pha chế không có giới hạn tuổi. Tại Học Viện, học viên từ nhiều độ tuổi và hoàn cảnh khác nhau đều hoàn thành khóa học thành công. Chương trình được thiết kế để ai cũng tự tay thực hành làm ra từng món — có tài liệu công thức chi tiết từng bước, từng định lượng đi kèm để bạn làm theo dễ dàng, không cần ghi nhớ tất cả trong lớp.',
  },
  {
    q: 'Học viên ở tỉnh khác đến học có chỗ nghỉ lại không?',
    a: 'Học Viện hiểu rằng di chuyển từ xa là một trở ngại lớn. Vì vậy, với các bạn ở tỉnh khác đến học các khóa tổng hợp, Học Viện hỗ trợ chỗ ở miễn phí ngay gần cơ sở — để bạn tập trung hoàn toàn vào việc học mà không lo chỗ ngủ hay chi phí lưu trú.',
  },
  {
    q: 'Sau khi hoàn thành khóa học có nhận bằng chứng nhận không?',
    a: 'Có. Học viên hoàn thành các khóa tổng hợp và khóa cà phê nâng cao sẽ được cấp bằng chứng nhận của Học Viện Cà Phê HCM. Đây là minh chứng cho năng lực pha chế của bạn — có giá trị khi xin việc tại quán hoặc tự giới thiệu bản thân khi mở quán riêng.',
  },
];

export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [lb, setLb] = useState<{ src: string; alt: string } | null>(null);
  const [fanIdx, setFanIdx] = useState(0);
  const [menuReady, setMenuReady] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const fanTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const marqueeRef1 = useRef<HTMLDivElement>(null);
  const marqueeRef2 = useRef<HTMLDivElement>(null);
  const menuSecRef = useRef<HTMLElement>(null);
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
    const el = menuSecRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setMenuReady(true); io.disconnect(); }
    }, { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
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
            <div className="hero-trust">⭐ 4.9/5 &nbsp;·&nbsp; 500+ học viên &nbsp;·&nbsp; ~10 năm kinh nghiệm</div>
            <h1>Học Pha Chế<br /><em>&amp; Kinh Doanh</em><br />Quán Cà Phê</h1>
            <p className="hero-sub">Đào tạo pha chế cà phê, trà sữa và tư vấn mở quán bài bản — từ công thức, set up menu đến vận hành kinh doanh.</p>
            <div className="hero-btns">
              <Link href="/khoa-hoc" className="btn btn-primary"><i className="ti ti-book-2"></i> Xem Khóa Học</Link>
              <Link href="/dang-ky" className="btn btn-outline">Đăng Ký Tư Vấn</Link>
            </div>
            <div className="hero-stats">
              <div className="h-stat"><div className="h-stat-n">11</div><div className="h-stat-l">Khóa &amp; chuyên đề</div></div>
              <div className="h-stat"><div className="h-stat-n">200<sup>+</sup></div><div className="h-stat-l">Công thức đồ uống</div></div>
              <div className="h-stat"><div className="h-stat-n">~10</div><div className="h-stat-l">Năm kinh nghiệm</div></div>
              <div className="h-stat"><div className="h-stat-n">1000<sup>+</sup></div><div className="h-stat-l">Quán được hỗ trợ</div></div>
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

      {/* COURSES + SERVICES CTA */}
      <section className="section" style={{ background: 'var(--bg-alt)' }} id="courses">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="tag">Dành Cho Bạn</span>
            <h2 className="title" style={{ marginTop: '10px' }}>Học Pha Chế &amp; Kinh Doanh Quán</h2>
            <p className="sub" style={{ maxWidth: '520px', margin: '0 auto' }}>Từ khóa học pha chế chuyên nghiệp đến tư vấn mở quán toàn diện — chúng tôi có gói phù hợp cho bạn.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
            {/* Card Khóa Học */}
            <div className="hp-price-card">
              <div className="hp-price-head">
                <div className="hp-price-title"><i className="ti ti-coffee"></i> Khóa Học Pha Chế</div>
                <p className="hp-price-desc">Cà phê, trà sữa, matcha, đá xay — khóa tổng hợp và chuyên đề lẻ. Thực hành trực tiếp, kèm 1–1.</p>
              </div>
              <ul className="hp-price-list">
                {KHOA_TONG_HOP.map(k => (
                  <li key={k.name} className="hp-price-row">
                    <div className="hp-price-name">
                      {k.name}
                      {k.pill && <span className="hp-price-pill">{k.pill}</span>}
                      <span className="hp-price-meta">{k.meta}</span>
                    </div>
                    <span className="hp-price-val">{k.price}</span>
                  </li>
                ))}
                <li className="hp-price-row hp-price-row-extra">
                  <div className="hp-price-name">Chuyên đề lẻ <span className="hp-price-meta">8 khóa tự chọn</span></div>
                  <span className="hp-price-val">từ 2.200.000đ</span>
                </li>
              </ul>
              <Link href="/khoa-hoc" className="btn-reg hp-price-btn">Xem tất cả khóa học <i className="ti ti-arrow-right"></i></Link>
            </div>

            {/* Card Dịch Vụ */}
            <div className="hp-price-card">
              <div className="hp-price-head">
                <div className="hp-price-title"><i className="ti ti-briefcase"></i> Dịch Vụ Kinh Doanh</div>
                <p className="hp-price-desc">Set up menu, khởi nghiệp, đào tạo vận hành — đồng hành từng bước để quán bạn phát triển bền vững.</p>
              </div>
              <ul className="hp-price-list">
                {DICH_VU_GIA.map(s => (
                  <li key={s.name} className="hp-price-row">
                    <div className="hp-price-name">
                      {s.name}
                      <span className="hp-price-meta">{s.meta}</span>
                    </div>
                    <span className="hp-price-val">{s.price}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dich-vu" className="btn-reg hp-price-btn">Xem chi tiết dịch vụ <i className="ti ti-arrow-right"></i></Link>
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
              <h2 className="title">Đồng Hành Cùng Bạn Mở Quán</h2>
              <p className="sub">Học Viện Cà Phê là nơi khởi nguồn kinh doanh của bạn — đào tạo pha chế bài bản và đồng hành từ công thức, set up menu đến vận hành quán cà phê, trà sữa hiệu quả.</p>
              <div className="checks">
                {['Khóa pha chế đa dạng: cà phê, trà sữa, trà trái cây, matcha, đá xay…','Học thực hành trực tiếp, có lớp kèm cặp 1–1 theo nhu cầu','Tư vấn set up menu signature, tối ưu chi phí mở quán','Đào tạo vận hành & hỗ trợ online 1 tháng sau khai trương'].map(t => (
                  <div className="check-row" key={t}><div className="check-dot"><i className="ti ti-check" style={{fontSize:'0.7rem'}}></i></div><span>{t}</span></div>
                ))}
              </div>
              <Link href="/dang-ky" className="btn btn-primary"><i className="ti ti-phone"></i> Liên Hệ Tư Vấn</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MENU GALLERY */}
      <section className="section" id="menu" ref={menuSecRef} style={{background:'var(--white)'}}>
        <div className="container">
          <h2 className="title" style={{textAlign:'center'}}>Kho 200+ Công Thức Thực Chiến</h2>
          <p className="sub" style={{textAlign:'center', maxWidth:'540px', margin:'0 auto'}}>Từ cà phê, trà sữa, trà trái cây, matcha đến đá xay — toàn bộ công thức được hướng dẫn chi tiết tại khóa học.</p>
        </div>
        <div className="marquee-outer">
          <div className="marquee-track go-left" ref={marqueeRef1}>
            {[...MENU_ROW1, ...MENU_ROW1].map(([file, cap], i) => (
              <div className="mi" key={`r1-${i}`}><div className="mi-thumb"><img src={menuReady ? `/images/gallery/Concept-studio-with-products/${file}` : IMG_PLACEHOLDER} alt={cap} loading="eager" /></div><div className="mi-cap">{cap}</div></div>
            ))}
          </div>
          <div className="marquee-track go-right" ref={marqueeRef2}>
            {[...MENU_ROW2, ...MENU_ROW2].map(([file, cap], i) => (
              <div className="mi" key={`r2-${i}`}><div className="mi-thumb"><img src={menuReady ? `/images/gallery/Concept-studio-with-products/${file}` : IMG_PLACEHOLDER} alt={cap} loading="eager" /></div><div className="mi-cap">{cap}</div></div>
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
                  <div className={`fan-photo${p === 0 ? ' fan-photo--zoom' : ''}`} onClick={p === 0 ? () => openLb(`/${s.img}`, s.name) : undefined}>
                    <img src={`/${s.img}`} alt={s.name} loading="lazy" onError={e => { const c = e.currentTarget.closest('.fan-card') as HTMLElement; if (c) c.style.display='none'; }} />
                    {p === 0 && <span className="fan-zoom-icon"><i className="ti ti-zoom-in"></i></span>}
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



      {/* FAQ */}
      <section className="section faq-section" id="faq">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <span className="tag">Câu Hỏi Thường Gặp</span>
            <h2 className="title" style={{ marginTop: '10px' }}>Giải Đáp Thắc Mắc</h2>
            <p className="sub" style={{ maxWidth: '540px', margin: '0 auto' }}>Khách hàng hay hỏi — chúng tôi trả lời thẳng, không vòng vo.</p>
          </div>
          <div className="faq-list">
            {FAQS.map((item, i) => (
              <div key={i} className={`faq-item${faqOpen === i ? ' open' : ''}`}>
                <button className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span>{item.q}</span>
                  <i className="ti ti-chevron-down faq-chevron"></i>
                </button>
                {faqOpen === i && <div className="faq-a">{item.a}</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <i className="ti ti-message-circle"></i> Hỏi Thêm Qua Zalo
            </a>
          </div>
        </div>
      </section>

    </>
  );
}
