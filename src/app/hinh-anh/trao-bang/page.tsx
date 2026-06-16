'use client';
import { useEffect, useState } from 'react';
import type { LarkStudent } from '@/lib/lark';

export default function TraoBangPage() {
  const [students, setStudents] = useState<LarkStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lark-students')
      .then(r => r.json())
      .then(d => setStudents(d.students ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...students].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* HERO */}
      <section className="tb-hero">
        <div className="container">
          <span className="tag">Học Viên</span>
          <h1>Học Viên Nhận<br /><em>Chứng Nhận</em></h1>
          <p className="sub" style={{ maxWidth: 520, margin: '0 auto' }}>
            Mỗi học viên hoàn thành khóa học đều nhận chứng nhận từ Học Viện Cà Phê — bước đầu trên hành trình kinh doanh của riêng bạn.
          </p>
          {!loading && (
            <div className="tb-count">
              <i className="ti ti-certificate"></i> {sorted.length} học viên đã nhận chứng nhận
            </div>
          )}
        </div>
      </section>

      {/* GRID */}
      <section className="section tb-grid-section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '60px 0' }}>Đang tải…</p>
          ) : sorted.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '60px 0' }}>Chưa có dữ liệu.</p>
          ) : (
            <div className="tb-grid">
              {sorted.map(s => (
                <div key={s.id} className="tb-card">
                  <div className="tb-card-img">
                    <img
                      src={s.photoUrl}
                      alt={s.name}
                      loading="lazy"
                      onError={e => {
                        const card = (e.currentTarget as HTMLImageElement).closest('.tb-card') as HTMLElement | null;
                        if (card) card.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="tb-card-info">
                    <span className="tb-card-name">{s.name.trim()}</span>
                    {s.date && <span className="tb-card-date">{s.date}</span>}
                    <span className="tb-badge"><i className="ti ti-certificate"></i> Chứng Nhận Hoàn Thành</span>
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
