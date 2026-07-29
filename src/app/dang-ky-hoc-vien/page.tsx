'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import s from './page.module.css';

function normalizePhone(raw: string): string {
  return raw.replace(/\s+/g, '').replace(/^(\+84|84)/, '0');
}
function phoneToEmail(phone: string): string {
  return `${normalizePhone(phone)}@hocviencaphehcm.vn`;
}

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
        body: JSON.stringify({ name: name.trim(), phone: normalizePhone(phone), authUserId: data.user.id }),
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
    <>
      <main className={s.page}>
        <div className={s.card}>
          <span className={s.cardEyebrow}>Dành cho học viên</span>
          <h1 className={s.cardTitle}>Tạo Tài Khoản</h1>
          <p className={s.cardSub}>Đăng ký để truy cập kho công thức pha chế độc quyền từ giảng viên.</p>

          {done ? (
            <div className={s.success}>
              <div className={s.successIco}><i className="ti ti-circle-check"></i></div>
              <h3>Đăng ký thành công!</h3>
              <p>Đang chuyển tới trang công thức...</p>
            </div>
          ) : (
            <form className={s.form} onSubmit={handleSubmit}>
              <div className={s.fieldGroup}>
                <label className={s.label} htmlFor="reg-name">Họ và tên <em style={{ color: 'var(--gtn-caramel-dark)' }}>*</em></label>
                <div className={s.inputWrap}>
                  <i className="ti ti-user"></i>
                  <input id="reg-name" type="text" placeholder="Nguyễn Văn A"
                    value={name} onChange={e => setName(e.target.value)}
                    required autoComplete="name" />
                </div>
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label} htmlFor="reg-phone">Số điện thoại <em style={{ color: 'var(--gtn-caramel-dark)' }}>*</em></label>
                <div className={s.inputWrap}>
                  <i className="ti ti-phone"></i>
                  <input id="reg-phone" type="tel" placeholder="0912 345 678"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    required autoComplete="tel" inputMode="numeric" />
                </div>
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label} htmlFor="reg-password">Mật khẩu <em style={{ color: 'var(--gtn-caramel-dark)' }}>*</em></label>
                <div className={s.inputWrap}>
                  <i className="ti ti-lock"></i>
                  <input id="reg-password" type="password" placeholder="Tối thiểu 6 ký tự"
                    value={password} onChange={e => setPassword(e.target.value)}
                    required autoComplete="new-password" />
                </div>
              </div>
              {error && (
                <div className={s.error}>
                  <i className="ti ti-alert-circle"></i> {error}
                </div>
              )}
              <button type="submit" className={s.submitBtn} disabled={loading}>
                {loading
                  ? <><i className="ti ti-loader-2 spin"></i> Đang tạo tài khoản...</>
                  : <><i className="ti ti-user-plus"></i> Tạo Tài Khoản</>}
              </button>
            </form>
          )}

          <p className={s.loginCta}>
            Đã có tài khoản?{' '}
            <Link href="/login">Đăng nhập</Link>
          </p>
          <p className={s.note}>
            <i className="ti ti-info-circle" style={{ verticalAlign: 'middle', marginRight: 4 }}></i>
            Sau khi tạo tài khoản, admin sẽ cấp quyền xem khóa học tương ứng.
          </p>
        </div>
      </main>
    </>
  );
}
