import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="login">
      <div className="container">
        <div className="ft-grid">
          <div>
            <div className="ft-brand-logo">
              <img src="/images/logo.png" className="ft-ico" alt="Học Viện Cà Phê" />
              <span className="ft-name">Học Viện Cà Phê HCM</span>
            </div>
            <p className="ft-desc">Nơi khởi nguồn kinh doanh của bạn. Đào tạo pha chế &amp; đồng hành mở quán cà phê, trà sữa.</p>
            <div className="ft-socs">
              <a href="https://www.facebook.com/hocviencaphe" className="ft-soc" title="Facebook" target="_blank" rel="noopener"><i className="ti ti-brand-facebook"></i></a>
              <a href="#" className="ft-soc" title="Instagram"><i className="ti ti-brand-instagram"></i></a>
              <a href="#" className="ft-soc" title="TikTok"><i className="ti ti-brand-tiktok"></i></a>
              <a href="#" className="ft-soc" title="YouTube"><i className="ti ti-brand-youtube"></i></a>
            </div>
          </div>
          <div className="ft-col">
            <h5>Khóa Học</h5>
            <ul>
              <li><Link href="/#courses">Tổng Hợp Truyền Thống</Link></li>
              <li><Link href="/#courses">Tổng Hợp Hiện Đại</Link></li>
              <li><Link href="/#courses">Chuyên Đề Lẻ</Link></li>
              <li><Link href="/#services">Gói Kinh Doanh</Link></li>
            </ul>
          </div>
          <div className="ft-col">
            <h5>Khám Phá</h5>
            <ul>
              <li><Link href="/#about">Về Chúng Tôi</Link></li>
              <li><Link href="/#menu">Menu Đồ Uống</Link></li>
              <li><Link href="/#dangky">Đăng Ký Tư Vấn</Link></li>
              <li><Link href="/login">Đăng Nhập Nội Bộ</Link></li>
            </ul>
          </div>
          <div className="ft-col">
            <h5>Liên Hệ</h5>
            <ul>
              <li><a href="tel:0834790555"><i className="ti ti-phone" style={{ fontSize:'0.78rem', verticalAlign:'middle', marginRight:'4px' }}></i>Hotline: 0834.790.555</a></li>
              <li><a href="https://zalo.me/0834790555"><i className="ti ti-message-circle" style={{ fontSize:'0.78rem', verticalAlign:'middle', marginRight:'4px' }}></i>Zalo: 0834.790.555</a></li>
              <li><a href="mailto:hocviencaphehcm@gmail.com"><i className="ti ti-mail" style={{ fontSize:'0.78rem', verticalAlign:'middle', marginRight:'4px' }}></i>hocviencaphehcm@gmail.com</a></li>
              <li><a href="https://maps.app.goo.gl/gdSAqQAEifDbjzJZA" target="_blank" rel="noopener"><i className="ti ti-map-pin" style={{ fontSize:'0.78rem', verticalAlign:'middle', marginRight:'4px' }}></i>CS1 – HCM: 26/23 Nguyễn Minh Hoàng, P. Bảy Hiền, Tân Bình</a></li>
              <li><a href="https://maps.google.com/?q=8+Dương+Đình+Nghệ,+Cầu+Giấy,+Hà+Nội" target="_blank" rel="noopener"><i className="ti ti-map-pin" style={{ fontSize:'0.78rem', verticalAlign:'middle', marginRight:'4px' }}></i>CS2 – HN: 8 Dương Đình Nghệ, Cầu Giấy, TP Hà Nội</a></li>
              <li><a href="#"><i className="ti ti-clock" style={{ fontSize:'0.78rem', verticalAlign:'middle', marginRight:'4px' }}></i>Thứ 2 – Thứ 7 · 8h30 – 17h30</a></li>
            </ul>
          </div>
        </div>
        <div className="ft-bot">
          © 2024 Công Ty Cổ Phần Học Viện Cà Phê · GPĐKKD: 0109777002 &nbsp;·&nbsp;
          <a href="#">Chính sách bảo mật</a> &nbsp;·&nbsp;
          <a href="#">Điều khoản sử dụng</a>
        </div>
      </div>
    </footer>
  );
}
