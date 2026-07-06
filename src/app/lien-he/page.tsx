'use client';
import { useState, useRef, FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const LOCATIONS = [
  { group: 'Chi nhánh Học Viện Cà Phê', options: [
    { value: 'Hồ Chí Minh', label: '🏙 Hồ Chí Minh (Chi nhánh HCM)' },
    { value: 'Hà Nội', label: '🏛 Hà Nội (Chi nhánh Hà Nội)' },
  ]},
  { group: 'Miền Nam', options: [
    { value: 'Bình Dương', label: 'Bình Dương' },
    { value: 'Đồng Nai', label: 'Đồng Nai' },
    { value: 'Long An', label: 'Long An' },
    { value: 'Tiền Giang', label: 'Tiền Giang' },
    { value: 'Vũng Tàu', label: 'Vũng Tàu' },
    { value: 'Cần Thơ', label: 'Cần Thơ' },
  ]},
  { group: 'Miền Trung', options: [
    { value: 'Đà Nẵng', label: 'Đà Nẵng' },
    { value: 'Huế', label: 'Huế' },
    { value: 'Nha Trang', label: 'Nha Trang' },
    { value: 'Đà Lạt', label: 'Đà Lạt' },
    { value: 'Quy Nhơn', label: 'Quy Nhơn' },
  ]},
  { group: 'Miền Bắc', options: [
    { value: 'Hải Phòng', label: 'Hải Phòng' },
    { value: 'Hải Dương', label: 'Hải Dương' },
    { value: 'Bắc Ninh', label: 'Bắc Ninh' },
    { value: 'Nam Định', label: 'Nam Định' },
  ]},
];

export default function LienHePage() {
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const nameRef     = useRef<HTMLInputElement>(null);
  const phoneRef    = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLSelectElement>(null);
  const courseRef   = useRef<HTMLSelectElement>(null);
  const ghichuRef   = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const name     = nameRef.current?.value.trim();
    const phone    = phoneRef.current?.value.trim();
    const location = locationRef.current?.value;
    const course   = courseRef.current?.value;
    const ghi_chu  = ghichuRef.current?.value.trim() || null;

    if (!name || !phone || !location || !course) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.'); return;
    }
    setSending(true); setError('');
    const { error: dbErr } = await createClient().from('leads').insert({ name, phone, course, location, ghi_chu });
    setSending(false);
    if (dbErr) { setError('Có lỗi xảy ra, vui lòng thử lại hoặc liên hệ Zalo.'); return; }
    void fetch('/api/notify-lark', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, course, location, ghi_chu }) });
    setDone(true);
  }

  return (
    <main className="lh-page">
      {/* HERO */}
      <section className="lh-hero">
        <div className="container">
          <div className="nl-hero-crumb">
            <Link href="/">Trang Chủ</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
            <span>Liên Hệ</span>
          </div>
          <h1>Liên Hệ <em>với Chúng Tôi</em></h1>
          <p>Đặt câu hỏi, tư vấn khóa học, hoặc đặt hàng số lượng lớn — chúng tôi sẵn sàng hỗ trợ.</p>
        </div>
      </section>

      <div className="container">
        <div className="lh-layout">
          {/* FORM */}
          <div className="lh-form-wrap">
            <div className="form-card">
              {!done ? (
                <>
                  <p className="form-hed">Gửi tin nhắn cho chúng tôi</p>
                  <p className="form-sub">Điền thông tin và tư vấn viên sẽ liên hệ trong vòng 30 phút (giờ hành chính).</p>
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="fg">
                      <label className="fl-lbl" htmlFor="lh-name">Họ và Tên <em>*</em></label>
                      <input className="fi" type="text" id="lh-name" placeholder="Ví dụ: Nguyễn Văn An" required ref={nameRef} />
                    </div>
                    <div className="fg">
                      <label className="fl-lbl" htmlFor="lh-phone">Số Điện Thoại <em>*</em></label>
                      <input className="fi" type="tel" id="lh-phone" placeholder="Ví dụ: 0901 234 567" required ref={phoneRef} />
                    </div>
                    <div className="fg">
                      <label className="fl-lbl" htmlFor="lh-location">Khu vực của bạn <em>*</em></label>
                      <select className="fs" id="lh-location" required ref={locationRef} defaultValue="">
                        <option value="" disabled>-- Chọn tỉnh / thành phố --</option>
                        {LOCATIONS.map(g => (
                          <optgroup key={g.group} label={g.group}>
                            {g.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </optgroup>
                        ))}
                        <option value="Tỉnh / Thành khác">Tỉnh / Thành khác</option>
                      </select>
                    </div>
                    <div className="fg">
                      <label className="fl-lbl" htmlFor="lh-course">Bạn quan tâm đến khóa học / dịch vụ nào? <em>*</em></label>
                      <select className="fs" id="lh-course" required ref={courseRef} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                        <option value="" disabled>-- Chọn khóa học hoặc dịch vụ --</option>
                        <optgroup label="Khóa pha chế tổng hợp">
                          <option value="Tổng Hợp Truyền Thống">🧋 Tổng Hợp Truyền Thống (3 ngày · 5.2tr)</option>
                          <option value="Tổng Hợp Hiện Đại">🍵 Tổng Hợp Hiện Đại (4 ngày · 7.5tr)</option>
                          <option value="Cà Phê Máy Nâng Cao">☕ Cà Phê Máy Nâng Cao (3 ngày · 8.3tr)</option>
                        </optgroup>
                        <optgroup label="Chuyên đề lẻ (1 ngày)">
                          <option value="Cà Phê Máy Cơ Bản">Cà Phê Máy Cơ Bản (2.5tr)</option>
                          <option value="Trà Sữa Hiện Đại">Trà Sữa Hiện Đại (2.5tr)</option>
                          <option value="Trà Trái Cây & Matcha">Trà Trái Cây &amp; Matcha (2.5tr)</option>
                          <option value="Đá Xay & Sinh Tố">Đá Xay &amp; Sinh Tố (2.5tr)</option>
                          <option value="Trà Sữa Truyền Thống">Trà Sữa Truyền Thống (2.2tr)</option>
                          <option value="Cà Phê Phin – Đá Xay & Sữa Chua">Cà Phê Phin – Đá Xay &amp; Sữa Chua (2.2tr)</option>
                          <option value="Nâng Cấp Menu Nitro Soda">Nâng Cấp Menu Nitro Soda (2.5tr)</option>
                          <option value="Khóa Chọn Món Kèm 1-1">Khóa Chọn Món Kèm 1–1 (3tr)</option>
                        </optgroup>
                        <optgroup label="Gói kinh doanh">
                          <option value="Khóa Khởi Nghiệp">🚀 Khóa Khởi Nghiệp (4tr)</option>
                          <option value="Gói Set Up Menu">📋 Gói Set Up Menu (7tr)</option>
                          <option value="Đào Tạo Vận Hành">🏪 Đào Tạo Vận Hành (15tr)</option>
                        </optgroup>
                        <option value="Khác / Tư vấn thêm">💬 Khác / Tư vấn thêm</option>
                      </select>
                    </div>
                    <div className="fg">
                      <label className="fl-lbl" htmlFor="lh-ghichu">Ghi chú (nếu có)</label>
                      <textarea className="fi" id="lh-ghichu" placeholder="Ví dụ: Muốn học cuối tuần, có thể học online không?..." rows={3} ref={ghichuRef} style={{ resize: 'vertical' }} />
                    </div>
                    {error && <p className="f-error"><i className="ti ti-alert-circle"></i> {error}</p>}
                    <button type="submit" className="f-submit" disabled={sending}>
                      {sending
                        ? <><i className="ti ti-loader-2 spin"></i> Đang gửi...</>
                        : <><i className="ti ti-send"></i> Gửi tin nhắn</>}
                    </button>
                    <p className="f-note">
                      <i className="ti ti-shield-check" style={{ fontSize: '0.8rem', verticalAlign: 'middle' }}></i>
                      {' '}Thông tin được bảo mật tuyệt đối — không chia sẻ với bên thứ ba.
                    </p>
                  </form>
                </>
              ) : (
                <div className="f-ok" style={{ display: 'block' }}>
                  <div className="f-ok-ico">🎉</div>
                  <h3>Gửi thành công!</h3>
                  <p>Cảm ơn bạn. Tư vấn viên sẽ liên hệ trong vòng <strong>30 phút</strong>.</p>
                </div>
              )}
            </div>
          </div>

          {/* INFO */}
          <div className="lh-info">
            <h2 className="lh-section-title">Thông tin liên hệ</h2>
            <div className="lh-info-cards">
              <a href="tel:0834790555" className="lh-info-card">
                <div className="lh-info-icon lh-icon-phone"><i className="ti ti-phone"></i></div>
                <div><p className="lh-info-label">Hotline</p><p className="lh-info-value">0834.790.555</p></div>
              </a>
              <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className="lh-info-card">
                <div className="lh-info-icon lh-icon-zalo"><i className="ti ti-brand-wechat"></i></div>
                <div><p className="lh-info-label">Zalo</p><p className="lh-info-value">0834.790.555</p></div>
              </a>
              <a href="mailto:hocviencaphehcm@gmail.com" className="lh-info-card">
                <div className="lh-info-icon lh-icon-mail"><i className="ti ti-mail"></i></div>
                <div><p className="lh-info-label">Email</p><p className="lh-info-value">hocviencaphehcm@gmail.com</p></div>
              </a>
              <div className="lh-info-card">
                <div className="lh-info-icon lh-icon-clock"><i className="ti ti-clock"></i></div>
                <div><p className="lh-info-label">Giờ làm việc</p><p className="lh-info-value">Thứ 2 – Thứ 7 · 8h30 – 17h30</p></div>
              </div>
            </div>
            <div className="lh-branches">
              <div className="lh-branch">
                <p className="lh-branch-label"><i className="ti ti-map-pin"></i> Cơ sở 1 — TP.HCM</p>
                <a href="https://maps.app.goo.gl/gdSAqQAEifDbjzJZA" target="_blank" rel="noopener noreferrer" className="lh-branch-addr">
                  26/23 Nguyễn Minh Hoàng, P. Bảy Hiền, Q. Tân Bình
                </a>
              </div>
              <div className="lh-branch">
                <p className="lh-branch-label"><i className="ti ti-map-pin"></i> Cơ sở 2 — Hà Nội</p>
                <a href="https://maps.google.com/?q=8+Dương+Đình+Nghệ,+Cầu+Giấy,+Hà+Nội" target="_blank" rel="noopener noreferrer" className="lh-branch-addr">
                  8 Dương Đình Nghệ, Cầu Giấy, TP Hà Nội
                </a>
              </div>
            </div>
            <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <i className="ti ti-brand-zalo"></i> Chat Zalo ngay — phản hồi nhanh nhất
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
