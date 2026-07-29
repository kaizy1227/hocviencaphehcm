'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import s from '../../../hinh-anh/library.module.css';
import v from '../../../video/video.module.css';

type VideoRow = {
  id: string;
  title: string | null;
  video_url: string;
  thumbnail_url: string | null;
};

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

export default function DaoTaoSetupDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [serviceName, setServiceName] = useState<string>('');
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<VideoRow | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => { setPlaying(false); }, [selected]);

  useEffect(() => {
    if (!slug) return;
    const supabase = createClient();
    (async () => {
      const [{ data: course }, { data: vids }] = await Promise.all([
        supabase.from('courses').select('name').eq('slug', slug).single(),
        supabase.from('service_videos')
          .select('id,title,video_url,thumbnail_url')
          .eq('active', true)
          .eq('service_slug', slug)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
      ]);
      const name = course?.name ?? slug;
      setServiceName(name);
      document.title = `${name} | Đào Tạo Setup | Học Viện Cà Phê HCM`;
      const list = vids ?? [];
      setVideos(list);
      if (list.length > 0) setSelected(list[0]);
      setLoading(false);
    })();
  }, [slug]);

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

      {/* ── HERO ── */}
      <section className={s.hero}>
        <div className="container">
          <div className={s.heroGrid}>
            <div>
              <span className={s.eyebrow}>Đào tạo · {serviceName || '...'}</span>
              <h1 className={s.heroH1}>{serviceName || '...'}</h1>
              <p className={s.heroLead}>Video thực tế từ các buổi {(serviceName || 'dịch vụ').toLowerCase()} tại Học Viện Cà Phê HCM.</p>
              <div className={s.heroCta}>
                <Link href="/thu-vien/dao-tao-setup" className="btn btn-primary">
                  <i className="ti ti-arrow-left"></i> Xem dịch vụ khác
                </Link>
                <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <i className="ti ti-brand-zalo"></i> Tư vấn
                </a>
              </div>
            </div>
            <figure className={s.heroPhoto}>
              <img src="/images/gallery/Life-styles-with-person/~12930.webp" alt="Đào tạo vận hành tại quán" loading="eager" />
              <figcaption className={s.heroCaption}>
                <strong>Đồng hành theo từng bước</strong>
                <span>Từ menu, nhân sự đến quy trình vận hành.</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── VIDEO SECTION ── */}
      <section className={s.section} style={{ background: 'var(--white, #fff)' }}>
        <div className="container">
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Đang xem</span>
              <h2 className={s.sectionTitle}>Tư liệu {serviceName || '...'}</h2>
            </div>
            {!loading && <span className={s.metaCount}>{videos.length} video</span>}
          </div>

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
          {!loading && videos.length === 0 && (
            <div className={v.emptyNote}>
              <i className="ti ti-video-off" style={{ fontSize:'2rem', display:'block', marginBottom:12 }}></i>
              Video đang được cập nhật. Vui lòng quay lại sau nhé!
            </div>
          )}

          {/* Player + Playlist */}
          {!loading && videos.length > 0 && (
            <div className={v.videoLayout}>
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
                      <img
                        src={selected?.thumbnail_url ?? '/images/gallery/Life-styles-with-person/~12930.webp'}
                        alt={selected?.title ?? 'Video'}
                      />
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
                  <p>{serviceName}</p>
                </div>
              </div>

              <div className={v.playlist}>
                {videos.map(vid => (
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
                      <span>{serviceName}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className={s.cta} style={{ marginTop: 48 }}>
            <h2>Muốn đồng hành mở quán thật?</h2>
            <p className={s.ctaP}>Xem gói dịch vụ hoặc nhắn Zalo để được tư vấn đúng mô hình và khu vực của bạn.</p>
            <div className={s.ctaActions}>
              <Link href="/thu-vien/dao-tao-setup" className="btn btn-primary">
                <i className="ti ti-arrow-left"></i> Xem dịch vụ khác
              </Link>
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
