'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        const p = session.user.email.replace('@hocviencaphehcm.vn', '');
        setPhone(p);
        setIsAdmin(session.user.app_metadata?.role === 'admin');
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user?.email) {
        const p = session.user.email.replace('@hocviencaphehcm.vn', '');
        setPhone(p);
        setIsAdmin(session.user.app_metadata?.role === 'admin');
      } else {
        setPhone(null);
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setPhone(null);
    setIsAdmin(false);
    router.push('/');
    router.refresh();
  }

  const { totalItems, openCart } = useCart();
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

              {phone ? (
                <div className="nav-user">
                  {isAdmin && (
                    <Link href="/admin" className={`nav-link nav-admin${pathname === '/admin' ? ' active' : ''}`}>
                      <i className="ti ti-settings"></i> Admin
                    </Link>
                  )}
                  <div className="nav-user-info">
                    <i className="ti ti-user-circle"></i>
                    <span>{phone}</span>
                  </div>
                  <button className="btn-login btn-logout" onClick={logout}>
                    <i className="ti ti-logout" style={{ fontSize: '0.85rem' }}></i> Đăng Xuất
                  </button>
                </div>
              ) : (
                <Link href="/login" className="btn-login">
                  <i className="ti ti-lock" style={{ fontSize: '0.85rem' }}></i> Đăng Nhập
                </Link>
              )}

              <button className="nav-cart-btn" onClick={openCart} aria-label="Giỏ hàng">
                <i className="ti ti-shopping-cart"></i>
                {totalItems > 0 && <span className="nav-cart-badge">{totalItems}</span>}
              </button>
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
        {phone ? (
          <>
            {isAdmin && <Link href="/admin" onClick={close}>⚙ Quản Lý Admin</Link>}
            <button className="mob-logout" onClick={() => { logout(); close(); }}>
              <i className="ti ti-logout"></i> Đăng Xuất ({phone})
            </button>
          </>
        ) : (
          <Link href="/login" onClick={close}>Đăng Nhập Nội Bộ</Link>
        )}
      </div>
    </>
  );
}
