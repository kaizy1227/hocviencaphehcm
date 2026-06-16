'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function normalizePhone(raw: string): string {
  return raw.replace(/\s+/g, '').replace(/^(\+84|84)/, '0');
}

function phoneToEmail(phone: string): string {
  return `${normalizePhone(phone)}@hocviencaphehcm.vn`;
}

const PERKS = [
  '60+ công thức cà phê, trà sữa, matcha được hướng dẫn chi tiết',
  'Cập nhật thường xuyên theo từng khóa học mới',
  'Hỗ trợ kỹ thuật từ đội ngũ giảng viên học viện',
];

export default function DangKyHocVienPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const digits = normalizePhone(phone).replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 11) {
      setError('Số điện thoại không hợp lệ.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpErr } = await supabase.auth.signUp({
      email: phoneToEmail(phone),
      password,
    });

    if (signUpErr) {
      setLoading(false);
      if (signUpErr.message.toLowerCase().includes('already registered')) {
        setError('Số điện thoại này đã được đăng ký. Vui lòng đăng nhập.');
      } else {
        setError('Đăng ký thất bại: ' + signUpErr.message);
      }
      return;
    }

    if (data.user) {
      const res = await fetch('/api/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: normalizePhone(phone),
          authUserId: data.user.id,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setLoading(false);
        setError('Tạo hồ sơ thất bại: ' + (body.error ?? res.status));
        return;
      }
    }

    setLoading(false);
    setDone(true);
    setTimeout(() => router.push('/cong-thuc'), 2500);
  }

  return (
    <main className="reg-page">
      {/* LEFT — brand panel */}
      <div className="reg-brand-panel">
        <div className="reg-brand-bg">
          <img src="/images/gallery/Life-styles-with-person/~12573.webp" alt="" aria-hidden="true" />
        </div>
        <div className="reg-brand-content">
          <Link href="/">
            <img src="/images/logo.png" alt="Học Viện Cà Phê" className="reg-brand-logo" />
          </Link>
          <div className="reg-brand-eyebrow">Dành Cho Học Viên</div>
          <h2 className="reg-brand-h">Mở Ra Kho<br />Công Thức Của Bạn</h2>
          <p className="reg-brand-desc">Truy cập kho công thức pha chế độc quyền — được cập nhật theo từng khóa học bạn đã tham gia.</p>
          <div className="reg-perks">
            {PERKS.map(t => (
              <div key={t} className="reg-perk">
                <i className="ti ti-circle-check"></i>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className="reg-form-panel">
        <div className="reg-card">
          <div className="login-logo">
            <Link href="/"><img src="/images/logo.png" alt="Học Viện Cà Phê" /></Link>
          </div>
          <h1 className="login-title">Tạo Tài Khoản Học Viên</h1>
          <p className="login-sub">Đăng ký để truy cập kho công thức pha chế độc quyền.</p>

          {done ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <i className="ti ti-circle-check" style={{ fontSize: '3rem', color: 'var(--accent)', display: 'block', marginBottom: '14px' }}></i>
              <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>Đăng ký thành công!</h3>
              <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Đang chuyển tới trang công thức...</p>
            </div>
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="lf-group">
                <label htmlFor="reg-name">Họ và tên</label>
                <div className="lf-input-wrap">
                  <i className="ti ti-user"></i>
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>
              <div className="lf-group">
                <label htmlFor="reg-phone">Số điện thoại</label>
                <div className="lf-input-wrap">
                  <i className="ti ti-phone"></i>
                  <input
                    id="reg-phone"
                    type="tel"
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    autoComplete="tel"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div className="lf-group">
                <label htmlFor="reg-password">Mật khẩu</label>
                <div className="lf-input-wrap">
                  <i className="ti ti-lock"></i>
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
              {error && (
                <div className="lf-error">
                  <i className="ti ti-alert-circle"></i> {error}
                </div>
              )}
              <button type="submit" className="btn btn-primary lf-submit" disabled={loading}>
                {loading
                  ? <><i className="ti ti-loader-2 spin"></i> Đang tạo tài khoản...</>
                  : <><i className="ti ti-user-plus"></i> Tạo Tài Khoản</>}
              </button>
            </form>
          )}

          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-3)' }}>
            Đã có tài khoản?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Đăng nhập</Link>
          </p>
          <p style={{ marginTop: '12px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.55 }}>
            <i className="ti ti-info-circle" style={{ verticalAlign: 'middle', marginRight: '4px' }}></i>
            Sau khi tạo tài khoản, admin sẽ cấp quyền xem khóa học tương ứng.
          </p>
        </div>
      </div>
    </main>
  );
}
