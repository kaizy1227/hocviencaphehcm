'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const TIKTOK_CHANNEL = 'https://www.tiktok.com/@congthucphache.hvcp';

type TikTokVideo = {
  id: string;
  url: string;
  video_id: string;
  title: string | null;
  thumbnail: string | null;
  author: string | null;
};

function TikTokCard({ video }: { video: TikTokVideo }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="vd-tt-player-wrap">
        <iframe
          src={`https://www.tiktok.com/embed/v2/${video.video_id}?lang=vi`}
          className="vd-tt-player-iframe"
          allowFullScreen
          allow="encrypted-media; autoplay"
          title={video.title ?? 'TikTok video'}
        />
      </div>
    );
  }

  return (
    <div className="vd-tt-card">
      <button className="vd-tt-thumb-wrap" onClick={() => setPlaying(true)} aria-label="Phát video">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title ?? 'TikTok video'} className="vd-tt-thumb-img" />
        ) : (
          <div className="vd-tt-thumb-placeholder">
            <i className="ti ti-brand-tiktok" />
          </div>
        )}
        <div className="vd-tt-play-btn">
          <div className="vd-tt-play-circle">
            <svg viewBox="0 0 24 24" fill="currentColor" className="vd-tt-play-icon">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </button>
      <div className="vd-tt-card-info">
        <span className="vd-tt-author">{video.author ?? '@congthucphache.hvcp'}</span>
        <p className="vd-tt-title">{video.title ?? ''}</p>
      </div>
    </div>
  );
}

export default function VideoPage() {
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient()
      .from('tiktok_videos')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setVideos(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* HERO */}
      <section className="vd-hero">
        <div className="container">
          <span className="tag">Truyền Thông</span>
          <h1>Video<br /><em>Học Viện</em></h1>
          <p className="sub" style={{ maxWidth: 520, margin: '0 auto' }}>
            Khám phá các clip pha chế, hoạt động đào tạo và câu chuyện từ Học Viện Cà Phê HCM.
          </p>
          <a href={TIKTOK_CHANNEL} target="_blank" rel="noopener noreferrer" className="vd-tt-follow">
            <i className="ti ti-brand-tiktok"></i> Theo dõi TikTok của chúng tôi
          </a>
        </div>
      </section>

      {/* GRID */}
      <section className="vd-section">
        <div className="container">
          {loading && (
            <div className="vd-tt-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="vd-skeleton">
                  <div className="vd-sk-media" />
                  <div className="vd-sk-info">
                    <div className="vd-sk-line short" />
                    <div className="vd-sk-line" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && videos.length === 0 && (
            <div className="vd-empty">
              <i className="ti ti-video-off" />
              <p>Video đang được cập nhật. Vui lòng quay lại sau nhé!</p>
              <a href={TIKTOK_CHANNEL} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginTop: 14 }}>
                <i className="ti ti-brand-tiktok"></i> Xem trên TikTok
              </a>
            </div>
          )}

          {!loading && videos.length > 0 && (
            <div className="vd-tt-grid">
              {videos.map(v => (
                <TikTokCard key={v.id} video={v} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
