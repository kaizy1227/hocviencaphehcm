'use client';
import { useEffect, useRef, useState, FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import s from './page.module.css';

const LOCATIONS = [
  { group: 'Chi nhánh Học Viện Cà Phê', options: [
    { value: 'Hồ Chí Minh', label: '🏙 Hồ Chí Minh (Chi nhánh HCM)' },
    { value: 'Hà Nội', label: '🏛 Hà Nội (Chi nhánh Hà Nội)' },
  ]},
  { group: 'Miền Nam', options: [
    { value: 'Bình Dương', label: 'Bình Dương' }, { value: 'Đồng Nai', label: 'Đồng Nai' },
    { value: 'Long An', label: 'Long An' }, { value: 'Tiền Giang', label: 'Tiền Giang' },
    { value: 'Vũng Tàu', label: 'Vũng Tàu' }, { value: 'Cần Thơ', label: 'Cần Thơ' },
  ]},
  { group: 'Miền Trung', options: [
    { value: 'Đà Nẵng', label: 'Đà Nẵng' }, { value: 'Huế', label: 'Huế' },
    { value: 'Nha Trang', label: 'Nha Trang' }, { value: 'Đà Lạt', label: 'Đà Lạt' },
    { value: 'Quy Nhơn', label: 'Quy Nhơn' },
  ]},
  { group: 'Miền Bắc', options: [
    { value: 'Hải Phòng', label: 'Hải Phòng' }, { value: 'Hải Dương', label: 'Hải Dương' },
    { value: 'Bắc Ninh', label: 'Bắc Ninh' }, { value: 'Nam Định', label: 'Nam Định' },
  ]},
];

function LienHeForm() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
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
    const { error: err } = await createClient().from('leads').insert({ name, phone, course, location, ghi_chu });
    setSending(false);
    if (err) { setError('Có lỗi xảy ra, vui lòng thử lại hoặc nhắn Zalo.'); return; }
    void fetch('/api/notify-lark', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, course, location, ghi_chu }) });
    setDone(true);
  }

  if (done) return (
    <div className="lh-success">
      <div className="lh-success-ico"><i className="ti ti-circle-check"></i></div>
      <h3>Đã nhận thông tin!</h3>
      <p>Đội ngũ Học Viện sẽ liên hệ lại với bạn trong vòng 30 phút.</p>
      <a href="https://zalo.me/0834790555" target="_blank" rel="noopener" className="lh-zalo-btn">
        <i className="ti ti-brand-zalo"></i> Nhắn ngay qua Zalo
      </a>
    </div>
  );

  return (
    <form className="lh-form" onSubmit={handleSubmit} noValidate>
      <div className="lh-field">
        <label>Họ và tên <span>*</span></label>
        <input type="text" placeholder="Ví dụ: Nguyễn Văn An" required ref={nameRef} />
      </div>
      <div className="lh-field">
        <label>Số điện thoại <span>*</span></label>
        <input type="tel" placeholder="Ví dụ: 0901 234 567" required ref={phoneRef} inputMode="numeric" />
      </div>
      <div className="lh-field">
        <label>Khu vực của bạn <span>*</span></label>
        <select required ref={locationRef} defaultValue="">
          <option value="" disabled>-- Chọn tỉnh / thành phố --</option>
          {LOCATIONS.map(g => (
            <optgroup key={g.group} label={g.group}>
              {g.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </optgroup>
          ))}
          <option value="Tỉnh / Thành khác">Tỉnh / Thành khác</option>
        </select>
      </div>
      <div className="lh-field">
        <label>Bạn quan tâm đến khóa học / dịch vụ nào? <span>*</span></label>
        <select required ref={courseRef} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} defaultValue="">
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
      <div className="lh-field">
        <label>Ghi chú (nếu có)</label>
        <textarea placeholder="Ví dụ: Muốn học cuối tuần, có thể học online không?..." rows={3} ref={ghichuRef} style={{ resize: 'vertical' }} />
      </div>
      {error && <p className="lh-error"><i className="ti ti-alert-circle"></i> {error}</p>}
      <button type="submit" className="lh-submit" disabled={sending}>
        {sending ? <><i className="ti ti-loader-2 spin"></i> Đang gửi...</> : <><i className="ti ti-send"></i> Gửi thông tin</>}
      </button>
    </form>
  );
}

const WHY_CARDS = [
  { icon: '☕', title: 'Đào tạo thực chiến', desc: 'Không lý thuyết suông. Thực hành 100% trong mỗi buổi học.' },
  { icon: '📈', title: 'Cập nhật xu hướng', desc: 'Menu 200+ công thức, bám sát thị trường. Luôn cập nhật hot trend mới nhất.' },
  { icon: '👥', title: 'Phòng học rộng rãi', desc: 'Giảng viên kèm sát từng học viên, đảm bảo không gian thực hành.' },
  { icon: '🤝', title: 'Đồng hành dài hạn', desc: 'Hỗ trợ setup menu, vận hành, khai trương. Không chỉ là một khóa học ngắn hạn.' },
];

const COMMIT_CARDS = [
  {
    icon: 'ti-refresh',
    title: 'Học lại miễn phí trong 12 tháng',
    desc: 'Chưa vững tay? Quay lại ôn buổi bất kỳ trong 1 năm — không đóng lại học phí, chỉ phụ phí nguyên liệu và phòng học cho buổi ôn.',
  },
  {
    icon: 'ti-book-2',
    title: 'Công thức cập nhật trọn đời',
    desc: 'Truy cập kho 200+ công thức định lượng rõ ràng, được bổ sung món hot-trend mới liên tục — dùng lâu dài, không giới hạn thời gian.',
  },
  {
    icon: 'ti-users',
    title: 'Lớp nhỏ, kèm sát tại quầy',
    desc: 'Mỗi lớp chỉ 3–4 học viên, đứng trực tiếp tại quầy với nguyên liệu thật, giảng viên sửa tay ngay đến khi bạn làm được thật.',
  },
  {
    icon: 'ti-heart-handshake',
    title: 'Đồng hành sau khóa học',
    desc: 'Hết khóa không phải là hết hỗ trợ — tư vấn menu, giá vốn, thiết bị và kế hoạch khai trương khi bạn mở quán.',
  },
];

export default function GioiThieuPage() {
  return (
    <div className={s.page}>

      {/* ===== HERO ===== */}
      <section className={s.hero} aria-labelledby="hero-title">
        <div className="container">
          <div className={s.heroGrid}>

            {/* Text side */}
            <div>
              <nav className={s.breadcrumb} aria-label="Breadcrumb">
                <Link href="/">Trang Chủ</Link>
                <span className={s.breadSep} aria-hidden="true">›</span>
                <span aria-current="page">Giới Thiệu</span>
              </nav>

              <h1 id="hero-title" className={s.heroH1}>
                Nơi Khởi Nguồn<br />
                <span className={s.accent}>Kinh Doanh</span><br />
                Của Bạn
              </h1>

              <p className={s.heroLead}>
                Học Viện Cà Phê HCM đã đồng hành cùng hơn 5.000 học viên — từ ngày đầu chưa biết gì về pha chế đến khi tự tin đứng quầy hoặc mở quán riêng.
              </p>

              <div className={s.chipRow} role="list" aria-label="Số liệu nổi bật">
                <span className={s.chip} role="listitem"><span className={s.chipNum}>11</span>Khóa &amp; chuyên đề</span>
                <span className={s.chip} role="listitem"><span className={s.chipNum}>200+</span>Công thức đồ uống</span>
                <span className={s.chip} role="listitem"><span className={s.chipNum}>10+</span>Năm kinh nghiệm</span>
                <span className={s.chip} role="listitem"><span className={s.chipNum}>1000+</span>Quán được hỗ trợ</span>
              </div>

              <div className={s.heroCtas}>
                <a href="#lien-he" className={`${s.btn} ${s.btnCyan}`}>
                  <i className="ti ti-calendar-check"></i> Đăng Ký Tư Vấn
                </a>
                <Link href="/#courses" className={`${s.btn} ${s.btnNavy}`}>
                  <i className="ti ti-book"></i> Xem Khóa Học
                </Link>
                <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className={`${s.btn} ${s.btnGhost}`}>
                  <i className="ti ti-cup"></i> Đến thử món trực tiếp
                </a>
              </div>
            </div>

            {/* Photo side */}
            <figure className={s.heroPhoto} aria-hidden="true">
              <div className={s.heroPhotoInner}>
                <img
                  src="/images/gallery/Life-styles-with-person/~12573.webp"
                  alt="Học viên thực hành tại Học Viện Cà Phê HCM"
                  loading="eager"
                />
              </div>
              <span className={s.heroSticker}>✦ từ HCM với ❤</span>
              <span className={s.heroTag}>pha chế thực chiến</span>
            </figure>

          </div>
        </div>
      </section>

      {/* ===== WHY ===== */}
      <section className={`${s.section} ${s.sectionAlt}`} aria-labelledby="why-title">
        <div className="container">
          <div className={s.sectionHead}>
            <span className={s.eyebrow}>Vì sao chọn Học Viện</span>
            <h2 id="why-title">Bốn điều làm nên<br />cách Học Viện đào tạo</h2>
            <p>Học thật, làm được thật — và vẫn có người bên cạnh sau khi khóa học kết thúc.</p>
          </div>
          <div className={s.whyGrid}>
            {WHY_CARDS.map(c => (
              <article className={s.whyCard} key={c.title}>
                <div className={s.whyIcon} aria-hidden="true">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAM KẾT ===== */}
      <section className={s.commitSection} aria-labelledby="commit-title">
        <div className="container">
          <div className={s.sectionHead}>
            <span className={s.eyebrow}>Cam kết Học Viện</span>
            <h2 id="commit-title">Điều bạn nhận được<br />không chỉ là một khóa học</h2>
            <p>Những cam kết rõ ràng, đo được — để bạn yên tâm học và yên tâm bắt đầu.</p>
          </div>
          <div className={s.commitGrid}>
            {COMMIT_CARDS.map(c => (
              <article className={s.commitCard} key={c.title}>
                <span className={s.commitIcon} aria-hidden="true"><i className={`ti ${c.icon}`}></i></span>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE / STORY ===== */}
      <section className={s.section} aria-labelledby="story-title">
        <div className="container">
          <div className={s.sectionHead}>
            <span className={s.eyebrow}>Câu chuyện &amp; phương pháp</span>
            <h2 id="story-title">Hành trình<br />của chúng tôi và của bạn</h2>
            <p>Từ câu hỏi khởi đầu đến hơn 1.000 quán được đồng hành trên cả nước — đây là hành trình của Học Viện Cà Phê HCM.</p>
          </div>

          <div className={s.timeline}>

            {/* 01 — visual left, body right */}
            <article className={s.tlBlock}>
              <figure className={s.tlVisual}>
                <img src="/images/gallery/Life-styles-with-person/~12405.webp" alt="" loading="lazy" />
                <span className={s.tlNum} aria-hidden="true">01</span>
              </figure>
              <div className={s.tlBody}>
                <span className={s.eyebrow}>01 — Câu Chuyện Của Chúng Tôi</span>
                <h3>Từ Một Câu Hỏi Đơn Giản</h3>
                <p>Chúng tôi bắt đầu từ một câu hỏi lặp đi lặp lại: <em>vì sao nhiều bạn trẻ đam mê mở quán nhưng lại đóng cửa chỉ sau vài tháng?</em> Phần lớn không phải vì thiếu nhiệt huyết — mà vì thiếu nền tảng thực chiến về sản phẩm, vận hành và tài chính.</p>
                <blockquote className={s.tlQuote}>"Chúng tôi mong được góp phần rút ngắn hành trình ấy — để bạn có thể bắt đầu đúng hướng, đi xa hơn và xây dựng bền vững hơn."</blockquote>
              </div>
            </article>

            {/* 02 — body left, visual right */}
            <article className={`${s.tlBlock} ${s.tlBlockEven}`}>
              <figure className={s.tlVisual}>
                <img src="/images/gallery/Life-styles-with-person/~12432.webp" alt="" loading="lazy" />
                <span className={s.tlNum} aria-hidden="true">02</span>
              </figure>
              <div className={s.tlBody}>
                <span className={s.eyebrow}>02 — Phương Pháp Đào Tạo</span>
                <h3>Học Thực Chiến Không Lý Thuyết Suông</h3>
                <p>Mỗi buổi học là một ca trực thực sự — bạn sẽ được đứng trực tiếp tại quầy, cân đo nguyên liệu, vận hành máy và pha lại cho đến khi thành thạo. Giảng viên không chỉ dạy <em>làm thế nào</em> mà giải thích <em>vì sao</em> với từng tỉ lệ, nhiệt độ và nguyên liệu. Lớp nhỏ, kèm sát, sửa tay ngay tại quầy.</p>
              </div>
            </article>

            {/* 03 — visual left, body right */}
            <article className={s.tlBlock}>
              <figure className={s.tlVisual}>
                <img src="/images/gallery/Life-styles-with-person/~12498.webp" alt="" loading="lazy" />
                <span className={s.tlNum} aria-hidden="true">03</span>
              </figure>
              <div className={s.tlBody}>
                <span className={s.eyebrow}>03 — Hành Trình Cùng Bạn</span>
                <h3>Đồng Hành Từ Ngày Đầu Đến Khi Thành Công</h3>
                <p>Sau khóa học, chúng tôi vẫn ở đây — cùng bạn thiết kế menu, cân đối chi phí, tư vấn thiết bị, lên kế hoạch soft-opening và xử lý các tình huống thực tế sau khai trương. Không dừng ở ngày bế giảng — Học Viện vẫn ở đó khi bạn cần.</p>
                <blockquote className={s.tlQuote}>"Học Viện không chỉ hướng dẫn pha chế — mà trân trọng được góp sức cùng bạn xây dựng một quán cà phê thực sự vững bền."</blockquote>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <div className={s.statsBar} aria-label="Thống kê Học Viện">
        <div className="container">
          <div className={s.statsGrid}>
            <div><div className={s.statN}>5000<sup>+</sup></div><div className={s.statL}>Học viên<br/>đã hoàn thành</div></div>
            <div><div className={s.statN}>200<sup>+</sup></div><div className={s.statL}>Công thức<br/>đồ uống</div></div>
            <div><div className={s.statN}>11</div><div className={s.statL}>Khóa học<br/>&amp; chuyên đề</div></div>
            <div><div className={s.statN}>98<sup>%</sup></div><div className={s.statL}>Học viên hài lòng<br/>sau khóa học</div></div>
          </div>
        </div>
      </div>

      {/* ===== INSTRUCTORS — teaser ===== */}
      <section className={s.instrSection} aria-labelledby="instructor-title">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className={s.eyebrow}>Đội Ngũ Giảng Viên</span>
            <h2 id="instructor-title" style={{ fontSize: 'clamp(26px,3.6vw,46px)', fontWeight: 700, color: 'var(--gtn-navy, #263D5B)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 12px' }}>
              Người thầy,<br /><em style={{ color: 'var(--gtn-caramel-dark, #8f5d18)', fontStyle: 'italic' }}>người đồng hành</em>
            </h2>
            <p style={{ color: 'var(--gtn-muted, #5A6E84)', maxWidth: '580px', margin: '0 auto 32px', fontSize: '17px', lineHeight: 1.7 }}>
              Giảng viên tại Học Viện Cà Phê HCM đều có kinh nghiệm vận hành quán thực tế — họ dạy từ những gì đã làm, không từ giáo trình.
            </p>
          </div>

          {/* Avatar teaser row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginBottom: 36 }}>
            {[
              { name: 'Đoàn Hồng Liêm', role: '☕ Trưởng PĐT · Chuyên Gia Cà Phê', photo: '/images/giangvienLiem.webp' },
              { name: 'Bùi Trần Thiên Ân', role: '🍵 Chuyên Gia Sáng Tạo Đồ Uống', photo: '/images/giangvienAn.webp' },
            ].map(gv => (
              <div key={gv.name} style={{ textAlign: 'center' }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: '3px solid var(--gtn-caramel-soft, #fbf3e6)', boxShadow: '0 4px 16px rgba(0,0,0,.18)' }}>
                  <img src={gv.photo} alt={gv.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', marginBottom: 4 }}>{gv.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gtn-muted, #667a8c)' }}>{gv.role}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/giang-vien" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--gtn-caramel-dark, #8f5d18)' }}>
              <i className="ti ti-user-star"></i> Xem thông tin giảng viên
            </Link>
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className={`${s.section} ${s.sectionPaper}`} aria-labelledby="values-title">
        <div className="container">
          <div className={s.sectionHead}>
            <span className={s.eyebrow}>Giá trị Học Viện</span>
            <h2 id="values-title">Tầm nhìn · Sứ mệnh<br />Chất lượng thực chiến</h2>
            <p>Ba điều chúng tôi giữ vững — trong từng khóa học, từng công thức và từng buổi tư vấn.</p>
          </div>
          <div className={s.valGrid}>
            <article className={s.valCard}>
              <span className={s.valCardNum} aria-hidden="true">01</span>
              <div className={s.valIcon} aria-hidden="true">🎯</div>
              <h3>Tầm Nhìn</h3>
              <p>Trở thành điểm tựa đào tạo pha chế và tư vấn kinh doanh đáng tin cậy tại TP.HCM.</p>
            </article>
            <article className={s.valCard}>
              <span className={s.valCardNum} aria-hidden="true">02</span>
              <div className={s.valIcon} aria-hidden="true">❤️</div>
              <h3>Sứ Mệnh</h3>
              <p>Rút ngắn khoảng cách từ đam mê đến thực tế kinh doanh qua đào tạo bài bản và tư vấn tận tâm.</p>
            </article>
            <article className={s.valCard}>
              <span className={s.valCardNum} aria-hidden="true">03</span>
              <div className={s.valIcon} aria-hidden="true">🏆</div>
              <h3>Chất Lượng Thực Chiến</h3>
              <p>Mọi công thức, quy trình đều được đúc kết từ thực tế vận hành — không sao chép, không lý thuyết suông.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className={s.contactSection} id="lien-he" aria-labelledby="contact-title">
        <div className="container">
          <div className={s.sectionHead}>
            <span className={s.eyebrow}>Liên hệ</span>
            <h2 id="contact-title">Liên Hệ Với<br />Học Viện Cà Phê HCM</h2>
            <p>Để lại thông tin — đội ngũ tư vấn sẽ liên hệ trong vòng 30 phút (trong giờ làm việc).</p>
          </div>

          <div className={s.contactWrap}>
            {/* Info */}
            <aside>
              <h3 className={s.contactInfoHead}>Thông tin liên hệ</h3>
              <p className={s.contactInfoLead}>Hãy chọn kênh liên lạc thuận tiện nhất — chúng tôi phản hồi nhanh qua hotline &amp; Zalo.</p>
              <ul className={s.contactList}>
                <li>
                  <span className={s.contactIc} aria-hidden="true"><i className="ti ti-phone"></i></span>
                  <div><strong>Hotline</strong><br /><a href="tel:0834790555">0834.790.555</a></div>
                </li>
                <li>
                  <span className={s.contactIc} aria-hidden="true"><i className="ti ti-message-circle"></i></span>
                  <div><strong>Zalo</strong><br /><a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer">0834.790.555</a></div>
                </li>
                <li>
                  <span className={s.contactIc} aria-hidden="true"><i className="ti ti-map-pin"></i></span>
                  <div><strong>Địa chỉ</strong><br /><span>26/23 Nguyễn Minh Hoàng, P. Bảy Hiền, Tân Bình, TP.HCM</span></div>
                </li>
                <li>
                  <span className={s.contactIc} aria-hidden="true"><i className="ti ti-clock"></i></span>
                  <div><strong>Giờ làm việc</strong><br /><span>Thứ 2 – Thứ 7: 8h30 – 17h30</span></div>
                </li>
              </ul>
            </aside>

            {/* Form */}
            <div className={s.contactFormWrap}>
              <p className={s.contactFormHead}>Gửi thông tin tư vấn miễn phí</p>
              <LienHeForm />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className={s.ctaSection} aria-label="Kêu gọi đăng ký">
        <div className="container">
          <div className={s.ctaBanner}>
            <h2>Sẵn Sàng Bắt Đầu<br />Chưa?</h2>
            <p>Đăng ký tư vấn miễn phí — đội ngũ sẽ gợi ý lộ trình phù hợp với mục tiêu, ngân sách và khu vực của bạn.</p>
            <Link href="/dang-ky" className={s.ctaBtn}>
              <i className="ti ti-calendar-check"></i> Đăng Ký Tư Vấn Miễn Phí
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
