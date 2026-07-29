'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type ServiceRow = {
  id: string;
  name: string;
  image: string | null;
  price: string;
  description: string | null;
  detail?: string | null;
  slug: string;
};

function resolveImg(img: string | null): string {
  if (!img) return '';
  if (img.startsWith('http')) return img;
  const webp = img.replace(/\.(png|jpe?g)$/i, '.webp');
  return `/images/services/${webp}`;
}

export default function DichVuDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [service, setService] = useState<ServiceRow | null | undefined>(undefined);
  const [otherServices, setOtherServices] = useState<ServiceRow[]>([]);

  useEffect(() => {
    if (!slug) return;
    const supabase = createClient();

    // Fetch this service
    supabase.from('courses')
      .select('id,name,image,price,description,detail,slug')
      .eq('slug', slug)
      .eq('category', 'kinh-doanh')
      .single()
      .then(({ data }) => setService(data ?? null));

    // Fetch other services
    supabase.from('courses')
      .select('id,name,image,price,description,slug')
      .eq('active', true)
      .eq('category', 'kinh-doanh')
      .neq('slug', slug)
      .order('sort_order')
      .then(({ data }) => setOtherServices(data ?? []));
  }, [slug]);

  // Loading state
  if (service === undefined) {
    return (
      <main style={{ paddingTop: 'var(--nav-h)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="ti ti-loader-2 spin" style={{ fontSize: 32, color: 'var(--accent)' }} />
      </main>
    );
  }

  if (!service) {
    return (
      <main style={{ paddingTop: 'var(--nav-h)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-3)', marginBottom: 16 }}>Không tìm thấy dịch vụ này.</p>
          <Link href="/dich-vu" className="btn btn-outline">← Xem tất cả dịch vụ</Link>
        </div>
      </main>
    );
  }

  const imgSrc = resolveImg(service.image);

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>

      {/* HERO */}
      <section className="lh-hero">
        <div className="container">
          <div className="nl-hero-crumb">
            <Link href="/">Trang Chủ</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }} />
            <Link href="/dich-vu">Dịch Vụ</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }} />
            <span>{service.name}</span>
          </div>
          <h1>{service.name}</h1>
          <p style={{ maxWidth: 560 }}>{service.detail ?? service.description ?? ''}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <Link href={`/dang-ky?course=${encodeURIComponent(service.name)}`} className="btn btn-primary">
              <i className="ti ti-phone" /> Đăng Ký Ngay
            </Link>
            <Link href="/dich-vu" className="btn btn-outline">← Dịch Vụ Khác</Link>
          </div>
        </div>
      </section>

      {/* POSTER + GIÁ */}
      <section className="section" style={{ background: 'var(--bg-alt)', paddingTop: 48, paddingBottom: 48 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, alignItems: 'center', maxWidth: 840, margin: '0 auto' }}>
            {imgSrc && (
              <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--sh-md)' }}>
                <img src={imgSrc} alt={service.name} style={{ width: '100%', display: 'block' }} />
              </div>
            )}
            <div>
              <span className="tag">Chi Tiết Gói</span>
              <h2 className="title" style={{ marginTop: 10 }}>{service.name}</h2>
              <p className="sub" style={{ marginBottom: 24 }}>{service.detail ?? service.description ?? ''}</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 24 }}>{service.price}</div>
              <Link href={`/dang-ky?course=${encodeURIComponent(service.name)}`} className="btn btn-primary" style={{ fontSize: '0.95rem' }}>
                <i className="ti ti-message-circle" /> Tư Vấn & Đăng Ký
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CÁC DỊCH VỤ KHÁC */}
      {otherServices.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-alt)' }}>
          <div className="container">
            <h2 className="title" style={{ textAlign: 'center', marginBottom: 32 }}>Dịch Vụ Khác</h2>
            <div className="poster-grid">
              {otherServices.map(s => (
                <Link key={s.id} href={s.slug ? `/dich-vu/${s.slug}` : '/dich-vu'} className="poster-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="poster-img">
                    {s.image && <img src={resolveImg(s.image)} alt={s.name} loading="lazy" />}
                  </div>
                  <div className="poster-body">
                    <div className="poster-name">{s.name}</div>
                    <p className="poster-desc">{s.description ?? ''}</p>
                    <div className="poster-foot">
                      <div className="card-price">{s.price}</div>
                      <span className="btn-reg">Xem Chi Tiết →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
