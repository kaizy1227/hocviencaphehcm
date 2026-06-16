'use client';
import { useEffect, useState } from 'react';
import type { LarkStudent } from '@/lib/lark';

export default function TraoBangPage() {
  const [students, setStudents] = useState<LarkStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ src: string; name: string } | null>(null);

  useEffect(() => {
    fetch('/api/lark-students')
      .then(r => r.json())
      .then(d => setStudents(d.students ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const parseDate = (d: string) => { const [day, mo, yr] = d.split('/'); return new Date(`${yr}-${mo}-${day}`).getTime(); };
  const sorted = [...students].sort((a, b) => parseDate(b.date) - parseDate(a.date));

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* HERO */}
      <section className="tb-hero">
        <div className="container">
          <span className="tag">Học Viên</span>
          <h1>Học Viên Nhận<br /><em>Chứng Nhận</em></h1>
          <p className="sub" style={{ maxWidth: 520, margin: '0 auto' }}>
            Mỗi học viên hoàn thành khóa học đều nhận chứng nhận từ Học Viện Cà Phê — bước đầu trên hành trình kinh doanh của riêng bạn.
          </p>
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
                    onClick={() => s.photoUrl && setLightbox({ src: s.photoUrl, name: s.name })}
                    style={{ cursor: s.photoUrl ? 'zoom-in' : 'default' }}
                  >
                    {s.photoUrl ? (
                      <img
                        src={s.photoUrl}
                        alt={s.name}
                        loading="lazy"
                        onError={e => {
                          const el = e.currentTarget as HTMLImageElement;
                          el.style.display = 'none';
                          const ph = el.nextElementSibling as HTMLElement | null;
                          if (ph) ph.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="tb-placeholder" style={{ display: s.photoUrl ? 'none' : 'flex' }}>
                      <i className="ti ti-certificate"></i>
                    </div>
                    {s.photoUrl && (
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
