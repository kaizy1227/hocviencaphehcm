'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import s from '../library.module.css';

type TraoBang = { id: string; name: string; date: string; course: string; photo_url: string; };

const LIB_TABS = [
  { href: '/hinh-anh/lop-hoc',      label: 'Hình Ảnh Lớp Học' },
  { href: '/hinh-anh/trao-bang',     label: 'Trao Bằng Học Viên' },
  { href: '/video',                  label: 'Tư Liệu Video' },
  { href: '/thu-vien/dao-tao-setup', label: 'Đào Tạo - Setup' },
];

export default function TraoBangPage() {
  const [students, setStudents] = useState<TraoBang[]>([]);
  const [loading, setLoading]   = useState(true);
  const [lightbox, setLightbox] = useState<{ src: string; name: string } | null>(null);

  useEffect(() => {
    void createClient()
      .from('trao_bang')
      .select('id,name,date,course,photo_url')
      .neq('photo_url', '')
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

  const parseDate = (d: string) => {
    try { const [day, mo, yr] = d.split('/'); return new Date(`${yr}-${mo}-${day}`).getTime(); }
    catch { return 0; }
  };
  const sorted = [...students].sort((a, b) => parseDate(b.date) - parseDate(a.date));

  return (
    <main className={s.page}>
      {/* ── LIBRARY TABS ── */}
      <div className={s.libTabs} style={{ marginTop: 'var(--nav-h, 64px)' }}>
        <div className={`container ${s.libTabsInner}`}>
          {LIB_TABS.map(tab => (
            <Link key={tab.href} href={tab.href}
              className={`${s.libTab}${tab.href === '/hinh-anh/trao-bang' ? ` ${s.libTabActive}` : ''}`}>
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── STUDENT GRID ── */}
      <section className={s.section} style={{ background: 'var(--white, #fff)' }}>
        <div className="container">
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Học viên nhận chứng nhận</span>
              <h2 className={s.sectionTitle}>Niềm vui sau những ngày đứng quầy.</h2>
            </div>
            {!loading && <span className={s.metaCount}>Hơn 5.000 học viên</span>}
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
              <i className="ti ti-certificate" style={{ fontSize:'2.5rem', display:'block', marginBottom:12 }}></i>
              Chưa có dữ liệu học viên.
            </div>
          )}

          {!loading && sorted.length > 0 && (
            <div className={s.studentGrid}>
              {sorted.map(st => (
                <article key={st.id} className={s.studentCard}>
                  <button
                    className={s.studentPhoto}
                    onClick={() => st.photo_url && setLightbox({ src: st.photo_url, name: st.name })}
                    style={{ cursor: st.photo_url ? 'zoom-in' : 'default' }}
                    aria-label={`Phóng to ảnh ${st.name}`}
                  >
                    {st.photo_url ? (
                      <Image
                        src={st.photo_url} alt={st.name} fill
                        sizes="(max-width:540px) 100vw,(max-width:960px) 50vw,33vw"
                        style={{ objectFit:'cover', objectPosition:'top' }}
                        loading="lazy"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{ aspectRatio:'4/3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', color:'var(--muted,#667a8c)' }}>
                        <i className="ti ti-certificate"></i>
                      </div>
                    )}
                  </button>
                  <div className={s.studentInfo}>
                    <h3>{st.name.trim()}</h3>
                    {st.date && <p>{st.date}{st.course ? ` · ${st.course}` : ''}</p>}
                    <span className={s.studentStatus}><i className="ti ti-certificate"></i> Chứng Nhận Hoàn Thành</span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className={s.cta}>
            <h2>Sẵn sàng bắt đầu hành trình của bạn?</h2>
            <p className={s.ctaP}>Chọn chương trình phù hợp với mục tiêu học nghề hoặc mở quán, chúng tôi sẽ tư vấn rõ ràng trước khi bạn đăng ký.</p>
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
      {lightbox && (
        <div className={s.lightbox} onClick={() => setLightbox(null)}>
          <button className={s.lbClose} onClick={() => setLightbox(null)} aria-label="Đóng">
            <i className="ti ti-x"></i>
          </button>
          <img
            src={lightbox.src} alt={lightbox.name}
            className={s.lbImg} onClick={e => e.stopPropagation()}
          />
          <p className={s.lbCaption}>{lightbox.name} · Chứng Nhận Hoàn Thành</p>
        </div>
      )}
    </main>
  );
}
