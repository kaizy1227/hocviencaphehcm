'use client';
import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const PROFILE_KEY = 'hvcph-profile';

export default function TaiKhoanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', email: '' });

  useEffect(() => {
    const supabase = createClient();
    Promise.race([
      supabase.auth.getSession(),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000)),
    ]).then(async ({ data: { session } }) => {
      if (!session) { router.replace('/login?redirect=/tai-khoan'); return; }
      const user = session.user;
      setUserId(user.id);
      try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
          setForm({ name: profile.name || '', phone: profile.phone || '', address: profile.address || '', email: profile.email || '' });
        } else {
          try {
            const saved = localStorage.getItem(PROFILE_KEY);
            if (saved) {
              const p = JSON.parse(saved);
              setForm({ name: p.name || '', phone: p.phone || '', address: p.address || '', email: p.email || '' });
            }
          } catch {}
        }
      } catch {}
      setLoading(false);
    }).catch(() => { router.replace('/login?redirect=/tai-khoan'); });
  }, [router]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('profiles').upsert({
      id: userId,
      name: form.name.trim() || null,
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      email: form.email.trim() || null,
      updated_at: new Date().toISOString(),
    });
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(form)); } catch {}
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <main className="tc-page">
        <div className="tc-loading"><i className="ti ti-loader-2 spin"></i> Đang tải...</div>
      </main>
    );
  }

  return (
    <main className="tc-page">
      <div className="container">
        <div className="tc-wrap">
          <div className="tc-header">
            <div className="tc-avatar"><i className="ti ti-user-circle"></i></div>
            <div>
              <h1 className="tc-title">Tài Khoản của tôi</h1>
              <p className="tc-sub">Thông tin sẽ được tự động điền khi đặt hàng</p>
            </div>
          </div>

          <form className="tc-form" onSubmit={handleSubmit}>
            <div className="tc-field">
              <label>Họ và tên</label>
              <input type="text" placeholder="Nguyễn Văn A" value={form.name} onChange={set('name')} />
            </div>
            <div className="tc-field">
              <label>Số điện thoại</label>
              <input type="tel" placeholder="0912 345 678" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="tc-field">
              <label>Địa chỉ giao hàng mặc định</label>
              <input type="text" placeholder="123 Đường ABC, Quận 1, TP.HCM" value={form.address} onChange={set('address')} />
            </div>
            <div className="tc-field">
              <label>Email</label>
              <input type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} />
            </div>

            <button type="submit" className={`tc-save-btn${saved ? ' saved' : ''}`} disabled={saving}>
              {saved
                ? <><i className="ti ti-circle-check"></i> Đã lưu!</>
                : saving
                  ? <><i className="ti ti-loader-2 spin"></i> Đang lưu...</>
                  : <><i className="ti ti-device-floppy"></i> Lưu thông tin</>}
            </button>
          </form>

          <div className="tc-links">
            <a href="/don-hang-cua-toi" className="tc-link">
              <i className="ti ti-clipboard-list"></i>
              <span>Đơn hàng của tôi</span>
              <i className="ti ti-chevron-right tc-link-arrow"></i>
            </a>
            <a href="/yeu-thich" className="tc-link">
              <i className="ti ti-heart"></i>
              <span>Sản phẩm yêu thích</span>
              <i className="ti ti-chevron-right tc-link-arrow"></i>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
