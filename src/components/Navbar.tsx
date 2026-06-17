'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
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

  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);
  const [spOpen, setSpOpen] = useState(false);
  const spRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ddOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDdOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [ddOpen]);

  useEffect(() => {
    if (!spOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (spRef.current && !spRef.current.contains(e.target as Node)) setSpOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [spOpen]);

  const { totalItems, openCart } = useCart();
  const close = () => { setMenuOpen(false); setExpanded(null); };
  const toggle = (key: string) => setExpanded(e => e === key ? null : key);
  const isHome = pathname === '/';

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="container">
          <div className="nav-inner">
            {/* LEFT — parent pages only */}
            <div className="nav-left">
              <Link href="/" className={`nav-link${isHome ? ' active' : ''}`}>Trang Chủ</Link>
              <Link href="/gioi-thieu" className={`nav-link${pathname === '/gioi-thieu' ? ' active' : ''}`}>Giới Thiệu</Link>
              <Link href="/cong-thuc" className={`nav-link${pathname === '/cong-thuc' ? ' active' : ''}`}>Công Thức</Link>
              <Link href="/cong-thuc-2" className={`nav-link${pathname === '/cong-thuc-2' ? ' active' : ''}`}>Công Thức 2</Link>
            </div>

            <Link href="/" className="nav-logo">
              <img src="/images/logo.png" className="nav-logo-icon" alt="Học Viện Cà Phê" />
            </Link>

            {/* RIGHT — parent pages + actions */}
            <div className="nav-right">
              {/* Sản Phẩm — desktop dropdown (click-toggle) */}
              <div
                ref={spRef}
                className={`nav-dropdown-wrap${(pathname === '/nguyen-lieu' || pathname === '/dung-cu') ? ' active' : ''}${spOpen ? ' open' : ''}`}
              >
                <button
                  className="nav-link nav-dropdown-trigger"
                  onClick={() => setSpOpen(o => !o)}
                  aria-expanded={spOpen}
                >
                  Sản Phẩm <i className="ti ti-chevron-down nav-dd-chevron"></i>
                </button>
                <div className="nav-dropdown-menu">
                  <Link href="/nguyen-lieu" className="nav-dd-item" onClick={() => { setSpOpen(false); close(); }}>
                    <i className="ti ti-bottle"></i> Nguyên Liệu
                  </Link>
                  <Link href="/dung-cu" className="nav-dd-item" onClick={() => { setSpOpen(false); close(); }}>
                    <i className="ti ti-coffee"></i> Dụng Cụ
                  </Link>
                </div>
              </div>

              {/* Hình Ảnh — desktop dropdown (click-toggle) */}
              <div
                ref={ddRef}
                className={`nav-dropdown-wrap${pathname.startsWith('/hinh-anh') ? ' active' : ''}${ddOpen ? ' open' : ''}`}
              >
                <button
                  className="nav-link nav-dropdown-trigger"
                  onClick={() => setDdOpen(o => !o)}
                  aria-expanded={ddOpen}
                >
                  Hình Ảnh <i className="ti ti-chevron-down nav-dd-chevron"></i>
                </button>
                <div className="nav-dropdown-menu">
                  <Link href="/hinh-anh/trao-bang" className="nav-dd-item" onClick={() => { setDdOpen(false); close(); }}>
                    <i className="ti ti-certificate"></i> Trao Bằng
                  </Link>
                  <Link href="/hinh-anh/lop-hoc" className="nav-dd-item" onClick={() => { setDdOpen(false); close(); }}>
                    <i className="ti ti-school"></i> Lớp Học
                  </Link>
                </div>
              </div>

              <Link href="/video" className={`nav-link${pathname === '/video' ? ' active' : ''}`}>Video</Link>
              <Link href="/gioi-thieu#lien-he" className="nav-link">Liên Hệ</Link>

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

      {/* HAMBURGER MENU */}
      <div className={`mob-menu${menuOpen ? ' open' : ''}`} id="mobMenu">

        {/* Trang Chủ — accordion with # children */}
        <div className="mob-parent">
          <button className={`mob-parent-btn${expanded === 'home' ? ' open' : ''}`} onClick={() => toggle('home')}>
            <span>Trang Chủ</span>
            <i className="ti ti-chevron-down mob-chevron"></i>
          </button>
          <div className={`mob-children${expanded === 'home' ? ' open' : ''}`}>
            <Link href="/" className="mob-child" onClick={close}><i className="ti ti-home"></i> Trang Chủ</Link>
            <Link href="/#courses" className="mob-child" onClick={close}><i className="ti ti-school"></i> Khóa Học</Link>
            <Link href="/#services" className="mob-child" onClick={close}><i className="ti ti-briefcase"></i> Gói Kinh Doanh</Link>
            <Link href="/#menu" className="mob-child" onClick={close}><i className="ti ti-coffee"></i> Menu Đồ Uống</Link>
            <Link href="/#about" className="mob-child" onClick={close}><i className="ti ti-info-circle"></i> Về Chúng Tôi</Link>
            <Link href="/#hoc-vien" className="mob-child" onClick={close}><i className="ti ti-users"></i> Học Viên</Link>
            <Link href="/#dangky" className="mob-child" onClick={close}><i className="ti ti-pencil"></i> Đăng Ký / Liên Hệ</Link>
          </div>
        </div>

        <Link href="/gioi-thieu" className={`mob-top-link${pathname === '/gioi-thieu' ? ' active' : ''}`} onClick={close}>Giới Thiệu</Link>
        <Link href="/cong-thuc" className={`mob-top-link${pathname === '/cong-thuc' ? ' active' : ''}`} onClick={close}>Công Thức Pha Chế</Link>
        <Link href="/cong-thuc-2" className={`mob-top-link${pathname === '/cong-thuc-2' ? ' active' : ''}`} onClick={close}>Công Thức 2</Link>
        <Link href="/video" className={`mob-top-link${pathname === '/video' ? ' active' : ''}`} onClick={close}>Video</Link>

        {/* Sản Phẩm — accordion */}
        <div className="mob-parent">
          <button className={`mob-parent-btn${expanded === 'san-pham' ? ' open' : ''}`} onClick={() => toggle('san-pham')}>
            <span>Sản Phẩm</span>
            <i className="ti ti-chevron-down mob-chevron"></i>
          </button>
          <div className={`mob-children${expanded === 'san-pham' ? ' open' : ''}`}>
            <Link href="/nguyen-lieu" className="mob-child" onClick={close}><i className="ti ti-bottle"></i> Nguyên Liệu</Link>
            <Link href="/dung-cu" className="mob-child" onClick={close}><i className="ti ti-coffee"></i> Dụng Cụ</Link>
          </div>
        </div>

        {/* Hình Ảnh — accordion */}
        <div className="mob-parent">
          <button className={`mob-parent-btn${expanded === 'hinh-anh' ? ' open' : ''}`} onClick={() => toggle('hinh-anh')}>
            <span>Hình Ảnh</span>
            <i className="ti ti-chevron-down mob-chevron"></i>
          </button>
          <div className={`mob-children${expanded === 'hinh-anh' ? ' open' : ''}`}>
            <Link href="/hinh-anh/trao-bang" className="mob-child" onClick={close}><i className="ti ti-certificate"></i> Trao Bằng</Link>
            <Link href="/hinh-anh/lop-hoc" className="mob-child" onClick={close}><i className="ti ti-school"></i> Lớp Học</Link>
          </div>
        </div>

        <div className="mob-divider" />

        {phone ? (
          <>
            {isAdmin && <Link href="/admin" onClick={close} className="mob-top-link">⚙ Quản Lý Admin</Link>}
            <button className="mob-logout" onClick={() => { logout(); close(); }}>
              <i className="ti ti-logout"></i> Đăng Xuất ({phone})
            </button>
          </>
        ) : (
          <Link href="/login" onClick={close} className="mob-top-link">Đăng Nhập Nội Bộ</Link>
        )}
      </div>
    </>
  );
}
