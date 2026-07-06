'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type VideoRow = {
  id: string;
  title: string | null;
  video_url: string;
  thumbnail_url: string | null;
};

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
            {video.thumbnail_url
              ? <img src={video.thumbnail_url} alt={video.title ?? 'Video'} className="vd2-thumb-img" loading="lazy" />
              : (
                <div className="vd2-thumb-img" style={{ background: '#1a0800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-brand-youtube" style={{ fontSize: 48, color: '#ff0000' }} />
                </div>
              )
            }
            <div className="vd2-play-overlay">
              <div className="vd2-play-circle">
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
          </button>
        )}
      </div>
      {video.title && <div className="vd2-info"><p className="vd2-title">{video.title}</p></div>}
    </div>
  );
}

export default function DaoTaoSetupDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [serviceName, setServiceName] = useState<string>('');
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const supabase = createClient();
    (async () => {
      const [{ data: course }, { data: videos }] = await Promise.all([
        supabase.from('courses').select('name').eq('slug', slug).single(),
        supabase.from('service_videos')
          .select('id,title,video_url,thumbnail_url')
          .eq('active', true)
          .eq('service_slug', slug)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
      ]);
      setServiceName(course?.name ?? slug);
      setVideos(videos ?? []);
      setLoading(false);
    })();
  }, [slug]);

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>

      <section className="lh-hero">
        <div className="container">
          <div className="nl-hero-crumb">
            <Link href="/">Trang Chủ</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }} />
            <Link href="/thu-vien/dao-tao-setup">Đào Tạo - Setup</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }} />
            <span>{serviceName}</span>
          </div>
          <h1>{serviceName || '...'}</h1>
          <p style={{ maxWidth: 560 }}>
            Video thực tế từ các buổi {serviceName.toLowerCase() || 'dịch vụ'} tại Học Viện Cà Phê HCM.
          </p>
          <div style={{ marginTop: 16 }}>
            <Link href="/thu-vien/dao-tao-setup" className="btn btn-outline" style={{ fontSize: '.88rem' }}>
              ← Xem dịch vụ khác
            </Link>
          </div>
        </div>
      </section>

      <section className="vd-section">
        <div className="container">

          {loading && (
            <div className="vd2-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="vd2-skeleton">
                  <div className="vd2-sk-media" />
                  <div className="vd2-sk-info"><div className="vd2-sk-line" /></div>
                </div>
              ))}
            </div>
          )}

          {!loading && videos.length === 0 && (
            <div className="vd-empty">
              <i className="ti ti-video-off" />
              <p>Video đang được cập nhật. Vui lòng quay lại sau nhé!</p>
            </div>
          )}

          {!loading && videos.length > 0 && (
            <div className="vd2-grid">
              {videos.map(v => <YouTubeCard key={v.id} video={v} />)}
            </div>
          )}

        </div>
      </section>

    </main>
  );
}
