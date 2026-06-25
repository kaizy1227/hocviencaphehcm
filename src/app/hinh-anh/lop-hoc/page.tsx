'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type LopHoc = { id: string; date: string; course: string; class_name: string; student_names: string; photos: string[]; };

interface LightboxState {
  photos: string[];
  index: number;
  label: string;
}

export default function LopHocPage() {
  const [sessions, setSessions] = useState<LopHoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [lb, setLb] = useState<LightboxState | null>(null);

  useEffect(() => {
    void createClient()
      .from('lop_hoc')
      .select('id,date,course,class_name,student_names,photos')
      .order('created_at', { ascending: false })
      .then(({ data }) => setSessions((data ?? []).filter(s => s.photos?.length > 0)))
      .then(() => setLoading(false), () => setLoading(false));
  }, []);

  useEffect(() => {
    if (!lb) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLb(null);
      if (e.key === 'ArrowRight') setLb(prev => prev && { ...prev, index: (prev.index + 1) % prev.photos.length });
      if (e.key === 'ArrowLeft')  setLb(prev => prev && { ...prev, index: (prev.index - 1 + prev.photos.length) % prev.photos.length });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lb]);

  const parseDate = (d: string) => { try { const [day, mo, yr] = d.split('/'); return new Date(`${yr}-${mo}-${day}`).getTime(); } catch { return 0; } };
  const sorted = [...sessions].sort((a, b) => parseDate(b.date) - parseDate(a.date));

  function openLb(session: LopHoc, index: number) {
    const label = [session.date, session.course].filter(Boolean).join(' · ');
    setLb({ photos: session.photos, index, label });
  }

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* HERO */}
      <section className="tb-hero">
        <div className="container">
          <span className="tag">Lớp Học</span>
          <h1>Hình Ảnh<br /><em>Lớp Học</em></h1>
          <p className="sub" style={{ maxWidth: 520, margin: '0 auto' }}>
            Những khoảnh khắc thực hành tại lớp — không gian học tập thân thiện, chuyên nghiệp cùng đội ngũ giảng viên giàu kinh nghiệm.
          </p>
        </div>
      </section>

      {/* CARD GRID */}
      <section className="section tb-grid-section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '60px 0' }}>Đang tải…</p>
          ) : sorted.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '60px 0' }}>Chưa có dữ liệu.</p>
          ) : (
            <div className="lh-card-grid">
              {sorted.map(session => (
                <div
                  key={session.id}
                  className="lh-card"
                  onClick={() => session.photos.length > 0 && openLb(session, 0)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && openLb(session, 0)}
                >
                  {/* Preview image */}
                  <div className="lh-card-cover">
                    <img
                      src={session.photos[0]}
                      alt={`${session.course} ${session.date}`}
                      loading="lazy"
                    />
                    {session.photos.length > 1 && (
                      <div className="lh-card-count">
                        <i className="ti ti-photo"></i> {session.photos.length}
                      </div>
                    )}
                    <div className="lh-card-dots">
                      {session.photos.slice(0, 5).map((_, i) => (
                        <span key={i} className={`lh-dot${i === 0 ? ' active' : ''}`} />
                      ))}
                      {session.photos.length > 5 && <span className="lh-dot" />}
                    </div>
                    <div className="tb-zoom-hint"><i className="ti ti-zoom-in"></i></div>
                  </div>

                  {/* Card info */}
                  <div className="lh-card-body">
                    <p className="lh-card-date-label">
                      {session.date}
                      {session.student_names && (
                        <span className="lh-student-names"> · {session.student_names}</span>
                      )}
                    </p>
                    {session.course && (
                      <span className="lh-course-tag">{session.course}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX */}
      {lb && (
        <div className="tb-lightbox" onClick={() => setLb(null)}>
          <button className="tb-lb-close" onClick={() => setLb(null)} aria-label="Đóng">
            <i className="ti ti-x"></i>
          </button>

          {lb.photos.length > 1 && (
            <button
              className="tb-lb-arrow tb-lb-prev"
              onClick={e => { e.stopPropagation(); setLb(prev => prev && { ...prev, index: (prev.index - 1 + prev.photos.length) % prev.photos.length }); }}
              aria-label="Ảnh trước"
            >
              <i className="ti ti-chevron-left"></i>
            </button>
          )}

          <img
            src={lb.photos[lb.index]}
            alt={lb.label}
            className="tb-lb-img"
            onClick={e => e.stopPropagation()}
          />

          {lb.photos.length > 1 && (
            <button
              className="tb-lb-arrow tb-lb-next"
              onClick={e => { e.stopPropagation(); setLb(prev => prev && { ...prev, index: (prev.index + 1) % prev.photos.length }); }}
              aria-label="Ảnh sau"
            >
              <i className="ti ti-chevron-right"></i>
            </button>
          )}

          <p className="tb-lb-name">
            {lb.label}
            {lb.photos.length > 1 && (
              <span style={{ opacity: 0.6, marginLeft: 8 }}>{lb.index + 1}/{lb.photos.length}</span>
            )}
          </p>

          {/* Thumbnail strip */}
          {lb.photos.length > 1 && (
            <div className="tb-lb-thumbs" onClick={e => e.stopPropagation()}>
              {lb.photos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className={`tb-lb-thumb${i === lb.index ? ' active' : ''}`}
                  onClick={e => { e.stopPropagation(); setLb(prev => prev && { ...prev, index: i }); }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
