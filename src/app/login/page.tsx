'use client';
import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import s from './page.module.css';

function normalizePhone(raw: string): string {
  return raw.replace(/\s+/g, '').replace(/^(\+84|84)/, '0');
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
    <form className={s.form} onSubmit={handleSubmit}>
      <div className={s.fieldGroup}>
        <label className={s.label} htmlFor="phone">Số điện thoại</label>
        <div className={s.inputWrap}>
          <i className="ti ti-phone"></i>
          <input id="phone" type="tel" placeholder="0912 345 678"
            value={phone} onChange={e => setPhone(e.target.value)}
            required autoComplete="tel" inputMode="numeric" />
        </div>
      </div>
      <div className={s.fieldGroup}>
        <label className={s.label} htmlFor="password">Mật khẩu</label>
        <div className={s.inputWrap}>
          <i className="ti ti-lock"></i>
          <input id="password" type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            required autoComplete="current-password" />
        </div>
      </div>
      {error && (
        <div className={s.error}>
          <i className="ti ti-alert-circle"></i> {error}
        </div>
      )}
      <button type="submit" className={s.submitBtn} disabled={loading}>
        {loading
          ? <><i className="ti ti-loader-2 spin"></i> Đang đăng nhập...</>
          : <><i className="ti ti-login"></i> Đăng Nhập</>}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <>
      <main className={s.page}>
        <div className={s.card}>
          <span className={s.cardEyebrow}>Cổng học viên</span>
          <h1 className={s.cardTitle}>Đăng Nhập</h1>
          <p className={s.cardSub}>Dành cho học viên Học Viện Cà Phê HCM</p>

          <Suspense fallback={<div style={{ color: 'var(--gtn-muted)' }}>Đang tải...</div>}>
            <LoginForm />
          </Suspense>

          <div className={s.divider}>hoặc</div>

          <div className={s.registerCta}>
            <span>Chưa có tài khoản?</span>
            <Link href="/dang-ky-hoc-vien" className={s.registerLink}>
              <i className="ti ti-user-plus"></i> Đăng ký ngay
            </Link>
          </div>

          <div className={s.footer}>
            <a href="https://zalo.me/0834790555" target="_blank" rel="noopener">
              <i className="ti ti-headset"></i> Liên hệ hỗ trợ
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
