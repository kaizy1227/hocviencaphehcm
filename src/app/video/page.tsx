'use client';
import { useEffect, useState } from 'react';
import type { LarkVideo } from '@/lib/lark';

function channelIcon(ch: string) {
  const c = ch.toLowerCase();
  if (c.includes('tiktok'))    return 'ti ti-brand-tiktok';
  if (c.includes('youtube'))   return 'ti ti-brand-youtube';
  if (c.includes('facebook'))  return 'ti ti-brand-facebook';
  if (c.includes('instagram')) return 'ti ti-brand-instagram';
  return 'ti ti-video';
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
                      <video
                        src={v.videoUrl}
                        controls
                        playsInline
                        preload="metadata"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000', display: 'block' }}
                      />
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
