'use client';
import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') ?? '/cong-thuc';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    } else {
      router.push(redirect);
      router.refresh();
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="lf-group">
        <label htmlFor="email">Email</label>
        <div className="lf-input-wrap">
          <i className="ti ti-mail"></i>
          <input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
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

      {error && <div className="lf-error"><i className="ti ti-alert-circle"></i> {error}</div>}

      <button type="submit" className="btn btn-primary lf-submit" disabled={loading}>
        {loading
          ? <><i className="ti ti-loader-2 spin"></i> Đang đăng nhập...</>
          : <><i className="ti ti-login"></i> Đăng Nhập</>}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/images/logo.png" alt="Học Viện Cà Phê" />
        </div>
        <h1 className="login-title">Đăng Nhập</h1>
        <p className="login-sub">Dành cho học viên Học Viện Cà Phê</p>

        <Suspense fallback={<div className="lf-loading">Đang tải...</div>}>
          <LoginForm />
        </Suspense>

        <div className="login-footer">
          <Link href="/">← Về trang chủ</Link>
          <span>·</span>
          <a href="https://zalo.me/0834790555" target="_blank" rel="noopener">Liên hệ hỗ trợ</a>
        </div>
      </div>
    </main>
  );
}
