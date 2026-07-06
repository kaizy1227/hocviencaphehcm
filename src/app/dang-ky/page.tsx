'use client';
import { useState, useRef, FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

const BENEFITS = [
  { icon: 'ti-clock', text: 'Tư vấn viên liên hệ trong vòng 30 phút' },
  { icon: 'ti-currency-dong', text: 'Hoàn toàn miễn phí, không ràng buộc' },
  { icon: 'ti-school', text: 'Học thử miễn phí trước khi quyết định' },
  { icon: 'ti-headset', text: 'Hỗ trợ sau khóa học trọn đời' },
];

function DangKyForm() {
  const params = useSearchParams();
  const defaultCourse = params.get('course') ?? '';

  const [selectedCourse, setSelectedCourse] = useState(defaultCourse);
  const [formDone, setFormDone] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const courseRef = useRef<HTMLSelectElement>(null);
  const locationRef = useRef<HTMLSelectElement>(null);
  const ghichuRef = useRef<HTMLTextAreaElement>(null);

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    const name = nameRef.current?.value.trim();
    const phone = phoneRef.current?.value.trim();
    const course = courseRef.current?.value;
    const location = locationRef.current?.value;
    const ghi_chu = ghichuRef.current?.value.trim() || null;
    if (!name || !phone || !course || !location) {
      setFormError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    setFormSubmitting(true);
    setFormError('');
    const supabase = createClient();
    const { error } = await supabase.from('leads').insert({ name, phone, course, location, ghi_chu });
    setFormSubmitting(false);
    if (error) { setFormError('Có lỗi xảy ra, vui lòng thử lại hoặc liên hệ Zalo.'); return; }
    void fetch('/api/notify-lark', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, course, location, ghi_chu }) });
    setFormDone(true);
  }

  return (
    <div className="form-card">
      {!formDone ? (
        <>
          <p className="form-hed">Thông tin đăng ký</p>
          <p className="form-sub">Vui lòng điền đầy đủ để nhận tư vấn hoàn toàn miễn phí.</p>
          <form onSubmit={submitForm} noValidate>
            <div className="fg">
              <label className="fl-lbl" htmlFor="f-name">Họ và Tên <em>*</em></label>
              <input className="fi" type="text" id="f-name" placeholder="Ví dụ: Nguyễn Văn An" required ref={nameRef} />
            </div>
            <div className="fg">
              <label className="fl-lbl" htmlFor="f-phone">Số Điện Thoại <em>*</em></label>
              <input className="fi" type="tel" id="f-phone" placeholder="Ví dụ: 0901 234 567" required ref={phoneRef} />
            </div>
            <div className="fg">
              <label className="fl-lbl" htmlFor="f-location">Khu vực của bạn <em>*</em></label>
              <select className="fs" id="f-location" required ref={locationRef} defaultValue="">
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
              <label className="fl-lbl" htmlFor="f-course">Bạn quan tâm đến khóa học / dịch vụ nào? <em>*</em></label>
              <select className="fs" id="f-course" required ref={courseRef} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
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
              <label className="fl-lbl" htmlFor="f-ghichu">Ghi chú (nếu có)</label>
              <textarea className="fi" id="f-ghichu" placeholder="Ví dụ: Muốn học cuối tuần, có thể học online không?..." rows={3} ref={ghichuRef} style={{ resize: 'vertical' }} />
            </div>
            {formError && <p className="f-error"><i className="ti ti-alert-circle"></i> {formError}</p>}
            <button type="submit" className="f-submit" disabled={formSubmitting}>
              {formSubmitting
                ? <><i className="ti ti-loader-2 spin"></i> Đang gửi...</>
                : <><i className="ti ti-send"></i> Tư Vấn Miễn Phí</>}
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
          <h3>Đăng ký thành công!</h3>
          <p>Cảm ơn bạn. Tư vấn viên sẽ liên hệ trong vòng <strong>30 phút</strong>.</p>
        </div>
      )}
    </div>
  );
}

export default function DangKyPage() {
  return (
    <>
      {/* HERO */}
      <section className="dk-hero">
        <div className="dk-hero-bg">
          <img src="/images/about.jpg" alt="Học Viện Cà Phê HCM" />
        </div>
        <div className="dk-hero-ov"></div>
        <div className="container">
          <div className="dk-hero-body">
            <span className="tag" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
              Tư Vấn Miễn Phí
            </span>
            <h1 className="dk-hero-title">Bắt Đầu Hành Trình<br /><em>Kinh Doanh Của Bạn</em></h1>
            <p className="dk-hero-sub">Để lại thông tin — tư vấn viên sẽ liên hệ trong vòng <strong>30 phút</strong> để giải đáp mọi thắc mắc và đặt lịch học thử miễn phí.</p>
            <div className="dk-benefits">
              {BENEFITS.map(b => (
                <div key={b.icon} className="dk-benefit">
                  <i className={`ti ${b.icon}`}></i>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="tag">Đăng Ký Ngay</span>
            <h2 className="title">Nhận Tư Vấn Hoàn Toàn Miễn Phí</h2>
            <p className="sub" style={{ maxWidth: '480px', margin: '0 auto' }}>
              Hơn <strong>500+ học viên</strong> đã tin tưởng và mở quán thành công sau khi học tại Học Viện Cà Phê HCM.
            </p>
          </div>
          <Suspense>
            <DangKyForm />
          </Suspense>
          <div className="dk-contact-alt">
            <p>Hoặc liên hệ trực tiếp:</p>
            <div className="dk-contact-links">
              <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <i className="ti ti-brand-whatsapp"></i> Zalo: 0834 790 555
              </a>
              <a href="tel:0834790555" className="btn btn-outline">
                <i className="ti ti-phone"></i> Gọi ngay
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
