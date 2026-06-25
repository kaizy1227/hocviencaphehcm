'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [articles, setArticles] = useState<{ title: string; url: string; image: string; date: string }[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Initial load — one client, one profile fetch
    void (async () => {
      try {
        const { data: { session } } = await Promise.race([
          supabase.auth.getSession(),
          new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000)),
        ]);
        if (session?.user?.email) {
          const phone = session.user.email.replace('@hocviencaphehcm.vn', '');
          setPhone(phone);
          setIsAdmin(session.user.app_metadata?.role === 'admin');
          // Use the SAME client — never create a new one inside callbacks
          const { data: profile } = await supabase.from('profiles').select('name').eq('id', session.user.id).single();
          setDisplayName(profile?.name?.trim() || phone);
        }
      } catch { /* timeout or error — stay logged out */ }
    })();

    // onAuthStateChange: NO DB calls, NO new createClient() — just sync state from session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setPhone(null); setIsAdmin(false); setDisplayName(null);
      } else if (session.user?.email) {
        const p = session.user.email.replace('@hocviencaphehcm.vn', '');
        setPhone(p);
        setIsAdmin(session.user.app_metadata?.role === 'admin');
        // Keep existing displayName; fall back to phone only if not yet set
        setDisplayName(prev => prev || p);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetch('/api/kinh-nghiem')
      .then(r => r.ok ? r.json() : { articles: [] })
      .then(d => setArticles(d.articles || []))
      .catch(() => setArticles([]));
  }, []);

  async function logout() {
    try { await createClient().auth.signOut(); } catch { /* ignore network errors */ }
    setPhone(null); setIsAdmin(false); setDisplayName(null);
    router.push('/'); router.refresh();
  }

  const { totalItems, openCart } = useCart();
  const { count: wishCount } = useWishlist();
  const close = () => { setMenuOpen(false); setExpanded(null); };
  const toggle = (key: string) => setExpanded(e => e === key ? null : key);

  const isHome = pathname === '/';
  const isDaoTao = pathname === '/khoa-hoc' || pathname === '/dich-vu';
  const isCongThuc = pathname === '/cong-thuc-2' || pathname === '/kho-cong-thuc';
  const isSanPham = pathname === '/nguyen-lieu' || pathname === '/dung-cu';
  const isHinhAnh = pathname.startsWith('/hinh-anh') || pathname === '/video';

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="container">
          <div className="nav-inner">
            {/* LOGO */}
            <Link href="/" className="nav-logo">
              <img
                src="https://hocviencaphe.vn/wp-content/uploads/2019/07/logo310x95-min.png"
                className="nav-logo-icon"
                alt="Học Viện Cà Phê"
              />
            </Link>

            {/* MAIN NAV LINKS */}
            <div className="nav-menu">
              <Link href="/" className={`nav-link${isHome ? ' active' : ''}`}>Trang Chủ</Link>

              {/* Đào Tạo */}
              <div className={`nav-dropdown-wrap${isDaoTao ? ' active' : ''}`}>
                <button className="nav-link nav-dropdown-trigger">Đào Tạo</button>
                <div className="nav-dropdown-menu">
                  <Link href="/khoa-hoc" className="nav-dd-item" onClick={close}>
                    <i className="ti ti-school"></i> Khóa Học
                  </Link>
                  <Link href="/dich-vu" className="nav-dd-item" onClick={close}>
                    <i className="ti ti-briefcase"></i> Dịch Vụ
                  </Link>
                </div>
              </div>

              {/* Công Thức */}
              <div className={`nav-dropdown-wrap${isCongThuc ? ' active' : ''}`}>
                <button className="nav-link nav-dropdown-trigger">Công Thức</button>
                <div className="nav-dropdown-menu">
                  <Link href="/cong-thuc-2" className="nav-dd-item" onClick={close}>
                    <i className="ti ti-lock"></i> Nội Bộ
                  </Link>
                  <Link href="/kho-cong-thuc" className="nav-dd-item" onClick={close}>
                    <i className="ti ti-gift"></i> Miễn Phí
                  </Link>
                </div>
              </div>

              {/* Sản Phẩm */}
              <div className={`nav-dropdown-wrap${isSanPham ? ' active' : ''}`}>
                <button className="nav-link nav-dropdown-trigger">Sản Phẩm</button>
                <div className="nav-dropdown-menu">
                  <Link href="/nguyen-lieu" className="nav-dd-item" onClick={close}>
                    <i className="ti ti-bottle"></i> Nguyên Liệu
                  </Link>
                  <Link href="/dung-cu" className="nav-dd-item" onClick={close}>
                    <i className="ti ti-coffee"></i> Dụng Cụ
                  </Link>
                </div>
              </div>

              {/* Thư Viện */}
              <div className={`nav-dropdown-wrap${isHinhAnh ? ' active' : ''}`}>
                <button className="nav-link nav-dropdown-trigger">Thư Viện</button>
                <div className="nav-dropdown-menu">
                  <Link href="/hinh-anh/trao-bang" className="nav-dd-item" onClick={close}>
                    <i className="ti ti-certificate"></i> Trao Bằng Học Viên
                  </Link>
                  <Link href="/hinh-anh/lop-hoc" className="nav-dd-item" onClick={close}>
                    <i className="ti ti-school"></i> Hình Ảnh Lớp Học
                  </Link>
                  <Link href="/video" className="nav-dd-item" onClick={close}>
                    <i className="ti ti-video"></i> Làm Món Cùng Giảng Viên
                  </Link>
                </div>
              </div>

              {/* Xu Hướng — mega dropdown */}
              <div className="nav-dropdown-wrap">
                <button className="nav-link nav-dropdown-trigger">Xu Hướng</button>
                <div className="nav-dropdown-menu nav-mega">
                  <a href="https://maynitrosodahvcp.vercel.app/" target="_blank" rel="noopener noreferrer" className="nav-dd-item nav-mega-feature">
                    <i className="ti ti-bolt"></i>
                    <span>Nâng Cấp Menu Với Công Nghệ Nitro Soda</span>
                    <i className="ti ti-external-link nav-mega-ext"></i>
                  </a>
                  <div className="nav-mega-head">
                    <span>Kinh Nghiệm</span>
                    <a href="https://hocviencaphe.vn/kinh-nghiem/" target="_blank" rel="noopener noreferrer">Xem tất cả <i className="ti ti-chevron-right"></i></a>
                  </div>
                  {articles.length > 0 ? articles.map(a => (
                    <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer" className="nav-mega-post">
                      <div className="nav-mega-thumb">
                        {a.image ? <img src={a.image} alt={a.title} loading="lazy" /> : <i className="ti ti-news"></i>}
                      </div>
                      <div className="nav-mega-post-text">
                        <span className="nav-mega-post-title">{a.title}</span>
                        <span className="nav-mega-post-date"><i className="ti ti-calendar"></i> {a.date}</span>
                      </div>
                    </a>
                  )) : (
                    <div className="nav-mega-loading"><i className="ti ti-loader-2 spin"></i> Đang tải bài viết...</div>
                  )}
                </div>
              </div>

              <Link href="/lien-he" className={`nav-link${pathname === '/lien-he' ? ' active' : ''}`}>Liên Hệ</Link>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="nav-actions">
              {phone ? (
                <div className="nav-user">
                  {isAdmin && (
                    <Link href="/admin" className={`nav-link nav-admin${pathname === '/admin' ? ' active' : ''}`}>
                      <i className="ti ti-settings"></i> Admin
                    </Link>
                  )}
                  <Link href="/tai-khoan" className={`nav-link${pathname === '/tai-khoan' ? ' active' : ''}`}>
                    <i className="ti ti-user-circle"></i> {displayName}
                  </Link>
                  <button className="btn-login btn-logout" onClick={logout}>
                    <i className="ti ti-logout" style={{ fontSize: '0.85rem' }}></i> Thoát
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

      {/* MOBILE MENU */}
      <div className={`mob-menu${menuOpen ? ' open' : ''}`} id="mobMenu">

        <div className="mob-cta-bar">
          <a href="tel:0834790555" className="mob-cta-call">
            <i className="ti ti-phone"></i> Gọi Ngay
          </a>
          <Link href="/dang-ky" className="mob-cta-consult" onClick={close}>
            <i className="ti ti-message-circle"></i> Tư Vấn Ngay
          </Link>
        </div>

        <Link href="/" className={`mob-top-link${isHome ? ' active' : ''}`} onClick={close}>Trang Chủ</Link>

        <div className="mob-parent">
          <button className={`mob-parent-btn${expanded === 'dao-tao' ? ' open' : ''}${isDaoTao ? ' active-parent' : ''}`} onClick={() => toggle('dao-tao')}>
            <span>Đào Tạo</span>
            <i className="ti ti-chevron-down mob-chevron"></i>
          </button>
          <div className={`mob-children${expanded === 'dao-tao' ? ' open' : ''}`}>
            <Link href="/khoa-hoc" className="mob-child" onClick={close}><i className="ti ti-school"></i> Khóa Học</Link>
            <Link href="/dich-vu" className="mob-child" onClick={close}><i className="ti ti-briefcase"></i> Dịch Vụ</Link>
          </div>
        </div>

        <div className="mob-parent">
          <button className={`mob-parent-btn${expanded === 'cong-thuc' ? ' open' : ''}${isCongThuc ? ' active-parent' : ''}`} onClick={() => toggle('cong-thuc')}>
            <span>Công Thức</span>
            <i className="ti ti-chevron-down mob-chevron"></i>
          </button>
          <div className={`mob-children${expanded === 'cong-thuc' ? ' open' : ''}`}>
            <Link href="/cong-thuc-2" className="mob-child" onClick={close}><i className="ti ti-lock"></i> Nội Bộ</Link>
            <Link href="/kho-cong-thuc" className="mob-child" onClick={close}><i className="ti ti-gift"></i> Miễn Phí</Link>
          </div>
        </div>

        <div className="mob-parent">
          <button className={`mob-parent-btn${expanded === 'san-pham' ? ' open' : ''}${isSanPham ? ' active-parent' : ''}`} onClick={() => toggle('san-pham')}>
            <span>Sản Phẩm</span>
            <i className="ti ti-chevron-down mob-chevron"></i>
          </button>
          <div className={`mob-children${expanded === 'san-pham' ? ' open' : ''}`}>
            <Link href="/nguyen-lieu" className="mob-child" onClick={close}><i className="ti ti-bottle"></i> Nguyên Liệu</Link>
            <Link href="/dung-cu" className="mob-child" onClick={close}><i className="ti ti-coffee"></i> Dụng Cụ</Link>
          </div>
        </div>

        <div className="mob-parent">
          <button className={`mob-parent-btn${expanded === 'hinh-anh' ? ' open' : ''}${isHinhAnh ? ' active-parent' : ''}`} onClick={() => toggle('hinh-anh')}>
            <span>Thư Viện</span>
            <i className="ti ti-chevron-down mob-chevron"></i>
          </button>
          <div className={`mob-children${expanded === 'hinh-anh' ? ' open' : ''}`}>
            <Link href="/hinh-anh/trao-bang" className="mob-child" onClick={close}><i className="ti ti-certificate"></i> Trao Bằng Học Viên</Link>
            <Link href="/hinh-anh/lop-hoc" className="mob-child" onClick={close}><i className="ti ti-school"></i> Hình Ảnh Lớp Học</Link>
            <Link href="/video" className="mob-child" onClick={close}><i className="ti ti-video"></i> Làm Món Cùng Giảng Viên</Link>
          </div>
        </div>

        <div className="mob-parent">
          <button className={`mob-parent-btn${expanded === 'xu-huong' ? ' open' : ''}`} onClick={() => toggle('xu-huong')}>
            <span>Xu Hướng</span>
            <i className="ti ti-chevron-down mob-chevron"></i>
          </button>
          <div className={`mob-children${expanded === 'xu-huong' ? ' open' : ''}`}>
            <a href="https://maynitrosodahvcp.vercel.app/" target="_blank" rel="noopener noreferrer" className="mob-child" onClick={close}>
              <i className="ti ti-bolt"></i> Nâng Cấp Menu Với Công Nghệ Nitro Soda
            </a>
            {articles.map(a => (
              <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer" className="mob-child" onClick={close}>
                <i className="ti ti-news"></i> {a.title}
              </a>
            ))}
            <a href="https://hocviencaphe.vn/kinh-nghiem/" target="_blank" rel="noopener noreferrer" className="mob-child" onClick={close}>
              <i className="ti ti-arrow-right"></i> Xem tất cả Kinh Nghiệm
            </a>
          </div>
        </div>

        <Link href="/lien-he" className={`mob-top-link${pathname === '/lien-he' ? ' active' : ''}`} onClick={close}>Liên Hệ</Link>

        <div className="mob-divider" />

        <Link href="/yeu-thich" className={`mob-top-link${pathname === '/yeu-thich' ? ' active' : ''}`} onClick={close}>
          <i className="ti ti-heart"></i> Yêu Thích {wishCount > 0 && `(${wishCount})`}
        </Link>

        {phone ? (
          <>
            {isAdmin && <Link href="/admin" onClick={close} className="mob-top-link">⚙ Quản Lý Admin</Link>}
            <Link href="/tai-khoan" onClick={close} className={`mob-top-link${pathname === '/tai-khoan' ? ' active' : ''}`}>
              <i className="ti ti-user-circle"></i> Tài Khoản ({displayName})
            </Link>
            <button className="mob-logout" onClick={() => { logout(); close(); }}>
              <i className="ti ti-logout"></i> Thoát
            </button>
          </>
        ) : (
          <Link href="/login" onClick={close} className="mob-login-link">
            <i className="ti ti-lock"></i> Đăng Nhập
          </Link>
        )}
      </div>
    </>
  );
}
