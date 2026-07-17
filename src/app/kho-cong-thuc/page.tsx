'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { buildSlugIndex } from '@/lib/slug';

type CongThuc = {
  id: string; name: string; category: string; photo_url: string;
  instructions: string; total_cost: number | null; recipe_text: string;
  linked_product_ids: string[]; courses: string[]; locked?: boolean;
};
type ExternalIngredient = {
  name: string; shopLink: string;
};
type ExternalRecipe = {
  id: string; name: string; short_name: string; category: string; source: string;
  image_url: string; steps: string; ingredients: ExternalIngredient[]; active: boolean; locked?: boolean;
};

const PER_PAGE = 24;

export default function KhoCongThucPage() {
  const [tab, setTab]               = useState<'internal' | 'external'>('internal');
  const [recipes, setRecipes]       = useState<CongThuc[]>([]);
  const [externalRecipes, setExternalRecipes] = useState<ExternalRecipe[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeCat, setActiveCat]   = useState('Tất cả');
  const [searchQ, setSearchQ]       = useState('');
  const [page, setPage]             = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [courseAccess, setCourseAccess] = useState<string[] | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const sb = createClient();
    void (async () => {
      const { data: { session } } = await sb.auth.getSession();
      setIsLoggedIn(!!session);
      if (session?.user) {
        if (session.user.app_metadata?.role === 'admin') {
          setIsAdmin(true);
          setCourseAccess(['admin']);
        } else {
          const { data } = await sb.from('students').select('course_access').eq('auth_user_id', session.user.id).maybeSingle();
          setCourseAccess((data?.course_access as string[]) ?? []);
        }
      } else {
        setCourseAccess([]);
      }
    })();
    void sb.from('cong_thuc_hvcp').select('*').order('sort_order').order('created_at')
      .then(({ data }) => { setRecipes(data ?? []); });
    void sb.from('cong_thuc_chia_se').select('*').eq('active', true).order('sort_order').order('created_at')
      .then(({ data }) => { setExternalRecipes(data ?? []); setLoading(false); }, () => setLoading(false));
  }, []);

  const switchTab = (t: 'internal' | 'external') => {
    setTab(t); setActiveCat('Tất cả'); setSearchQ(''); setPage(1);
  };

  useEffect(() => { setPage(1); }, [activeCat, searchQ, tab]);

  const hasAccess = isAdmin || (isLoggedIn === true && courseAccess !== null && courseAccess.length > 0);

  const internalIndex = useMemo(() => buildSlugIndex(recipes, r => r.name), [recipes]);
  const externalIndex = useMemo(() => buildSlugIndex(externalRecipes, r => r.name), [externalRecipes]);

  const byLockedLast = <T extends { locked?: boolean }>(list: T[]) =>
    [...list].sort((a, b) => (a.locked ? 1 : 0) - (b.locked ? 1 : 0));

  // --- INTERNAL ---
  const internalCats = ['Tất cả', ...Array.from(new Set(recipes.map(r => r.category).filter(Boolean))).sort()];
  const filteredInternal = byLockedLast(recipes.filter(r => {
    const matchCat = activeCat === 'Tất cả' || r.category === activeCat;
    const q = searchQ.toLowerCase();
    return matchCat && (!q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  }));

  // --- EXTERNAL ---
  const externalCats = ['Tất cả', ...Array.from(new Set(externalRecipes.map(r => r.category).filter(Boolean))).sort()];
  const filteredExternal = byLockedLast(externalRecipes.filter(r => {
    const matchCat = activeCat === 'Tất cả' || r.category === activeCat;
    const q = searchQ.toLowerCase();
    return matchCat && (!q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  }));

  const fmtCost = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' VNĐ';

  const cats = tab === 'internal' ? internalCats : externalCats;
  const filteredCount = tab === 'internal' ? filteredInternal.length : filteredExternal.length;
  const totalPages = Math.ceil(filteredCount / PER_PAGE);
  const paginatedInternal = filteredInternal.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const paginatedExternal = filteredExternal.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      {/* HERO */}
      <section className="ct-hero">
        <div className="ct-hero-bg">
          <img src="/images/gallery/Concept-studio-with-products/43. Trà đào cam sả bg.webp" alt="Kho Công Thức" loading="eager" />
        </div>
        <div className="ct-hero-ov"></div>
        <div className="container">
          <div className="ct-hero-body">
            <div className="ct-hero-crumb">
              <Link href="/">Trang Chủ</Link>
              <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
              <span>Kho Công Thức</span>
            </div>
            <h1>Kho<br /><em>Công Thức</em></h1>
            <p className="ct-hero-sub">
              Công thức HVCP dùng nguyên liệu của học viện — và công thức miễn phí pha chế tại nhà.
            </p>
            <div className="ct-hero-badges">
              <span className="ct-badge"><i className="ti ti-building-store"></i> {loading ? '...' : recipes.length} CT HVCP</span>
              <span className="ct-badge"><i className="ti ti-gift"></i> {externalRecipes.length} CT Miễn Phí</span>
              <span className="ct-badge"><i className="ti ti-truck-delivery"></i> Ship Toàn Quốc</span>
            </div>
          </div>
        </div>
      </section>

      {/* UNLOCK OFFER BANNER */}
      <div className="kct-unlock-wrap">
        <div className="container">
          <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className="kct-unlock-banner-link">
            <Image src="/images/banners/kct-unlock-banner.png" alt="Ưu đãi khách hàng mới — Mua nguyên liệu từ 3.000.000đ trở lên, mở khóa toàn bộ công thức nội bộ hoàn toàn miễn phí"
              width={2172} height={724} className="kct-unlock-img" priority />
          </a>
        </div>
      </div>

      {/* TYPE TABS */}
      <div className="kct-type-tabs">
        <div className="container">
          <button
            className={`kct-tab-btn${tab === 'internal' ? ' active' : ''}`}
            onClick={() => switchTab('internal')}
          >
            <i className="ti ti-building-store"></i> Công Thức HVCP
            <span className="kct-tab-badge">{loading ? '...' : recipes.length}</span>
          </button>
          <button
            className={`kct-tab-btn${tab === 'external' ? ' active' : ''}`}
            onClick={() => switchTab('external')}
          >
            <i className="ti ti-gift"></i> Công Thức Miễn Phí
            <span className="kct-tab-badge">{externalRecipes.length}</span>
          </button>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="ct-controls-wrap kct-controls-sticky">
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
        </div>
      </div>

      {/* GRID */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <p className="kct-count">{filteredCount} công thức</p>

          {tab === 'internal' ? (
            loading ? (
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
            ) : filteredInternal.length === 0 ? (
              <div className="ct-empty">
                <i className="ti ti-mood-sad"></i>
                <p>Không tìm thấy công thức phù hợp</p>
                <button className="btn btn-outline" onClick={() => { setActiveCat('Tất cả'); setSearchQ(''); }}>Xem tất cả</button>
              </div>
            ) : (
              <div className="ct-grid">
                {paginatedInternal.map(r => {
                  const showLock = !hasAccess && r.locked;
                  const slug = internalIndex.byId.get(r.id);
                  return (
                  <Link href={`/kho-cong-thuc/${slug}`} key={r.id} className="ct-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    <div className="ct-card-img">
                      {r.photo_url
                        ? <Image src={r.photo_url} alt={showLock ? '' : r.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                            style={{ objectFit: 'cover', ...(showLock ? { filter: 'blur(10px)', transform: 'scale(1.12)' } : {}) }} loading="lazy" />
                        : <div className="ct2-no-img"><i className="ti ti-coffee"></i></div>
                      }
                      {showLock
                        ? <div className="kct-card-lock-ov"><i className="ti ti-lock"></i></div>
                        : <span className="kct-tag-internal"><i className="ti ti-building-store"></i> Nội bộ</span>}
                    </div>
                    <div className="ct-card-body">
                      <span className="ct-card-cat">{r.category}</span>
                      <h3 className="ct-card-name">{r.name}</h3>
                      {!showLock && r.total_cost != null && (
                        <div className="ct-card-foot">
                          <span className="ct-cost"><i className="ti ti-coin"></i> {fmtCost(r.total_cost)}</span>
                          <span className="ct-view-btn">Xem công thức <i className="ti ti-arrow-right"></i></span>
                        </div>
                      )}
                      {showLock && (
                        <div className="ct-card-foot">
                          <span style={{ fontSize: '.75rem', color: '#c0392b', fontWeight: 600 }}><i className="ti ti-lock"></i> Đang khóa</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  );
                })}
              </div>
            )
          ) : (
            filteredExternal.length === 0 ? (
              <div className="ct-empty">
                <i className="ti ti-mood-sad"></i>
                <p>Không tìm thấy công thức phù hợp</p>
                <button className="btn btn-outline" onClick={() => { setActiveCat('Tất cả'); setSearchQ(''); }}>Xem tất cả</button>
              </div>
            ) : (
              <div className="ct-grid">
                {paginatedExternal.map(r => {
                  const showLock = !hasAccess && r.locked;
                  const slug = externalIndex.byId.get(r.id);
                  return (
                  <Link href={`/kho-cong-thuc/${slug}`} key={r.id} className="ct-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    <div className="ct-card-img">
                      {r.image_url
                        ? <img src={r.image_url} alt={showLock ? '' : r.name} loading="lazy"
                            style={showLock ? { filter: 'blur(10px)', transform: 'scale(1.12)' } : {}} />
                        : <div className="ct2-no-img"><i className="ti ti-world"></i></div>}
                      {showLock
                        ? <div className="kct-card-lock-ov"><i className="ti ti-lock"></i></div>
                        : <span className="kct-tag-external"><i className="ti ti-gift"></i> Miễn phí</span>}
                    </div>
                    <div className="ct-card-body">
                      <span className="ct-card-cat">{r.category}</span>
                      <h3 className="ct-card-name">{r.short_name || r.name}</h3>
                      {!showLock && r.source && (
                        <div className="ct-card-foot">
                          <span className="kct-source-hint"><i className="ti ti-link"></i> {r.source}</span>
                        </div>
                      )}
                      {showLock && (
                        <div className="ct-card-foot">
                          <span style={{ fontSize: '.75rem', color: '#c0392b', fontWeight: 600 }}><i className="ti ti-lock"></i> Đang khóa</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  );
                })}
              </div>
            )
          )}

          {/* Pagination */}
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

      <style>{`
        .kct-unlock-wrap { background: var(--bg); padding: 24px 0 4px; }
        .kct-unlock-banner-link { display: block; border-radius: var(--r-lg); overflow: hidden; box-shadow: 0 10px 28px rgba(73,182,229,.25); transition: transform .2s, box-shadow .2s; }
        .kct-unlock-banner-link:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(73,182,229,.32); }
        .kct-unlock-img { width: 100%; height: auto; display: block; }
        .kct-type-tabs { background: var(--white); border-bottom: 1px solid var(--border); position: sticky; top: var(--nav-h); z-index: 92; }
        .kct-type-tabs .container { display: flex; overflow-x: auto; scrollbar-width: none; }
        .kct-type-tabs .container::-webkit-scrollbar { display: none; }
        .kct-tab-btn { flex-shrink: 0; padding: 14px 24px; font-size: .88rem; font-weight: 600; color: var(--text-3); background: none; border: none; border-bottom: 2.5px solid transparent; cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 7px; white-space: nowrap; font-family: inherit; }
        .kct-tab-btn:hover { color: var(--accent); }
        .kct-tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
        .kct-tab-badge { font-size: .65rem; font-weight: 700; background: var(--bg-alt); color: var(--muted); padding: 2px 7px; border-radius: 100px; }
        .kct-tab-btn.active .kct-tab-badge { background: rgba(73,182,229,.12); color: var(--accent); }
        .kct-controls-sticky .ct-controls-wrap, .kct-controls-sticky { top: calc(var(--nav-h) + 49px) !important; }
        .kct-count { font-size: .78rem; font-weight: 600; color: var(--muted); margin-bottom: 20px; text-transform: uppercase; letter-spacing: .06em; }
        .kct-tag-internal, .kct-tag-external { position: absolute; top: 8px; left: 8px; font-size: .6rem; font-weight: 700; padding: 3px 8px; border-radius: 100px; display: flex; align-items: center; gap: 3px; }
        .kct-tag-internal { background: #ECFDF5; color: #065F46; }
        .kct-tag-external { background: #EFF6FF; color: #1D4ED8; }
        .kct-source-hint { font-size: .69rem; color: var(--muted); display: flex; align-items: center; gap: 4px; }
        .kct-card-lock-ov { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.42); }
        .kct-card-lock-ov i { font-size: 2rem; color: #fff; }
        .ct2-skeleton-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px; }
        .ct2-skeleton-card { background:var(--white); border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--sh-sm); }
        .ct2-sk-img { height:180px; background:linear-gradient(90deg,#f0e8df 25%,#e8ddd4 50%,#f0e8df 75%); background-size:200% 100%; animation:ct2shimmer 1.4s infinite; }
        .ct2-sk-body { padding:16px; }
        .ct2-sk-line { height:12px; border-radius:6px; margin-bottom:8px; background:linear-gradient(90deg,#f0e8df 25%,#e8ddd4 50%,#f0e8df 75%); background-size:200% 100%; animation:ct2shimmer 1.4s infinite; }
        .ct2-sk-line.short { width:55%; }
        @keyframes ct2shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .ct2-no-img { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:3rem; color:var(--muted); background:var(--bg-alt); }
      `}</style>
    </>
  );
}

