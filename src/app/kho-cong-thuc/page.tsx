'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { buildSlugIndex } from '@/lib/slug';
import s from './recipe.module.css';

type CongThuc = {
  id: string; name: string; category: string; photo_url: string;
  instructions: string; total_cost: number | null; recipe_text: string;
  linked_product_ids: string[]; courses: string[]; locked?: boolean;
};
type ExternalRecipe = {
  id: string; name: string; short_name: string; category: string; source: string;
  image_url: string; steps: string; ingredients: { name: string; shopLink: string }[]; active: boolean; locked?: boolean;
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
  const [isAdmin, setIsAdmin]       = useState(false);

  useEffect(() => {
    const sb = createClient();
    void (async () => {
      const { data: { session } } = await sb.auth.getSession();
      setIsLoggedIn(!!session);
      if (session?.user) {
        if (session.user.app_metadata?.role === 'admin') {
          setIsAdmin(true); setCourseAccess(['admin']);
        } else {
          const { data } = await sb.from('students').select('course_access').eq('auth_user_id', session.user.id).maybeSingle();
          setCourseAccess((data?.course_access as string[]) ?? []);
        }
      } else { setCourseAccess([]); }
    })();
    void sb.from('cong_thuc_hvcp').select('*').order('sort_order').order('created_at')
      .then(({ data }) => setRecipes(data ?? []));
    void sb.from('cong_thuc_chia_se').select('*').eq('active', true).order('sort_order').order('created_at')
      .then(({ data }) => { setExternalRecipes(data ?? []); setLoading(false); }, () => setLoading(false));
  }, []);

  const switchTab = (t: 'internal' | 'external') => { setTab(t); setActiveCat('Tất cả'); setSearchQ(''); setPage(1); };
  useEffect(() => { setPage(1); }, [activeCat, searchQ, tab]);

  const hasAccess = isAdmin || (isLoggedIn === true && courseAccess !== null && courseAccess.length > 0);

  const internalIndex = useMemo(() => buildSlugIndex(recipes, r => r.name), [recipes]);
  const externalIndex = useMemo(() => buildSlugIndex(externalRecipes, r => r.name), [externalRecipes]);

  const byLockedLast = <T extends { locked?: boolean }>(list: T[]) =>
    [...list].sort((a, b) => (a.locked ? 1 : 0) - (b.locked ? 1 : 0));

  const internalCats = ['Tất cả', ...Array.from(new Set(recipes.map(r => r.category).filter(Boolean))).sort()];
  const filteredInternal = byLockedLast(recipes.filter(r => {
    const matchCat = activeCat === 'Tất cả' || r.category === activeCat;
    const q = searchQ.toLowerCase();
    return matchCat && (!q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  }));

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
    <main className={s.page}>
      {/* UNLOCK BANNER */}
      <div className={s.unlockWrap}>
        <div className="container">
          <a href="https://zalo.me/0834790555" target="_blank" rel="noopener noreferrer" className={s.unlockLink}>
            <Image src="/images/banners/kct-unlock-banner.png" alt="Ưu đãi khách hàng mới — Mua nguyên liệu từ 3.000.000đ trở lên, mở khóa toàn bộ công thức nội bộ hoàn toàn miễn phí"
              width={2172} height={724} className={s.unlockImg} priority />
          </a>
        </div>
      </div>

      {/* TYPE TABS */}
      <div className={s.typeTabs}>
        <div className="container">
          <div className={s.typeTabsInner}>
            <button className={`${s.tabBtn}${tab === 'internal' ? ` ${s.tabBtnActive}` : ''}`} onClick={() => switchTab('internal')}>
              <i className="ti ti-building-store"></i> Công Thức HVCP
              <span className={s.tabBadge}>{loading ? '…' : recipes.length}</span>
            </button>
            <button className={`${s.tabBtn}${tab === 'external' ? ` ${s.tabBtnActive}` : ''}`} onClick={() => switchTab('external')}>
              <i className="ti ti-gift"></i> Công Thức Miễn Phí
              <span className={s.tabBadge}>{externalRecipes.length}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className={s.controls} style={{ top: 'calc(var(--nav-h) + 49px)' }}>
        <div className="container">
          <div className={s.controlRow}>
            <div className={s.cats}>
              {cats.map(c => (
                <button key={c} className={`${s.chip}${activeCat === c ? ` ${s.chipActive}` : ''}`} onClick={() => setActiveCat(c)}>{c}</button>
              ))}
            </div>
            <label className={s.searchLabel}>
              <i className="ti ti-search"></i>
              <input className={s.searchInput} type="search" placeholder="Tìm công thức..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
            </label>
          </div>
        </div>
      </div>

      {/* GRID */}
      <section className="section" style={{ background: 'var(--bg,#F5F4F1)' }}>
        <div className="container">
          <p className={s.countLine}>{filteredCount} công thức</p>

          {tab === 'internal' ? (
            loading ? (
              <div className={s.skeletonGrid}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={s.skeletonCard}>
                    <div className={s.skImg}></div>
                    <div className={s.skBody}><div className={s.skLine}></div><div className={`${s.skLine} ${s.skShort}`}></div></div>
                  </div>
                ))}
              </div>
            ) : filteredInternal.length === 0 ? (
              <div className={s.emptyState}><i className="ti ti-mood-sad" style={{ fontSize: '2rem' }}></i><p>Không tìm thấy công thức phù hợp</p></div>
            ) : (
              <div className={s.recipeGrid}>
                {paginatedInternal.map(r => {
                  const showLock = !hasAccess && r.locked;
                  const slug = internalIndex.byId.get(r.id);
                  return (
                    <Link href={`/kho-cong-thuc/${slug}`} key={r.id} className={s.recipeCard}>
                      <div className={s.recipeMedia}>
                        {r.photo_url
                          ? <Image src={r.photo_url} alt={showLock ? '' : r.name} fill sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,280px"
                              style={{ objectFit: 'cover', ...(showLock ? { filter: 'blur(10px)', transform: 'scale(1.12)' } : {}) }} loading="lazy" />
                          : <div className={s.noImg}><i className="ti ti-coffee"></i></div>}
                        {showLock
                          ? <div className={s.lockOv}><i className={`ti ti-lock ${s.lockIcon}`}></i></div>
                          : <span className={s.tagInternal}><i className="ti ti-building-store"></i> Nội bộ</span>}
                      </div>
                      <div className={s.recipeBody}>
                        <span className={s.recipeCat}>{r.category}</span>
                        <h3>{r.name}</h3>
                        <div className={s.recipeFoot}>
                          {showLock
                            ? <span className={s.lockLabel}><i className="ti ti-lock"></i> Đang khóa</span>
                            : r.total_cost != null
                              ? <span className={s.costPill}><i className="ti ti-coin"></i> {fmtCost(r.total_cost)}</span>
                              : <span></span>}
                          {!showLock && <span className={s.textLink}>Xem công thức →</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )
          ) : (
            filteredExternal.length === 0 ? (
              <div className={s.emptyState}><i className="ti ti-mood-sad" style={{ fontSize: '2rem' }}></i><p>Không tìm thấy công thức phù hợp</p></div>
            ) : (
              <div className={s.recipeGrid}>
                {paginatedExternal.map(r => {
                  const showLock = !hasAccess && r.locked;
                  const slug = externalIndex.byId.get(r.id);
                  return (
                    <Link href={`/kho-cong-thuc/${slug}`} key={r.id} className={s.recipeCard}>
                      <div className={`${s.recipeMedia} ${showLock ? '' : s.recipeMediaFree}`}>
                        {r.image_url
                          ? <img src={r.image_url} alt={showLock ? '' : r.name} loading="lazy"
                              style={showLock ? { filter: 'blur(10px)', transform: 'scale(1.12)', width: '100%', height: '100%', objectFit: 'cover' } : { width: '100%', height: '100%', objectFit: 'contain' }} />
                          : <div className={s.noImg}><i className="ti ti-world"></i></div>}
                        {showLock
                          ? <div className={s.lockOv}><i className={`ti ti-lock ${s.lockIcon}`}></i></div>
                          : <span className={`${s.badge} ${s.badgeFree}`}>Miễn phí</span>}
                      </div>
                      <div className={s.recipeBody}>
                        <span className={s.recipeCat}>{r.category}</span>
                        <h3>{r.short_name || r.name}</h3>
                        <div className={s.recipeFoot}>
                          {showLock
                            ? <span className={s.lockLabel}><i className="ti ti-lock"></i> Đang khóa</span>
                            : r.source
                              ? <span className={s.sourceHint}><i className="ti ti-link"></i> {r.source}</span>
                              : <span></span>}
                          {!showLock && <span className={s.textLink}>Xem công thức →</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )
          )}

          {totalPages > 1 && (
            <div className="nl-pagination" style={{ marginTop: 40 }}>
              <button className="nl-page-btn" disabled={page === 1}
                onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 260, behavior: 'smooth' }); }}>
                <i className="ti ti-chevron-left"></i>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} className={`nl-page-btn${page === n ? ' active' : ''}`}
                  onClick={() => { setPage(n); window.scrollTo({ top: 260, behavior: 'smooth' }); }}>{n}</button>
              ))}
              <button className="nl-page-btn" disabled={page === totalPages}
                onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 260, behavior: 'smooth' }); }}>
                <i className="ti ti-chevron-right"></i>
              </button>
            </div>
          )}

          {/* COMMERCE */}
          <div className={s.commerce}>
            <div>
              <h2>Tìm đúng nguyên liệu cho công thức</h2>
              <p>Kho Nguyên Liệu hỗ trợ tư vấn và giao hàng toàn quốc qua số 0931.433.684.</p>
            </div>
            <div className={s.commerceActions}>
              <a href="/nguyen-lieu" className="btn btn-primary">Xem bảng giá nguyên liệu</a>
              <a href="https://zalo.me/0931433684" target="_blank" rel="noopener" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,.4)', color: '#fff' }}>Chat Kho NVL</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
