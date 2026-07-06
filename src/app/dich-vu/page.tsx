'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { SERVICES } from '@/lib/services';

type ServiceItem = { img: string; name: string; desc: string; price: string; slug?: string; };

function resolveImg(img: string | null): string {
  if (!img) return '';
  if (img.startsWith('http')) return img;
  return `/images/services/${img}`;
}

const SERVICES_DEFAULT: ServiceItem[] = SERVICES.map(s => ({ img: `/images/services/${s.img}`, name: s.name, desc: s.desc, price: s.price, slug: s.slug }));

export default function DichVuPage() {
  const [lb, setLb] = useState<{ src: string; alt: string } | null>(null);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DEFAULT);

  const openLb = (src: string, alt: string) => { setLb({ src, alt }); document.body.style.overflow = 'hidden'; };
  const closeLb = () => { setLb(null); document.body.style.overflow = ''; };

  useEffect(() => {
    createClient().from('courses').select('name,image,description,price,slug').eq('active', true).eq('category', 'kinh-doanh').order('sort_order').then(({ data }) => {
      if (!data || !data.length) return;
      setServices(data.map((c: { image: string | null; name: string; description: string | null; price: string; slug: string | null }) => ({
        img: resolveImg(c.image),
        name: c.name,
        desc: c.description ?? '',
        price: c.price,
        slug: c.slug ?? undefined,
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
                <div className="poster-img" onClick={() => s.img && openLb(s.img, s.name)}>
                  {s.img && <img src={s.img} alt={s.name} loading="lazy" />}
                </div>
                <div className="poster-body">
                  <div className="poster-name">{s.name}</div>
                  <p className="poster-desc">{s.desc}</p>
                  <div className="poster-foot">
                    <div className="card-price">{s.price}</div>
                    {s.slug && (
                      <Link href={`/dich-vu/${s.slug}`} className="btn-reg">Xem Chi Tiết →</Link>
                    )}
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
