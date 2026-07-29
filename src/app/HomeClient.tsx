'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import s from './home.module.css';

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
  { src: 'images/gallery/Life-styles-with-person/~12321.webp', cap: 'Thực hành để tự tin đứng quầy' },
  { src: 'images/gallery/Life-styles-with-person/~12405.webp', cap: 'Pha chế đúng chuẩn từ ngày đầu' },
  { src: 'images/gallery/Life-styles-with-person/~12432.webp', cap: 'Kèm cặp 1–1 từng học viên' },
  { src: 'images/gallery/Life-styles-with-person/~12498.webp', cap: 'Từ học viên đến chủ quán' },
  { src: 'images/gallery/Life-styles-with-person/~12555.webp', cap: 'Lớp nhỏ, chất lượng cao' },
  { src: 'images/gallery/Life-styles-with-person/~12573.webp', cap: 'Nguyên liệu thật, thiết bị thật' },
  { src: 'images/gallery/Life-styles-with-person/~12720.webp', cap: 'Đào tạo bài bản hơn 10 năm kinh nghiệm' },
  { src: 'images/gallery/Life-styles-with-person/~12816.webp', cap: '1000+ quán đã được hỗ trợ' },
  { src: 'images/gallery/Life-styles-with-person/~12930.webp', cap: 'Học xong là làm được ngay' },
];

const STUDENTS = [
  { img: 'images/students/nguyen-phuong-hong.jpg',    name: 'Chị Nguyễn Phượng Hồng',   review: 'Mình đã thử nhiều chỗ học pha chế nhưng ở đây dạy bài bản và tâm huyết nhất. Học xong là tự tin hẳn, không còn lo khi đứng bar nữa.' },
  { img: 'images/students/le-trong-nghia.jpg',        name: 'Anh Lê Trọng Nghĩa',        review: 'Chất lượng đào tạo thực sự ổn, không qua loa hay hời hợt. Mình học xong là mở quán được luôn, không phải loay hoay gì thêm nữa.' },
  { img: 'images/students/nguyen-nhat-dien.jpg',      name: 'Anh Nguyễn Nhật Điền',      review: 'Cảm ơn thầy cô đã kiên nhẫn hướng dẫn! Từ người chưa biết gì về pha chế, giờ mình tự tin làm menu cà phê cho quán của mình rồi.' },
  { img: 'images/students/le-the-phong.jpg',          name: 'Anh Lê Thế Phong',          review: 'Mình học khóa cà phê máy, thầy cô hướng dẫn rất nhiệt tình, tận tâm từng động tác nhỏ. Ra về là tự pha được ngay, rất đáng tiền!' },
  { img: 'images/students/pham-nhut-tan.jpg',         name: 'Anh Phạm Nhựt Tân',         review: 'Khóa học vừa ngắn vừa đủ, không quá dài dòng nhưng vẫn đầy đủ kỹ năng. Giảng viên chia sẻ kinh nghiệm thực tế rất hay!' },
  { img: 'images/students/lay-sivmey.jpg',            name: 'Chị Lay Sivmey',             review: 'Mình từ Campuchia sang học, thầy cô rất kiên nhẫn và tận tình. Giờ mình pha trà sữa chuẩn lắm, cảm ơn Học Viện Cà Phê nhiều!' },
  { img: 'images/students/phan-thi-kim-xuong.jpg',   name: 'Chị Phan Thị Kim Xương',    review: 'Mình học gói khởi nghiệp, được tư vấn rất kỹ từ menu đến cách tính giá. Mở quán rồi mà vẫn được hỗ trợ, không cảm giác bị bỏ rơi.' },
  { img: 'images/students/phou-sivchou.jpg',          name: 'Chị Phou Sivchou',           review: 'Thầy cô rất tốt bụng và kiên nhẫn, chỉ dẫn từng bước tỉ mỉ. Bây giờ chị pha được trà sữa ngon đúng chuẩn và rất tự tin rồi!' },
  { img: 'images/students/truong-thi-thuy-dung.jpg', name: 'Chị Trương Thị Thùy Dung',  review: 'Chị học khóa đá xay và sinh tố, tưởng đơn giản nhưng có nhiều bí quyết hay. Thầy cô chia sẻ kinh nghiệm thực tế, không giấu nghề.' },
  { img: 'images/students/tran-nhu-ngoc.jpg',         name: 'Chị Trần Như Ngọc',          review: 'Mình là người mới hoàn toàn nhưng sau khóa học thấy tự tin lắm. Thực hành trực tiếp tại lớp giúp mình nhớ lâu, không bị quên công thức.' },
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

const IMG_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const FAQS = [
  { icon: 'ti-school', badge: 'Lớp 3–4 người', q: 'Chưa biết gì về pha chế, liệu có theo kịp không?', a: 'Đây là băn khoăn của hầu hết học viên khi đăng ký lần đầu — và câu trả lời là hoàn toàn theo kịp. Học Viện thiết kế chương trình dành riêng cho người bắt đầu từ con số 0, đi từng bước từ lý thuyết đến thực hành trực tiếp trên máy và nguyên liệu thật. Lớp học chỉ 3–4 học viên, giảng viên theo sát và chỉnh tay cho từng người.' },
  { icon: 'ti-calendar', badge: '3–4 ngày', q: 'Một khóa học mất bao nhiêu ngày? Có linh hoạt lịch không?', a: 'Khóa tổng hợp kéo dài 3–4 ngày liên tục (9h–16h, nghỉ trưa 1 tiếng), các chuyên đề lẻ học trong 1 ngày. Học Viện mở lớp liên tục — bạn chọn ngày bắt đầu phù hợp với lịch cá nhân, không cần chờ khai giảng theo đợt.' },
  { icon: 'ti-coin', badge: 'Từ 2.200.000đ', q: 'Học phí các khóa học là bao nhiêu?', a: 'Khóa pha chế tổng hợp 3–4 ngày dao động từ 5.200.000 – 7.500.000đ tùy chương trình. Chuyên đề lẻ 1 ngày từ 2.200.000 – 3.000.000đ. Học phí đã bao gồm nguyên liệu thực hành, tài liệu công thức và bằng chứng nhận sau khoá.' },
  { icon: 'ti-building-store', badge: 'Hỗ trợ sau khoá', q: 'Học xong có được hỗ trợ mở quán không?', a: 'Học Viện đồng hành cùng bạn không chỉ trong lớp học. Sau khoá, bạn được tư vấn trọn gói về thiết kế, setup quầy bar, máy móc và nguyên liệu. Với dịch vụ Đào tạo Tại Quán, giảng viên đến tận nơi hướng dẫn thực tế và hỗ trợ vận hành.' },
  { icon: 'ti-users', badge: 'Mọi độ tuổi', q: 'Tuổi đã lớn, học có theo được không?', a: 'Pha chế không có giới hạn tuổi. Tại Học Viện, học viên từ nhiều độ tuổi và hoàn cảnh khác nhau đều hoàn thành thành công. Chương trình có tài liệu công thức chi tiết từng bước và định lượng rõ ràng — bạn làm theo dễ dàng, không cần ghi nhớ tất cả trong lớp.' },
  { icon: 'ti-home', badge: 'Chỗ ở miễn phí', q: 'Học viên ở tỉnh khác đến học có chỗ nghỉ lại không?', a: 'Học Viện hiểu di chuyển từ xa là trở ngại lớn. Vì vậy, với các bạn ở tỉnh khác đến học khóa tổng hợp, Học Viện hỗ trợ chỗ ở miễn phí ngay gần cơ sở — để bạn tập trung hoàn toàn vào việc học.' },
  { icon: 'ti-certificate', badge: 'Chứng nhận HV', q: 'Sau khi hoàn thành khóa học có nhận bằng chứng nhận không?', a: 'Có. Học viên hoàn thành khóa tổng hợp và cà phê nâng cao được cấp bằng chứng nhận của Học Viện Cà Phê HCM — có giá trị khi xin việc tại quán hoặc tự giới thiệu bản thân khi mở quán riêng.' },
  { icon: 'ti-refresh', badge: 'Học lại 12 tháng', q: 'Học viên cũ có thể học lại không?', a: 'Có. Trong vòng 12 tháng sau khoá, học viên được quay lại ôn tập hoặc củng cố kỹ năng mà không phải đóng lại học phí — bạn chỉ cần đóng chi phí nguyên liệu và phòng học cho buổi ôn. Đây là cách Học Viện đồng hành dài hạn với học viên sau khi kết thúc khoá chính.' },
];

export default function HomeClient({ nvlSection }: { nvlSection: React.ReactNode }) {
  const [heroIdx, setHeroIdx]     = useState(0);
  const [lb, setLb]               = useState<{ src: string; alt: string; href?: string } | null>(null);
  const [fanIdx, setFanIdx]       = useState(0);
  const [menuReady, setMenuReady] = useState(false);
  const [faqOpen, setFaqOpen]     = useState<number | null>(null);

  const fanTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const marqueeRef1 = useRef<HTMLDivElement>(null);
  const marqueeRef2 = useRef<HTMLDivElement>(null);
  const menuSecRef  = useRef<HTMLElement>(null);
  const n = STUDENTS.length;

  const openLb = (src: string, alt: string, href?: string) => { setLb({ src, alt, href }); document.body.style.overflow = 'hidden'; };
  const closeLb = () => { setLb(null); document.body.style.overflow = ''; };

  const resetFanTimer = () => {
    if (fanTimerRef.current) clearInterval(fanTimerRef.current);
    fanTimerRef.current = setInterval(() => setFanIdx(i => (i + 1) % n), 3800);
  };

  useEffect(() => {
    const iv = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMGS.length), 4500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    resetFanTimer();
    return () => { if (fanTimerRef.current) clearInterval(fanTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setMenuReady(true); io.disconnect(); }
    }, { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLb(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fanPositions = [-2, -1, 0, 1, 2];

  return (
    <div className={s.page}>
      {/* LIGHTBOX */}
      {lb && (
        <div className="lightbox active" onClick={e => { if (e.target === e.currentTarget) closeLb(); }}>
          <button className="lb-close" onClick={closeLb}>&#x2715;</button>
          <div className={s.lbInner} onClick={e => { if (e.target === e.currentTarget) closeLb(); }}>
            <img src={lb.src} alt={lb.alt} />
            <p className={s.lbCaption}>{lb.alt}</p>
            {lb.href && (
              <Link href={lb.href} className={s.lbDetailBtn} onClick={closeLb}>
                <i className="ti ti-info-circle"></i> Xem chi tiết sản phẩm
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section className={s.hero} id="home">
        <div className="container">
          <div className={s.heroSplit}>
            <div>
              <span className={s.eyebrow}>Đào tạo pha chế · Tư vấn mở quán tại TP.HCM</span>
              <h1 className={s.heroH1}>Học Pha Chế.<br /><em>Tự Tin Mở Quán.</em></h1>
              <p className={s.heroLead}>Đào tạo pha chế cà phê, trà sữa và hỗ trợ mở quán tại TP.HCM — từ công thức thực chiến đến xây menu và vận hành thực tế.</p>
              <div className={s.heroCta}>
                <Link href="/khoa-hoc" className="btn btn-primary"><i className="ti ti-book-2"></i> Xem Khóa Học</Link>
                <Link href="/dang-ky" className="btn btn-outline">Đăng Ký Tư Vấn</Link>
                <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><i className="ti ti-cup"></i> Đến thử món trực tiếp</a>
              </div>
              <div className={s.trustLine}>
                <span><i className="ti ti-check" style={{ color:'var(--accent)' }}></i> Lớp 3–4 người, kèm sát từng học viên</span>
                <span><i className="ti ti-check" style={{ color:'var(--accent)' }}></i> Hỗ trợ mở quán sau khi học xong</span>
              </div>
            </div>
            <figure className={s.heroVisual}>
              {HERO_IMGS.map(({ src, cap }, i) => (
                <img
                  key={src} src={`/${src}`} alt={cap}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  style={{ position: i === 0 ? 'relative' : 'absolute', inset:0, opacity: i === heroIdx ? 0.83 : 0, transition:'opacity .8s ease' }}
                />
              ))}
              <figcaption className={s.heroCaption}>
                <strong>{HERO_IMGS[heroIdx].cap}</strong>
                <span>⭐ 4.9/5 · 5.000+ học viên · hơn 10 năm kinh nghiệm</span>
              </figcaption>
              <button className={`${s.heroArrow} ${s.heroArrowPrev}`} onClick={() => setHeroIdx(i => (i - 1 + HERO_IMGS.length) % HERO_IMGS.length)} aria-label="Ảnh trước">&#8249;</button>
              <button className={`${s.heroArrow} ${s.heroArrowNext}`} onClick={() => setHeroIdx(i => (i + 1) % HERO_IMGS.length)} aria-label="Ảnh tiếp theo">&#8250;</button>
              <div className={s.heroDots}>
                {HERO_IMGS.map((_, i) => (
                  <button key={i} className={`${s.heroDot}${i === heroIdx ? ` ${s.heroDotActive}` : ''}`} onClick={() => setHeroIdx(i)} aria-label={`Ảnh ${i+1}`} />
                ))}
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* ── STAT RAIL ── */}
      <div className={s.statRail}>
        <div className="container">
          <div className={s.stats}>
            <div className={s.stat}><span className={s.statNum}>11</span><span className={s.statLabel}>Khóa &amp; chuyên đề pha chế</span></div>
            <div className={s.stat}><span className={s.statNum}>200<sup>+</sup></span><span className={s.statLabel}>Công thức đồ uống</span></div>
            <div className={s.stat}><span className={s.statNum}>10<sup>+</sup></span><span className={s.statLabel}>Năm kinh nghiệm đào tạo</span></div>
            <div className={s.stat}><span className={s.statNum}>1000<sup>+</sup></span><span className={s.statLabel}>Quán được hỗ trợ</span></div>
          </div>
        </div>
      </div>

      {/* ── JOURNEY CARDS ── */}
      <section className={s.journeySection}>
        <div className="container">
          <div className={s.journeyHeader}>
            <span className={s.eyebrow}>Trọn vẹn từ A đến Z</span>
            <h2 className={s.journeyTitle}>Từ con số 0<br/><em>đến khi quán vận hành</em></h2>
            <p className={s.journeyLead}>Học Viện đồng hành toàn bộ hành trình — từ chưa biết pha chế đến khi quán bạn khai trương và hoạt động ổn định.</p>
          </div>
          <div className={s.journeyGrid}>
            <Link href="/khoa-hoc" className={`${s.journeyCard} ${s.jc1}`}>
              <div className={s.journeyIconWrap}>
                <i className="ti ti-coffee"></i>
                <span className={s.journeyStep}>01</span>
              </div>
              <h3>Học nghề pha chế</h3>
              <p>Không cần kinh nghiệm. Thực hành trực tiếp tại quầy — cà phê, trà sữa, matcha, đá xay, Kombucha — lớp nhỏ, giảng viên kèm sát.</p>
              <span className={s.journeyLink}>Xem khóa học <i className="ti ti-arrow-right"></i></span>
            </Link>
            <div className={s.journeyArrow}><i className="ti ti-chevron-right"></i></div>
            <Link href="/dich-vu" className={`${s.journeyCard} ${s.jc2}`}>
              <div className={s.journeyIconWrap}>
                <i className="ti ti-building-store"></i>
                <span className={s.journeyStep}>02</span>
              </div>
              <h3>Mở quán trọn gói</h3>
              <p>Từ chưa có gì đến khai trương — Học Viện hỗ trợ chọn mặt bằng, thiết kế quầy, xây menu, đào tạo nhân viên và vận hành ngày đầu.</p>
              <span className={s.journeyLink}>Xem dịch vụ <i className="ti ti-arrow-right"></i></span>
            </Link>
            <div className={s.journeyArrow}><i className="ti ti-chevron-right"></i></div>
            <Link href="/kho-cong-thuc" className={`${s.journeyCard} ${s.jc3}`}>
              <div className={s.journeyIconWrap}>
                <i className="ti ti-book-2"></i>
                <span className={s.journeyStep}>03</span>
              </div>
              <h3>Kho công thức độc quyền</h3>
              <p>200+ công thức thực chiến — đầy đủ định lượng, giá vốn, ảnh minh họa. Cập nhật trend liên tục để menu quán luôn mới mẻ.</p>
              <span className={s.journeyLink}>Khám phá công thức <i className="ti ti-arrow-right"></i></span>
            </Link>
            <div className={s.journeyArrow}><i className="ti ti-chevron-right"></i></div>
            <Link href="/nguyen-lieu" className={`${s.journeyCard} ${s.jc4}`}>
              <div className={s.journeyIconWrap}>
                <i className="ti ti-shopping-bag"></i>
                <span className={s.journeyStep}>04</span>
              </div>
              <h3>Nguồn hàng & dụng cụ</h3>
              <p>Nguyên liệu, dụng cụ bar, thiết bị — giá cạnh tranh, cập nhật liên tục. Đặt thẳng từ kho Học Viện, giao tận nơi.</p>
              <span className={s.journeyLink}>Xem nguyên liệu <i className="ti ti-arrow-right"></i></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BẢNG GIÁ POSTER ── */}
      <section className="section" id="courses" style={{ background:'var(--white,#fff)' }}>
        <div className="container">
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Chương trình & dịch vụ</span>
              <h2 className={s.sectionTitle}>Bảng Giá Khóa Học</h2>
            </div>
          </div>
          <div className={s.posterWrap}>
            <div className={s.posterImgWrap} onClick={() => openLb('/images/courses/Bang-gia-khoa-tong-hop/danh-sach-khoa-hoc-pha-che.webp', 'Bảng giá khóa học pha chế')} title="Nhấn để xem lớn">
              <img
                src="/images/courses/Bang-gia-khoa-tong-hop/danh-sach-khoa-hoc-pha-che.webp"
                alt="Bảng giá khóa học pha chế"
                className={s.posterImg}
                loading="lazy"
              />
              <span className={s.posterZoomHint}><i className="ti ti-zoom-in"></i> Nhấn để phóng to</span>
            </div>
            <div className={s.posterBtns}>
              <Link href="/khoa-hoc" className="btn btn-primary">Xem chi tiết khóa học <i className="ti ti-arrow-right"></i></Link>
              <Link href="/dich-vu" className="btn btn-outline">Dịch vụ kinh doanh <i className="ti ti-arrow-right"></i></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MENU MARQUEE ── */}
      <section className={`section ${s.menuSection}`} id="menu" ref={menuSecRef} style={{ background:'var(--white,#fff)' }}>
        <div className="container">
          <div className={s.sectionHead} style={{ justifyContent:'center', textAlign:'center' }}>
            <div>
              <span className={s.eyebrow}>Công thức thực chiến</span>
              <h2 className={s.sectionTitle}>Kho 200+ Công Thức Đồ Uống</h2>
              <p className={s.sectionLead}>Từ cà phê, trà sữa, trà trái cây, matcha đến đá xay — toàn bộ công thức được hướng dẫn chi tiết tại khóa học.</p>
            </div>
          </div>
        </div>
        <div className="marquee-outer">
          <div className="marquee-track go-left" ref={marqueeRef1}>
            {[...MENU_ROW1, ...MENU_ROW1].map(([file, cap], i) => (
              <div className="mi" key={`r1-${i}`}>
                <div className="mi-thumb" style={{ cursor:'zoom-in' }} onClick={() => menuReady && openLb(`/images/gallery/Concept-studio-with-products/${file}`, cap)}><img src={menuReady ? `/images/gallery/Concept-studio-with-products/${file}` : IMG_PLACEHOLDER} alt={cap} loading="eager" /></div>
                <div className="mi-cap">{cap}</div>
              </div>
            ))}
          </div>
          <div className="marquee-track go-right" ref={marqueeRef2}>
            {[...MENU_ROW2, ...MENU_ROW2].map(([file, cap], i) => (
              <div className="mi" key={`r2-${i}`}>
                <div className="mi-thumb" style={{ cursor:'zoom-in' }} onClick={() => menuReady && openLb(`/images/gallery/Concept-studio-with-products/${file}`, cap)}><img src={menuReady ? `/images/gallery/Concept-studio-with-products/${file}` : IMG_PLACEHOLDER} alt={cap} loading="eager" /></div>
                <div className="mi-cap">{cap}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INGREDIENT MARQUEE — rendered server-side ── */}
      {nvlSection}

      {/* ── FAN CAROUSEL ── */}
      <section className="section" id="hoc-vien" style={{ background:'var(--bg-alt,#F5F4F1)', overflow:'hidden' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <span className="tag">Học Viên</span>
          <h2 className="title">Học Viên Nhận Chứng Nhận</h2>
          <p className="sub" style={{ maxWidth:'540px', margin:'0 auto' }}>Mỗi học viên hoàn thành khóa học đều nhận chứng nhận từ Học Viện Cà Phê — bước đầu trên hành trình kinh doanh của riêng bạn.</p>
        </div>
        <div className="fan-wrap">
          <div className="fan-stage">
            {fanPositions.map(p => {
              const idx = (fanIdx + p + n) % n;
              const st = STUDENTS[idx];
              return (
                <div key={`fan-${p}`} className="fan-card" data-pos={p} onClick={p !== 0 ? () => { setFanIdx(idx); resetFanTimer(); } : undefined}>
                  <div className={`fan-photo${p === 0 ? ' fan-photo--zoom' : ''}`} onClick={p === 0 ? () => openLb(`/${st.img}`, st.name) : undefined}>
                    <img src={`/${st.img}`} alt={st.name} loading="lazy" onError={e => { const c = e.currentTarget.closest('.fan-card') as HTMLElement; if (c) c.style.display='none'; }} />
                    {p === 0 && <span className="fan-zoom-icon"><i className="ti ti-zoom-in"></i></span>}
                  </div>
                  <div className="fan-info">
                    <div className="fan-name">{st.name}</div>
                    {p === 0 && st.review && <div className="fan-review">&ldquo;{st.review}&rdquo;</div>}
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

      {/* ── CAMPUSES ── */}
      <section className="section" style={{ background:'var(--white,#fff)' }}>
        <div className="container">
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Cơ sở đào tạo</span>
              <h2 className={s.sectionTitle}>Học tại HCM hoặc Hà Nội</h2>
            </div>
          </div>
          <div className={s.campusGrid}>
            <a className={s.campusCard} href="https://maps.app.goo.gl/Y6ED3sRDtYymYhti8" target="_blank" rel="noopener noreferrer">
              <div className={s.campusMapWrap}>
                <img src="/images/gallery/maps/ho-chi-minh.jpg" alt="Bản đồ cơ sở TP.HCM" loading="lazy" />
                <span className={s.campusMapBadge}><i className="ti ti-map-2"></i> Mở Google Maps</span>
              </div>
              <div className={s.campusBody}>
                <p className={s.campusMeta}>Cơ sở · TP.HCM</p>
                <h3>Tân Bình, Hồ Chí Minh</h3>
                <p>26/23 Nguyễn Minh Hoàng, phường 12, Tân Bình.</p>
                <span className={s.campusHours}><i className="ti ti-clock"></i> T2–T7 · 8h30–17h30</span>
              </div>
            </a>
            <a className={s.campusCard} href="https://maps.app.goo.gl/VyzD2QrmMUzXtkvN8" target="_blank" rel="noopener noreferrer">
              <div className={s.campusMapWrap}>
                <img src="/images/gallery/maps/ha-noi.jpg" alt="Bản đồ cơ sở Hà Nội" loading="lazy" />
                <span className={s.campusMapBadge}><i className="ti ti-map-2"></i> Mở Google Maps</span>
              </div>
              <div className={s.campusBody}>
                <p className={s.campusMeta}>Cơ sở chính · Hà Nội</p>
                <h3>Cầu Giấy, Hà Nội</h3>
                <p>8 Dương Đình Nghệ, phường Yên Hòa, Cầu Giấy.</p>
                <span className={s.campusHours}><i className="ti ti-clock"></i> T2–T7 · 8h30–17h30</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" id="faq" style={{ background:'var(--bg-alt,#F5F4F1)' }}>
        <div className="container">
          <div style={{ textAlign:'center' }}>
            <span className={s.eyebrow}>Câu hỏi thường gặp</span>
            <h2 className={s.sectionTitle} style={{ marginTop:8 }}>Giải đáp thắc mắc</h2>
            <p className={s.sectionLead} style={{ margin:'10px auto 0', textAlign:'center' }}>Khách hàng hay hỏi — chúng tôi trả lời thẳng, không vòng vo.</p>
          </div>
          <div className={s.faqWrap}>
            {FAQS.map((item, i) => (
              <div key={i} className={`${s.faqItem}${faqOpen === i ? ` ${s.faqItemOpen}` : ''}`}>
                <button className={s.faqQ} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span className={s.faqIcon}><i className={`ti ${item.icon}`}></i></span>
                  <span className={s.faqQText}>
                    {item.q}
                    <span className={s.faqBadge}>{item.badge}</span>
                  </span>
                  <span className={`${s.faqToggle}${faqOpen === i ? ` ${s.faqToggleOpen}` : ''}`}>
                    <i className="ti ti-chevron-down"></i>
                  </span>
                </button>
                {faqOpen === i && <div className={s.faqA}>{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONSULT CTA ── */}
      <section className="section" style={{ background:'var(--white,#fff)' }}>
        <div className="container">
          <div className={s.consult}>
            <h2>Sẵn sàng bắt đầu hành trình của bạn?</h2>
            <p>Liên hệ ngay để được tư vấn miễn phí về khóa học và dịch vụ phù hợp với mục tiêu của bạn.</p>
            <div className={s.consultActions}>
              <Link href="/dang-ky" className="btn btn-primary"><i className="ti ti-phone"></i> Đăng Ký Tư Vấn Miễn Phí</Link>
              <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className="btn btn-outline"><i className="ti ti-brand-zalo"></i> Chat Zalo Ngay</a>
              <a href="tel:0834790555" className="btn btn-outline"><i className="ti ti-phone-call"></i> 0834.790.555</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
