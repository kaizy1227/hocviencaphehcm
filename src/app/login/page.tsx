'use client';
import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function normalizePhone(raw: string): string {
  let p = raw.replace(/\s+/g, '').replace(/^(\+84|84)/, '0');
  return p;
}

function phoneToEmail(phone: string): string {
  return `${normalizePhone(phone)}@hocviencaphehcm.vn`;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') ?? '/';

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const digits = normalizePhone(phone).replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 11) {
      setError('Số điện thoại không hợp lệ.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email: phoneToEmail(phone),
      password,
    });
    setLoading(false);

    if (err) {
      setError('Số điện thoại hoặc mật khẩu không đúng. Vui lòng thử lại.');
    } else {
      router.push(redirect);
      router.refresh();
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="lf-group">
        <label htmlFor="phone">Số điện thoại</label>
        <div className="lf-input-wrap">
          <i className="ti ti-phone"></i>
          <input
            id="phone"
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
        <label htmlFor="password">Mật khẩu</label>
        <div className="lf-input-wrap">
          <i className="ti ti-lock"></i>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
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
          ? <><i className="ti ti-loader-2 spin"></i> Đang đăng nhập...</>
          : <><i className="ti ti-login"></i> Đăng Nhập</>}
      </button>
    </form>
  );
}

const LOGIN_PERKS = [
  'Kho công thức pha chế độc quyền từ giảng viên',
  'Cập nhật liên tục — hơn 60 công thức đồ uống',
  'Hỗ trợ trực tiếp từ đội ngũ học viện',
];

export default function LoginPage() {
  return (
    <main className="reg-page">
      {/* LEFT — brand panel */}
      <div className="reg-brand-panel">
        <div className="reg-brand-bg">
          <img src="/images/gallery/Life-styles-with-person/~12816.webp" alt="" aria-hidden="true" />
        </div>
        <div className="reg-brand-content">
          <Link href="/">
            <img src="/images/logo.png" alt="Học Viện Cà Phê" className="reg-brand-logo" />
          </Link>
          <div className="reg-brand-eyebrow">Cổng Học Viên</div>
          <h2 className="reg-brand-h">Chào Mừng<br />Trở Lại</h2>
          <p className="reg-brand-desc">Đăng nhập để truy cập kho công thức pha chế độc quyền dành cho học viên Học Viện Cà Phê.</p>
          <div className="reg-perks">
            {LOGIN_PERKS.map(t => (
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
          <h1 className="login-title">Đăng Nhập</h1>
          <p className="login-sub">Dành cho học viên Học Viện Cà Phê</p>

          <Suspense fallback={<div className="lf-loading">Đang tải...</div>}>
            <LoginForm />
          </Suspense>

          <div className="login-register-cta">
            <span>Chưa có tài khoản?</span>
            <Link href="/dang-ky-hoc-vien" className="login-register-link">
              <i className="ti ti-user-plus"></i> Đăng ký ngay
            </Link>
          </div>

          <div className="login-footer">
            <Link href="/">← Về trang chủ</Link>
            <span>·</span>
            <a href="https://zalo.me/0834790555" target="_blank" rel="noopener">Liên hệ hỗ trợ</a>
          </div>
        </div>
      </div>
    </main>
  );
}
