'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';

type CongThuc = {
  id: string; name: string; category: string; photo_url: string;
  instructions: string; total_cost: number | null; recipe_text: string;
  linked_product_ids: string[]; courses: string[];
};
type Product = {
  id: string; name: string; unit: string; price: number; image_url: string;
};
type RecipeIngItem = {
  id: string; source: 'internal' | 'external'; name: string;
  quantity: number; unit: string; cost_per_unit: number;
};

const PER_PAGE = 24;

export default function CongThucPage() {
  const [recipes, setRecipes]           = useState<CongThuc[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeCat, setActiveCat]       = useState('Tất cả');
  const [activeCourse, setActiveCourse] = useState('');
  const [searchQ, setSearchQ]           = useState('');
  const [page, setPage]                 = useState(1);
  const [modalOpen, setModalOpen]       = useState(false);
  const [selected, setSelected]         = useState<CongThuc | null>(null);
  const [isLoggedIn, setIsLoggedIn]     = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin]           = useState(false);
  const [courseAccess, setCourseAccess] = useState<string[] | null>(null);
  const [allProducts, setAllProducts]   = useState<Product[]>([]);
  const [addedIds, setAddedIds]         = useState<Set<string>>(new Set());
  const [recipeItems, setRecipeItems]   = useState<RecipeIngItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const { addItem, openCart } = useCart();

  useEffect(() => {
    const supabase = createClient();
    const timer = setTimeout(() => setLoading(false), 8000);

    const initAuth = async () => {
      try {
        const { data: { session } } = await Promise.race([
          supabase.auth.getSession(),
          new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000)),
        ]);
        if (!session) { setIsLoggedIn(false); setCourseAccess([]); return; }
        const user = session.user;
        setIsLoggedIn(true);
        if (user.app_metadata?.role === 'admin') { setIsAdmin(true); setCourseAccess(null); return; }
        const { data } = await supabase.from('students').select('course_access').eq('auth_user_id', user.id).maybeSingle();
        setCourseAccess((data?.course_access as string[]) ?? []);
      } catch { setIsLoggedIn(false); setCourseAccess([]); }
    };
    void initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') { setIsLoggedIn(false); setCourseAccess([]); setIsAdmin(false); }
    });

    void supabase.from('products').select('id,name,unit,price,image_url').eq('active', true)
      .then(({ data }) => { if (data) setAllProducts(data); });
    void (async () => {
      try {
        const { data } = await supabase.from('cong_thuc').select('*').order('sort_order').order('created_at');
        setRecipes(data ?? []);
      } finally {
        clearTimeout(timer);
        setLoading(false);
      }
    })();

    return () => { clearTimeout(timer); subscription.unsubscribe(); };
  }, []);

  const cats = ['Tất cả', ...Array.from(new Set(recipes.map(r => r.category).filter(Boolean))).sort()];
  const allCourses = Array.from(new Set(recipes.flatMap(r => r.courses ?? []).filter(Boolean))).sort();

  const filtered = recipes.filter(r => {
    const matchCat = activeCat === 'Tất cả' || r.category === activeCat;
    const matchCourse = !activeCourse || (r.courses ?? []).includes(activeCourse);
    const q = searchQ.toLowerCase();
    return matchCat && matchCourse && (!q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  });

  useEffect(() => { setPage(1); }, [activeCat, activeCourse, searchQ]);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const canView = (recipe: CongThuc) =>
    isAdmin ||
    !(recipe.courses ?? []).length ||
    (recipe.courses ?? []).some(c => courseAccess?.includes(c) ?? false);
  const noAccess = isLoggedIn === true && !isAdmin && courseAccess !== null && courseAccess.length === 0;

  const openModal  = (r: CongThuc) => {
    setSelected(r); setModalOpen(true); setAddedIds(new Set()); setRecipeItems([]);
    if (canView(r)) {
      setItemsLoading(true);
      void createClient().from('recipe_ingredient_items')
        .select('id,source,name,quantity,unit,cost_per_unit')
        .eq('recipe_id', r.id).order('created_at')
        .then(({ data }) => { setRecipeItems(data ?? []); setItemsLoading(false); });
    }
  };
  const closeModal = () => { setModalOpen(false); setSelected(null); setRecipeItems([]); };

  const fmtCost = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' VNĐ';
  const splitLines = (text: string) => text.split(/\n/).map(l => l.trim()).filter(Boolean);

  // Exact match by ID — no fuzzy matching needed
  const linkedProducts = selected && canView(selected)
    ? allProducts.filter(p => selected.linked_product_ids?.includes(p.id))
    : [];

  const handleAddToCart = useCallback((p: Product) => {
    addItem({ id: p.id, name: p.name, price: p.price, image_url: p.image_url, unit: p.unit });
    setAddedIds(prev => new Set([...prev, p.id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n; }), 1500);
  }, [addItem]);

  return (
    <>
      {/* HERO */}
      <section className="ct-hero">
        <div className="ct-hero-bg">
          <img src="/images/gallery/Concept-studio-with-products/14. Matcha latte bg.webp" alt="Công Thức" loading="eager" />
        </div>
        <div className="ct-hero-ov"></div>
        <div className="container">
          <div className="ct-hero-body">
            <div className="ct-hero-crumb">
              <Link href="/">Trang Chủ</Link>
              <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
              <span>Công Thức</span>
            </div>
            <h1>Kho Công Thức<br /><em>Thực Tế</em></h1>
            <p className="ct-hero-sub">
              {loading ? 'Đang tải...' : `${recipes.length}+ công thức`} — đầy đủ hướng dẫn pha chế, tổng cost và công thức chi tiết dành cho học viên Học Viện Cà Phê.
            </p>
            <div className="ct-hero-badges">
              <span className="ct-badge"><i className="ti ti-lock"></i> Nội dung độc quyền</span>
              <span className="ct-badge"><i className="ti ti-database"></i> Cập nhật bởi Admin</span>
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
              <input className="ct-search" type="text" placeholder="Tìm công thức..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
              {searchQ && <button className="ct-search-clear" onClick={() => setSearchQ('')}><i className="ti ti-x"></i></button>}
            </div>
          </div>
          {allCourses.length > 0 && (
            <div className="ct-course-filter">
              <button className={`ct-course-btn${!activeCourse ? ' active' : ''}`} onClick={() => setActiveCourse('')}>Tất cả khóa</button>
              {allCourses.map(c => (
                <button key={c} className={`ct-course-btn${activeCourse === c ? ' active' : ''}`} onClick={() => setActiveCourse(activeCourse === c ? '' : c)}>{c}</button>
              ))}
            </div>
          )}
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
            <>
              <div className="ct-grid">
                {paginated.map(r => (
                  <div key={r.id} className="ct-card" onClick={() => openModal(r)}>
                    <div className="ct-card-img">
                      {r.photo_url
                        ? <Image src={r.photo_url} alt={r.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px" style={{ objectFit: 'cover' }} loading="lazy" />
                        : <div className="ct2-no-img"><i className="ti ti-coffee"></i></div>
                      }
                      <div className="ct-card-lock"><i className="ti ti-lock"></i></div>
                    </div>
                    <div className="ct-card-body">
                      <span className="ct-card-cat">{r.category}</span>
                      <h3 className="ct-card-name">{r.name}</h3>
                      {r.total_cost != null && (
                        <div className="ct-card-foot">
                          <span className="ct-cost"><i className="ti ti-coin"></i> {fmtCost(r.total_cost)}</span>
                          <span className="ct-view-btn">Xem công thức <i className="ti ti-arrow-right"></i></span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="nl-pagination">
                  <button className="nl-page-btn" disabled={page === 1}
                    onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 260, behavior: 'smooth' }); }}>
                    <i className="ti ti-chevron-left"></i>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} className={`nl-page-btn${page === n ? ' active' : ''}`}
                      onClick={() => { setPage(n); window.scrollTo({ top: 260, behavior: 'smooth' }); }}>
                      {n}
                    </button>
                  ))}
                  <button className="nl-page-btn" disabled={page === totalPages}
                    onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 260, behavior: 'smooth' }); }}>
                    <i className="ti ti-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}

          {/* CTA */}
          <div className="nl-cta">
            <i className="ti ti-headset" style={{ fontSize: '2rem', color: 'var(--accent)', display: 'block', marginBottom: '12px' }}></i>
            <h3>Tư Vấn Và Đặt Nguyên Liệu</h3>
            <p>Liên hệ trực tiếp với Kho NVL để được tư vấn và hỗ trợ đặt hàng — ship toàn quốc.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
              <a href="https://zalo.me/0931433684" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <i className="ti ti-brand-zalo"></i> Chat Zalo ngay
              </a>
              <a href="https://www.facebook.com/profile.php?id=61560410163133" target="_blank" rel="noopener noreferrer" className="btn btn-facebook">
                <i className="ti ti-brand-facebook"></i> Facebook Kho NVL
              </a>
              <a href="tel:0931433684" className="btn btn-outline">
                <i className="ti ti-phone"></i> Gọi 0931.433.684
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {modalOpen && selected && (
        <div className="ct-modal-bg" onClick={closeModal}>
          <div className="ct-modal" onClick={e => e.stopPropagation()}>
            <button className="ct-modal-close" onClick={closeModal} aria-label="Đóng"><i className="ti ti-x"></i></button>

            <div className="ct-modal-img">
              {selected.photo_url
                ? <Image src={selected.photo_url} alt={selected.name} fill sizes="(max-width: 768px) 100vw, 700px" style={{ objectFit: 'cover' }} />
                : <div className="ct2-modal-no-img"><i className="ti ti-coffee"></i></div>
              }
              {isLoggedIn === false ? (
                <div className="ct-modal-lock-ov">
                  <div className="ct-modal-lock-box">
                    <div className="ct-lock-ico"><i className="ti ti-user-circle"></i></div>
                    <h3>Đăng Nhập Để Xem</h3>
                    <p>Nội dung chỉ dành cho khách hàng và học viên của Học Viện Cà Phê.</p>
                    <Link href="/login" className="btn btn-primary" onClick={closeModal}>
                      <i className="ti ti-login"></i> Đăng Nhập Ngay
                    </Link>
                    <Link href="/dang-ky-hoc-vien" className="ct-modal-gate-sub" onClick={closeModal}>
                      Chưa có tài khoản? Đăng ký học viên
                    </Link>
                  </div>
                </div>
              ) : !canView(selected) ? (
                <div className="ct-modal-lock-ov">
                  <div className="ct-modal-lock-box">
                    <div className="ct-lock-ico"><i className="ti ti-lock"></i></div>
                    <h3>Nội Dung Độc Quyền</h3>
                    <p>Công thức này dành cho học viên đã được cấp quyền truy cập.</p>
                    <Link href="/dang-ky" className="btn btn-primary" onClick={closeModal}>
                      <i className="ti ti-calendar-check"></i> Đăng Ký Khóa Học
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="ct-modal-body">
              <span className="ct-card-cat">{selected.category}</span>
              <h2>{selected.name}</h2>

              {selected.total_cost != null && (
                <div className="ct-modal-meta">
                  <span><i className="ti ti-coin"></i> Tổng cost: <strong>{fmtCost(selected.total_cost)}</strong></span>
                </div>
              )}

              {canView(selected) ? (
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

                  {recipeItems.length > 0 ? (
                    <div className="ct-modal-section">
                      <h4><i className="ti ti-list"></i> Công thức &amp; định lượng</h4>
                      <div className="ct-cost-table-wrap">
                        <table className="ct-cost-table">
                          <thead>
                            <tr>
                              <th>Nguyên liệu</th>
                              <th className="num">Định lượng</th>
                              <th className="num">Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recipeItems.map(item => (
                              <tr key={item.id}>
                                <td>
                                  <span className={`ct-src-tag ${item.source}`}>{item.source === 'internal' ? 'HVCP' : 'Ngoài'}</span>
                                  {item.name}
                                </td>
                                <td className="num">{item.quantity} {item.unit}</td>
                                <td className="num cost">{fmtCost(Math.round(item.quantity * item.cost_per_unit))}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={2}>Tổng cost</td>
                              <td className="num total">{fmtCost(Math.round(recipeItems.reduce((s, i) => s + i.quantity * i.cost_per_unit, 0)))}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  ) : selected.recipe_text ? (
                    <div className="ct-modal-section">
                      <h4><i className="ti ti-list"></i> Công thức</h4>
                      {itemsLoading && <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '0 0 8px' }}><i className="ti ti-loader-2 spin"></i> Đang tải định lượng...</p>}
                      <ul className="ct-ing-list">
                        {splitLines(selected.recipe_text).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {linkedProducts.length > 0 && (
                    <div className="ct-modal-section ct-linked-products">
                      <h4><i className="ti ti-package"></i> Nguyên liệu sử dụng</h4>
                      <div className="ct-prod-list">
                        {linkedProducts.map(p => (
                          <div key={p.id} className="ct-prod-item">
                            <div className="ct-prod-img">
                              {p.image_url
                                ? <Image src={p.image_url} alt={p.name} width={48} height={48} style={{ objectFit: 'cover' }} loading="lazy" />
                                : <div className="ct-prod-img-ph"><i className="ti ti-package"></i></div>}
                            </div>
                            <div className="ct-prod-info">
                              <p className="ct-prod-name">{p.name}</p>
                              <p className="ct-prod-meta">{p.unit} · <strong>{p.price.toLocaleString('vi-VN')}đ</strong></p>
                            </div>
                            <div className="ct-prod-btns">
                              <Link href="/nguyen-lieu" className="ct-prod-view" onClick={closeModal}>Xem</Link>
                              <button
                                className={`ct-prod-add${addedIds.has(p.id) ? ' added' : ''}`}
                                onClick={() => handleAddToCart(p)}
                              >
                                {addedIds.has(p.id)
                                  ? <><i className="ti ti-check"></i> Đã thêm</>
                                  : <><i className="ti ti-shopping-cart-plus"></i> Thêm</>}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="ct-view-cart-btn" onClick={() => { closeModal(); openCart(); }}>
                        <i className="ti ti-shopping-cart"></i> Xem giỏ hàng
                      </button>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ct2-skeleton-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px; }
        .ct2-skeleton-card { background:var(--white); border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--sh-sm); }
        .ct2-sk-img { height:180px; background:linear-gradient(90deg,#f0e8df 25%,#e8ddd4 50%,#f0e8df 75%); background-size:200% 100%; animation:ct2shimmer 1.4s infinite; }
        .ct2-sk-body { padding:16px; }
        .ct2-sk-line { height:12px; border-radius:6px; margin-bottom:8px; background:linear-gradient(90deg,#f0e8df 25%,#e8ddd4 50%,#f0e8df 75%); background-size:200% 100%; animation:ct2shimmer 1.4s infinite; }
        .ct2-sk-line.short { width:55%; }
        @keyframes ct2shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .ct2-no-img { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:3rem; color:var(--muted); background:var(--bg-alt); }
        .ct2-modal-no-img { width:100%; height:220px; display:flex; align-items:center; justify-content:center; font-size:4rem; color:var(--muted); background:var(--bg-alt); }
        .ct-cost-table-wrap { border:1px solid var(--border); border-radius:var(--r); overflow:hidden; }
        .ct-cost-table { width:100%; border-collapse:collapse; font-size:0.9rem; }
        .ct-cost-table th { background:var(--bg-alt); text-align:left; padding:9px 12px; font-weight:600; font-size:0.82rem; color:var(--text-2); border-bottom:1px solid var(--border); }
        .ct-cost-table th.num, .ct-cost-table td.num { text-align:right; white-space:nowrap; }
        .ct-cost-table td { padding:9px 12px; border-bottom:1px solid var(--border); vertical-align:middle; }
        .ct-cost-table tbody tr:last-child td { border-bottom:none; }
        .ct-cost-table td.cost { font-weight:600; color:var(--accent); }
        .ct-cost-table tfoot td { background:var(--bg-alt); font-weight:700; border-top:2px solid var(--border); padding:11px 12px; }
        .ct-cost-table tfoot td.total { color:var(--accent); font-size:1rem; }
        .ct-src-tag { display:inline-block; font-size:0.68rem; font-weight:600; border-radius:3px; padding:1px 6px; margin-right:7px; vertical-align:middle; }
        .ct-src-tag.internal { background:#d1ecf1; color:#0c5460; }
        .ct-src-tag.external { background:#fff3cd; color:#856404; }
      `}</style>
    </>
  );
}
