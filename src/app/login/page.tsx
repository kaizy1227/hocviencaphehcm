import Link from 'next/link';

export default function LoginPage() {
  return (
    <main style={{ minHeight: '100dvh', paddingTop: 'var(--nav-h)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ maxWidth: '420px', margin: '0 auto' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#fff', fontSize: '1.6rem' }}>
            <i className="ti ti-lock"></i>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>Đăng Nhập Nội Bộ</h1>
          <p style={{ color: 'var(--text-3)', marginBottom: '32px', lineHeight: 1.7 }}>
            Trang dành riêng cho học viên và giảng viên Học Viện Cà Phê. Hệ thống đang được cập nhật.
          </p>
          <Link href="/#dangky" className="btn btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
            <i className="ti ti-calendar-check"></i> Đăng Ký Tư Vấn
          </Link>
          <div style={{ marginTop: '16px' }}>
            <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>← Về trang chủ</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
