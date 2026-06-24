'use client';
import { useEffect, useRef, useState, FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function LienHeForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) { setError('Vui lòng điền tên và số điện thoại.'); return; }
    setLoading(true); setError('');
    const supabase = createClient();
    const courseNote = message.trim() ? `Liên hệ chung: ${message.trim()}` : 'Liên hệ chung';
    const { error: err } = await supabase.from('leads').insert({ name: name.trim(), phone: phone.trim(), course: courseNote, location: 'Không rõ' });
    setLoading(false);
    if (err) { setError('Có lỗi xảy ra, vui lòng thử lại hoặc nhắn Zalo.'); return; }
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
    <form className="lh-form" onSubmit={handleSubmit}>
      <div className="lh-field">
        <label>Họ và tên <span>*</span></label>
        <input type="text" placeholder="Nguyễn Văn A" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="lh-field">
        <label>Số điện thoại <span>*</span></label>
        <input type="tel" placeholder="0912 345 678" value={phone} onChange={e => setPhone(e.target.value)} required inputMode="numeric" />
      </div>
      <div className="lh-field">
        <label>Nội dung (không bắt buộc)</label>
        <textarea placeholder="Bạn muốn hỏi về khóa học nào? Hoặc cần tư vấn gì?" value={message} onChange={e => setMessage(e.target.value)} rows={4} />
      </div>
      {error && <p className="lh-error"><i className="ti ti-alert-circle"></i> {error}</p>}
      <button type="submit" className="lh-submit" disabled={loading}>
        {loading ? <><i className="ti ti-loader-2 spin"></i> Đang gửi...</> : <><i className="ti ti-send"></i> Gửi thông tin</>}
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
            <p className="gt-hero-sub">Từ một tách cà phê đến hàng trăm giấc mơ mở quán — Học Viện Cà Phê HCM đồng hành cùng bạn trên từng bước hành trình.</p>
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
              <p>Học Viện Cà Phê HCM ra đời từ một trăn trở thực tế: có quá nhiều bạn trẻ đam mê mở quán cà phê, nhưng chỉ sau vài tháng phải đóng cửa vì thiếu nền tảng. Không phải thiếu vốn, không phải thiếu địa điểm đẹp — mà thiếu kiến thức đúng.</p>
              <p>Câu hỏi đặt ra là: <em>Tại sao việc học pha chế đúng cách lại khó tiếp cận đến vậy?</em> Tại sao người muốn mở quán phải tự mày mò từng công thức, tự thử nghiệm từng sai lầm đắt giá?</p>
              <blockquote className="story-quote">Chúng tôi muốn rút ngắn hành trình đó — để bạn bắt đầu đúng, đi xa hơn và bền vững hơn.</blockquote>
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
              <p>Mỗi buổi học tại Học Viện Cà Phê là một ca làm việc thực sự. Học viên tự tay pha hơn 200 công thức đồ uống — từ cà phê máy, trà sữa, matcha đến đá xay và các xu hướng mới nhất.</p>
              <p>Chúng tôi không chỉ dạy bạn cách pha. Chúng tôi giải thích <em>tại sao</em>: tại sao tỉ lệ này, tại sao nhiệt độ đó, tại sao nguyên liệu này kết hợp lại tạo ra hương vị đặc biệt. Khi hiểu bản chất, bạn tự tạo ra công thức của riêng mình.</p>
              <p>Lớp học nhỏ, kèm cặp 1–1, phản hồi trực tiếp từ giảng viên có kinh nghiệm vận hành quán thực tế — đó là điểm khác biệt của chúng tôi.</p>
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
              <p>Hành trình không kết thúc khi bạn bước ra khỏi lớp học. Đội ngũ Học Viện tiếp tục đồng hành qua từng bước: thiết kế menu phù hợp thị trường, tính toán giá thành để có lợi nhuận tốt, chọn thiết bị đúng ngân sách.</p>
              <p>Bạn sẽ nhận được hỗ trợ từ khâu lên ý tưởng quán đến ngày khai trương — kể cả sau khai trương khi cần điều chỉnh menu hay giải quyết vấn đề vận hành.</p>
              <blockquote className="story-quote">Không dừng lại ở dạy pha chế — chúng tôi giúp bạn xây dựng một quán cà phê thực sự bền vững.</blockquote>
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
            <p className="sub" style={{maxWidth:'580px', margin:'0 auto'}}>Mỗi giảng viên đều đã trực tiếp quản lý quán, xây dựng chuỗi và setup menu cho hàng chục cơ sở — trước khi đứng lớp truyền nghề.</p>
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
                  Hiện là <strong>Trưởng Phòng Đào Tạo</strong> tại Học Viện Cà Phê Chi Nhánh Miền Nam, Giảng viên Liêm đã trực tiếp xây dựng menu và đào tạo nhân sự cho hàng chục quán mới mở trải dài khắp cả nước — mỗi nơi anh đặt chân đến, đều để lại một dấu ấn khó phai.
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
            <p className="sub" style={{maxWidth:'520px', margin:'0 auto'}}>Mỗi người đến đây với một giấc mơ riêng — và chúng tôi ở đây để giúp giấc mơ đó thành hiện thực.</p>
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
            <p className="sub" style={{maxWidth:'520px', margin:'0 auto'}}>Từ cà phê, trà sữa, matcha đến đá xay — mỗi công thức được tinh chỉnh từ kinh nghiệm vận hành quán thực tế.</p>
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
            <p className="sub" style={{maxWidth:'520px', margin:'0 auto'}}>Những giá trị định hướng mọi quyết định và hành động của Học Viện Cà Phê.</p>
          </div>
          <div className="val-grid">
            <div className="val-card">
              <div className="val-ico"><i className="ti ti-target"></i></div>
              <h3>Tầm Nhìn</h3>
              <p>Trở thành học viện đào tạo pha chế và tư vấn kinh doanh quán cà phê uy tín hàng đầu tại TP.HCM — nơi mỗi học viên được trang bị đủ kiến thức để tự tin bắt đầu.</p>
            </div>
            <div className="val-card">
              <div className="val-ico"><i className="ti ti-heart"></i></div>
              <h3>Sứ Mệnh</h3>
              <p>Rút ngắn hành trình từ đam mê đến kinh doanh thực tế — bằng chương trình đào tạo thực chiến, tư vấn tận tâm và đồng hành dài lâu với từng học viên.</p>
            </div>
            <div className="val-card">
              <div className="val-ico"><i className="ti ti-award"></i></div>
              <h3>Chất Lượng Thực Chiến</h3>
              <p>Mọi công thức, quy trình và kiến thức kinh doanh đều được rút ra từ kinh nghiệm vận hành quán thực tế — không phải lý thuyết sách vở hay sao chép từ nguồn khác.</p>
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
              <h2>Hãy Để Chúng Tôi<br />Tư Vấn Cho Bạn</h2>
              <p>Điền form hoặc nhắn Zalo — đội ngũ sẽ phản hồi trong vòng 30 phút trong giờ hành chính.</p>
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
            <h2>Sẵn Sàng Khởi Nghiệp<br />Cùng Chúng Tôi?</h2>
            <p>Đặt lịch tư vấn miễn phí — đội ngũ Học Viện sẽ liên hệ trong 30 phút để tìm khóa học phù hợp nhất với bạn.</p>
            <Link href="/#dangky" className="cta-white"><i className="ti ti-calendar-check"></i> Đăng Ký Tư Vấn Miễn Phí</Link>
          </div>
        </div>
      </section>
    </>
  );
}
