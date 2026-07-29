'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import s from '../../hinh-anh/library.module.css';
import v from '../../video/video.module.css';

type ServiceTab = { slug: string; name: string; count: number };
type VideoRow  = { id: string; title: string | null; video_url: string; thumbnail_url: string | null; service_slug: string };

const LIB_TABS = [
  { href: '/hinh-anh/lop-hoc',      label: 'Hình Ảnh Lớp Học' },
  { href: '/hinh-anh/trao-bang',     label: 'Trao Bằng Học Viên' },
  { href: '/video',                  label: 'Tư Liệu Video' },
  { href: '/thu-vien/dao-tao-setup', label: 'Đào Tạo - Setup' },
];

function isYouTube(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}
function toEmbedUrl(url: string): string {
  if (url.includes('youtube.com/embed/')) return url;
  const m = url.match(/(?:youtu\.be\/|v=)([A-Za-z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

export default function DaoTaoSetupPage() {
  const [services, setServices]       = useState<ServiceTab[]>([]);
  const [videos, setVideos]           = useState<VideoRow[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeSlug, setActiveSlug]   = useState<string>('');
  const [selected, setSelected]       = useState<VideoRow | null>(null);
  const [playing, setPlaying]         = useState(false);

  useEffect(() => { setPlaying(false); }, [selected]);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      // Fetch all active service videos + course names in parallel
      const [{ data: vids }, { data: courses }] = await Promise.all([
        supabase.from('service_videos')
          .select('id,title,video_url,thumbnail_url,service_slug')
          .eq('active', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase.from('courses').select('slug,name,sort_order'),
      ]);

      const allVids = vids ?? [];
      setVideos(allVids);

      // Build service tab list in course sort_order
      const slugCount: Record<string, number> = {};
      allVids.forEach(v => { slugCount[v.service_slug] = (slugCount[v.service_slug] ?? 0) + 1; });

      const tabs: ServiceTab[] = Object.keys(slugCount).map(slug => {
        const course = courses?.find(c => c.slug === slug);
        return { slug, name: course?.name ?? slug, count: slugCount[slug], sort: course?.sort_order ?? 999 } as any;
      }).sort((a: any, b: any) => a.sort - b.sort);

      setServices(tabs);
      if (tabs.length > 0) {
        setActiveSlug(tabs[0].slug);
        const first = allVids.find(v => v.service_slug === tabs[0].slug);
        if (first) setSelected(first);
      }
      setLoading(false);
    })();
  }, []);

  const handleTabChange = (slug: string) => {
    setActiveSlug(slug);
    const first = videos.find(v => v.service_slug === slug);
    setSelected(first ?? null);
  };

  const filtered = videos.filter(v => v.service_slug === activeSlug);
  const activeService = services.find(s => s.slug === activeSlug);

  return (
    <main className={s.page}>
      {/* ── LIBRARY TABS ── */}
      <div className={s.libTabs} style={{ marginTop: 'var(--nav-h, 64px)' }}>
        <div className={`container ${s.libTabsInner}`}>
          {LIB_TABS.map(tab => (
            <Link key={tab.href} href={tab.href}
              className={`${s.libTab}${tab.href === '/thu-vien/dao-tao-setup' ? ` ${s.libTabActive}` : ''}`}>
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── VIDEO SECTION ── */}
      <section className={s.section} style={{ background: 'var(--white, #fff)' }}>
        <div className="container">
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Đang xem</span>
              <h2 className={s.sectionTitle}>Tư liệu Đào Tạo.</h2>
            </div>
            <p className={s.sectionLead}>Chọn dịch vụ để lọc, sau đó chọn video muốn xem.</p>
          </div>

          {/* Service pills */}
          {!loading && services.length > 0 && (
            <div className={v.videoCats}>
              {services.map(svc => (
                <button
                  key={svc.slug}
                  className={`${v.videoCat}${activeSlug === svc.slug ? ` ${v.videoCatActive}` : ''}`}
                  onClick={() => handleTabChange(svc.slug)}
                >
                  {svc.name}
                  <span className={v.videoCatCount}>{String(svc.count).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
          )}

          {/* Skeleton */}
          {loading && (
            <div className={v.skeletonLayout}>
              <div className={v.skPlayer} />
              <div className={v.skPlaylist}>
                {[1,2,3].map(i => <div key={i} className={v.skItem} />)}
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className={v.emptyNote}>
              <i className="ti ti-video-off" style={{ fontSize:'2rem', display:'block', marginBottom:12 }}></i>
              Video đang được cập nhật. Vui lòng quay lại sau nhé!
            </div>
          )}

          {/* Player + Playlist */}
          {!loading && filtered.length > 0 && (
            <div className={v.videoLayout}>
              {/* Main player */}
              <div className={v.player}>
                <div className={v.playerStage}>
                  {selected && playing ? (
                    isYouTube(selected.video_url) ? (
                      <iframe
                        src={`${toEmbedUrl(selected.video_url)}?autoplay=1&rel=0`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video src={selected.video_url} controls autoPlay playsInline
                        poster={selected.thumbnail_url ?? undefined} />
                    )
                  ) : (
                    <>
                      {selected?.thumbnail_url
                        ? <img src={selected.thumbnail_url} alt={selected.title ?? 'Video'} />
                        : <img src="/images/gallery/Life-styles-with-person/~12930.webp" alt="Đào tạo tại quán" />
                      }
                      <button className={v.playBtn} onClick={() => setPlaying(true)}
                        aria-label={`Phát ${selected?.title ?? 'video'}`}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                    </>
                  )}
                </div>
                <div className={v.playerCopy}>
                  <h2>{selected?.title ?? 'Chọn video từ danh sách'}</h2>
                  <p>{activeService?.name ?? ''}</p>
                </div>
              </div>

              {/* Playlist */}
              <div className={v.playlist}>
                {filtered.map(vid => (
                  <button key={vid.id}
                    className={`${v.playlistItem}${selected?.id === vid.id ? ` ${v.playlistItemActive}` : ''}`}
                    onClick={() => setSelected(vid)}>
                    <div className={v.playlistThumb}>
                      {vid.thumbnail_url
                        ? <img src={vid.thumbnail_url} alt={vid.title ?? 'Video'} loading="lazy" />
                        : <video src={`${vid.video_url}#t=0.1`} preload="metadata" muted playsInline />
                      }
                    </div>
                    <div className={v.playlistInfo}>
                      <strong>{vid.title ?? 'Video'}</strong>
                      <span>{activeService?.name ?? ''}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className={s.cta}>
            <h2>Đang chuẩn bị mở quán?</h2>
            <p className={s.ctaP}>Gửi mô hình, khu vực và mục tiêu của bạn để được tư vấn đúng gói đồng hành.</p>
            <div className={s.ctaActions}>
              <Link href="/dich-vu" className="btn btn-primary"><i className="ti ti-briefcase"></i> Xem gói dịch vụ</Link>
              <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ color:'#fff', borderColor:'rgba(255,255,255,.3)' }}>
                <i className="ti ti-brand-zalo"></i> Nhắn Zalo
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
