'use client';
import { useState, FormEvent, useEffect } from 'react';
import { useCart, CartItem } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type SubmitStatus = 'idle' | 'submitting' | 'done';
type OrderResult = { id: string; customer_name: string; phone: string; items: CartItem[]; total: number; };

const PROFILE_KEY = 'hvcph-profile';

export default function GioHangPage() {
  const { items, totalItems, totalPrice, clearCart, openCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '', email: '', notes: '' });
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load profile: localStorage first, then Supabase (wins if logged in)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        setForm(f => ({ ...f, name: p.name || '', phone: p.phone || '', address: p.address || '', email: p.email || '' }));
      }
    } catch {}
    const supabase = createClient();
    Promise.race([
      supabase.auth.getSession(),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000)),
    ]).then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      setIsLoggedIn(!!user);
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
          setForm(f => ({
            name: profile.name || f.name,
            phone: profile.phone || f.phone,
            address: profile.address || f.address,
            email: profile.email || f.email,
            notes: f.notes,
          }));
        }
      }
    }).catch(() => {});
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Vui lòng nhập họ tên.'); return; }
    if (!form.phone.trim()) { setError('Vui lòng nhập số điện thoại.'); return; }
    setStatus('submitting'); setError('');

    const { data: { session: _s } } = await createClient().auth.getSession();
    const user = _s?.user ?? null;

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim() || null,
        email: form.email.trim() || null,
        notes: form.notes.trim() || null,
        items,
        total: totalPrice,
        user_id: user?.id ?? null,
      }),
    });

    if (!res.ok) {
      setError('Có lỗi xảy ra, vui lòng thử lại.');
      setStatus('idle');
      return;
    }

    const data = await res.json();

    // Lưu profile để auto-fill lần sau
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({
        name: form.name.trim(), phone: form.phone.trim(),
        address: form.address.trim(), email: form.email.trim(),
      }));
    } catch {}

    const snapshot = [...items];
    const total = totalPrice;
    clearCart();
    setOrderResult({ id: data.orderId, customer_name: form.name.trim(), phone: form.phone.trim(), items: snapshot, total });
    setStatus('done');
  }

  // ── SUCCESS STATE ──
  if (status === 'done' && orderResult) {
    return (
      <main className="gh-page">
        <div className="container">
          <div className="gh-confirm">
            <div className="gh-confirm-head">
              <div className="gh-confirm-icon"><i className="ti ti-circle-check-filled"></i></div>
              <div>
                <h1 className="gh-confirm-title">Đặt hàng thành công!</h1>
                <p className="gh-confirm-sub">Chúng tôi sẽ liên hệ <strong>{orderResult.phone}</strong> để xác nhận đơn.</p>
              </div>
            </div>

            <div className="gh-confirm-id">
              <span>Mã đơn hàng</span>
              <strong>#{orderResult.id.slice(0, 8).toUpperCase()}</strong>
            </div>

            <div className="gh-confirm-items">
              <p className="gh-confirm-items-title">Sản phẩm đã đặt</p>
              {orderResult.items.map(item => (
                <div key={item.id} className="gh-confirm-item">
                  <div className="gh-confirm-item-img">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} />
                      : <div className="gh-item-img-ph"><i className="ti ti-package"></i></div>}
                  </div>
                  <div className="gh-confirm-item-info">
                    <span className="gh-confirm-item-name">{item.name}</span>
                    <span className="gh-confirm-item-unit">{item.unit}</span>
                  </div>
                  <span className="gh-confirm-item-qty">×{item.quantity}</span>
                  <span className="gh-confirm-item-price">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
              <div className="gh-confirm-total">
                <span>Tổng cộng</span>
                <strong>{orderResult.total.toLocaleString('vi-VN')}đ</strong>
              </div>
            </div>

            <div className="gh-confirm-actions">
              {isLoggedIn && (
                <Link href="/don-hang-cua-toi" className="btn btn-primary">
                  <i className="ti ti-clipboard-list"></i> Xem lịch sử đơn hàng
                </Link>
              )}
              <Link href="/nguyen-lieu" className="btn btn-outline">
                <i className="ti ti-package"></i> Tiếp tục mua sắm
              </Link>
              <Link href="/" className="btn btn-outline">
                <i className="ti ti-home"></i> Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── EMPTY CART ──
  if (items.length === 0) {
    return (
      <main className="gh-page">
        <div className="gh-empty">
          <div className="gh-empty-icon"><i className="ti ti-shopping-cart-off"></i></div>
          <h1>Giỏ hàng trống</h1>
          <p>Thêm sản phẩm vào giỏ để đặt hàng.</p>
          <div className="gh-success-actions">
            <Link href="/nguyen-lieu" className="btn btn-primary"><i className="ti ti-package"></i> Xem nguyên liệu</Link>
            <Link href="/dung-cu" className="btn btn-outline"><i className="ti ti-tool"></i> Xem dụng cụ</Link>
          </div>
        </div>
      </main>
    );
  }

  // ── FORM ──
  return (
    <main className="gh-page">
      <div className="container">
        <div className="gh-header">
          <h1 className="gh-title"><i className="ti ti-shopping-bag"></i> Xác nhận đơn hàng</h1>
          <button className="gh-edit-cart" onClick={openCart}>
            <i className="ti ti-pencil"></i> Sửa giỏ hàng
          </button>
        </div>

        <div className="gh-layout">
          {/* ── SUMMARY ── */}
          <div className="gh-summary">
            <h2 className="gh-section-title">Sản phẩm đã chọn</h2>
            <div className="gh-items">
              {items.map(item => (
                <div key={item.id} className="gh-item">
                  <div className="gh-item-img">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} />
                      : <div className="gh-item-img-ph"><i className="ti ti-package"></i></div>}
                  </div>
                  <div className="gh-item-info">
                    <p className="gh-item-name">{item.name}</p>
                    <p className="gh-item-unit">{item.unit}</p>
                  </div>
                  <div className="gh-item-right">
                    <span className="gh-item-qty">x{item.quantity}</span>
                    <span className="gh-item-price">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="gh-total-row">
              <span>{totalItems} sản phẩm</span>
              <strong>{totalPrice.toLocaleString('vi-VN')}đ</strong>
            </div>
          </div>

          {/* ── FORM ── */}
          <div className="gh-form-wrap">
            <h2 className="gh-section-title">Thông tin giao hàng</h2>
            <form className="gh-form" onSubmit={handleSubmit}>
              <div className="gh-field">
                <label>Họ và tên <span className="gh-required">*</span></label>
                <input type="text" placeholder="Nguyễn Văn A" value={form.name} onChange={set('name')} />
              </div>
              <div className="gh-field">
                <label>Số điện thoại <span className="gh-required">*</span></label>
                <input type="tel" placeholder="0912 345 678" value={form.phone} onChange={set('phone')} />
              </div>
              <div className="gh-field">
                <label>Địa chỉ giao hàng</label>
                <input type="text" placeholder="123 Đường ABC, Quận 1, TP.HCM" value={form.address} onChange={set('address')} />
              </div>
              <div className="gh-field">
                <label>Email <span style={{ fontWeight: 400, color: 'var(--text-3)', fontSize: '0.78rem' }}>(nhận xác nhận đơn hàng)</span></label>
                <input type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} />
              </div>
              <div className="gh-field">
                <label>Ghi chú</label>
                <textarea placeholder="Giao giờ hành chính, gọi trước khi giao..." rows={3} value={form.notes} onChange={set('notes')} />
              </div>

              {error && <div className="gh-error"><i className="ti ti-alert-circle"></i> {error}</div>}

              <button type="submit" className="gh-submit-btn" disabled={status === 'submitting'}>
                {status === 'submitting'
                  ? <><i className="ti ti-loader-2 spin"></i> Đang gửi...</>
                  : <><i className="ti ti-check"></i> Xác nhận đặt hàng — {totalPrice.toLocaleString('vi-VN')}đ</>}
              </button>

              <p className="gh-note">
                <i className="ti ti-info-circle"></i>
                Nhân viên sẽ liên hệ xác nhận đơn và tư vấn phương thức thanh toán.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
