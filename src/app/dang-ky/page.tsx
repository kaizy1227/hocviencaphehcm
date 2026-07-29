'use client';
import { useState, useRef, FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import s from './page.module.css';

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
  { icon: 'ti-clock', text: 'Tư vấn viên liên hệ sớm nhất, trong giờ hành chính' },
  { icon: 'ti-currency-dong', text: 'Hoàn toàn miễn phí, không ràng buộc' },
  { icon: 'ti-school', text: 'Đến trực tiếp tham quan và thử nước miễn phí' },
  { icon: 'ti-headset', text: 'Hỗ trợ sau khóa học trọn đời' },
];

function DangKyForm() {
  const params = useSearchParams();
  const defaultCourse = params.get('course') ?? '';

  const [selectedCourse, setSelectedCourse] = useState(defaultCourse);
  const [formDone, setFormDone] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const nameRef     = useRef<HTMLInputElement>(null);
  const phoneRef    = useRef<HTMLInputElement>(null);
  const courseRef   = useRef<HTMLSelectElement>(null);
  const locationRef = useRef<HTMLSelectElement>(null);
  const ghichuRef   = useRef<HTMLTextAreaElement>(null);

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    const name     = nameRef.current?.value.trim();
    const phone    = phoneRef.current?.value.trim();
    const course   = courseRef.current?.value;
    const location = locationRef.current?.value;
    const ghi_chu  = ghichuRef.current?.value.trim() || null;
    if (!name || !phone || !course || !location) {
      setFormError('Vui lòng điền đầy đủ thông tin.'); return;
    }
    setFormSubmitting(true); setFormError('');
    const { error } = await createClient().from('leads').insert({ name, phone, course, location, ghi_chu });
    setFormSubmitting(false);
    if (error) { setFormError('Có lỗi xảy ra, vui lòng thử lại hoặc liên hệ Zalo.'); return; }
    void fetch('/api/notify-lark', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, course, location, ghi_chu }) });
    setFormDone(true);
  }

  if (formDone) return (
    <div className={s.success}>
      <div className={s.successIco}>🎉</div>
      <h3>Đăng ký thành công!</h3>
      <p>Cảm ơn bạn đã tin tưởng Học Viện Cà Phê HCM.<br />Tư vấn viên sẽ liên hệ trong vòng <strong>30 phút</strong>.</p>
      <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className={s.zaloBtn}>
        <i className="ti ti-brand-zalo"></i> Nhắn ngay qua Zalo
      </a>
    </div>
  );

  return (
    <>
      <p className={s.formTitle}>Thông tin đăng ký</p>
      <p className={s.formSub}>Vui lòng điền đầy đủ để nhận tư vấn hoàn toàn miễn phí.</p>
      <form onSubmit={submitForm} noValidate>
        <div className={s.fieldGroup}>
          <label className={s.label} htmlFor="f-name">Họ và Tên <em>*</em></label>
          <input className={s.input} type="text" id="f-name" placeholder="Ví dụ: Nguyễn Văn An" required ref={nameRef} />
        </div>
        <div className={s.fieldGroup}>
          <label className={s.label} htmlFor="f-phone">Số Điện Thoại <em>*</em></label>
          <input className={s.input} type="tel" id="f-phone" placeholder="Ví dụ: 0901 234 567" required ref={phoneRef} inputMode="numeric" />
        </div>
        <div className={s.fieldGroup}>
          <label className={s.label} htmlFor="f-location">Khu vực của bạn <em>*</em></label>
          <select className={s.select} id="f-location" required ref={locationRef} defaultValue="">
            <option value="" disabled>-- Chọn tỉnh / thành phố --</option>
            {LOCATIONS.map(g => (
              <optgroup key={g.group} label={g.group}>
                {g.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </optgroup>
            ))}
            <option value="Tỉnh / Thành khác">Tỉnh / Thành khác</option>
          </select>
        </div>
        <div className={s.fieldGroup}>
          <label className={s.label} htmlFor="f-course">Khóa học / dịch vụ bạn quan tâm <em>*</em></label>
          <select className={s.select} id="f-course" required ref={courseRef} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
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
        <div className={s.fieldGroup}>
          <label className={s.label} htmlFor="f-ghichu">Ghi chú (nếu có)</label>
          <textarea className={s.textarea} id="f-ghichu" placeholder="Ví dụ: Muốn học cuối tuần, có thể học online không?..." rows={3} ref={ghichuRef} />
        </div>
        {formError && <p className={s.formError}><i className="ti ti-alert-circle"></i> {formError}</p>}
        <button type="submit" className={s.submitBtn} disabled={formSubmitting}>
          {formSubmitting
            ? <><i className="ti ti-loader-2 spin"></i> Đang gửi...</>
            : <><i className="ti ti-send"></i> Tư Vấn Miễn Phí</>}
        </button>
        <p className={s.formNote}>
          <i className="ti ti-shield-check"></i> Thông tin được bảo mật — không chia sẻ với bên thứ ba.
        </p>
      </form>
    </>
  );
}

export default function DangKyPage() {
  return (
    <div className={s.page}>
      {/* ===== HERO: split grid ===== */}
      <section className={s.hero}>
        <div className="container">
          <div className={s.heroGrid}>

            {/* LEFT — pitch */}
            <div>
              <nav className={s.breadcrumb} aria-label="Breadcrumb">
                <Link href="/">Trang Chủ</Link>
                <span className={s.breadSep} aria-hidden="true">›</span>
                <span aria-current="page">Đăng Ký</span>
              </nav>

              <span className={s.eyebrow}>Tư Vấn Miễn Phí</span>

              <h1 className={s.heroH1}>
                Bắt Đầu Hành Trình<br />
                <em>Kinh Doanh Của Bạn</em>
              </h1>

              <p className={s.heroLead}>
                Để lại thông tin — tư vấn viên sẽ liên hệ <strong>sớm nhất, trong giờ hành chính</strong> để giải đáp mọi thắc mắc và đặt lịch học thử miễn phí.
              </p>

              {/* Stats chips */}
              <div className={s.chipRow}>
                <span className={s.chip}><span className={s.chipNum}>5000<sup style={{fontSize:'0.65em'}}>+</sup></span>Học viên</span>
                <span className={s.chip}><span className={s.chipNum}>10<sup style={{fontSize:'0.65em'}}>+</sup></span>Năm kinh nghiệm</span>
                <span className={s.chip}><span className={s.chipNum}>98<sup style={{fontSize:'0.65em'}}>%</sup></span>Hài lòng</span>
              </div>

              {/* Benefits */}
              <div className={s.benefits}>
                {BENEFITS.map(b => (
                  <div key={b.icon} className={s.benefit}>
                    <span className={s.benefitIco}><i className={`ti ${b.icon}`}></i></span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>

              {/* Contact shortcuts */}
              <div className={s.contactShortcuts}>
                <p>Hoặc liên hệ trực tiếp:</p>
                <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className={s.contactBtn}>
                  <i className="ti ti-brand-zalo"></i> Zalo: 0834 790 555
                </a>
                <a href="tel:0834790555" className={s.contactBtn}>
                  <i className="ti ti-phone"></i> Gọi ngay
                </a>
              </div>
            </div>

            {/* RIGHT — form */}
            <div className={s.formCard}>
              <Suspense>
                <DangKyForm />
              </Suspense>
            </div>

          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <div className={s.trustBar} aria-label="Thống kê Học Viện">
        <div className="container">
          <div className={s.trustGrid}>
            <div><div className={s.trustN}>5000<sup>+</sup></div><div className={s.trustL}>Học viên<br />đã hoàn thành</div></div>
            <div><div className={s.trustN}>200<sup>+</sup></div><div className={s.trustL}>Công thức<br />đồ uống</div></div>
            <div><div className={s.trustN}>11</div><div className={s.trustL}>Khóa học<br />&amp; chuyên đề</div></div>
            <div><div className={s.trustN}>98<sup>%</sup></div><div className={s.trustL}>Học viên hài lòng<br />sau khóa học</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
