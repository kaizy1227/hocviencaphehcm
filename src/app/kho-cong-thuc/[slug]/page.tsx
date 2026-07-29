'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';
import { buildSlugIndex } from '@/lib/slug';
import s from '../recipe.module.css';

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

type FoundRecipe = { type: 'internal'; data: CongThuc } | { type: 'external'; data: ExternalRecipe };

export default function CongThucDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, openCart } = useCart();

  const [loading, setLoading]         = useState(true);
  const [found, setFound]             = useState<FoundRecipe | null | undefined>(undefined);
  const [related, setRelated]         = useState<{ slug: string; name: string; img: string; locked?: boolean }[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [addedIds, setAddedIds]       = useState<Set<string>>(new Set());
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn]   = useState<boolean | null>(null);
  const [courseAccess, setCourseAccess] = useState<string[] | null>(null);
  const [isAdmin, setIsAdmin]         = useState(false);

  useEffect(() => {
    if (!slug) return;
    const sb = createClient();
    void (async () => {
      const { data: { session } } = await sb.auth.getSession();
      setIsLoggedIn(!!session);
      if (session?.user) {
        if (session.user.app_metadata?.role === 'admin') { setIsAdmin(true); setCourseAccess(['admin']); }
        else {
          const { data } = await sb.from('students').select('course_access').eq('auth_user_id', session.user.id).maybeSingle();
          setCourseAccess((data?.course_access as string[]) ?? []);
        }
      } else { setCourseAccess([]); }
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
        setRelated(internalList.filter(r => r.id !== hitInternal.id && r.category === hitInternal.category).slice(0, 4)
          .map(r => ({ slug: internalIndex.byId.get(r.id)!, name: r.name, img: r.photo_url, locked: r.locked })));
      } else if (hitExternal) {
        setFound({ type: 'external', data: hitExternal });
        setRelated(externalList.filter(r => r.id !== hitExternal.id && r.category === hitExternal.category).slice(0, 4)
          .map(r => ({ slug: externalIndex.byId.get(r.id)!, name: r.short_name || r.name, img: r.image_url, locked: r.locked })));
      } else { setFound(null); }
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
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Không tìm thấy công thức này.</p>
          <Link href="/kho-cong-thuc" className="btn btn-outline">← Quay lại Kho Công Thức</Link>
        </div>
      </main>
    );
  }

  const isInternal = found.type === 'internal';
  const r = found.data;
  const name = isInternal ? (r as CongThuc).name : ((r as ExternalRecipe).short_name || r.name);
  const imgSrc = isInternal ? (r as CongThuc).photo_url : (r as ExternalRecipe).image_url;
  const locked = r.locked;
  const showLock = !hasAccess && locked;
  const linkedProducts = isInternal ? allProducts.filter(p => (r as CongThuc).linked_product_ids?.includes(p.id)) : [];
  const productSlugById = buildSlugIndex(allProducts, p => p.name).byId;

  return (
    <main className={s.page}>
      {/* BREADCRUMBS */}
      <div className={s.detailBread}>
        <div className="container">
          <nav className={s.breadcrumbs}>
            <Link href="/">Trang Chủ</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: '.7rem' }}></i>
            <Link href="/kho-cong-thuc">Kho Công Thức</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: '.7rem' }}></i>
            <span>{name}</span>
          </nav>

          {/* DETAIL GRID */}
          <div className={s.detailGrid}>
            {/* LEFT — sticky image */}
            <figure className={`${s.detailImage}${showLock ? ` ${s.detailLocked}` : ''}`}>
              {imgSrc ? (
                <img src={showLock ? imgSrc : imgSrc} alt={showLock ? '' : name}
                  style={showLock ? { filter: 'blur(14px)', transform: 'scale(1.1)' } : {}}
                  onClick={() => !showLock && setLightboxImg(imgSrc)} />
              ) : (
                <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: 'var(--muted)' }}>
                  <i className={`ti ti-${isInternal ? 'coffee' : 'world'}`}></i>
                </div>
              )}
              {showLock && (
                <div className={s.lockOvDetail}>
                  <div className={s.lockBox}>
                    {isLoggedIn === false ? (
                      <>
                        <div className={s.lockIco}><i className="ti ti-user-circle"></i></div>
                        <h3>Đăng Nhập Để Xem</h3>
                        <p>Nội dung chỉ dành cho khách hàng và học viên của Học Viện Cà Phê.</p>
                        <Link href={`/login?redirect=/kho-cong-thuc/${slug}`} className="btn btn-primary"><i className="ti ti-login"></i> Đăng Nhập Ngay</Link>
                        <Link href="/dang-ky-hoc-vien" className={s.lockBoxSub}>Chưa có tài khoản? Đăng ký học viên</Link>
                      </>
                    ) : (
                      <>
                        <div className={s.lockIco}><i className="ti ti-lock-access"></i></div>
                        <h3>Chưa Được Cấp Quyền</h3>
                        <p>Tài khoản chưa được cấp quyền xem công thức. Liên hệ Học Viện để kích hoạt sau khi đăng ký khóa học.</p>
                        <p><strong>Ưu đãi mới:</strong> mua nguyên liệu từ 3.000.000đ sẽ được mở khóa toàn bộ công thức miễn phí.</p>
                        <a href="https://zalo.me/0834790555" target="_blank" rel="noopener" className="btn btn-primary"><i className="ti ti-brand-hipchat"></i> Chat Zalo Ngay</a>
                      </>
                    )}
                  </div>
                </div>
              )}
            </figure>

            {/* RIGHT — content */}
            <article className={s.detailContent}>
              <p className={s.detailEyebrow}>
                {isInternal ? 'Công thức HVCP' : 'Công thức miễn phí'} · {r.category}
              </p>
              <h1 className={s.detailH1}>{name}</h1>

              {!showLock && (
                <div className={s.facts}>
                  <span className={s.fact}>1 ly</span>
                  <span className={s.fact}>{r.category}</span>
                  {isInternal && (r as CongThuc).total_cost != null && (
                    <span className={s.fact}>Cost: {fmtCost((r as CongThuc).total_cost!)}</span>
                  )}
                </div>
              )}

              {!isInternal && (r as ExternalRecipe).source && !showLock && (
                <p className={s.sourceHint}><i className="ti ti-link"></i> {(r as ExternalRecipe).source}</p>
              )}

              {!showLock && (
                <>
                  {/* Instructions */}
                  {isInternal && (r as CongThuc).instructions && (
                    <div className={s.recipeSection}>
                      <h2><i className="ti ti-steps"></i> Hướng dẫn pha chế</h2>
                      <ol className={s.stepsList}>
                        {splitLines((r as CongThuc).instructions).map((line, i) => (
                          <li key={i}>{line.replace(/^B\d+:\s*/, '')}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* External steps */}
                  {!isInternal && (r as ExternalRecipe).steps && (
                    <div className={s.recipeSection}>
                      <h2><i className="ti ti-list-check"></i> Công thức</h2>
                      <ol className={s.stepsList}>
                        {splitLines((r as ExternalRecipe).steps).map((line, i) => (
                          <li key={i}>{line.replace(/^B\d+:\s*/, '')}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Internal recipe text */}
                  {isInternal && (r as CongThuc).recipe_text && (
                    <div className={s.recipeSection}>
                      <h2><i className="ti ti-list"></i> Công thức</h2>
                      <ul className={s.ingList}>
                        {splitLines((r as CongThuc).recipe_text).map((line, i) => <li key={i}>{line}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* External ingredients */}
                  {!isInternal && ((r as ExternalRecipe).ingredients ?? []).length > 0 && (
                    <div className={s.recipeSection}>
                      <h2><i className="ti ti-basket"></i> Nguyên liệu</h2>
                      <div className={s.extIngList}>
                        {(r as ExternalRecipe).ingredients.map((ing, i) => (
                          <div key={i} className={s.extIngItem}>
                            <span className={s.extIngName}>{ing.name}</span>
                            {ing.shopLink && (
                              <a href={ing.shopLink} target="_blank" rel="noopener" className={s.shopeeLink}>
                                <i className="ti ti-external-link"></i> Shopee
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Internal linked products */}
                  {isInternal && linkedProducts.length > 0 && (
                    <div className={s.recipeSection}>
                      <h2><i className="ti ti-package"></i> Nguyên liệu sử dụng</h2>
                      <div className={s.prodList}>
                        {linkedProducts.map(p => (
                          <div key={p.id} className={s.prodItem}>
                            <div className={s.prodImg}>
                              {p.image_url
                                ? <Image src={p.image_url} alt={p.name} width={48} height={48} style={{ objectFit: 'cover' }} loading="lazy" />
                                : <div className={s.prodImgPh}><i className="ti ti-package"></i></div>}
                            </div>
                            <div className={s.prodInfo}>
                              <p className={s.prodName}>{p.name}</p>
                              <p className={s.prodMeta}>{p.unit} · <strong>{p.price.toLocaleString('vi-VN')}đ</strong></p>
                            </div>
                            <div className={s.prodBtns}>
                              <Link href={`/nguyen-lieu/${productSlugById.get(p.id)}`} className={s.prodView}>Xem</Link>
                              <button className={`${s.prodAdd}${addedIds.has(p.id) ? ` ${s.prodAdded}` : ''}`} onClick={() => handleAddToCart(p)}>
                                {addedIds.has(p.id) ? <><i className="ti ti-check"></i> Đã thêm</> : <><i className="ti ti-shopping-cart-plus"></i> Thêm</>}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className={s.viewCartBtn} onClick={() => openCart()}>
                        <i className="ti ti-shopping-cart"></i> Xem giỏ hàng
                      </button>
                    </div>
                  )}

                  {isInternal && (
                    <div className={s.recipeSection}>
                      <div className={s.orderNote}>
                        <p><i className="ti ti-truck-delivery"></i> Hỗ Trợ Tư Vấn Và Đặt Nguyên Liệu</p>
                        <p>Thêm vào giỏ và liên hệ với Kho NVL để đặt hàng — ship toàn quốc.</p>
                        <div className={s.orderBtns}>
                          <a href="https://zalo.me/0931433684" target="_blank" rel="noopener" className={s.zaloBtn}><i className="ti ti-brand-hipchat"></i> Zalo</a>
                          <a href="https://www.facebook.com/profile.php?id=61560410163133" target="_blank" rel="noopener" className={s.fbBtn}><i className="ti ti-brand-facebook"></i> Facebook</a>
                          <a href="tel:0931433684" className={s.phoneBtn}><i className="ti ti-phone"></i> 093 143 36 84</a>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={s.recipeSection}>
                    <h2><i className="ti ti-shopping-bag"></i> Cần nguyên liệu hoặc dụng cụ?</h2>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <Link href="/nguyen-lieu" className="btn btn-primary">Bảng giá nguyên liệu</Link>
                      <Link href="/dung-cu" className="btn btn-outline">Xem dụng cụ</Link>
                    </div>
                  </div>
                </>
              )}

              <div style={{ marginTop: 28 }}>
                <Link href="/kho-cong-thuc" className="btn btn-outline"><i className="ti ti-arrow-left"></i> Quay lại Kho Công Thức</Link>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-alt,#F5EDE1)', borderTop: '1px solid var(--border,#dce6ed)' }}>
          <div className="container">
            <h2 className="title" style={{ textAlign: 'center', marginBottom: 32 }}>Công Thức Cùng Loại</h2>
            <div className={s.relatedGrid}>
              {related.map(rel => {
                const relLocked = !hasAccess && rel.locked;
                return (
                  <Link key={rel.slug} href={`/kho-cong-thuc/${rel.slug}`} className={s.recipeCard}>
                    <div className={s.recipeMedia}>
                      {rel.img && <img src={rel.img} alt={relLocked ? '' : rel.name} loading="lazy"
                        style={{ ...(relLocked ? { filter: 'blur(10px)', transform: 'scale(1.12)' } : {}), width: '100%', height: '100%', objectFit: 'cover' }} />}
                      {relLocked && <div className={s.lockOv}><i className={`ti ti-lock ${s.lockIcon}`}></i></div>}
                    </div>
                    <div className={s.recipeBody}><h3>{rel.name}</h3></div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div className={s.lightbox} onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Phóng to" onClick={e => e.stopPropagation()} />
          <button className={s.lbClose} onClick={() => setLightboxImg(null)}><i className="ti ti-x"></i></button>
        </div>
      )}
    </main>
  );
}
