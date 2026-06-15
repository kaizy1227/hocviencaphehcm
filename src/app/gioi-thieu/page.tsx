'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

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
              <div className="gh-stat"><div className="gh-stat-n">500<sup>+</sup></div><div className="gh-stat-l">Học viên<br />đã đào tạo</div></div>
              <div className="gh-stat"><div className="gh-stat-n">11</div><div className="gh-stat-l">Khóa học<br />&amp; chuyên đề</div></div>
              <div className="gh-stat"><div className="gh-stat-n">60<sup>+</sup></div><div className="gh-stat-l">Công thức<br />đồ uống</div></div>
              <div className="gh-stat"><div className="gh-stat-n">A–Z</div><div className="gh-stat-l">Hỗ trợ từ<br />pha chế đến mở quán</div></div>
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
              <p>Mỗi buổi học tại Học Viện Cà Phê là một ca làm việc thực sự. Học viên tự tay pha hơn 60 công thức đồ uống — từ cà phê máy, trà sữa, matcha đến đá xay và các xu hướng mới nhất.</p>
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
            <div className="gt-stat"><div className="gt-stat-n">60<sup>+</sup></div><div className="gt-stat-l">Công thức<br />đồ uống</div></div>
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
            {/* THẦY LIÊM */}
            <div className="gv-hero-card">
              <img className="gv-hero-bg" src="/images/giangvien_Liem.jpg" alt="" style={{objectPosition:'top center'}} />
              <div className="gv-hero-overlay" />
              <div className="gv-hero-content">
                <div className="gv-hero-badges">
                  <span className="gv-badge">10 năm kinh nghiệm</span>
                  <span className="gv-badge">Cựu QL Phúc Long</span>
                  <span className="gv-badge">Sinh 1996</span>
                </div>
                <div className="gv-hero-name">Đoàn Hồng Liêm</div>
                <div className="gv-hero-role">☕ Chuyên Gia Cà Phê &amp; Vận Hành</div>
                <p className="gv-hero-desc">
                  Gắn bó với ngành F&amp;B từ năm 18 tuổi, Thầy Liêm từng đảm nhiệm nhiều vị trí từ barista đến quản lý tại <strong>Phúc Long</strong> — thương hiệu cà phê &amp; trà hàng đầu Việt Nam. Không dừng lại ở vận hành, Thầy Liêm còn trực tiếp <strong>setup menu và đào tạo nhân sự</strong> cho hàng chục quán mới mở khắp cả nước.
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

            {/* THẦY ÂN */}
            <div className="gv-hero-card gv-hero-reverse">
              <img className="gv-hero-bg" src="/images/giangvien_An.jpg" alt="" style={{objectPosition:'top center'}} />
              <div className="gv-hero-overlay" />
              <div className="gv-hero-content">
                <div className="gv-hero-badges">
                  <span className="gv-badge">8 năm kinh nghiệm</span>
                  <span className="gv-badge">Cựu Trainer AiCha</span>
                  <span className="gv-badge">Sinh 1997</span>
                </div>
                <div className="gv-hero-name">Bùi Trần Thiên Ân</div>
                <div className="gv-hero-role">🍵 Chuyên Gia Trà &amp; Sáng Tạo Hot Trend</div>
                <p className="gv-hero-desc">
                  Với 8 năm trong ngành F&amp;B, Thầy Ân từng là trainer chính cho chuỗi trà sữa <strong>AiCha</strong> — có thời điểm đạt đến gần 20 cửa hàng. Ngoài ra, Thầy Ân đã trực tiếp <strong>setup menu và phát triển công thức</strong> cho hàng chục quán trà sữa &amp; cà phê, tạo ra nhiều đồ uống <strong>hot trend</strong> được thị trường đón nhận.
                </p>
                <blockquote className="gv-hero-quote">
                  "Người học nhanh nhất không phải người thông minh nhất — mà là người dám thử, dám sai và không bỏ cuộc."
                </blockquote>
                <div className="gv-skills">
                  <span className="gv-skill-pill">🍵 Trà Việt Nam & Đài Loan</span>
                  <span className="gv-skill-pill">✨ Sáng tạo hot trend</span>
                  <span className="gv-skill-pill">🍽️ Setup menu</span>
                  <span className="gv-skill-pill">👥 Đào tạo chuỗi</span>
                </div>
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
            <h2 className="title">Hơn 60 Công Thức<br />Bạn Sẽ Học</h2>
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
