'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { LarkRecipe } from '@/lib/lark';

export default function CongThuc2Page() {
  const [recipes, setRecipes]           = useState<LarkRecipe[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeCat, setActiveCat]       = useState('Tất cả');
  const [searchQ, setSearchQ]           = useState('');
  const [modalOpen, setModalOpen]       = useState(false);
  const [selected, setSelected]         = useState<LarkRecipe | null>(null);
  const [isLoggedIn, setIsLoggedIn]     = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin]           = useState(false);
  const [courseAccess, setCourseAccess] = useState<string[] | null>(null);

  // Auth check
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setIsLoggedIn(false); setCourseAccess([]); return; }
      setIsLoggedIn(true);
      if (user.app_metadata?.role === 'admin') { setIsAdmin(true); setCourseAccess(null); return; }
      const { data } = await supabase
        .from('students')
        .select('course_access')
        .eq('auth_user_id', user.id)
        .maybeSingle();
      setCourseAccess((data?.course_access as string[]) ?? []);
    });
  }, []);

  // Fetch recipes from Lark API
  useEffect(() => {
    fetch('/api/lark-recipes')
      .then(r => r.json())
      .then(d => setRecipes(d.recipes ?? []))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, []);

  // Derived categories
  const cats = ['Tất cả', ...Array.from(new Set(recipes.map(r => r.category).filter(Boolean))).sort()];

  const filtered = recipes.filter(r => {
    const matchCat = activeCat === 'Tất cả' || r.category === activeCat;
    const q = searchQ.toLowerCase();
    const matchQ = !q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const canView = isAdmin || isLoggedIn === true;
  const noAccess = isLoggedIn === true && !isAdmin && courseAccess !== null && courseAccess.length === 0;

  const openModal  = (r: LarkRecipe) => { setSelected(r); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setSelected(null); };

  const fmtCost = (n: number) =>
    new Intl.NumberFormat('vi-VN').format(n) + ' VNĐ';

  // Split text by newlines for display
  const splitLines = (text: string) =>
    text.split(/\n/).map(l => l.trim()).filter(Boolean);

  return (
    <>
      {/* HERO */}
      <section className="ct-hero">
        <div className="ct-hero-bg">
          <img src="/images/gallery/Concept-studio-with-products/14. Matcha latte bg.webp" alt="Công Thức 2" loading="eager" />
        </div>
        <div className="ct-hero-ov"></div>
        <div className="container">
          <div className="ct-hero-body">
            <div className="ct-hero-crumb">
              <Link href="/">Trang Chủ</Link>
              <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
              <span>Công Thức 2</span>
            </div>
            <h1>Kho Công Thức<br /><em>Thực Tế</em></h1>
            <p className="ct-hero-sub">
              {loading ? 'Đang tải...' : `${recipes.length}+ công thức`} — đầy đủ hướng dẫn pha chế, tổng cost và công thức chi tiết dành cho học viên Học Viện Cà Phê.
            </p>
            <div className="ct-hero-badges">
              <span className="ct-badge"><i className="ti ti-lock"></i> Nội dung độc quyền</span>
              <span className="ct-badge"><i className="ti ti-database"></i> Lark Base</span>
              <span className="ct-badge"><i className="ti ti-refresh"></i> Cập nhật thường xuyên</span>
            </div>
          </div>
        </div>
      </section>

      {/* ACCESS BANNER */}
      {noAccess && (
        <div className="ct-access-banner">
          <i className="ti ti-lock-access"></i>
          <div>
            <strong>Tài khoản chưa được cấp quyền xem công thức.</strong>
            <span> Vui lòng liên hệ Học Viện qua{' '}
              <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer">Zalo 0834 790 555</a>
              {' '}để được kích hoạt sau khi đăng ký khóa học.
            </span>
          </div>
        </div>
      )}

      {/* CONTROLS */}
      <div className="ct-controls-wrap">
        <div className="container">
          <div className="ct-controls">
            <div className="ct-cats">
              {cats.map(c => (
                <button key={c} className={`ct-btn${activeCat === c ? ' active' : ''}`} onClick={() => setActiveCat(c)}>{c}</button>
              ))}
            </div>
            <div className="ct-search-wrap">
              <i className="ti ti-search"></i>
              <input
                className="ct-search"
                type="text"
                placeholder="Tìm công thức..."
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
              />
              {searchQ && (
                <button className="ct-search-clear" onClick={() => setSearchQ('')} aria-label="Xóa">
                  <i className="ti ti-x"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          {loading ? (
            <div className="ct2-skeleton-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="ct2-skeleton-card">
                  <div className="ct2-sk-img"></div>
                  <div className="ct2-sk-body">
                    <div className="ct2-sk-line short"></div>
                    <div className="ct2-sk-line"></div>
                    <div className="ct2-sk-line short"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="ct-empty">
              <i className="ti ti-mood-sad"></i>
              <p>Không tìm thấy công thức phù hợp</p>
              <button className="btn btn-outline" onClick={() => { setActiveCat('Tất cả'); setSearchQ(''); }}>Xem tất cả</button>
            </div>
          ) : (
            <div className="ct-grid">
              {filtered.map(r => (
                <div key={r.id} className="ct-card" onClick={() => openModal(r)}>
                  <div className="ct-card-img">
                    {r.photoUrl
                      ? <img src={r.photoUrl} alt={r.name} loading="lazy" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      : <div className="ct2-no-img"><i className="ti ti-coffee"></i></div>
                    }
                    <div className="ct-card-lock"><i className="ti ti-lock"></i></div>
                  </div>
                  <div className="ct-card-body">
                    <span className="ct-card-cat">{r.category}</span>
                    <h3 className="ct-card-name">{r.name}</h3>
                    {r.totalCost && (
                      <div className="ct-card-foot">
                        <span className="ct-cost"><i className="ti ti-coin"></i> {fmtCost(r.totalCost)}</span>
                        <span className="ct-view-btn">Xem công thức <i className="ti ti-arrow-right"></i></span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL */}
      {modalOpen && selected && (
        <div className="ct-modal-bg" onClick={closeModal}>
          <div className="ct-modal" onClick={e => e.stopPropagation()}>
            <button className="ct-modal-close" onClick={closeModal} aria-label="Đóng"><i className="ti ti-x"></i></button>

            <div className="ct-modal-img">
              {selected.photoUrl
                ? <img src={selected.photoUrl} alt={selected.name} />
                : <div className="ct2-modal-no-img"><i className="ti ti-coffee"></i></div>
              }

              {/* Gate: chưa đăng nhập */}
              {isLoggedIn === false && (
                <div className="ct-modal-lock-ov">
                  <div className="ct-modal-lock-box">
                    <div className="ct-lock-ico"><i className="ti ti-user-circle"></i></div>
                    <h3>Đăng Nhập Để Xem</h3>
                    <p>Chỉ học viên Học Viện Cà Phê mới xem được công thức chi tiết.</p>
                    <Link href="/login" className="btn btn-primary" onClick={closeModal}>
                      <i className="ti ti-login"></i> Đăng Nhập Ngay
                    </Link>
                    <Link href="/dang-ky-hoc-vien" className="ct-modal-gate-sub" onClick={closeModal}>
                      Chưa có tài khoản? Đăng ký học viên
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="ct-modal-body">
              <span className="ct-card-cat">{selected.category}</span>
              <h2>{selected.name}</h2>

              {selected.totalCost && (
                <div className="ct-modal-meta">
                  <span><i className="ti ti-coin"></i> Tổng cost: <strong>{fmtCost(selected.totalCost)}</strong></span>
                </div>
              )}

              {canView ? (
                <>
                  {selected.instructions && (
                    <div className="ct-modal-section">
                      <h4><i className="ti ti-steps"></i> Hướng dẫn pha chế</h4>
                      <ol className="ct-steps-list">
                        {splitLines(selected.instructions).map((line, i) => (
                          <li key={i}>{line.replace(/^B\d+:\s*/, '')}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {selected.recipe && (
                    <div className="ct-modal-section">
                      <h4><i className="ti ti-list"></i> Công thức</h4>
                      <ul className="ct-ing-list">
                        {splitLines(selected.recipe).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : isLoggedIn !== false ? (
                /* Đã đăng nhập nhưng không có quyền */
                <div className="ct-modal-cta">
                  <Link href="/dang-ky" className="btn btn-primary" onClick={closeModal}>
                    <i className="ti ti-calendar-check"></i> Đăng Ký Để Xem Đầy Đủ
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ct2-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }
        .ct2-skeleton-card {
          background: var(--white);
          border-radius: var(--r-lg);
          overflow: hidden;
          box-shadow: var(--sh-sm);
        }
        .ct2-sk-img {
          height: 180px;
          background: linear-gradient(90deg, #f0e8df 25%, #e8ddd4 50%, #f0e8df 75%);
          background-size: 200% 100%;
          animation: ct2shimmer 1.4s infinite;
        }
        .ct2-sk-body { padding: 16px; }
        .ct2-sk-line {
          height: 12px; border-radius: 6px; margin-bottom: 8px;
          background: linear-gradient(90deg, #f0e8df 25%, #e8ddd4 50%, #f0e8df 75%);
          background-size: 200% 100%;
          animation: ct2shimmer 1.4s infinite;
        }
        .ct2-sk-line.short { width: 55%; }
        @keyframes ct2shimmer {
          0%  { background-position: 200% 0; }
          100%{ background-position: -200% 0; }
        }
        .ct2-no-img {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 3rem; color: var(--muted);
          background: var(--bg-alt);
        }
        .ct2-modal-no-img {
          width: 100%; height: 220px;
          display: flex; align-items: center; justify-content: center;
          font-size: 4rem; color: var(--muted);
          background: var(--bg-alt);
        }
      `}</style>
    </>
  );
}
