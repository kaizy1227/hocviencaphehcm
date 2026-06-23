'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
type ExternalIngredient = {
  name: string; shopLink: string;
};
type ExternalRecipe = {
  id: string; name: string; short_name: string; category: string; source: string;
  image_url: string; steps: string; ingredients: ExternalIngredient[]; active: boolean;
};


const PLATFORM_LABEL: Record<string, string> = { shopee: 'Shopee', lazada: 'Lazada', tiki: 'Tiki' };

export default function KhoCongThucPage() {
  const [tab, setTab]               = useState<'internal' | 'external'>('internal');
  const [recipes, setRecipes]       = useState<CongThuc[]>([]);
  const [externalRecipes, setExternalRecipes] = useState<ExternalRecipe[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeCat, setActiveCat]   = useState('Tất cả');
  const [searchQ, setSearchQ]       = useState('');
  const [modalOpen, setModalOpen]   = useState(false);
  const [selInternal, setSelInternal] = useState<CongThuc | null>(null);
  const [selExternal, setSelExternal] = useState<ExternalRecipe | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [addedIds, setAddedIds]     = useState<Set<string>>(new Set());
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const { addItem, openCart } = useCart();

  useEffect(() => {
    const sb = createClient();
    void sb.from('products').select('id,name,unit,price,image_url').eq('active', true)
      .then(({ data }) => { if (data) setAllProducts(data); });
    void sb.from('cong_thuc_hvcp').select('*').order('sort_order').order('created_at')
      .then(({ data }) => { setRecipes(data ?? []); });
    void sb.from('cong_thuc_chia_se').select('*').eq('active', true).order('sort_order').order('created_at')
      .then(({ data }) => { setExternalRecipes(data ?? []); setLoading(false); }, () => setLoading(false));
  }, []);

  const switchTab = (t: 'internal' | 'external') => {
    setTab(t); setActiveCat('Tất cả'); setSearchQ(''); setModalOpen(false);
  };

  // --- INTERNAL ---
  const internalCats = ['Tất cả', ...Array.from(new Set(recipes.map(r => r.category).filter(Boolean))).sort()];
  const filteredInternal = recipes.filter(r => {
    const matchCat = activeCat === 'Tất cả' || r.category === activeCat;
    const q = searchQ.toLowerCase();
    return matchCat && (!q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  });
  const linkedProducts = selInternal ? allProducts.filter(p => selInternal.linked_product_ids?.includes(p.id)) : [];

  // --- EXTERNAL ---
  const externalCats = ['Tất cả', ...Array.from(new Set(externalRecipes.map(r => r.category).filter(Boolean))).sort()];
  const filteredExternal = externalRecipes.filter(r => {
    const matchCat = activeCat === 'Tất cả' || r.category === activeCat;
    const q = searchQ.toLowerCase();
    return matchCat && (!q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  });

  const openInternal = (r: CongThuc) => { setSelInternal(r); setSelExternal(null); setModalOpen(true); setAddedIds(new Set()); };
  const openExternal = (r: ExternalRecipe) => { setSelExternal(r); setSelInternal(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setSelInternal(null); setSelExternal(null); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (lightboxImg) { setLightboxImg(null); return; }
      setModalOpen(false); setSelInternal(null); setSelExternal(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxImg]);

  const handleAddToCart = useCallback((p: Product) => {
    addItem({ id: p.id, name: p.name, price: p.price, image_url: p.image_url, unit: p.unit });
    setAddedIds(prev => new Set([...prev, p.id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n; }), 1500);
  }, [addItem]);

  const splitLines = (text: string) => text.split(/\n/).map(l => l.trim()).filter(Boolean);
  const fmtCost = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' VNĐ';

  const cats = tab === 'internal' ? internalCats : externalCats;
  const filteredCount = tab === 'internal' ? filteredInternal.length : filteredExternal.length;
  const externalLoading = loading && tab === 'external';

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
                {filteredInternal.map(r => (
                  <div key={r.id} className="ct-card" onClick={() => openInternal(r)}>
                    <div className="ct-card-img">
                      {r.photo_url
                        ? <img src={r.photo_url} alt={r.name} loading="lazy" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                        : <div className="ct2-no-img"><i className="ti ti-coffee"></i></div>
                      }
                      <span className="kct-tag-internal"><i className="ti ti-building-store"></i> Nội bộ</span>
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
                {filteredExternal.map(r => (
                  <div key={r.id} className="ct-card" onClick={() => openExternal(r)}>
                    <div className="ct-card-img">
                      {r.image_url
                        ? <img src={r.image_url} alt={r.name} loading="lazy" />
                        : <div className="ct2-no-img"><i className="ti ti-world"></i></div>}
                      <span className="kct-tag-external"><i className="ti ti-gift"></i> Miễn phí</span>
                    </div>
                    <div className="ct-card-body">
                      <span className="ct-card-cat">{r.category}</span>
                      <h3 className="ct-card-name">{r.short_name || r.name}</h3>
                      {r.source && (
                        <div className="ct-card-foot">
                          <span className="kct-source-hint"><i className="ti ti-link"></i> {r.source}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </section>

      {/* MODAL — INTERNAL */}
      {modalOpen && selInternal && (
        <div className="ct-modal-bg" onClick={closeModal}>
          <div className="ct-modal" onClick={e => e.stopPropagation()}>
            <button className="ct-modal-close" onClick={closeModal} aria-label="Đóng"><i className="ti ti-x"></i></button>
            {selInternal.photo_url ? (
              <div className="ct-modal-img kct-lb-trigger" onClick={() => setLightboxImg(selInternal.photo_url)}>
                <img src={selInternal.photo_url} alt={selInternal.name} />
                <span className="kct-lb-hint"><i className="ti ti-zoom-in"></i> Phóng to</span>
              </div>
            ) : (
              <div className="ct-modal-img"><div className="ct2-modal-no-img"><i className="ti ti-coffee"></i></div></div>
            )}
            <div className="ct-modal-body">
              <span className="ct-card-cat">{selInternal.category}</span>
              <h2>{selInternal.name}</h2>
              {selInternal.total_cost != null && (
                <div className="ct-modal-meta">
                  <span><i className="ti ti-coin"></i> Tổng cost: <strong>{fmtCost(selInternal.total_cost)}</strong></span>
                </div>
              )}

              {selInternal.instructions && (
                <div className="ct-modal-section">
                  <h4><i className="ti ti-steps"></i> Hướng dẫn pha chế</h4>
                  <ol className="ct-steps-list">
                    {splitLines(selInternal.instructions).map((line, i) => (
                      <li key={i}>{line.replace(/^B\d+:\s*/, '')}</li>
                    ))}
                  </ol>
                </div>
              )}

              {selInternal.recipe_text && (
                <div className="ct-modal-section">
                  <h4><i className="ti ti-list"></i> Công thức</h4>
                  <ul className="ct-ing-list">
                    {splitLines(selInternal.recipe_text).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}

              {linkedProducts.length > 0 && (
                <div className="ct-modal-section ct-linked-products">
                  <h4><i className="ti ti-package"></i> Nguyên liệu sử dụng</h4>
                  <div className="ct-prod-list">
                    {linkedProducts.map(p => (
                      <div key={p.id} className="ct-prod-item">
                        <div className="ct-prod-img">
                          {p.image_url
                            ? <img src={p.image_url} alt={p.name} loading="lazy" />
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

              <div className="kct-order-note">
                <p><i className="ti ti-truck-delivery"></i> <strong>Đặt nguyên liệu</strong></p>
                <p>Thêm vào giỏ và liên hệ qua Zalo để đặt hàng — ship toàn quốc.</p>
                <a href="https://zalo.me/0834790555" target="_blank" rel="noopener" className="kct-zalo-btn">
                  <i className="ti ti-brand-hipchat"></i> Chat Zalo Ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — EXTERNAL */}
      {modalOpen && selExternal && (
        <div className="ct-modal-bg" onClick={closeModal}>
          <div className="ct-modal" onClick={e => e.stopPropagation()}>
            <button className="ct-modal-close" onClick={closeModal} aria-label="Đóng"><i className="ti ti-x"></i></button>
            {selExternal.image_url ? (
              <div className="ct-modal-img kct-lb-trigger" onClick={() => setLightboxImg(selExternal.image_url)}>
                <img src={selExternal.image_url} alt={selExternal.name} />
                <span className="kct-lb-hint"><i className="ti ti-zoom-in"></i> Phóng to</span>
              </div>
            ) : (
              <div className="ct-modal-img"><div className="ct2-modal-no-img"><i className="ti ti-world"></i></div></div>
            )}
            <div className="ct-modal-body">
              <span className="ct-card-cat">{selExternal.category}</span>
              <h2>{selExternal.name}</h2>
              {selExternal.source && (
                <p className="kct-source"><i className="ti ti-link" style={{ fontSize: '.75rem' }}></i> {selExternal.source}</p>
              )}

              {selExternal.steps && (
                <div className="ct-modal-section">
                  <h4><i className="ti ti-list-check"></i> Công thức</h4>
                  <ol className="ct-steps-list">
                    {splitLines(selExternal.steps).map((line, i) => (
                      <li key={i}>{line.replace(/^B\d+:\s*/, '')}</li>
                    ))}
                  </ol>
                </div>
              )}

              {(selExternal.ingredients ?? []).length > 0 && (
                <div className="ct-modal-section">
                  <h4><i className="ti ti-basket"></i> Nguyên liệu sử dụng</h4>
                  <div className="kct-ext-ing-list">
                    {selExternal.ingredients.map((ing, i) => (
                      <div key={i} className="kct-ext-ing-item">
                        <span className="kct-ext-ing-name">{ing.name}</span>
                        {ing.shopLink && (
                          <a href={ing.shopLink} target="_blank" rel="noopener" className="kct-platform-link kct-platform-shopee">
                            <i className="ti ti-external-link" style={{ fontSize: '.7rem' }}></i> Shopee
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .kct-type-tabs { background: var(--white); border-bottom: 1px solid var(--border); position: sticky; top: var(--nav-h); z-index: 92; }
        .kct-type-tabs .container { display: flex; overflow-x: auto; scrollbar-width: none; }
        .kct-type-tabs .container::-webkit-scrollbar { display: none; }
        .kct-tab-btn { flex-shrink: 0; padding: 14px 24px; font-size: .88rem; font-weight: 600; color: var(--text-3); background: none; border: none; border-bottom: 2.5px solid transparent; cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 7px; white-space: nowrap; font-family: inherit; }
        .kct-tab-btn:hover { color: var(--accent); }
        .kct-tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
        .kct-tab-badge { font-size: .65rem; font-weight: 700; background: var(--bg-alt); color: var(--muted); padding: 2px 7px; border-radius: 100px; }
        .kct-tab-btn.active .kct-tab-badge { background: rgba(176,90,16,.12); color: var(--accent); }
        .kct-controls-sticky .ct-controls-wrap, .kct-controls-sticky { top: calc(var(--nav-h) + 49px) !important; }
        .kct-count { font-size: .78rem; font-weight: 600; color: var(--muted); margin-bottom: 20px; text-transform: uppercase; letter-spacing: .06em; }
        .kct-tag-internal, .kct-tag-external { position: absolute; top: 8px; left: 8px; font-size: .6rem; font-weight: 700; padding: 3px 8px; border-radius: 100px; display: flex; align-items: center; gap: 3px; }
        .kct-tag-internal { background: #ECFDF5; color: #065F46; }
        .kct-tag-external { background: #EFF6FF; color: #1D4ED8; }
        .kct-source-hint { font-size: .69rem; color: var(--muted); display: flex; align-items: center; gap: 4px; }
        .kct-source { font-size: .76rem; color: var(--muted); display: flex; align-items: center; gap: 4px; margin-bottom: 16px; }
        .kct-ext-ing-list { display: flex; flex-direction: column; gap: 8px; }
        .kct-ext-ing-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; border-radius: 10px; background: var(--bg); border: 1px solid var(--border); }
        .kct-ext-ing-name { font-size: .82rem; font-weight: 600; color: var(--text); flex: 1; min-width: 0; }
        .kct-platform-link { flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px; font-size: .72rem; font-weight: 600; padding: 5px 11px; border-radius: 8px; border: 1.5px solid; text-decoration: none; transition: all .2s; white-space: nowrap; }
        .kct-platform-shopee { color: #EE4D2D; border-color: rgba(238,77,45,.3); background: rgba(238,77,45,.04); }
        .kct-platform-shopee:hover { background: rgba(238,77,45,.12); }
        .kct-platform-lazada { color: #0F146D; border-color: rgba(15,20,109,.25); background: rgba(15,20,109,.03); }
        .kct-platform-lazada:hover { background: rgba(15,20,109,.1); }
        .kct-platform-tiki { color: #1A94FF; border-color: rgba(26,148,255,.3); background: rgba(26,148,255,.04); }
        .kct-order-note { margin-top: 20px; padding: 14px 16px; background: #FFF5ED; border-radius: 12px; border: 1px solid rgba(176,90,16,.15); }
        .kct-order-note p { font-size: .8rem; color: var(--text-3); line-height: 1.6; margin-bottom: 4px; }
        .kct-order-note p:first-child { color: var(--accent); font-weight: 600; margin-bottom: 4px; }
        .kct-zalo-btn { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; padding: 9px 18px; border-radius: 10px; background: #0068FF; color: #fff; font-size: .82rem; font-weight: 700; text-decoration: none; transition: background .2s; }
        .kct-zalo-btn:hover { background: #0052CC; }
        .ct2-skeleton-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px; }
        .ct2-skeleton-card { background:var(--white); border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--sh-sm); }
        .ct2-sk-img { height:180px; background:linear-gradient(90deg,#f0e8df 25%,#e8ddd4 50%,#f0e8df 75%); background-size:200% 100%; animation:ct2shimmer 1.4s infinite; }
        .ct2-sk-body { padding:16px; }
        .ct2-sk-line { height:12px; border-radius:6px; margin-bottom:8px; background:linear-gradient(90deg,#f0e8df 25%,#e8ddd4 50%,#f0e8df 75%); background-size:200% 100%; animation:ct2shimmer 1.4s infinite; }
        .ct2-sk-line.short { width:55%; }
        @keyframes ct2shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .ct2-no-img { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:3rem; color:var(--muted); background:var(--bg-alt); }
        .ct2-modal-no-img { width:100%; height:220px; display:flex; align-items:center; justify-content:center; font-size:4rem; color:var(--muted); background:var(--bg-alt); }
      `}</style>

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div className="kct-lightbox" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Phóng to" onClick={e => e.stopPropagation()} />
          <button className="kct-lb-close" onClick={() => setLightboxImg(null)} aria-label="Đóng lightbox">
            <i className="ti ti-x"></i>
          </button>
        </div>
      )}
    </>
  );
}
