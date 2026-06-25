import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="login">
      <div className="container">
        <div className="ft-grid">
          {/* COL 1: Brand + Contact */}
          <div>
            <div className="ft-brand-logo">
              <img src="https://hocviencaphe.vn/wp-content/uploads/2019/07/logo310x95-min.png" className="ft-ico" alt="Học Viện Cà Phê" />
            </div>
            <p className="ft-desc">Nơi khởi nguồn kinh doanh của bạn. Đào tạo pha chế &amp; đồng hành mở quán cà phê, trà sữa.</p>
            <div className="ft-socs">
              <a href="https://www.facebook.com/hocviencaphe" className="ft-soc" title="Facebook" target="_blank" rel="noopener"><i className="ti ti-brand-facebook"></i></a>
              <a href="#" className="ft-soc" title="Instagram"><i className="ti ti-brand-instagram"></i></a>
              <a href="#" className="ft-soc" title="TikTok"><i className="ti ti-brand-tiktok"></i></a>
              <a href="#" className="ft-soc" title="YouTube"><i className="ti ti-brand-youtube"></i></a>
            </div>
            <ul className="ft-contact-list">
              <li><a href="tel:0834790555"><i className="ti ti-phone"></i>Hotline: 0834.790.555</a></li>
              <li><a href="https://zalo.me/0834790555"><i className="ti ti-message-circle"></i>Zalo: 0834.790.555</a></li>
              <li><a href="mailto:hocviencaphehcm@gmail.com"><i className="ti ti-mail"></i>hocviencaphehcm@gmail.com</a></li>
              <li><i className="ti ti-clock"></i><span>Thứ 2 – Thứ 7 · 8h30 – 17h30</span></li>
            </ul>
          </div>

          {/* COL 2: Khóa Học */}
          <div className="ft-col">
            <h5>Khóa Học</h5>
            <ul>
              <li><Link href="/khoa-hoc">Tổng Hợp Truyền Thống</Link></li>
              <li><Link href="/khoa-hoc">Tổng Hợp Hiện Đại</Link></li>
              <li><Link href="/khoa-hoc">Chuyên Đề Lẻ</Link></li>
              <li><Link href="/dich-vu">Gói Kinh Doanh</Link></li>
              <li><Link href="/dang-ky">Đăng Ký Học</Link></li>
            </ul>
          </div>

          {/* COL 3: Khám Phá */}
          <div className="ft-col">
            <h5>Khám Phá</h5>
            <ul>
              <li><Link href="/gioi-thieu">Về Chúng Tôi</Link></li>
              <li><Link href="/nguyen-lieu">Nguyên Liệu</Link></li>
              <li><Link href="/dung-cu">Dụng Cụ Pha Chế</Link></li>
              <li><Link href="/kho-cong-thuc">Công Thức Miễn Phí</Link></li>
              <li><Link href="/lien-he">Liên Hệ / Tư Vấn</Link></li>
              <li><Link href="/login">Đăng Nhập Nội Bộ</Link></li>
            </ul>
          </div>

          {/* COL 4: Fanpage + Maps */}
          <div className="ft-col ft-col-maps">
            <div className="ft-fanpage">
              <span>Fanpage:</span>
              <a href="https://www.facebook.com/hocviencaphe" title="Facebook" target="_blank" rel="noopener"><i className="ti ti-brand-facebook"></i></a>
              <a href="https://zalo.me/0834790555" title="Zalo" target="_blank" rel="noopener"><i className="ti ti-message-circle"></i></a>
              <a href="#" title="YouTube"><i className="ti ti-brand-youtube"></i></a>
            </div>

            <div className="ft-map-item">
              <h6><i className="ti ti-map-pin"></i> CS1 – TP. Hồ Chí Minh</h6>
              <iframe
                className="ft-map-iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.0!2d106.6484504!3d10.7994362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529cb26ebc783%3A0x2d237fafdfc72f3f!2sH%E1%BB%8Dc+Vi%E1%BB%87n+C%C3%A0+Ph%C3%AA!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
                title="Cơ sở HCM"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <p className="ft-map-addr"><i className="ti ti-map-pin-2"></i> 26/23 Nguyễn Minh Hoàng, P. Bảy Hiền, Tân Bình</p>
            </div>

            <div className="ft-map-item">
              <h6><i className="ti ti-map-pin"></i> CS2 – Hà Nội</h6>
              <iframe
                className="ft-map-iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.0!2d105.7922858!3d21.0245749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abb0e56c68ef%3A0x6fb2a4ab19567d44!2sH%E1%BB%8Dc+Vi%E1%BB%87n+C%C3%A0+Ph%C3%AA!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
                title="Cơ sở Hà Nội"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <p className="ft-map-addr"><i className="ti ti-map-pin-2"></i> 8 Dương Đình Nghệ, Cầu Giấy, Hà Nội</p>
            </div>
          </div>
        </div>

        <div className="ft-bot">
          © {new Date().getFullYear()} Công Ty Cổ Phần Học Viện Cà Phê · GPĐKKD: 0109777002 &nbsp;·&nbsp;
          <a href="#">Chính sách bảo mật</a> &nbsp;·&nbsp;
          <a href="#">Điều khoản sử dụng</a>
        </div>
      </div>
    </footer>
  );
}
