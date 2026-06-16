'use client';
import { useEffect, useRef, useState } from 'react';
import type { LarkVideo } from '@/lib/lark';

function channelIcon(ch: string) {
  const c = ch.toLowerCase();
  if (c.includes('tiktok'))    return 'ti ti-brand-tiktok';
  if (c.includes('youtube'))   return 'ti ti-brand-youtube';
  if (c.includes('facebook'))  return 'ti ti-brand-facebook';
  if (c.includes('instagram')) return 'ti ti-brand-instagram';
  return 'ti ti-video';
}

function localThumb(videoName: string | null): string | undefined {
  if (!videoName) return undefined;
  const base = videoName.replace(/\.[^.]+$/, ''); // bỏ đuôi .mov/.mp4
  return `/videos/thumbs/${encodeURIComponent(base)}.jpg`;
}

function VideoPlayer({ url, poster, title }: { url: string; poster: string | null | undefined; title: string }) {
  const [errored, setErrored] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (errored) {
    return (
      <div className="vd-placeholder" style={{ gap: 14 }}>
        {poster
          ? <img src={poster} alt={title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          : <i className="ti ti-video-off" style={{ fontSize: '2.5rem' }} />}
        <a
          href={url}
          download
          target="_blank"
          rel="noopener"
          style={{
            position: 'relative', zIndex: 1,
            background: 'rgba(0,0,0,.6)', color: '#fff',
            fontSize: '.78rem', padding: '7px 14px', borderRadius: 8,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <i className="ti ti-download" /> Tải về để xem
        </a>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={url}
      controls
      playsInline
      preload="metadata"
      poster={poster ?? undefined}
      onError={() => setErrored(true)}
      style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000', display: 'block' }}
    />
  );
}

export default function VideoPage() {
  const [videos, setVideos]   = useState<LarkVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    fetch('/api/videos')
      .then(r => r.json())
      .then(d => {
        if (!d.ok) throw new Error(d.error);
        setVideos(d.videos ?? []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
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
        </div>
      </section>

      {/* GRID */}
      <section className="vd-section">
        <div className="container">
          {loading && (
            <div className="vd-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="vd-skeleton">
                  <div className="vd-sk-media" />
                  <div className="vd-sk-info">
                    <div className="vd-sk-line short" />
                    <div className="vd-sk-line" />
                    <div className="vd-sk-line short" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="vd-empty">
              <i className="ti ti-alert-circle" />
              <p>Không tải được video. Vui lòng thử lại sau.</p>
              <small style={{ opacity: 0.5 }}>{error}</small>
            </div>
          )}

          {!loading && !error && videos.length === 0 && (
            <div className="vd-empty">
              <i className="ti ti-video-off" />
              <p>Chưa có video nào.</p>
            </div>
          )}

          {!loading && !error && videos.length > 0 && (
            <div className="vd-grid">
              {videos.map(v => (
                <div key={v.id} className="vd-card">
                  <div className="vd-media">
                    {v.videoUrl ? (
                      <VideoPlayer url={v.videoUrl} poster={v.thumbnailUrl ?? localThumb(v.videoName)} title={v.title} />
                    ) : v.downloadUrl ? (
                      <div className="vd-placeholder">
                        {v.thumbnailUrl && (
                          <img src={v.thumbnailUrl} alt={v.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <a
                          href={v.downloadUrl}
                          download
                          target="_blank"
                          rel="noopener"
                          style={{
                            position: 'relative', zIndex: 1,
                            background: 'rgba(0,0,0,.6)', color: '#fff',
                            fontSize: '.78rem', padding: '8px 16px', borderRadius: 8,
                            display: 'flex', alignItems: 'center', gap: 6,
                          }}
                        >
                          <i className="ti ti-download" /> Tải về để xem (.mov)
                        </a>
                      </div>
                    ) : v.thumbnailUrl ? (
                      <img src={v.thumbnailUrl} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div className="vd-placeholder">
                        <i className="ti ti-video" style={{ fontSize: '2.5rem' }} />
                        <span>Không có tệp</span>
                      </div>
                    )}
                  </div>
                  <div className="vd-info">
                    {v.channel && (
                      <span className="vd-channel">
                        <i className={channelIcon(v.channel)} /> {v.channel}
                      </span>
                    )}
                    <div className="vd-title">{v.title || 'Video'}</div>
                    {v.date && (
                      <div className="vd-date">
                        <i className="ti ti-calendar" style={{ fontSize: '0.8rem' }} /> {v.date}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
