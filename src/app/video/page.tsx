'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import s from './video.module.css';

const VIDEO_CATEGORIES = [
  { slug: 'series-100-ngay',    label: 'Series 100 Ngày Pha Chế' },
  { slug: 'giang-vien',         label: 'Giảng Viên Làm Món' },
  { slug: 'hoc-vien-workshop',  label: 'Học Viên & Workshop' },
  { slug: 'phong-van',          label: 'Phỏng Vấn Khách Hàng' },
] as const;

type CategorySlug = typeof VIDEO_CATEGORIES[number]['slug'];

type VideoRow = {
  id: string;
  title: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  created_at: string;
};

const LIB_TABS = [
  { href: '/hinh-anh/lop-hoc',       label: 'Hình Ảnh Lớp Học' },
  { href: '/hinh-anh/trao-bang',      label: 'Trao Bằng Học Viên' },
  { href: '/video',                   label: 'Tư Liệu Video' },
  { href: '/thu-vien/dao-tao-setup',  label: 'Đào Tạo - Setup' },
];

function isYouTube(url: string) {
  return url.includes('youtube.com/embed/') || url.includes('youtu.be/');
}

function toEmbedUrl(url: string): string {
  if (url.includes('youtube.com/embed/')) return url;
  const m = url.match(/(?:youtu\.be\/|v=)([A-Za-z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

export default function VideoPage() {
  const [videos, setVideos]         = useState<VideoRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategorySlug>('series-100-ngay');
  const [selected, setSelected]     = useState<VideoRow | null>(null);

  useEffect(() => {
    createClient()
      .from('videos')
      .select('id,title,video_url,thumbnail_url,category,created_at')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const list = data ?? [];
        setVideos(list);
        if (list.length > 0) setSelected(list[0]);
        setLoading(false);
      });
  }, []);

  const filtered = videos.filter(v => v.category === activeCategory);

  const activeCats = VIDEO_CATEGORIES.filter(c => videos.some(v => v.category === c.slug));

  const handleCatChange = (slug: CategorySlug) => {
    setActiveCategory(slug);
    const first = videos.find(v => v.category === slug);
    if (first) setSelected(first);
  };

  const handleSelect = (v: VideoRow) => setSelected(v);

  const [playing, setPlaying] = useState(false);
  useEffect(() => { setPlaying(false); }, [selected]);

  return (
    <main className={s.page}>
      {/* ── LIBRARY TABS ── */}
      <div className={s.libTabs} style={{ marginTop: 'var(--nav-h, 64px)' }}>
        <div className={`container ${s.libTabsInner}`}>
          {LIB_TABS.map(tab => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`${s.libTab}${tab.href === '/video' ? ` ${s.libTabActive}` : ''}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── VIDEO PLAYER SECTION ── */}
      <section className={s.section} style={{ background: 'var(--white, #fff)' }}>
        <div className="container">
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Đang xem</span>
              <h2 className={s.sectionTitle}>Tư liệu Học Viện.</h2>
            </div>
            <p className={s.sectionLead}>Chọn danh mục để lọc, sau đó chọn video muốn xem.</p>
          </div>

          {/* Category pills */}
          {!loading && activeCats.length > 0 && (
            <div className={s.videoCats}>
              {activeCats.map(cat => {
                const count = videos.filter(v => v.category === cat.slug).length;
                return (
                  <button
                    key={cat.slug}
                    className={`${s.videoCat}${activeCategory === cat.slug ? ` ${s.videoCatActive}` : ''}`}
                    onClick={() => handleCatChange(cat.slug)}
                  >
                    {cat.label}
                    <span className={s.videoCatCount}>{String(count).padStart(2, '0')}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className={s.skeletonLayout}>
              <div className={s.skPlayer} />
              <div className={s.skPlaylist}>
                {[1,2,3].map(i => <div key={i} className={s.skItem} />)}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className={s.emptyNote}>
              <i className="ti ti-video-off" style={{ fontSize: '2rem', display: 'block', marginBottom: 12 }}></i>
              Video đang được cập nhật. Vui lòng quay lại sau nhé!
            </div>
          )}

          {/* Player + Playlist */}
          {!loading && filtered.length > 0 && (
            <div className={s.videoLayout}>
              {/* Main player */}
              <div className={s.player}>
                <div className={s.playerStage}>
                  {selected && playing ? (
                    isYouTube(selected.video_url) ? (
                      <iframe
                        src={`${toEmbedUrl(selected.video_url)}?autoplay=1&rel=0`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={selected.video_url}
                        controls autoPlay playsInline
                        poster={selected.thumbnail_url ?? undefined}
                      />
                    )
                  ) : (
                    <>
                      {selected?.thumbnail_url ? (
                        <img src={selected.thumbnail_url} alt={selected.title ?? 'Video'} />
                      ) : (
                        <img src="/images/gallery/Life-styles-with-person/~12573.webp" alt="Video Học Viện" />
                      )}
                      <button
                        className={s.playBtn}
                        onClick={() => setPlaying(true)}
                        aria-label={`Phát ${selected?.title ?? 'video'}`}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                    </>
                  )}
                </div>
                <div className={s.playerCopy}>
                  <h2>{selected?.title ?? 'Chọn video từ danh sách'}</h2>
                  <p>
                    {selected
                      ? (VIDEO_CATEGORIES.find(c => c.slug === selected.category)?.label ?? selected.category)
                      : 'Nhấn vào một video trong danh sách bên phải để bắt đầu xem.'}
                  </p>
                </div>
              </div>

              {/* Playlist */}
              <div className={s.playlist}>
                {filtered.map(v => (
                  <button
                    key={v.id}
                    className={`${s.playlistItem}${selected?.id === v.id ? ` ${s.playlistItemActive}` : ''}`}
                    onClick={() => handleSelect(v)}
                  >
                    <div className={s.playlistThumb}>
                      {v.thumbnail_url ? (
                        <img src={v.thumbnail_url} alt={v.title ?? 'Video'} loading="lazy" />
                      ) : (
                        <video src={`${v.video_url}#t=0.1`} preload="metadata" muted playsInline />
                      )}
                    </div>
                    <div className={s.playlistInfo}>
                      <strong>{v.title ?? 'Video'}</strong>
                      <span>{VIDEO_CATEGORIES.find(c => c.slug === v.category)?.label ?? v.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className={s.cta}>
            <h2>Muốn trải nghiệm một buổi học thật?</h2>
            <p>Xem chương trình đang mở hoặc nhắn Zalo để được tư vấn lịch học và nội dung phù hợp.</p>
            <div className={s.ctaActions}>
              <Link href="/khoa-hoc" className="btn btn-primary"><i className="ti ti-book-2"></i> Xem khóa học</Link>
              <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}>
                <i className="ti ti-brand-zalo"></i> Nhắn Zalo
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
