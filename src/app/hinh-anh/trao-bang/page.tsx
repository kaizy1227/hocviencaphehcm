'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type TraoBang = { id: string; name: string; date: string; course: string; photo_url: string; };

export default function TraoBangPage() {
  const [students, setStudents] = useState<TraoBang[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ src: string; name: string } | null>(null);

  useEffect(() => {
    void createClient()
      .from('trao_bang')
      .select('id,name,date,course,photo_url')
      .order('created_at', { ascending: false })
      .then(({ data }) => setStudents(data ?? []))
      .then(() => setLoading(false), () => setLoading(false));
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const parseDate = (d: string) => { try { const [day, mo, yr] = d.split('/'); return new Date(`${yr}-${mo}-${day}`).getTime(); } catch { return 0; } };
  const sorted = [...students].sort((a, b) => parseDate(b.date) - parseDate(a.date));

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* HERO */}
      <section className="ct-hero">
        <div className="ct-hero-bg">
          <img src="/images/gallery/Concept-studio-with-products/22. Bạc xỉu bg.webp" alt="Trao Bằng Học Viên" loading="eager" />
        </div>
        <div className="ct-hero-ov"></div>
        <div className="container">
          <div className="ct-hero-body">
            <div className="ct-hero-crumb">
              <Link href="/">Trang Chủ</Link>
              <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
              <span>Thư Viện</span>
              <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
              <span>Trao Bằng Học Viên</span>
            </div>
            <h1>Học Viên Nhận <em>Chứng Nhận</em></h1>
            <p className="ct-hero-sub">
              Mỗi học viên hoàn thành khóa học đều nhận chứng nhận từ Học Viện Cà Phê — bước đầu trên hành trình kinh doanh của riêng bạn.
            </p>
            <div className="ct-hero-badges">
              <span className="ct-badge"><i className="ti ti-certificate"></i> {loading ? '...' : sorted.length} Học Viên</span>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="section tb-grid-section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '60px 0' }}>Đang tải…</p>
          ) : sorted.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '60px 0' }}>Chưa có dữ liệu.</p>
          ) : (
            <div className="tb-grid">
              {sorted.map(s => (
                <div key={s.id} className="tb-card">
                  <div
                    className="tb-card-img"
                    onClick={() => s.photo_url && setLightbox({ src: s.photo_url, name: s.name })}
                    style={{ cursor: s.photo_url ? 'zoom-in' : 'default' }}
                  >
                    {s.photo_url ? (
                      <Image
                        src={s.photo_url}
                        alt={s.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                        loading="lazy"
                        onError={e => {
                          const el = e.currentTarget as HTMLImageElement;
                          el.style.display = 'none';
                          const ph = el.nextElementSibling as HTMLElement | null;
                          if (ph) ph.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="tb-placeholder" style={{ display: s.photo_url ? 'none' : 'flex' }}>
                      <i className="ti ti-certificate"></i>
                    </div>
                    {s.photo_url && (
                      <div className="tb-zoom-hint"><i className="ti ti-zoom-in"></i></div>
                    )}
                  </div>
                  <div className="tb-card-info">
                    <span className="tb-card-name">{s.name.trim()}</span>
                    {s.date && <span className="tb-card-date">{s.date}</span>}
                    {s.course && <span className="tb-course">{s.course}</span>}
                    <span className="tb-badge"><i className="ti ti-certificate"></i> Chứng Nhận Hoàn Thành</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="tb-lightbox" onClick={() => setLightbox(null)}>
          <button className="tb-lb-close" onClick={() => setLightbox(null)} aria-label="Đóng">
            <i className="ti ti-x"></i>
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.name}
            className="tb-lb-img"
            onClick={e => e.stopPropagation()}
          />
          <p className="tb-lb-name">{lightbox.name}</p>
        </div>
      )}
    </main>
  );
}
