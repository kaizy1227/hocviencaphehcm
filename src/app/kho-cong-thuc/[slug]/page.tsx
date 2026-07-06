'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';
import { buildSlugIndex } from '@/lib/slug';

type CongThuc = {
  id: string; name: string; category: string; photo_url: string;
  instructions: string; total_cost: number | null; recipe_text: string;
  linked_product_ids: string[]; courses: string[]; locked?: boolean;
};
type ExternalIngredient = { name: string; shopLink: string };
type ExternalRecipe = {
  id: string; name: string; short_name: string; category: string; source: string;
  image_url: string; steps: string; ingredients: ExternalIngredient[]; active: boolean; locked?: boolean;
};
type Product = { id: string; name: string; unit: string; price: number; image_url: string };

type FoundRecipe =
  | { type: 'internal'; data: CongThuc }
  | { type: 'external'; data: ExternalRecipe };

export default function CongThucDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, openCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState<FoundRecipe | null | undefined>(undefined);
  const [related, setRelated] = useState<{ slug: string; name: string; img: string; locked?: boolean }[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [courseAccess, setCourseAccess] = useState<string[] | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!slug) return;
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

    void sb.from('products').select('id,name,unit,price,image_url').eq('active', true).order('stt')
      .then(({ data }) => { if (data) setAllProducts(data); });

    void (async () => {
      const [{ data: internal }, { data: external }] = await Promise.all([
        sb.from('cong_thuc_hvcp').select('*').order('sort_order').order('created_at'),
        sb.from('cong_thuc_chia_se').select('*').eq('active', true).order('sort_order').order('created_at'),
      ]);
      const internalList: CongThuc[] = internal ?? [];
      const externalList: ExternalRecipe[] = external ?? [];
      const internalIndex = buildSlugIndex(internalList, r => r.name);
      const externalIndex = buildSlugIndex(externalList, r => r.name);

      const hitInternal = internalIndex.bySlug.get(slug);
      const hitExternal = externalIndex.bySlug.get(slug);

      if (hitInternal) {
        setFound({ type: 'internal', data: hitInternal });
        setRelated(
          internalList.filter(r => r.id !== hitInternal.id && r.category === hitInternal.category)
            .slice(0, 4)
            .map(r => ({ slug: internalIndex.byId.get(r.id)!, name: r.name, img: r.photo_url, locked: r.locked }))
        );
      } else if (hitExternal) {
        setFound({ type: 'external', data: hitExternal });
        setRelated(
          externalList.filter(r => r.id !== hitExternal.id && r.category === hitExternal.category)
            .slice(0, 4)
            .map(r => ({ slug: externalIndex.byId.get(r.id)!, name: r.short_name || r.name, img: r.image_url, locked: r.locked }))
        );
      } else {
        setFound(null);
      }
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxImg(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleAddToCart = useCallback((p: Product) => {
    addItem({ id: p.id, name: p.name, price: p.price, image_url: p.image_url, unit: p.unit });
    setAddedIds(prev => new Set([...prev, p.id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n; }), 1500);
  }, [addItem]);

  const splitLines = (text: string) => text.split(/\n/).map(l => l.trim()).filter(Boolean);
  const fmtCost = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' VNĐ';

  const hasAccess = isAdmin || (isLoggedIn === true && courseAccess !== null && courseAccess.length > 0);

  if (loading || found === undefined) {
    return (
      <main style={{ paddingTop: 'var(--nav-h)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="ti ti-loader-2 spin" style={{ fontSize: 32, color: 'var(--accent)' }} />
      </main>
    );
  }

  if (!found) {
    return (
      <main style={{ paddingTop: 'var(--nav-h)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-3)', marginBottom: 16 }}>Không tìm thấy công thức này.</p>
          <Link href="/kho-cong-thuc" className="btn btn-outline">← Quay lại Kho Công Thức</Link>
        </div>
      </main>
    );
  }

  const isInternal = found.type === 'internal';
  const r = found.data;
  const name = isInternal ? (r as CongThuc).name : ((r as ExternalRecipe).short_name || r.name);
  const imgSrc = isInternal ? (r as CongThuc).photo_url : (r as ExternalRecipe).image_url;
  const category = r.category;
  const locked = r.locked;
  const showLock = !hasAccess && locked;
  const linkedProducts = isInternal ? allProducts.filter(p => (r as CongThuc).linked_product_ids?.includes(p.id)) : [];
  const productSlugById = buildSlugIndex(allProducts, p => p.name).byId;

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>

      {/* HERO / BREADCRUMB */}
      <section className="lh-hero">
        <div className="container">
          <div className="nl-hero-crumb">
            <Link href="/">Trang Chủ</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }} />
            <Link href="/kho-cong-thuc">Kho Công Thức</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }} />
            <span>{name}</span>
          </div>
          <h1>{name}</h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <Link href="/kho-cong-thuc" className="btn btn-outline"><i className="ti ti-arrow-left" /> Quay Lại Kho Công Thức</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--sh-md)' }}>

            {/* IMAGE */}
            {!showLock ? (
              imgSrc ? (
                <div className="ct-modal-img kct-lb-trigger" onClick={() => setLightboxImg(imgSrc)} style={{ cursor: 'zoom-in' }}>
                  <img src={imgSrc} alt={name} />
                </div>
              ) : (
                <div className="ct-modal-img"><div className="ct2-modal-no-img"><i className={`ti ti-${isInternal ? 'coffee' : 'world'}`}></i></div></div>
              )
            ) : (
              <div className="ct-modal-img kct-locked-img">
                {imgSrc
                  ? <img src={imgSrc} alt="" style={{ filter: 'blur(14px)', transform: 'scale(1.1)' }} />
                  : <div className="ct2-modal-no-img"><i className={`ti ti-${isInternal ? 'coffee' : 'world'}`}></i></div>}
                <div className="ct-modal-lock-ov">
                  <div className="ct-modal-lock-box">
                    {isLoggedIn === false ? (
                      <>
                        <div className="ct-lock-ico"><i className="ti ti-user-circle"></i></div>
                        <h3>Đăng Nhập Để Xem</h3>
                        <p>Nội dung chỉ dành cho khách hàng và học viên của Học Viện Cà Phê.</p>
                        <Link href={`/login?redirect=/kho-cong-thuc/${slug}`} className="btn btn-primary">
                          <i className="ti ti-login"></i> Đăng Nhập Ngay
                        </Link>
                        <Link href="/dang-ky-hoc-vien" className="ct-modal-gate-sub">
                          Chưa có tài khoản? Đăng ký học viên
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="ct-lock-ico"><i className="ti ti-lock-access"></i></div>
                        <h3>Chưa Được Cấp Quyền</h3>
                        <p>Tài khoản của bạn chưa được cấp quyền xem công thức. Vui lòng liên hệ Học Viện để kích hoạt sau khi đăng ký khóa học.</p>
                        <p style={{ marginTop: 4 }}><strong>Ưu đãi khách hàng mới:</strong> chưa từng sử dụng dịch vụ của Học Viện — mua nguyên liệu từ <strong>3.000.000đ</strong> trở lên sẽ được mở khóa xem toàn bộ công thức miễn phí.</p>
                        <a href="https://zalo.me/0834790555" target="_blank" rel="noopener" className="btn btn-primary">
                          <i className="ti ti-brand-hipchat"></i> Chat Zalo Ngay
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="ct-modal-body">
              <span className="ct-card-cat">{category}</span>
              <h2>{name}</h2>

              {!showLock && (
                <>
                  {isInternal && (r as CongThuc).total_cost != null && (
                    <div className="ct-modal-meta">
                      <span><i className="ti ti-coin"></i> Tổng cost: <strong>{fmtCost((r as CongThuc).total_cost!)}</strong></span>
                    </div>
                  )}

                  {!isInternal && (r as ExternalRecipe).source && (
                    <p className="kct-source"><i className="ti ti-link" style={{ fontSize: '.75rem' }}></i> {(r as ExternalRecipe).source}</p>
                  )}

                  {isInternal && (r as CongThuc).instructions && (
                    <div className="ct-modal-section">
                      <h4><i className="ti ti-steps"></i> Hướng dẫn pha chế</h4>
                      <ol className="ct-steps-list">
                        {splitLines((r as CongThuc).instructions).map((line, i) => (
                          <li key={i}>{line.replace(/^B\d+:\s*/, '')}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {isInternal && (r as CongThuc).recipe_text && (
                    <div className="ct-modal-section">
                      <h4><i className="ti ti-list"></i> Công thức</h4>
                      <ul className="ct-ing-list">
                        {splitLines((r as CongThuc).recipe_text).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!isInternal && (r as ExternalRecipe).steps && (
                    <div className="ct-modal-section">
                      <h4><i className="ti ti-list-check"></i> Công thức</h4>
                      <ol className="ct-steps-list">
                        {splitLines((r as ExternalRecipe).steps).map((line, i) => (
                          <li key={i}>{line.replace(/^B\d+:\s*/, '')}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {!isInternal && ((r as ExternalRecipe).ingredients ?? []).length > 0 && (
                    <div className="ct-modal-section">
                      <h4><i className="ti ti-basket"></i> Nguyên liệu sử dụng</h4>
                      <div className="kct-ext-ing-list">
                        {(r as ExternalRecipe).ingredients.map((ing, i) => (
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

                  {isInternal && linkedProducts.length > 0 && (
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
                              <Link href={`/nguyen-lieu/${productSlugById.get(p.id)}`} className="ct-prod-view">Xem</Link>
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
                      <button className="ct-view-cart-btn" onClick={() => openCart()}>
                        <i className="ti ti-shopping-cart"></i> Xem giỏ hàng
                      </button>
                    </div>
                  )}

                  {isInternal && (
                    <div className="kct-order-note">
                      <p><i className="ti ti-truck-delivery"></i> <strong>Hỗ Trợ Tư Vấn Và Đặt Nguyên Liệu</strong></p>
                      <p>Thêm vào giỏ và liên hệ với Kho NVL để đặt hàng — ship toàn quốc.</p>
                      <div className="kct-contact-btns">
                        <a href="https://zalo.me/0931433684" target="_blank" rel="noopener" className="kct-zalo-btn">
                          <i className="ti ti-brand-hipchat"></i> Chat Zalo Ngay
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61560410163133" target="_blank" rel="noopener" className="kct-fb-btn">
                          <i className="ti ti-brand-facebook"></i> Facebook Kho NVL
                        </a>
                        <a href="tel:0931433684" className="kct-phone-btn">
                          <i className="ti ti-phone"></i> 093 143 36 84
                        </a>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link href="/kho-cong-thuc" className="btn btn-outline"><i className="ti ti-arrow-left" /> Quay Lại Kho Công Thức</Link>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-alt)' }}>
          <div className="container">
            <h2 className="title" style={{ textAlign: 'center', marginBottom: 32 }}>Công Thức Cùng Loại</h2>
            <div className="poster-grid">
              {related.map(rel => {
                const relLocked = !hasAccess && rel.locked;
                return (
                <Link key={rel.slug} href={`/kho-cong-thuc/${rel.slug}`} className="poster-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="poster-img" style={{ position: 'relative' }}>
                    {rel.img && (
                      <img src={rel.img} alt={relLocked ? '' : rel.name} loading="lazy"
                        style={relLocked ? { filter: 'blur(10px)', transform: 'scale(1.12)' } : {}} />
                    )}
                    {relLocked && (
                      <div className="kct-card-lock-ov"><i className="ti ti-lock"></i></div>
                    )}
                  </div>
                  <div className="poster-body">
                    <div className="poster-name">{rel.name}</div>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .ct2-modal-no-img { width:100%; height:220px; display:flex; align-items:center; justify-content:center; font-size:4rem; color:var(--muted); background:var(--bg-alt); }
        .kct-locked-img { position: relative; overflow: hidden; }
        .kct-card-lock-ov { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.42); }
        .kct-card-lock-ov i { font-size: 2rem; color: #fff; }
        .kct-source { font-size: .76rem; color: var(--muted); display: flex; align-items: center; gap: 4px; margin-bottom: 16px; }
        .kct-ext-ing-list { display: flex; flex-direction: column; gap: 8px; }
        .kct-ext-ing-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; border-radius: 10px; background: var(--bg); border: 1px solid var(--border); }
        .kct-ext-ing-name { font-size: .82rem; font-weight: 600; color: var(--text); flex: 1; min-width: 0; }
        .kct-platform-link { flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px; font-size: .72rem; font-weight: 600; padding: 5px 11px; border-radius: 8px; border: 1.5px solid; text-decoration: none; transition: all .2s; white-space: nowrap; }
        .kct-platform-shopee { color: #EE4D2D; border-color: rgba(238,77,45,.3); background: rgba(238,77,45,.04); }
        .kct-platform-shopee:hover { background: rgba(238,77,45,.12); }
        .kct-order-note { margin-top: 20px; padding: 14px 16px; background: #FFF5ED; border-radius: 12px; border: 1px solid rgba(176,90,16,.15); }
        .kct-order-note p { font-size: .8rem; color: var(--text-3); line-height: 1.6; margin-bottom: 4px; }
        .kct-order-note p:first-child { color: var(--accent); font-weight: 600; margin-bottom: 4px; }
        .kct-contact-btns { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
        .kct-zalo-btn, .kct-fb-btn, .kct-phone-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 10px; color: #fff; font-size: .82rem; font-weight: 700; text-decoration: none; transition: background .2s; }
        .kct-zalo-btn { background: #0068FF; }
        .kct-zalo-btn:hover { background: #0052CC; }
        .kct-fb-btn { background: #1877F2; }
        .kct-fb-btn:hover { background: #145DC4; }
        .kct-phone-btn { background: var(--accent); }
        .kct-phone-btn:hover { background: #8a4408; }
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
    </main>
  );
}
