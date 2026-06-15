import type { Metadata } from 'next';
import { fetchLarkStudents } from '@/lib/lark';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Học Viên Nhận Chứng Nhận',
  description: 'Hình ảnh học viên hoàn thành khóa học và nhận chứng nhận tại Học Viện Cà Phê HCM.',
};

export default async function TraoBangPage() {
  let students: Awaited<ReturnType<typeof fetchLarkStudents>> = [];
  try {
    if (process.env.LARK_APP_ID) students = await fetchLarkStudents();
  } catch {}

  // Sort newest first
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
          <div className="tb-count">
            <i className="ti ti-certificate"></i> {sorted.length} học viên đã nhận chứng nhận
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="section tb-grid-section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          {sorted.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-3)' }}>Đang tải dữ liệu…</p>
          ) : (
            <div className="tb-grid">
              {sorted.map(s => (
                <div key={s.id} className="tb-card">
                  <div className="tb-card-img">
                    <img
                      src={s.photoUrl}
                      alt={s.name}
                      loading="lazy"
                      onError={e => { (e.currentTarget.closest('.tb-card') as HTMLElement | null)?.remove(); }}
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
