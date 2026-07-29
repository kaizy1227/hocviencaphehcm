'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import s from '../library.module.css';

type LopHoc = { id: string; date: string; course: string; si_so: string; student_names: string; giang_vien: string; photos: string[]; };
interface LightboxState { photos: string[]; index: number; label: string; }

const PER_PAGE = 24;

const LIB_TABS = [
  { href: '/hinh-anh/lop-hoc',      label: 'Hình Ảnh Lớp Học' },
  { href: '/hinh-anh/trao-bang',     label: 'Trao Bằng Học Viên' },
  { href: '/video',                  label: 'Tư Liệu Video' },
  { href: '/thu-vien/dao-tao-setup', label: 'Đào Tạo - Setup' },
];

export default function LopHocPage() {
  const [sessions, setSessions]   = useState<LopHoc[]>([]);
  const [loading, setLoading]     = useState(true);
  const [lb, setLb]               = useState<LightboxState | null>(null);
  const [page, setPage]           = useState(1);
  const [gvFilter, setGvFilter]   = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gv = params.get('gv') ?? '';
    setGvFilter(gv);
    void createClient()
      .from('lop_hoc')
      .select('id,date,course,si_so,student_names,giang_vien,photos')
      .order('created_at', { ascending: false })
      .then(({ data }) => setSessions((data ?? []).filter(r => r.photos?.length > 0)))
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

  const parseDate = (d: string) => {
    try { const [day, mo, yr] = d.split('/'); return new Date(`${yr}-${mo}-${day}`).getTime(); }
    catch { return 0; }
  };
  const filtered   = gvFilter
    ? sessions.filter(r => r.giang_vien?.toLowerCase().includes(gvFilter.toLowerCase()))
    : sessions;
  const sorted     = [...filtered].sort((a, b) => parseDate(b.date) - parseDate(a.date));
  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated  = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openLb = (session: LopHoc, index: number) => {
    const label = [session.date, session.course].filter(Boolean).join(' · ');
    setLb({ photos: session.photos, index, label });
  };

  return (
    <main className={s.page}>
      {/* ── LIBRARY TABS ── */}
      <div className={s.libTabs} style={{ marginTop: 'var(--nav-h, 64px)' }}>
        <div className={`container ${s.libTabsInner}`}>
          {LIB_TABS.map(tab => (
            <Link key={tab.href} href={tab.href}
              className={`${s.libTab}${tab.href === '/hinh-anh/lop-hoc' ? ` ${s.libTabActive}` : ''}`}>
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── SESSION GRID ── */}
      <section className={s.section} style={{ background: 'var(--white, #fff)' }}>
        <div className="container">
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Khoảnh khắc thực hành</span>
              <h2 className={s.sectionTitle}>Học bằng tay, nhớ bằng trải nghiệm.</h2>
            </div>
            {!loading && <span className={s.metaCount}>Hơn 10 năm đào tạo</span>}
          </div>

          {/* Instructor filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            {[
              { label: 'Tất cả', value: '' },
              { label: '☕ GV. Liêm', value: 'Liêm' },
              { label: '🍵 GV. Thiên Ân', value: 'Ân' },
            ].map(f => (
              <button key={f.value}
                onClick={() => { setGvFilter(f.value); setPage(1); window.history.pushState({}, '', f.value ? `/hinh-anh/lop-hoc?gv=${encodeURIComponent(f.value)}` : '/hinh-anh/lop-hoc'); }}
                style={{
                  padding: '7px 16px',
                  borderRadius: 999,
                  border: '1.5px solid',
                  borderColor: gvFilter === f.value ? '#8f5d18' : '#dce6ed',
                  background: gvFilter === f.value ? '#fbf3e6' : 'transparent',
                  color: gvFilter === f.value ? '#8f5d18' : 'var(--text-2)',
                  fontWeight: gvFilter === f.value ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >{f.label}</button>
            ))}
          </div>

          {/* Skeleton */}
          {loading && (
            <div className={s.skGrid}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className={s.skCard}>
                  <div className={s.skPhoto} />
                  <div className={s.skInfo}>
                    <div className={s.skLine} />
                    <div className={`${s.skLine} ${s.skShort}`} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && sorted.length === 0 && (
            <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted,#667a8c)' }}>
              <i className="ti ti-photo-off" style={{ fontSize:'2.5rem', display:'block', marginBottom:12 }}></i>
              Chưa có dữ liệu buổi học.
            </div>
          )}

          {!loading && sorted.length > 0 && (
            <>
              <div className={s.studentGrid}>
                {paginated.map(session => (
                  <article key={session.id} className={s.studentCard}>
                    {/* Cover photo */}
                    <div
                      className={s.sessionCover}
                      onClick={() => openLb(session, 0)}
                      role="button" tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && openLb(session, 0)}
                      aria-label={`Xem ảnh lớp ${session.date}`}
                    >
                      <Image
                        src={session.photos[0]}
                        alt={`${session.course} ${session.date}`}
                        fill
                        sizes="(max-width:540px) 100vw,(max-width:960px) 50vw,33vw"
                        style={{ objectFit:'cover' }}
                        loading="lazy"
                      />
                      {session.photos.length > 1 && (
                        <span className={s.sessionPhotoCount}>
                          <i className="ti ti-photo"></i> {session.photos.length}
                        </span>
                      )}
                      <span className={s.zoomHint}><i className="ti ti-zoom-in"></i></span>
                    </div>
                    {/* Info */}
                    <div className={s.studentInfo}>
                      {session.date && <span className={s.sessionDate}>{session.date}</span>}
                      <h3>{session.course || 'Buổi học'}</h3>
                      {session.giang_vien && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 6, background: '#fbf3e6', borderRadius: 6, padding: '3px 9px' }}>
                          <i className="ti ti-user-star" style={{ color: '#8f5d18', fontSize: '0.85rem' }}></i>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8f5d18' }}>{session.giang_vien}</span>
                        </div>
                      )}
                      {session.si_so && (
                        <span className={s.studentStatus}><i className="ti ti-users"></i> Sỉ số: {session.si_so}</span>
                      )}
                      {session.student_names && (
                        <p className={s.sessionStudents} style={{ fontSize: '0.78rem', opacity: 0.7, marginTop: 3 }}>{session.student_names}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className={s.pagination}>
                  <button className={s.pageBtn} disabled={page === 1}
                    onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 260, behavior:'smooth' }); }}>
                    <i className="ti ti-chevron-left"></i>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n}
                      className={`${s.pageBtn}${page === n ? ` ${s.pageBtnActive}` : ''}`}
                      onClick={() => { setPage(n); window.scrollTo({ top: 260, behavior:'smooth' }); }}>
                      {n}
                    </button>
                  ))}
                  <button className={s.pageBtn} disabled={page === totalPages}
                    onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 260, behavior:'smooth' }); }}>
                    <i className="ti ti-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Trust strip */}
          <div className={s.trust}>
            <div className={s.trustItem}>
              <strong>Học trực tiếp tại quầy</strong>
              <span>Không chỉ xem, bạn tự tay thực hiện từng công đoạn.</span>
            </div>
            <div className={s.trustItem}>
              <strong>Giảng viên theo sát</strong>
              <span>Điều chỉnh thao tác và giải đáp ngay trong buổi học.</span>
            </div>
            <div className={s.trustItem}>
              <strong>Đi tiếp sau lớp học</strong>
              <span>Khám phá công thức, nguyên liệu và dụng cụ cùng hệ thống.</span>
            </div>
          </div>

          {/* CTA */}
          <div className={s.cta}>
            <h2>Muốn đứng quầy tự tin hơn?</h2>
            <p className={s.ctaP}>Xem các khóa học pha chế hoặc trao đổi trực tiếp với Học Viện về mục tiêu của bạn.</p>
            <div className={s.ctaActions}>
              <Link href="/khoa-hoc" className="btn btn-primary"><i className="ti ti-book-2"></i> Xem khóa học</Link>
              <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ color:'#fff', borderColor:'rgba(255,255,255,.3)' }}>
                <i className="ti ti-brand-zalo"></i> Nhắn Zalo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lb && (
        <div className={s.lightbox} onClick={() => setLb(null)}>
          <button className={s.lbClose} onClick={() => setLb(null)} aria-label="Đóng">
            <i className="ti ti-x"></i>
          </button>

          {lb.photos.length > 1 && (
            <button className={`${s.lbArrow} ${s.lbPrev}`}
              onClick={e => { e.stopPropagation(); setLb(prev => prev && { ...prev, index: (prev.index - 1 + prev.photos.length) % prev.photos.length }); }}
              aria-label="Ảnh trước">
              <i className="ti ti-chevron-left"></i>
            </button>
          )}

          <img
            src={lb.photos[lb.index]} alt={lb.label}
            className={s.lbImg} onClick={e => e.stopPropagation()}
          />

          {lb.photos.length > 1 && (
            <button className={`${s.lbArrow} ${s.lbNext}`}
              onClick={e => { e.stopPropagation(); setLb(prev => prev && { ...prev, index: (prev.index + 1) % prev.photos.length }); }}
              aria-label="Ảnh sau">
              <i className="ti ti-chevron-right"></i>
            </button>
          )}

          <p className={s.lbCaption}>
            {lb.label}
            {lb.photos.length > 1 && <span style={{ opacity:.6, marginLeft:8 }}>{lb.index + 1}/{lb.photos.length}</span>}
          </p>

          {lb.photos.length > 1 && (
            <div className={s.lbThumbs} onClick={e => e.stopPropagation()}>
              {lb.photos.map((url, i) => (
                <Image key={i} src={url} alt="" width={56} height={42}
                  className={`${s.lbThumb}${i === lb.index ? ` ${s.lbThumbActive}` : ''}`}
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
