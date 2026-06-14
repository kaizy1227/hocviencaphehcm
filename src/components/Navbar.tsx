'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);
  const isHome = pathname === '/';

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="container">
          <div className="nav-inner">
            <div className="nav-left">
              <Link href="/" className={`nav-link${isHome ? ' active' : ''}`}>Trang Chủ</Link>
              <Link href="/#courses" className="nav-link">Khóa Học</Link>
              <Link href="/#services" className="nav-link">Gói Kinh Doanh</Link>
            </div>

            <Link href="/" className="nav-logo">
              <img src="/images/logo.png" className="nav-logo-icon" alt="Học Viện Cà Phê" />
              <div>
                <span className="nav-logo-main">Học Viện Cà Phê</span>
                <span className="nav-logo-sub">Coffee &amp; Tea Academy</span>
              </div>
            </Link>

            <div className="nav-right">
              <Link href="/#menu" className="nav-link">Menu</Link>
              <Link href="/gioi-thieu" className={`nav-link${pathname === '/gioi-thieu' ? ' active' : ''}`}>Giới Thiệu</Link>
              <Link href="/cong-thuc" className={`nav-link${pathname === '/cong-thuc' ? ' active' : ''}`}>Công Thức</Link>
              <Link href="/#dangky" className="nav-link">Liên Hệ</Link>
              <Link href="/login" className="btn-login">
                <i className="ti ti-lock" style={{ fontSize: '0.85rem' }}></i> Đăng Nhập
              </Link>
              <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`mob-menu${menuOpen ? ' open' : ''}`} id="mobMenu">
        <Link href="/" onClick={close}>Trang Chủ</Link>
        <Link href="/#about" onClick={close}>Về Chúng Tôi</Link>
        <Link href="/#courses" onClick={close}>Khóa Học</Link>
        <Link href="/#services" onClick={close}>Gói Kinh Doanh</Link>
        <Link href="/#menu" onClick={close}>Menu Đồ Uống</Link>
        <Link href="/#hoc-vien" onClick={close}>Học Viên</Link>
        <Link href="/gioi-thieu" onClick={close}>Giới Thiệu</Link>
        <Link href="/cong-thuc" onClick={close}>Công Thức Pha Chế</Link>
        <Link href="/#dangky" onClick={close}>Đăng Ký / Liên Hệ</Link>
        <Link href="/login" onClick={close}>Đăng Nhập Nội Bộ</Link>
      </div>
    </>
  );
}
