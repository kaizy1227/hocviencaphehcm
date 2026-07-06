'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type ServiceCard = {
  slug: string;
  name: string;
  image: string | null;
  videoCount: number;
};

function resolveImg(img: string | null): string {
  if (!img) return '';
  if (img.startsWith('http')) return img;
  return `/images/services/${img}`;
}

export default function DaoTaoSetupPage() {
  const [services, setServices] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: videos } = await supabase
        .from('service_videos')
        .select('service_slug')
        .eq('active', true);

      if (!videos || videos.length === 0) { setLoading(false); return; }

      const slugCount = videos.reduce<Record<string, number>>((acc, v) => {
        acc[v.service_slug] = (acc[v.service_slug] ?? 0) + 1;
        return acc;
      }, {});

      const slugs = Object.keys(slugCount);

      const { data: courses } = await supabase
        .from('courses')
        .select('slug,name,image,sort_order')
        .in('slug', slugs);

      const list: ServiceCard[] = slugs
        .map(slug => {
          const course = courses?.find(c => c.slug === slug);
          return {
            slug,
            name: course?.name ?? slug,
            image: course?.image ?? null,
            videoCount: slugCount[slug],
            sort_order: course?.sort_order ?? 999,
          };
        })
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(({ slug, name, image, videoCount }) => ({ slug, name, image, videoCount }));

      setServices(list);
      setLoading(false);
    })();
  }, []);

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>

      <section className="lh-hero">
        <div className="container">
          <div className="nl-hero-crumb">
            <Link href="/">Trang Chủ</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }} />
            <span>Đào Tạo - Setup</span>
          </div>
          <h1>Đào Tạo - Setup</h1>
          <p style={{ maxWidth: 560 }}>
            Video thực tế từ các buổi đào tạo và setup tại quán của Học Viện Cà Phê HCM — chọn dịch vụ để xem tư liệu chi tiết.
          </p>
        </div>
      </section>

      <section className="vd-section">
        <div className="container">

          {loading && (
            <div className="poster-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="vd2-skeleton" style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '4/3', background: 'linear-gradient(90deg,#f0e8df 25%,#e8ddd4 50%,#f0e8df 75%)', backgroundSize: '200% 100%', animation: 'vd-shimmer 1.4s infinite' }} />
                  <div style={{ padding: '16px' }}><div className="vd2-sk-line" /></div>
                </div>
              ))}
            </div>
          )}

          {!loading && services.length === 0 && (
            <div className="vd-empty">
              <i className="ti ti-video-off" />
              <p>Nội dung đang được cập nhật. Vui lòng quay lại sau nhé!</p>
            </div>
          )}

          {!loading && services.length > 0 && (
            <div className="poster-grid">
              {services.map(s => {
                const imgSrc = resolveImg(s.image);
                return (
                  <Link key={s.slug} href={`/thu-vien/dao-tao-setup/${s.slug}`} className="poster-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="poster-img">
                      {imgSrc
                        ? <img src={imgSrc} alt={s.name} loading="lazy" />
                        : <div style={{ background: '#1a0800', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="ti ti-video" style={{ fontSize: 40, color: 'var(--accent)' }} />
                          </div>
                      }
                    </div>
                    <div className="poster-body">
                      <div className="poster-name">{s.name}</div>
                      <div className="poster-foot">
                        <span style={{ fontSize: '.82rem', color: 'var(--text-3)' }}>
                          <i className="ti ti-movie" /> {s.videoCount} video
                        </span>
                        <span className="btn-reg">Xem Video →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </section>

    </main>
  );
}
