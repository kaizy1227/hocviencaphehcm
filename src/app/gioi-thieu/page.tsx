'use client';
import { useEffect, useRef, useState, FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

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

export default function GioiThieuPage() {
  const baristaRef = useRef<HTMLDivElement>(null);
  const drinkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initObserver = (container: HTMLDivElement | null, cls: string) => {
      if (!container) return;
      const els = container.querySelectorAll<HTMLElement>(`.${cls}`);
      els.forEach((el, i) => { el.style.transitionDelay = `${(i % 6) * 0.07}s`; });
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.08 });
      els.forEach(el => obs.observe(el));
      return obs;
    };
    const obs1 = initObserver(baristaRef.current, 'barista-img');
    const obs2 = initObserver(drinkRef.current, 'drink-img');
    return () => { obs1?.disconnect(); obs2?.disconnect(); };
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="gt-hero">
        <div className="gt-hero-bg">
          <img src="/images/gallery/Life-styles-with-person/~12573.webp" alt="Học Viện Cà Phê" loading="eager" />
        </div>
        <div className="gt-hero-ov"></div>
        <div className="container">
          <div className="gt-hero-body">
            <div className="gt-hero-crumb">
              <Link href="/">Trang Chủ</Link>
              <i className="ti ti-chevron-right" style={{fontSize:'.75rem'}}></i>
              <span>Giới Thiệu</span>
            </div>
            <h1>Nơi Khởi Nguồn<br /><em>Kinh Doanh</em><br />Của Bạn</h1>
            <p className="gt-hero-sub">Mỗi giấc mơ về một quán cà phê đều bắt đầu từ một tách cà phê — và Học Viện Cà Phê HCM trân trọng được đồng hành cùng bạn trên từng bước của hành trình đó.</p>
            <div className="gt-hero-stats">
              <div className="gh-stat"><div className="gh-stat-n">11</div><div className="gh-stat-l">Khóa<br />&amp; chuyên đề</div></div>
              <div className="gh-stat"><div className="gh-stat-n">200<sup>+</sup></div><div className="gh-stat-l">Công thức<br />đồ uống</div></div>
              <div className="gh-stat"><div className="gh-stat-n">~10</div><div className="gh-stat-l">Năm<br />kinh nghiệm</div></div>
              <div className="gh-stat"><div className="gh-stat-n">1000<sup>+</sup></div><div className="gh-stat-l">Quán<br />được hỗ trợ</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY 1 */}
      <section className="story-block section" style={{background:'var(--white)'}}>
        <div className="container">
          <div className="story-grid">
            <div className="story-text">
              <span className="tag">Câu Chuyện Của Chúng Tôi</span>
              <div className="story-num">01</div>
              <h2 className="title">Từ Một Câu Hỏi<br />Đơn Giản</h2>
              <p>Học Viện Cà Phê HCM được hình thành từ một trăn trở rất thật: biết bao người trẻ đầy đam mê bước vào ngành F&amp;B với tất cả nhiệt huyết, nhưng chỉ sau vài tháng đã phải khép lại cánh cửa quán mình. Không phải vì thiếu vốn, không phải vì địa điểm chưa đủ đẹp — mà vì chưa có một nền tảng kiến thức vững chắc để đi tiếp.</p>
              <p>Câu hỏi cứ vương vấn mãi: <em>vì sao những kiến thức pha chế căn bản lại xa vời đến vậy với người mới bắt đầu?</em> Vì sao mỗi người đều phải tự mày mò một mình, rồi trả giá bằng những bài học đắt đỏ — trong khi hoàn toàn có thể được dẫn dắt bài bản ngay từ những bước đầu tiên?</p>
              <blockquote className="story-quote">Chúng tôi mong được góp phần rút ngắn hành trình ấy — để bạn có thể bắt đầu đúng hướng, đi xa hơn và xây dựng bền vững hơn.</blockquote>
            </div>
            <div className="story-img">
              <img src="/images/gallery/Life-styles-with-person/~12405.webp" alt="" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* STORY 2 */}
      <section className="story-block section" style={{background:'var(--bg-alt)'}}>
        <div className="container">
          <div className="story-grid rev">
            <div className="story-text">
              <span className="tag">Phương Pháp Đào Tạo</span>
              <div className="story-num">02</div>
              <h2 className="title">Học Thực Chiến<br />Không Lý Thuyết Suông</h2>
              <p>Mỗi buổi học tại Học Viện không chỉ là một buổi học — mà là một ca thực hành đích thực. Học viên trực tiếp tự tay thực hiện từng công thức đồ uống, từ cà phê espresso truyền thống, trà sữa, matcha đến đá xay và những xu hướng mới nhất của thị trường.</p>
              <p>Các giảng viên không chỉ hướng dẫn kỹ thuật — mà còn chia sẻ bản chất đằng sau mỗi công thức: <em>vì sao</em> tỉ lệ này mang lại sự cân bằng, vì sao nhiệt độ kia giữ trọn hương thơm, vì sao nguyên liệu này khi hòa quyện lại tạo nên một hương vị không thể nhầm lẫn. Khi thấu hiểu được bản chất, bạn không chỉ học theo — mà có thể tự sáng tạo nên công thức của riêng mình.</p>
              <p>Quy mô lớp nhỏ, hướng dẫn tận tình và theo sát từng học viên, phản hồi trực tiếp từ giảng viên nhiều năm kinh nghiệm vận hành thực tế — đó là điều Học Viện luôn gìn giữ, bởi chúng tôi tin rằng mỗi người xứng đáng được quan tâm đúng mức.</p>
            </div>
            <div className="story-img">
              <img src="/images/gallery/Life-styles-with-person/~12432.webp" alt="" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* STORY 3 */}
      <section className="story-block section" style={{background:'var(--white)'}}>
        <div className="container">
          <div className="story-grid">
            <div className="story-text">
              <span className="tag">Hành Trình Cùng Bạn</span>
              <div className="story-num">03</div>
              <h2 className="title">Đồng Hành<br />Từ Ngày Đầu Đến<br />Khi Thành Công</h2>
              <p>Hành trình không khép lại khi bạn rời lớp học. Đội ngũ Học Viện tiếp tục sát cánh cùng bạn qua từng bước tiếp theo: hỗ trợ thiết kế menu phù hợp với thị trường, cân đối giá thành để đảm bảo lợi nhuận bền vững, tư vấn lựa chọn thiết bị phù hợp với nhu cầu và ngân sách.</p>
              <p>Từ những buổi đầu lên ý tưởng cho đến ngày khai trương, Học Viện luôn có mặt. Và ngay cả khi quán đã vận hành, khi bạn cần điều chỉnh menu hay tháo gỡ một vướng mắc trong vận hành — đội ngũ vẫn sẵn lòng lắng nghe và đồng hành.</p>
              <blockquote className="story-quote">Học Viện không chỉ hướng dẫn pha chế — mà trân trọng được góp sức cùng bạn xây dựng một quán cà phê thực sự vững bền.</blockquote>
            </div>
            <div className="story-img">
              <img src="/images/gallery/Life-styles-with-person/~12498.webp" alt="" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS DARK */}
      <div className="gt-stats">
        <div className="container">
          <div className="gt-stats-grid">
            <div className="gt-stat"><div className="gt-stat-n">500<sup>+</sup></div><div className="gt-stat-l">Học viên<br />đã hoàn thành</div></div>
            <div className="gt-stat"><div className="gt-stat-n">200<sup>+</sup></div><div className="gt-stat-l">Công thức<br />đồ uống</div></div>
            <div className="gt-stat"><div className="gt-stat-n">11</div><div className="gt-stat-l">Khóa học<br />&amp; chuyên đề</div></div>
            <div className="gt-stat"><div className="gt-stat-n">98<sup>%</sup></div><div className="gt-stat-l">Học viên hài lòng<br />sau khóa học</div></div>
          </div>
        </div>
      </div>

      {/* INSTRUCTORS */}
      <section className="section gv-section">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'48px'}}>
            <span className="tag">Đội Ngũ Giảng Viên</span>
            <h2 className="title">Học Từ Người Đã Làm<br /><em>Thực Chiến</em></h2>
            <p className="sub" style={{maxWidth:'580px', margin:'0 auto'}}>Mỗi giảng viên tại Học Viện đều đã trải qua hành trình thực tế — từ vận hành quán, xây dựng chuỗi đến thiết lập menu cho nhiều cơ sở — trước khi mang những kinh nghiệm ấy trở thành bài học chia sẻ cùng học viên.</p>
          </div>

          <div className="gv-list">

            {/* THẦY LIÊM — ảnh trái, nội dung phải */}
            <div className="gv-card2">
              <div className="gv-photo-side">
                <img src="/images/giangvienLiem.jpg" alt="Thầy Đoàn Hồng Liêm" />
              </div>
              <div className="gv-text-side">
                <div className="gv-hero-badges">
                  <span className="gv-badge">Trưởng PĐT Học Viện</span>
                  <span className="gv-badge">10 năm kinh nghiệm</span>
                  <span className="gv-badge">Cựu QL chuỗi Coffee</span>
                </div>
                <div className="gv-hero-name">Đoàn Hồng Liêm</div>
                <div className="gv-hero-role">☕ Trưởng Phòng Đào Tạo · Chuyên Gia Cà Phê</div>
                <p className="gv-hero-desc">
                  Gắn bó với ngành F&amp;B như một lẽ tự nhiên — và kể từ đó, chưa một lần rời bước.
                </p>
                <p className="gv-hero-desc">
                  Hành trình ấy bắt đầu từ vị trí barista rồi dần vươn lên quản lý tại nhiều chuỗi quán cà phê lớn, tích lũy qua từng ca làm, từng tách cà phê, từng đội nhóm được dẫn dắt. Những năm tháng ấy đã tôi luyện nên một người thầy không chỉ giỏi nghề, mà còn thấu hiểu nghề đến tận gốc rễ.
                </p>
                <p className="gv-hero-desc">
                  Hiện là <strong>Trưởng Phòng Đào Tạo</strong> tại Học Viện Cà Phê Chi Nhánh Miền Nam, Giảng viên Liêm đã trực tiếp xây dựng menu và hướng dẫn nhân sự cho hàng chục quán mới mở trải dài khắp cả nước — mỗi nơi anh đặt chân đến, đều để lại một dấu ấn khó phai.
                </p>
                <blockquote className="gv-hero-quote">
                  "Một ly cà phê ngon không bao giờ là ngẫu nhiên — đó là tích lũy của kỹ thuật và tâm huyết. Tôi muốn truyền trọn điều đó cho các bạn."
                </blockquote>
                <div className="gv-skills">
                  <span className="gv-skill-pill">☕ Cà phê máy & espresso</span>
                  <span className="gv-skill-pill">🔧 Vận hành quán</span>
                  <span className="gv-skill-pill">🍽️ Setup menu</span>
                  <span className="gv-skill-pill">👥 Đào tạo nhân sự</span>
                </div>
              </div>
            </div>

            {/* THẦY ÂN — nội dung trái, ảnh phải */}
            <div className="gv-card2 gv-card2-reverse">
              <div className="gv-text-side">
                <div className="gv-hero-badges">
                  <span className="gv-badge">Nền tảng Nghệ Thuật</span>
                  <span className="gv-badge">6 năm kinh nghiệm</span>
                  <span className="gv-badge">Cựu Trainer chuỗi trà sữa AiCha</span>
                </div>
                <div className="gv-hero-name">Bùi Trần Thiên Ân</div>
                <div className="gv-hero-role">🍵 Chuyên Gia Sáng Tạo Đồ Uống</div>
                <p className="gv-hero-desc">
                  Xuất thân từ mái trường <strong>Nghệ Thuật</strong>, Giảng viên Thiên Ân mang trong mình một gu thẩm mỹ riêng biệt — thứ ngôn ngữ không lời mà anh dùng để thổi linh hồn vào từng ly thức uống.
                </p>
                <p className="gv-hero-desc">
                  Trải qua 6 năm gắn bó với ngành F&amp;B, từng đảm nhận vai trò trainer cho chuỗi trà sữa AiCha ở thời điểm thương hiệu vươn tới gần 20 cửa hàng, anh tích lũy cho mình một kho công thức phong phú về <strong>trà trái cây, trà sữa</strong> nơi hương vị tinh tế hòa quyện cùng nghệ thuật trang trí bắt mắt.
                </p>
                <p className="gv-hero-desc">
                  Mỗi ly nước được chụp lại tại Học Viện đều do chính tay anh tạo ra và trình bày — một sự tỉ mỉ nho nhỏ, nhưng đủ để nói lên tất cả.
                </p>
                <blockquote className="gv-hero-quote">
                  "Người học nhanh nhất không phải người thông minh nhất — mà là người dám thử, dám sai và không bỏ cuộc."
                </blockquote>
                <div className="gv-skills">
                  <span className="gv-skill-pill">🍵 Trà trái cây & trà sữa</span>
                  <span className="gv-skill-pill">✨ Sáng tạo hot trend</span>
                  <span className="gv-skill-pill">🎨 Decor & trình bày</span>
                  <span className="gv-skill-pill">🍽️ Setup menu</span>
                </div>
              </div>
              <div className="gv-photo-side">
                <img src="/images/giangvienAn.jpg" alt="Thầy Bùi Trần Thiên Ân" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BARISTA GALLERY */}
      <section className="section" style={{background:'var(--bg-alt)'}}>
        <div className="container">
          <div style={{textAlign:'center'}}>
            <span className="tag">Con Người Học Viện</span>
            <h2 className="title">Giảng Viên &amp; Học Viên</h2>
            <p className="sub" style={{maxWidth:'520px', margin:'0 auto'}}>Mỗi người đến Học Viện mang theo một câu chuyện và một ước vọng riêng — chúng tôi trân trọng điều đó và nỗ lực đồng hành để cùng họ biến ước vọng ấy thành hiện thực.</p>
          </div>
          <div className="barista-grid" ref={baristaRef}>
            {['~12321.webp','~12555.webp','~12720.webp','~12816.webp','~12930.webp','~12573.webp','~12405.webp'].map(f => (
              <div className="barista-img" key={f}><img src={`/images/gallery/Life-styles-with-person/${f}`} alt="" loading="lazy" /></div>
            ))}
          </div>
        </div>
      </section>

      {/* DRINK GALLERY */}
      <section className="section" style={{background:'var(--white)'}}>
        <div className="container">
          <div style={{textAlign:'center'}}>
            <span className="tag">Menu Đồ Uống</span>
            <h2 className="title">Kho 200+ Công Thức<br />Thực Chiến</h2>
            <p className="sub" style={{maxWidth:'520px', margin:'0 auto'}}>Từ cà phê espresso truyền thống đến trà sữa, matcha và đá xay — mỗi công thức đều được chắt lọc và tinh chỉnh qua nhiều năm vận hành thực tế.</p>
          </div>
          <div className="drink-grid" ref={drinkRef}>
            {['~11447.webp','~11594_1.webp','~11783.webp','~11900.webp','~12219.webp','~12609.webp','~11675.webp'].map(f => (
              <div className="drink-img" key={f}><img src={`/images/gallery/Life-styles/${f}`} alt="" loading="lazy" /></div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section" style={{background:'var(--bg-alt)'}}>
        <div className="container">
          <div style={{textAlign:'center'}}>
            <span className="tag">Giá Trị Cốt Lõi</span>
            <h2 className="title">Tầm Nhìn &amp; Sứ Mệnh</h2>
            <p className="sub" style={{maxWidth:'520px', margin:'0 auto'}}>Những giá trị cốt lõi mà Học Viện Cà Phê luôn gìn giữ — là nền tảng định hướng mỗi bước đi và từng quyết định.</p>
          </div>
          <div className="val-grid">
            <div className="val-card">
              <div className="val-ico"><i className="ti ti-target"></i></div>
              <h3>Tầm Nhìn</h3>
              <p>Trở thành điểm tựa đào tạo pha chế và tư vấn kinh doanh đáng tin cậy tại TP.HCM — nơi mỗi học viên được trang bị kiến thức vững chắc và đủ tự tin để bước vào hành trình của riêng mình.</p>
            </div>
            <div className="val-card">
              <div className="val-ico"><i className="ti ti-heart"></i></div>
              <h3>Sứ Mệnh</h3>
              <p>Mong muốn được rút ngắn khoảng cách từ đam mê đến thực tế kinh doanh — qua chương trình đào tạo bài bản, sự tư vấn tận tâm và cam kết đồng hành lâu dài bên từng học viên.</p>
            </div>
            <div className="val-card">
              <div className="val-ico"><i className="ti ti-award"></i></div>
              <h3>Chất Lượng Thực Chiến</h3>
              <p>Mọi công thức, quy trình và kiến thức kinh doanh tại Học Viện đều được đúc kết từ thực tế vận hành — không sao chép, không lý thuyết suông. Đó là sự cam kết chúng tôi luôn gìn giữ với từng học viên.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LIÊN HỆ */}
      <section className="lh-section" id="lien-he">
        <div className="container">
          <div className="lh-inner">
            {/* LEFT — info */}
            <div className="lh-info">
              <span className="section-tag">Liên Hệ</span>
              <h2>Chúng Tôi<br />Sẵn Lòng Lắng Nghe</h2>
              <p>Hãy để lại thông tin hoặc nhắn qua Zalo — đội ngũ Học Viện sẽ liên hệ trong vòng 30 phút để lắng nghe và tư vấn cùng bạn.</p>
              <ul className="lh-contacts">
                <li><i className="ti ti-phone"></i><div><strong>Hotline</strong><a href="tel:0834790555">0834.790.555</a></div></li>
                <li><i className="ti ti-message-circle"></i><div><strong>Zalo</strong><a href="https://zalo.me/0834790555" target="_blank" rel="noopener">0834.790.555</a></div></li>
                <li><i className="ti ti-map-pin"></i><div><strong>Địa chỉ</strong><span>26/23 Nguyễn Minh Hoàng, P. Bảy Hiền, Tân Bình, TP.HCM</span></div></li>
                <li><i className="ti ti-clock"></i><div><strong>Giờ làm việc</strong><span>Thứ 2 – Thứ 7: 8h30 – 17h30</span></div></li>
              </ul>
            </div>
            {/* RIGHT — form */}
            <div className="lh-form-wrap">
              <p className="lh-form-hed">Gửi thông tin tư vấn miễn phí</p>
              <LienHeForm />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gt-cta">
        <div className="gt-cta-bg">
          <img src="/images/gallery/Life-styles-with-person/~12720.webp" alt="" loading="lazy" />
        </div>
        <div className="gt-cta-ov"></div>
        <div className="container">
          <div className="gt-cta-body">
            <span className="gt-cta-tag">Bắt Đầu Ngay Hôm Nay</span>
            <h2>Bắt Đầu Hành Trình<br />Của Bạn Từ Hôm Nay</h2>
            <p>Đặt lịch tư vấn miễn phí — đội ngũ Học Viện sẽ liên hệ trong vòng 30 phút để cùng bạn tìm ra lộ trình học tập phù hợp nhất.</p>
            <Link href="/dang-ky" className="cta-white"><i className="ti ti-calendar-check"></i> Đăng Ký Tư Vấn Miễn Phí</Link>
          </div>
        </div>
      </section>
    </>
  );
}
