'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { buildSlugIndex } from '@/lib/slug';
import { useReviewStats } from '@/lib/useReviewStats';
import CardRating from '@/components/CardRating';
import s from './product.module.css';

type Product = {
  id: string; stt: number; name: string; unit: string;
  price: number; image_url: string; category: string;
  phan_loai: 'thuong-mai' | 'thuong-hieu';
};
type SortBy = 'default' | 'price-asc' | 'price-desc' | 'name-asc';
type QuickItem = Product | null;
const PER_PAGE = 24;

export default function NguyenLieuPage() {
  const [products, setProducts]       = useState<Product[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeCat, setActiveCat]     = useState('');
  const [activePhanLoai, setActivePhanLoai] = useState('');
  const [search, setSearch]           = useState('');
  const [sortBy, setSortBy]           = useState<SortBy>('default');
  const [page, setPage]               = useState(1);
  const [addedIds, setAddedIds]       = useState<Set<string>>(new Set());
  const [quick, setQuick]             = useState<QuickItem>(null);
  const [quickAdded, setQuickAdded]   = useState(false);

  const { addItem } = useCart();
  const { toggle: toggleWish, has: isWishlisted } = useWishlist();
  const reviewStats = useReviewStats('products');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10000);
    createClient().from('products').select('*').eq('active', true).order('stt')
      .then(({ data }) => { clearTimeout(timer); setProducts(data ?? []); setLoading(false); },
            ()       => { clearTimeout(timer); setLoading(false); });
    return () => clearTimeout(timer);
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category))).sort();
  const slugById = buildSlugIndex(products, p => p.name).byId;
  const q = search.trim().toLowerCase();

  useEffect(() => { setPage(1); }, [search, activeCat, activePhanLoai, sortBy]);

  const filtered = products
    .filter(p => !activeCat || p.category === activeCat)
    .filter(p => !activePhanLoai || p.phan_loai === activePhanLoai)
    .filter(p => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));

  const sortedBase = sortBy === 'price-asc' ? [...filtered].sort((a,b) => a.price - b.price)
    : sortBy === 'price-desc' ? [...filtered].sort((a,b) => b.price - a.price)
    : sortBy === 'name-asc'   ? [...filtered].sort((a,b) => a.name.localeCompare(b.name,'vi'))
    : filtered;

  const sorted = [...sortedBase].sort((a,b) =>
    (a.phan_loai === 'thuong-hieu' ? 0 : 1) - (b.phan_loai === 'thuong-hieu' ? 0 : 1)
  );

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated  = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasFilter  = !!(search || activeCat || activePhanLoai || sortBy !== 'default');

  const handleAddToCart = useCallback((p: Product) => {
    addItem({ id: p.id, name: p.name, price: p.price, image_url: p.image_url, unit: p.unit });
    setAddedIds(prev => new Set([...prev, p.id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n; }), 1500);
  }, [addItem]);

  const openQuick = (p: Product) => { setQuick(p); setQuickAdded(false); };
  const closeQuick = () => setQuick(null);
  const handleQuickAdd = () => {
    if (!quick) return;
    addItem({ id: quick.id, name: quick.name, price: quick.price, image_url: quick.image_url, unit: quick.unit });
    setQuickAdded(true);
  };

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') closeQuick(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  return (
    <main className={s.page}>
      {/* BANNER */}
      <div className="container" style={{ paddingTop: 'calc(var(--nav-h, 64px) + 20px)' }}>
        <div className={s.bannerWrap}>
          <button type="button" className={s.bannerImg}
            onClick={() => { setActivePhanLoai('thuong-hieu'); window.scrollTo({ top: 500, behavior: 'smooth' }); }}>
            <Image src="/images/banners/hang-thuong-hieu.png" alt="Hàng Thương Hiệu — sản phẩm độc quyền Học Viện Cà Phê HCM"
              width={2172} height={724} sizes="100vw" priority />
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className={s.toolbar}>
        <div className="container">
          <div className={s.toolbarRow}>
            <div className={s.searchWrap}>
              <i className={`ti ti-search ${s.searchIcon}`}></i>
              <input className={s.searchInput} type="search" placeholder="Tìm tên nguyên liệu..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className={s.toolbarSelect} value={activeCat} onChange={e => setActiveCat(e.target.value)}>
              <option value="">Tất cả danh mục</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className={s.toolbarSelect} value={activePhanLoai} onChange={e => setActivePhanLoai(e.target.value)}>
              <option value="">Tất cả loại</option>
              <option value="thuong-mai">Thương Mại</option>
              <option value="thuong-hieu">Thương Hiệu</option>
            </select>
            <select className={s.toolbarSelect} value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)}>
              <option value="default">Mặc định</option>
              <option value="name-asc">Tên A → Z</option>
              <option value="price-asc">Giá thấp → cao</option>
              <option value="price-desc">Giá cao → thấp</option>
            </select>
            {hasFilter && (
              <button className={s.resetBtn} onClick={() => { setSearch(''); setActiveCat(''); setActivePhanLoai(''); setSortBy('default'); }}>
                <i className="ti ti-x"></i> Xóa lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="section" style={{ background: 'radial-gradient(circle at 12% 22%, rgba(73,182,229,0.13), transparent 36%), radial-gradient(circle at 88% 78%, rgba(73,182,229,0.09), transparent 34%), var(--bg,#F5F4F1)', paddingTop: 36 }}>
        <div className="container">
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Hàng thương hiệu &amp; thương mại</span>
              <h2 className={s.sectionTitle}>Bảng giá nguyên liệu</h2>
            </div>
            <span className={s.metaCount}>{sorted.length} sản phẩm hiển thị</span>
          </div>

          {loading ? (
            <div className={s.loading}><i className="ti ti-loader-2 spin"></i> Đang tải...</div>
          ) : sorted.length === 0 ? (
            <div className={s.empty}>
              <i className="ti ti-package-off"></i>
              <p>{q ? `Không tìm thấy kết quả cho "${search}"` : 'Chưa có sản phẩm nào.'}</p>
              {hasFilter && <button className="btn btn-outline" onClick={() => { setSearch(''); setActiveCat(''); setActivePhanLoai(''); setSortBy('default'); }}>Xóa bộ lọc</button>}
            </div>
          ) : (
            <>
              <div className={s.productGrid}>
                {paginated.map((p) => (
                  <article key={p.id} className={s.productCard}>
                    <div className={s.productMedia}>
                      {p.image_url
                        ? <Image src={p.image_url} alt={p.name} fill sizes="(max-width:500px) 100vw,(max-width:720px) 50vw,(max-width:1100px) 33vw,25vw" style={{ objectFit:'contain', padding:'12px' }} loading="lazy" />
                        : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem',color:'var(--muted,#667a8c)' }}><i className="ti ti-package"></i></div>}
                      {p.phan_loai === 'thuong-hieu'
                        ? <span className={`${s.productBadge} ${s.productBadgeTH}`}><i className="ti ti-shield-star"></i> Thương Hiệu</span>
                        : <span className={s.productBadge}>Thương mại</span>}
                      <button className={s.quickBtn} onClick={() => openQuick(p)}>Xem nhanh</button>
                      <button
                        className={`${s.wishBtn}${isWishlisted(p.id) ? ` ${s.wishBtnActive}` : ''}`}
                        onClick={() => toggleWish({ id:p.id, name:p.name, unit:p.unit, price:p.price, image_url:p.image_url, category:p.category, source:'nguyen-lieu' })}
                        aria-label={isWishlisted(p.id) ? 'Bỏ yêu thích' : 'Yêu thích'}
                      >
                        <i className={`ti ${isWishlisted(p.id) ? 'ti-hearts' : 'ti-heart'}`}></i>
                      </button>
                    </div>
                    <div className={s.productBody}>
                      <span className={s.cardCat}>{p.category}</span>
                      <h3>
                        <Link href={`/nguyen-lieu/${slugById.get(p.id)}`} style={{ color:'inherit', textDecoration:'none' }}>{p.name}</Link>
                      </h3>
                      <p className={s.productUnit}>{p.unit}</p>
                      <CardRating stat={reviewStats.get(p.id)} />
                      <div className={s.productFoot}>
                        <strong className={s.price}>{p.price ? p.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</strong>
                        <button className={`${s.cardAdd}${addedIds.has(p.id) ? ` ${s.cardAddDone}` : ''}`} onClick={() => handleAddToCart(p)}>
                          {addedIds.has(p.id) ? <><i className="ti ti-check"></i> Đã thêm</> : <><i className="ti ti-shopping-cart-plus"></i> Thêm</>}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className={s.pagination}>
                  <button className={s.pageBtn} disabled={page === 1} onClick={() => { setPage(p => p-1); window.scrollTo({ top:400, behavior:'smooth' }); }}>
                    <i className="ti ti-chevron-left"></i>
                  </button>
                  {Array.from({ length: totalPages }, (_,i) => i+1).map(n => (
                    <button key={n} className={`${s.pageBtn}${page===n ? ` ${s.pageBtnActive}` : ''}`} onClick={() => { setPage(n); window.scrollTo({ top:400, behavior:'smooth' }); }}>{n}</button>
                  ))}
                  <button className={s.pageBtn} disabled={page === totalPages} onClick={() => { setPage(p => p+1); window.scrollTo({ top:400, behavior:'smooth' }); }}>
                    <i className="ti ti-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}

          {/* TRUST */}
          <div className={s.trust}>
            <div className={s.trustItem}><strong>Dữ liệu bảng giá thật</strong><span>Tên, đơn vị và giá giữ nguyên từ nguồn hiện hành.</span></div>
            <div className={s.trustItem}><strong>Giao hàng toàn quốc</strong><span>Kho NVL xác nhận tồn và phí vận chuyển qua Zalo.</span></div>
            <div className={s.trustItem}><strong>Liên kết với công thức</strong><span>Chọn nguyên liệu trực tiếp từ màn hình chi tiết món.</span></div>
          </div>

          {/* CTA */}
          <div className={s.ctaContact}>
            <h3>Tư Vấn Và Đặt Nguyên Liệu</h3>
            <p>Liên hệ trực tiếp với Kho NVL để được tư vấn và hỗ trợ đặt hàng — ship toàn quốc.</p>
            <div className={s.ctaActions}>
              <a href="https://zalo.me/0931433684" target="_blank" rel="noopener noreferrer" className={s.btnZalo}><i className="ti ti-brand-zalo"></i> Chat Zalo ngay</a>
              <a href="https://www.facebook.com/profile.php?id=61560410163133" target="_blank" rel="noopener noreferrer" className={s.btnFb}><i className="ti ti-brand-facebook"></i> Facebook Kho NVL</a>
              <a href="tel:0931433684" className={s.btnPhone}><i className="ti ti-phone"></i> Gọi 0931.433.684</a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK VIEW MODAL */}
      {quick && (
        <div className={s.modalBg} onClick={closeQuick}>
          <div className={s.modalCard} onClick={e => e.stopPropagation()}>
            <div className={s.modalHead}>
              <h3>Xem nhanh</h3>
              <button className={s.modalCloseBtn} onClick={closeQuick} aria-label="Đóng"><i className="ti ti-x"></i></button>
            </div>
            <div className={s.modalBody}>
              <div className={s.modalProduct}>
                {quick.image_url && <Image className={s.modalImg} src={quick.image_url} alt={quick.name} width={300} height={300} style={{ objectFit: 'contain' }} />}
                <div>
                  <h3 className={s.modalName}>{quick.name}</h3>
                  <p className={s.modalUnit}>{quick.unit} · {quick.category}</p>
                  <strong className={s.modalPrice}>{quick.price ? quick.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</strong>
                  <button className={s.modalAdd} onClick={handleQuickAdd}>
                    {quickAdded ? <><i className="ti ti-check"></i> Đã thêm vào giỏ</> : <><i className="ti ti-shopping-cart-plus"></i> Thêm vào giỏ</>}
                  </button>
                  <div style={{ marginTop: 12 }}>
                    <Link href={`/nguyen-lieu/${slugById.get(quick.id)}`} style={{ fontSize:'.8rem', color:'var(--cd,#8f5d18)', textDecoration:'underline', textUnderlineOffset:'3px' }} onClick={closeQuick}>
                      Xem chi tiết sản phẩm →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
