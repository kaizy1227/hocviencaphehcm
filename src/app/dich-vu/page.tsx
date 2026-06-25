'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const SERVICES_DEFAULT = [
  { img: 'khoi-nghiep-v2.png', name: 'Khóa Khởi Nghiệp', desc: 'Nền tảng mở quán, quản lý chi phí, vận hành hiệu quả — 1 ngày (2 buổi). Hỗ trợ online 1 tháng sau khai trương.', price: '4.000.000đ' },
  { img: 'setup-menu-7tr.png', name: 'Gói Set Up Menu', desc: 'Menu nhỏ gọn dưới 10 món: xây dựng 2–3 signature, thiết kế menu, hướng dẫn cost, tư vấn thiết bị và test món 2 lần.', price: '7.000.000đ' },
  { img: 'setup-menu-15-20-mon.png', name: 'Setup Menu 15–20 Món', desc: 'Menu độc quyền 15–20 món: 3–5 signature, tính cost toàn bộ, tư vấn nguyên liệu & thiết bị, test món 2 buổi tại Học Viện.', price: '15.000.000đ' },
  { img: 'dao-tao-van-hanh-v2.png', name: 'Đào Tạo Vận Hành', desc: 'Vận hành chuẩn, quản trị chặt: xây dựng chính sách, quản lý nhân sự, kiểm soát chi phí & doanh thu. Hỗ trợ online 1 tháng sau khai trương.', price: '15.000.000đ' },
  { img: 'dao-tao-tai-quan.png', name: 'Đào Tạo Tại Quán', desc: 'Giảng viên đến trực tiếp quán đào tạo nhân viên pha chế, thiết lập quy trình bar & hỗ trợ sắp xếp thiết bị phù hợp với thực tế quán.', price: 'Từ 2.300.000đ/ngày' },
];

type ServiceItem = { img: string; name: string; desc: string; price: string; };

export default function DichVuPage() {
  const router = useRouter();
  const [lb, setLb] = useState<{ src: string; alt: string } | null>(null);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DEFAULT);

  const openLb = (src: string, alt: string) => { setLb({ src, alt }); document.body.style.overflow = 'hidden'; };
  const closeLb = () => { setLb(null); document.body.style.overflow = ''; };
  const dangKy = (name: string) => router.push(`/dang-ky?course=${encodeURIComponent(name)}`);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('courses').select('*').eq('active', true).eq('category', 'kinh-doanh').order('sort_order').then(({ data }) => {
      if (!data || !data.length) return;
      setServices(data.map((c: { image: string; name: string; description: string; price: string }) => ({
        img: c.image, name: c.name, desc: c.description, price: c.price,
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
            <span>Dịch Vụ</span>
          </div>
          <h1>Dịch Vụ <em>Kinh Doanh</em></h1>
          <p>Từ khởi nghiệp, set up menu đến đào tạo vận hành — chúng tôi đồng hành cùng bạn từng bước mở quán.</p>
          <Link href="/dang-ky" className="btn btn-primary"><i className="ti ti-phone"></i> Tư Vấn Ngay</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4px' }}><span className="tag">Gói Kinh Doanh</span></div>
          <h2 className="title" style={{ textAlign: 'center' }}>Đồng Hành Mở &amp; Vận Hành Quán</h2>
          <p className="sub" style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 44px' }}>
            Không chỉ pha chế — chúng tôi đồng hành cùng bạn từ khởi nghiệp, set up menu đến vận hành quán hiệu quả.
          </p>
          <div className="poster-grid">
            {services.map(s => (
              <div className="poster-card" key={s.name}>
                <div className="poster-img" onClick={() => openLb(`/images/services/${s.img}`, s.name)}>
                  <img src={`/images/services/${s.img}`} alt={s.name} loading="lazy" />
                </div>
                <div className="poster-body">
                  <div className="poster-name">{s.name}</div>
                  <p className="poster-desc">{s.desc}</p>
                  <div className="poster-foot">
                    <div className="card-price">{s.price}</div>
                    <button className="btn-reg" onClick={() => dangKy(s.name)}>Đăng Ký</button>
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
