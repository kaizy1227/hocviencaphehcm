'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const TONG_HOP_DISPLAY = [
  { emoji: '🧋', ciClass: 'ci1', pill: '', imgPath: '/images/courses/Bang-gia-khoa-tong-hop/menu-truyen-thong.png', subtitle: 'Trà sữa, cà phê phin…', name: 'Tổng Hợp Truyền Thống', desc: 'Trọn bộ công thức trà sữa truyền thống, trà trái cây & matcha, cà phê phin, đá xay & sữa chua — học trong 3 ngày.', price: '5.200.000đ', duration: '3 ngày' },
  { emoji: '🍵', ciClass: 'ci2', pill: 'Phổ Biến', imgPath: '/images/courses/Bang-gia-khoa-tong-hop/menu-hien-dai.png', subtitle: 'Cà phê máy, nitro…', name: 'Tổng Hợp Hiện Đại', desc: 'Cà phê máy cơ bản, trà sữa hiện đại, oolong nitro tea, trà trái cây & matcha, đá xay & sinh tố — học trong 4 ngày.', price: '7.500.000đ', duration: '4 ngày' },
  { emoji: '☕', ciClass: 'ci4', pill: 'Chuyên Sâu', imgPath: '/images/courses/Bang-gia-khoa-le/ca-phe-may-nang-cao.png', subtitle: 'Espresso chuyên sâu', name: 'Cà Phê Máy Nâng Cao', desc: 'Khóa chuyên sâu về cà phê máy: chiết xuất espresso, tạo bọt sữa, latte art và vận hành máy pha chuyên nghiệp.', price: '8.300.000đ', duration: '3 ngày' },
];

const LE_COURSES_DEFAULT = [
  { img: 'ca-phe-may-co-ban.png', name: 'Cà Phê Máy Cơ Bản', desc: 'Pha espresso, cà phê sữa, bạc xỉu, americano, cappuccino, latte và hot chocolate. Phù hợp người mới muốn vận hành máy pha cà phê chuyên nghiệp.', price: '2.500.000đ', time: '1 ngày · 2 buổi' },
  { img: 'tra-sua-hien-dai.png', name: 'Trà Sữa Hiện Đại', desc: 'Shan tuyết phủ topping, olong nitro tea, olong trái cây và topping trân châu, phô mai, đường đen. Menu trà sữa hiện đại được ưa chuộng nhất hiện nay.', price: '2.500.000đ', time: '1 ngày · 2 buổi' },
  { img: 'tra-trai-cay-matcha.png', name: 'Trà Trái Cây & Matcha', desc: 'Hơn 15 công thức trà trái cây soda, trà tươi và 4 loại matcha latte. Dễ làm, chi phí thấp — phù hợp mọi loại hình quán.', price: '2.500.000đ', time: '1 ngày · 2 buổi' },
  { img: 'da-xay-sinh-to.png', name: 'Đá Xay & Sinh Tố', desc: 'Đá xay cocomilk, cookies chocolate, matcha freeze, việt quất iceblend, caramel freeze và 6 loại sinh tố. Thu hút khách mùa hè, áp dụng ngay vào menu.', price: '2.500.000đ', time: '1 ngày · 2 buổi' },
  { img: 'tra-sua-truyen-thong.png', name: 'Trà Sữa Truyền Thống', desc: 'Shan tuyết thăng hoa, olong, topping trân châu 3Q, đường đen, phô mai, kem bánh. Nền tảng cho menu trà sữa truyền thống hoàn chỉnh.', price: '2.200.000đ', time: '1 ngày · 2 buổi' },
  { img: 'ca-phe-phin.png', name: 'Cà Phê Phin – Đá Xay & Sữa Chua', desc: 'Cà phê phin, cacao & socola, sữa chua lắc kết hợp đá xay. Chi phí thấp, dễ triển khai — phù hợp quán nhỏ và xe đẩy.', price: '2.200.000đ', time: '1 ngày · 2 buổi' },
  { img: 'nitro-soda.png', name: 'Nâng Cấp Menu Nitro Soda', desc: 'Trà, cà phê, kombucha & soda nitro bằng hệ thống Nitro 4 vòi hiện đại. Tạo hương vị độc đáo — điểm nhận diện khác biệt cho quán.', price: '2.500.000đ', time: '1 ngày · 2 buổi' },
  { img: 'chon-mon-kem-1-1.png', name: 'Khóa Chọn Món Kèm 1–1', desc: 'Tự chọn 15 món, học kèm 1-1 cùng giảng viên. Phù hợp muốn nâng cấp hoặc thay đổi menu mà không cần học cả khóa tổng hợp.', price: '3.000.000đ', time: 'Linh hoạt' },
];

type TongHopItem = { emoji: string; ciClass: string; pill: string; imgPath: string; subtitle: string; name: string; desc: string; price: string; duration: string; };
type LeItem = { img: string; name: string; desc: string; price: string; time: string; };

export default function KhoaHocPage() {
  const router = useRouter();
  const [lb, setLb] = useState<{ src: string; alt: string } | null>(null);
  const [tongHopCourses, setTongHopCourses] = useState<TongHopItem[]>(TONG_HOP_DISPLAY);
  const [leCourses, setLeCourses] = useState<LeItem[]>(LE_COURSES_DEFAULT);

  const openLb = (src: string, alt: string) => { setLb({ src, alt }); document.body.style.overflow = 'hidden'; };
  const closeLb = () => { setLb(null); document.body.style.overflow = ''; };
  const dangKy = (course: string) => router.push(`/dang-ky?course=${encodeURIComponent(course)}`);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('courses').select('*').eq('active', true).order('sort_order').then(({ data }) => {
      if (!data || !data.length) return;
      const th = data.filter((c: { category: string }) => c.category === 'tong-hop');
      const le = data.filter((c: { category: string }) => c.category === 'chuyen-de');
      if (th.length) setTongHopCourses(prev => prev.map(d => {
        const db = th.find((c: { name: string }) => c.name === d.name);
        return db ? { ...d, price: db.price, desc: db.description ?? d.desc, duration: db.duration ?? d.duration } : d;
      }));
      if (le.length) setLeCourses(le.map((c: { image: string; name: string; description: string; price: string; duration: string }) => ({
        img: c.image, name: c.name, desc: c.description, price: c.price, time: c.duration,
      })));
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLb(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {lb && (
        <div className="lightbox active" onClick={e => { if (e.target === e.currentTarget) closeLb(); }}>
          <button className="lb-close" onClick={closeLb}>&#x2715;</button>
          <img src={lb.src} alt={lb.alt} onClick={closeLb} />
        </div>
      )}

      <section className="lh-hero">
        <div className="container">
          <div className="nl-hero-crumb">
            <Link href="/">Trang Chủ</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
            <span>Khóa Học</span>
          </div>
          <h1>Các Khóa Học <em>Pha Chế</em></h1>
          <p>Khóa tổng hợp và chuyên đề lẻ — học đúng thứ bạn cần, thực hành trực tiếp, có giảng viên kèm cặp 1–1.</p>
          <Link href="/dang-ky" className="btn btn-primary"><i className="ti ti-phone"></i> Đăng Ký Tư Vấn</Link>
        </div>
      </section>

      <section className="section courses" style={{ paddingBottom: '0' }}>
        <div className="container">
          <div className="courses-head">
            <div>
              <span className="tag">Khóa Tổng Hợp</span>
              <h2 className="title" style={{ marginTop: '8px' }}>Học Trọn Gói Theo Chủ Đề</h2>
            </div>
            <Link href="/dang-ky" className="btn btn-outline">Tư Vấn Thêm →</Link>
          </div>
          <div className="course-grid">
            {tongHopCourses.map(c => (
              <div className="card" key={c.name}>
                <div className={`card-img ${c.ciClass}`} onClick={() => openLb(c.imgPath, c.name)}>
                  {c.emoji}{c.pill && <span className="card-pill">{c.pill}</span>}
                  <img className="ph-img" src={c.imgPath} alt={c.name} onError={e => { e.currentTarget.style.display = 'none'; }} />
                </div>
                <div className="card-body">
                  <div className="card-meta">
                    <span><i className="ti ti-clock" style={{ fontSize: '0.88rem' }}></i> {c.duration}</span>
                    <span><i className="ti ti-cup" style={{ fontSize: '0.88rem' }}></i> {c.subtitle}</span>
                  </div>
                  <div className="card-name">{c.name}</div>
                  <div className="card-desc">{c.desc}</div>
                  <div className="card-foot">
                    <div className="card-price">{c.price}<small>Khóa {c.duration}</small></div>
                    <button className="btn-reg" onClick={() => dangKy(c.name)}>Đăng Ký</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '48px' }}>
        <div className="container">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>Chuyên đề lẻ tự chọn</h3>
          <p className="sub" style={{ marginBottom: '20px' }}>Học đúng món bạn cần — mỗi chuyên đề 1 ngày, riêng Cà Phê Máy Nâng Cao 3 ngày.</p>
          <div className="le-grid">
            {leCourses.map(c => (
              <div className="le-card" key={c.name}>
                <div className="le-img" onClick={() => openLb(c.img?.startsWith('http') ? c.img : `/images/courses/Bang-gia-khoa-le/${c.img}`, c.name)}>
                  <img src={c.img?.startsWith('http') ? c.img : `/images/courses/Bang-gia-khoa-le/${c.img}`} alt={c.name} loading="lazy"
                    onError={e => { const card = e.currentTarget.closest('.le-card') as HTMLElement; if (card) card.style.display = 'none'; }} />
                </div>
                <div className="le-body">
                  <div className="le-meta">
                    <span><i className="ti ti-clock"></i>{c.time}</span>
                    <span className="le-price">{c.price}</span>
                  </div>
                  <div className="le-name">{c.name}</div>
                  <div className="le-desc">{c.desc}</div>
                  <div className="le-foot">
                    <span className="le-price">{c.price}</span>
                    <button className="btn-reg" onClick={() => dangKy(c.name)}>Đăng Ký</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
