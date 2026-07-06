'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const VIDEO_CATEGORIES = [
  { slug: 'series-100-ngay', label: 'Series 100 Ngày Pha Chế' },
  { slug: 'giang-vien', label: 'Giảng Viên Làm Món' },
  { slug: 'hoc-vien-workshop', label: 'Học Viên & Workshop' },
  { slug: 'phong-van', label: 'Phỏng Vấn Khách Hàng' },
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

function isYouTubeEmbed(url: string) {
  return url.includes('youtube.com/embed/');
}

function YouTubeCard({ video }: { video: VideoRow }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="vd2-card">
      <div className="vd2-media">
        {playing ? (
          <iframe
            className="vd2-player"
            src={`${video.video_url}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button className="vd2-thumb-btn" onClick={() => setPlaying(true)} aria-label="Phát video">
            {video.thumbnail_url ? (
              <img src={video.thumbnail_url} alt={video.title ?? 'Video'} className="vd2-thumb-img" loading="lazy" />
            ) : (
              <div className="vd2-thumb-img" style={{ background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-brand-youtube" style={{ fontSize: 48, color: '#ff0000' }}></i>
              </div>
            )}
            <div className="vd2-play-overlay">
              <div className="vd2-play-circle">
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>
      {video.title && (
        <div className="vd2-info">
          <p className="vd2-title">{video.title}</p>
        </div>
      )}
    </div>
  );
}

function LegacyVideoCard({ video }: { video: VideoRow }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="vd2-card">
      <div className="vd2-media">
        {playing ? (
          <video
            src={video.video_url}
            controls
            autoPlay
            playsInline
            className="vd2-player"
            poster={video.thumbnail_url ?? undefined}
          />
        ) : (
          <button className="vd2-thumb-btn" onClick={() => setPlaying(true)} aria-label="Phát video">
            {video.thumbnail_url ? (
              <img src={video.thumbnail_url} alt={video.title ?? 'Video'} className="vd2-thumb-img" loading="lazy" />
            ) : (
              <video
                src={video.video_url + '#t=0.1'}
                preload="metadata"
                muted
                playsInline
                className="vd2-thumb-img"
              />
            )}
            <div className="vd2-play-overlay">
              <div className="vd2-play-circle">
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>
      {video.title && (
        <div className="vd2-info">
          <p className="vd2-title">{video.title}</p>
        </div>
      )}
    </div>
  );
}

function VideoCard({ video }: { video: VideoRow }) {
  return isYouTubeEmbed(video.video_url)
    ? <YouTubeCard video={video} />
    : <LegacyVideoCard video={video} />;
}

export default function VideoPage() {
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategorySlug>('series-100-ngay');

  useEffect(() => {
    createClient()
      .from('videos')
      .select('id,title,video_url,thumbnail_url,category,created_at')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setVideos(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = videos.filter(v => v.category === activeCategory);

  // Chỉ hiện tab nếu có ít nhất 1 video trong category đó
  const activeCats = VIDEO_CATEGORIES.filter(c => videos.some(v => v.category === c.slug));

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* HERO */}
      <section className="ct-hero">
        <div className="ct-hero-bg">
          <img src="/images/gallery/Concept-studio-with-products/36. Đào xoài macchiato bg.webp" alt="Video Học Viện" loading="eager" />
        </div>
        <div className="ct-hero-ov"></div>
        <div className="container">
          <div className="ct-hero-body">
            <div className="ct-hero-crumb">
              <Link href="/">Trang Chủ</Link>
              <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
              <span>Thư Viện</span>
              <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
              <span>Tư Liệu Video</span>
            </div>
            <h1>Video <em>Học Viện</em></h1>
            <p className="ct-hero-sub">
              Khám phá các clip pha chế, hoạt động đào tạo và câu chuyện từ Học Viện Cà Phê HCM.
            </p>
            <div className="ct-hero-badges">
              <span className="ct-badge"><i className="ti ti-video"></i> {loading ? '...' : videos.length} Video</span>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="vd-section">
        <div className="container">

          {/* TAB BAR */}
          {!loading && activeCats.length > 1 && (
            <div className="htq-tabs" style={{ marginBottom: 32 }}>
              {activeCats.map(cat => (
                <button
                  key={cat.slug}
                  className={`htq-tab-btn${activeCategory === cat.slug ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat.slug)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="vd2-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="vd2-skeleton">
                  <div className="vd2-sk-media" />
                  <div className="vd2-sk-info">
                    <div className="vd2-sk-line" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="vd-empty">
              <i className="ti ti-video-off" />
              <p>Video đang được cập nhật. Vui lòng quay lại sau nhé!</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="vd2-grid">
              {filtered.map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
