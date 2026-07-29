'use client';
import { useState, FormEvent, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCart, CartItem } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import s from './checkout.module.css';

type Step = 1 | 2;
type SubmitStatus = 'idle' | 'submitting' | 'done';
type OrderResult = { id: string; customer_name: string; phone: string; items: CartItem[]; total: number; };

const PROFILE_KEY = 'hvcph-profile';
const ZALO_NUMBER = '0834790555';

function fmtPrice(price: number, qty = 1) {
  if (!price) return 'Liên hệ';
  return (price * qty).toLocaleString('vi-VN') + 'đ';
}

function buildOrderText(name: string, phone: string, notes: string, items: CartItem[], total: number) {
  const lines = [
    'Xin chào Học Viện Cà Phê HCM!',
    '',
    'THÔNG TIN ĐẶT HÀNG',
    `- Họ tên: ${name}`,
    `- Điện thoại: ${phone}`,
    '',
    'SẢN PHẨM',
    ...items.map(i => `- ${i.name}${i.unit ? ` (${i.unit})` : ''} x${i.quantity}: ${fmtPrice(i.price, i.quantity)}`),
    '',
  ];
  const knownTotal = items.filter(i => i.price > 0).reduce((s, i) => s + i.price * i.quantity, 0);
  const hasContact = items.some(i => !i.price);
  lines.push(`Tạm tính: ${knownTotal > 0 ? knownTotal.toLocaleString('vi-VN') + 'đ' : ''}${hasContact ? (knownTotal > 0 ? ' + Liên hệ' : 'Liên hệ') : ''}`);
  if (notes.trim()) lines.push(`Ghi chú: ${notes.trim()}`);
  return lines.join('\n');
}

export default function GioHangPage() {
  const { items, totalItems, totalPrice, updateQty, removeItem, clearCart } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({ name: '', phone: '', notes: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState('');
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [orderText, setOrderText] = useState('');
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved profile
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        setForm(f => ({ ...f, name: p.name || '', phone: p.phone || '' }));
      }
    } catch {}
  }, []);

  // Rebuild order text whenever step 2 is entered
  useEffect(() => {
    if (step === 2) setOrderText(buildOrderText(form.name, form.phone, form.notes, items, totalPrice));
  }, [step]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const knownTotal = items.filter(i => i.price > 0).reduce((s, i) => s + i.price * i.quantity, 0);
  const hasContact = items.some(i => !i.price);

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên.';
    if (!form.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleContinue(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleConfirm() {
    setStatus('submitting'); setSubmitError('');
    const { data: { session } } = await createClient().auth.getSession();
    const user = session?.user ?? null;

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        address: null,
        email: null,
        notes: form.notes.trim() || null,
        items,
        total: totalPrice,
        user_id: user?.id ?? null,
      }),
    });

    if (!res.ok) { setSubmitError('Có lỗi xảy ra, vui lòng thử lại.'); setStatus('idle'); return; }
    const data = await res.json();

    try { localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: form.name.trim(), phone: form.phone.trim() })); } catch {}

    const snapshot = [...items];
    const total = totalPrice;
    clearCart();
    setOrderResult({ id: data.orderId, customer_name: form.name.trim(), phone: form.phone.trim(), items: snapshot, total });
    setStatus('done');
  }

  function copyText() {
    navigator.clipboard.writeText(orderText).then(() => {
      setToast(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(false), 2200);
    });
  }

  const zaloUrl = `https://zalo.me/${ZALO_NUMBER}`;

  // ── SUCCESS ──
  if (status === 'done' && orderResult) return (
    <main className={s.page}>
      <div className="container">
        <div className={s.success}>
          <div className={s.successHead}>
            <span className={s.successIcon}><i className="ti ti-circle-check-filled"></i></span>
            <div>
              <h1 className={s.successTitle}>Đặt hàng thành công!</h1>
              <p className={s.successSub}>Chúng tôi sẽ liên hệ <strong>{orderResult.phone}</strong> để xác nhận đơn.</p>
            </div>
          </div>

          <div className={s.successId}>
            <span>Mã đơn hàng</span>
            <strong>#{orderResult.id.slice(0, 8).toUpperCase()}</strong>
          </div>

          <div className={s.successItems}>
            <p className={s.successItemsTitle}>Sản phẩm đã đặt</p>
            {orderResult.items.map(item => (
              <div key={item.id} className={s.successItem}>
                {item.image_url
                  ? <Image src={item.image_url} alt={item.name} width={56} height={56} className={s.successItemImg} style={{ objectFit: 'contain' }} />
                  : <div className={s.successItemImgPh}><i className="ti ti-package"></i></div>}
                <div className={s.successItemInfo}>
                  <span className={s.successItemName}>{item.name}</span>
                  {item.unit && <span className={s.successItemUnit}>{item.unit}</span>}
                </div>
                <span className={s.successItemQty}>×{item.quantity}</span>
                <span className={s.successItemPrice}>{fmtPrice(item.price, item.quantity)}</span>
              </div>
            ))}
            <div className={s.successTotal}>
              <span>Tổng cộng</span>
              <strong>{knownTotal > 0 ? knownTotal.toLocaleString('vi-VN') + 'đ' : ''}{hasContact ? (knownTotal > 0 ? ' + Liên hệ' : 'Liên hệ') : ''}</strong>
            </div>
          </div>

          <div className={s.successActions}>
            <Link href="/nguyen-lieu" className="btn btn-primary"><i className="ti ti-package"></i> Tiếp tục mua sắm</Link>
            <Link href="/" className="btn btn-outline"><i className="ti ti-home"></i> Về trang chủ</Link>
          </div>
        </div>
      </div>
    </main>
  );

  // ── EMPTY CART ──
  if (items.length === 0) return (
    <main className={s.page}>
      <div className="container">
        <div className={s.emptyCart} style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' }}>
          <div className={s.emptyIcon}><i className="ti ti-shopping-cart-off"></i></div>
          <h2>Giỏ hàng trống</h2>
          <p>Thêm sản phẩm vào giỏ để đặt hàng nhé.</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginTop:8 }}>
            <Link href="/nguyen-lieu" className="btn btn-primary"><i className="ti ti-package"></i> Xem nguyên liệu</Link>
            <Link href="/dung-cu" className="btn btn-outline"><i className="ti ti-tool"></i> Xem dụng cụ</Link>
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <main className={s.page}>
      {/* ── HEAD ── */}
      <div className={s.checkoutHead}>
        <div className="container">
          <nav className={s.breadcrumb}>
            <Link href="/">Trang Chủ</Link>
            <span>›</span>
            <span>Giỏ Hàng</span>
            {step === 2 && <><span>›</span><span>Xác Nhận</span></>}
          </nav>
          <h1 className={s.h1}>{step === 1 ? 'Giỏ hàng.' : 'Xác nhận đơn.'}</h1>
          <p className={s.lead}>
            {step === 1
              ? 'Kiểm tra sản phẩm, điền thông tin liên hệ và tiến hành xác nhận.'
              : 'Sao chép nội dung đơn hàng và gửi qua Zalo — nhân viên sẽ xác nhận và hỗ trợ thanh toán.'}
          </p>
          <div className={s.steps}>
            <div className={`${s.step} ${step >= 1 ? s.stepActive : ''}`} />
            <div className={`${s.step} ${step >= 2 ? s.stepActive : ''}`} />
          </div>
        </div>
      </div>

      <div className={s.section}>
        <div className="container">

          {/* ══ STEP 1 ══ */}
          {step === 1 && (
            <form onSubmit={handleContinue} noValidate>
              <div className={s.grid}>
                {/* LEFT */}
                <div>
                  {/* Cart items */}
                  <div className={s.panel}>
                    <div className={s.panelHead}>
                      <h2>{totalItems} sản phẩm</h2>
                      <button type="button" className={s.clearBtn} onClick={clearCart}>Xóa tất cả</button>
                    </div>
                    {items.map(item => (
                      <div key={item.id} className={s.cartItem}>
                        {item.image_url
                          ? <Image src={item.image_url} alt={item.name} width={80} height={80} className={s.cartImg} style={{ objectFit: 'contain' }} />
                          : <div className={s.cartImgPh}><i className="ti ti-package"></i></div>}
                        <div className={s.cartCopy}>
                          <h3>{item.name}</h3>
                          {item.unit && <p>{item.unit}</p>}
                          <span className={`${s.cartPrice}${!item.price ? ` ${s.cartPriceContact}` : ''}`}>
                            {fmtPrice(item.price, item.quantity)}
                          </span>
                        </div>
                        <div className={s.cartActions}>
                          <div className={s.qty}>
                            <button type="button" className={s.qtyBtn} onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                            <span className={s.qtyNum}>{item.quantity}</span>
                            <button type="button" className={s.qtyBtn} onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                          </div>
                          <button type="button" className={s.removeBtn} onClick={() => removeItem(item.id)}>Xóa</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contact form */}
                  <div className={`${s.panel} ${s.formPanel}`}>
                    <h2>Thông tin liên hệ</h2>
                    <p className={s.formLead}>Chúng tôi sẽ liên hệ xác nhận đơn và trao đổi phương thức thanh toán.</p>
                    <div className={s.formGrid}>
                      <div className={s.field}>
                        <label>Họ và tên <span className={s.required}>*</span></label>
                        <input type="text" placeholder="Nguyễn Văn A" value={form.name} onChange={set('name')}
                          style={errors.name ? { borderColor: '#ef4444' } : undefined} />
                        {errors.name && <span className={s.fieldError}>{errors.name}</span>}
                      </div>
                      <div className={s.field}>
                        <label>Số điện thoại <span className={s.required}>*</span></label>
                        <input type="tel" placeholder="0912 345 678" value={form.phone} onChange={set('phone')}
                          style={errors.phone ? { borderColor: '#ef4444' } : undefined} />
                        {errors.phone && <span className={s.fieldError}>{errors.phone}</span>}
                      </div>
                      <div className={`${s.field} ${s.fieldFull}`}>
                        <label>Ghi chú</label>
                        <textarea placeholder="Giao giờ hành chính, gọi trước khi giao..." value={form.notes} onChange={set('notes')} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — summary */}
                <div className={s.summary}>
                  <h2>Tóm tắt đơn</h2>
                  <div className={s.summaryLine}>
                    <span>Số sản phẩm</span>
                    <strong>{totalItems} sản phẩm</strong>
                  </div>
                  {knownTotal > 0 && (
                    <div className={s.summaryLine}>
                      <span>Tạm tính</span>
                      <strong>{knownTotal.toLocaleString('vi-VN')}đ</strong>
                    </div>
                  )}
                  <div className={s.summaryTotal}>
                    <span>Tổng cộng</span>
                    <strong>
                      {knownTotal > 0 ? knownTotal.toLocaleString('vi-VN') + 'đ' : ''}
                      {hasContact ? (knownTotal > 0 ? ' + Liên hệ' : 'Liên hệ') : ''}
                    </strong>
                  </div>
                  {hasContact && (
                    <div className={s.summaryNote}>
                      Một số sản phẩm cần liên hệ để xác nhận giá. Nhân viên sẽ tư vấn sau khi nhận đơn.
                    </div>
                  )}
                  <div className={s.summaryActions}>
                    <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}>
                      Tiếp tục xác nhận <i className="ti ti-arrow-right"></i>
                    </button>
                    <a href={zaloUrl} target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline" style={{ width:'100%', justifyContent:'center', display:'flex', alignItems:'center', gap:8 }}>
                      <i className="ti ti-brand-zalo"></i> Hỏi qua Zalo
                    </a>
                  </div>
                  <div className={s.summarySecure}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span>Thông tin của bạn được bảo mật. Chúng tôi không lưu thẻ hay mật khẩu.</span>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* ══ STEP 2 ══ */}
          {step === 2 && (
            <div>
              <div className={`${s.panel} ${s.orderShell}`}>
                {/* Review info */}
                <div className={s.orderPanel}>
                  <h2>Thông tin đơn hàng</h2>
                  <p>Kiểm tra lại trước khi gửi.</p>
                  <div className={s.reviewList}>
                    <div className={s.reviewRow}><span>Họ tên</span><strong>{form.name}</strong></div>
                    <div className={s.reviewRow}><span>Điện thoại</span><strong>{form.phone}</strong></div>
                    <div className={s.reviewRow}><span>Số sản phẩm</span><strong>{totalItems} sản phẩm</strong></div>
                    <div className={s.reviewRow}>
                      <span>Tổng cộng</span>
                      <strong>
                        {knownTotal > 0 ? knownTotal.toLocaleString('vi-VN') + 'đ' : ''}
                        {hasContact ? (knownTotal > 0 ? ' + Liên hệ' : 'Liên hệ') : ''}
                      </strong>
                    </div>
                    {form.notes && <div className={s.reviewRow}><span>Ghi chú</span><strong style={{ fontWeight:400 }}>{form.notes}</strong></div>}
                  </div>
                  <button className="btn btn-outline" style={{ marginTop:20, width:'100%', justifyContent:'center' }}
                    onClick={() => setStep(1)}>
                    <i className="ti ti-arrow-left"></i> Quay lại chỉnh sửa
                  </button>
                </div>

                {/* Order text + actions */}
                <div className={s.orderPanel}>
                  <h2>Nội dung gửi Zalo</h2>
                  <p>Sao chép nội dung bên dưới và gửi qua Zalo để đặt hàng.</p>
                  <textarea className={s.orderText} value={orderText} onChange={e => setOrderText(e.target.value)} />
                  <div className={s.orderActions}>
                    <button type="button" className="btn btn-primary" onClick={copyText}>
                      <i className="ti ti-copy"></i> Sao chép nội dung
                    </button>
                    <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline"
                      style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
                      <i className="ti ti-brand-zalo"></i> Mở Zalo gửi đơn
                    </a>
                    <a href={`tel:${ZALO_NUMBER}`} className="btn btn-outline"
                      style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
                      <i className="ti ti-phone"></i> Gọi ngay
                    </a>
                  </div>
                  {submitError && <div className={s.error}><i className="ti ti-alert-circle"></i> {submitError}</div>}
                  <button className="btn btn-primary" disabled={status === 'submitting'}
                    onClick={handleConfirm}
                    style={{ marginTop:16, width:'100%', justifyContent:'center', background:'var(--accent)', borderColor:'var(--accent)' }}>
                    {status === 'submitting'
                      ? <><i className="ti ti-loader-2 spin"></i> Đang gửi...</>
                      : <><i className="ti ti-check"></i> Xác nhận đặt hàng</>}
                  </button>
                </div>
              </div>

              {/* Next steps */}
              <div className={s.nextSteps}>
                <h2>Điều gì xảy ra tiếp theo?</h2>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
                  {[
                    { icon:'ti-copy', title:'Sao chép & gửi Zalo', desc:'Dán nội dung vào Zalo và gửi cho nhân viên.' },
                    { icon:'ti-phone', title:'Nhân viên liên hệ', desc:'Chúng tôi xác nhận đơn và tư vấn thanh toán trong vòng 1–2 giờ.' },
                    { icon:'ti-truck', title:'Nhận hàng', desc:'Đơn được xử lý và giao theo thỏa thuận.' },
                  ].map(step => (
                    <div key={step.title} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                      <span style={{ width:36, height:36, borderRadius:10, background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--accent)' }}>
                        <i className={`ti ${step.icon}`}></i>
                      </span>
                      <div>
                        <strong style={{ display:'block', fontSize:'.9rem', marginBottom:3 }}>{step.title}</strong>
                        <span style={{ fontSize:'.8rem', color:'var(--text-3)', lineHeight:1.5 }}>{step.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <div className={`${s.toast}${toast ? ` ${s.toastShow}` : ''}`}>
        <i className="ti ti-check"></i> Đã sao chép!
      </div>
    </main>
  );
}
