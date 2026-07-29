'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useReviewStats } from '@/lib/useReviewStats';
import CardRating from '@/components/CardRating';
import s from '../nguyen-lieu/product.module.css';

type Tool = {
  id: string; stt: number; name: string; unit: string;
  price: number; image_url: string; category: string;
};
type SortBy = 'default' | 'price-asc' | 'price-desc' | 'name-asc';
const PER_PAGE = 24;

export default function DungCuPage() {
  const [tools, setTools]           = useState<Tool[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeCat, setActiveCat]   = useState('');
  const [search, setSearch]         = useState('');
  const [sortBy, setSortBy]         = useState<SortBy>('default');
  const [page, setPage]             = useState(1);
  const [addedIds, setAddedIds]     = useState<Set<string>>(new Set());
  const [lightbox, setLightbox]     = useState<string | null>(null);
  const [quick, setQuick]           = useState<Tool | null>(null);
  const [quickAdded, setQuickAdded] = useState(false);

  const { addItem } = useCart();
  const { toggle: toggleWish, has: isWishlisted } = useWishlist();
  const reviewStats = useReviewStats('dung_cu');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10000);
    createClient().from('dung_cu').select('*').eq('active', true).order('stt')
      .then(({ data }) => { clearTimeout(timer); setTools(data ?? []); setLoading(false); },
            ()       => { clearTimeout(timer); setLoading(false); });
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') { setLightbox(null); setQuick(null); } };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  const categories = Array.from(new Set(tools.map(p => p.category))).sort();
  const q = search.trim().toLowerCase();
  useEffect(() => { setPage(1); }, [search, activeCat, sortBy]);

  const filtered = tools
    .filter(p => !activeCat || p.category === activeCat)
    .filter(p => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));

  const sorted = sortBy === 'price-asc' ? [...filtered].sort((a,b) => a.price - b.price)
    : sortBy === 'price-desc' ? [...filtered].sort((a,b) => b.price - a.price)
    : sortBy === 'name-asc'   ? [...filtered].sort((a,b) => a.name.localeCompare(b.name,'vi'))
    : filtered;

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated  = sorted.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const hasFilter  = !!(search || activeCat || sortBy !== 'default');

  const handleAddToCart = useCallback((p: Tool) => {
    addItem({ id:p.id, name:p.name, price:p.price, image_url:p.image_url, unit:p.unit });
    setAddedIds(prev => new Set([...prev, p.id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n; }), 1500);
  }, [addItem]);

  return (
    <main className={s.page} style={{ paddingTop: 'var(--nav-h, 64px)' }}>
      {/* BANNER */}
      <div className="container">
        <div className={s.bannerWrap}>
          <div className={s.bannerImg}>
            <Image src="/images/banners/freeship.png" alt="Freeship dụng cụ pha chế" width={2172} height={724} sizes="100vw" priority />
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className={s.toolbar}>
        <div className="container">
          <div className={s.toolbarRow}>
            <div className={s.searchWrap}>
              <i className={`ti ti-search ${s.searchIcon}`}></i>
              <input className={s.searchInput} type="search" placeholder="Tìm dụng cụ..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className={s.toolbarSelect} value={activeCat} onChange={e => setActiveCat(e.target.value)}>
              <option value="">Tất cả danh mục</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className={s.toolbarSelect} value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)}>
              <option value="default">Mặc định</option>
              <option value="name-asc">Tên A → Z</option>
              <option value="price-asc">Giá thấp → cao</option>
              <option value="price-desc">Giá cao → thấp</option>
            </select>
            {hasFilter && (
              <button className={s.resetBtn} onClick={() => { setSearch(''); setActiveCat(''); setSortBy('default'); }}>
                <i className="ti ti-x"></i> Xóa lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="section" style={{ background:'radial-gradient(circle at 12% 22%, rgba(73,182,229,0.13), transparent 36%), radial-gradient(circle at 88% 78%, rgba(73,182,229,0.09), transparent 34%), var(--bg,#F5F4F1)', paddingTop:36 }}>
        <div className="container">
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Bảng giá hiện hành</span>
              <h2 className={s.sectionTitle}>Dụng cụ pha chế</h2>
            </div>
            <span className={s.metaCount}>{sorted.length} sản phẩm hiển thị</span>
          </div>

          {loading ? (
            <div className={s.loading}><i className="ti ti-loader-2 spin"></i> Đang tải...</div>
          ) : sorted.length === 0 ? (
            <div className={s.empty}>
              <i className="ti ti-package-off"></i>
              <p>{q ? `Không tìm thấy kết quả cho "${search}"` : 'Chưa có sản phẩm nào.'}</p>
              {hasFilter && <button className="btn btn-outline" onClick={() => { setSearch(''); setActiveCat(''); setSortBy('default'); }}>Xóa bộ lọc</button>}
            </div>
          ) : (
            <>
              <div className={s.productGrid}>
                {paginated.map(p => (
                  <article key={p.id} className={s.productCard}>
                    <div className={s.productMedia} onClick={() => p.image_url && setLightbox(p.image_url)} style={{ cursor: p.image_url ? 'zoom-in' : 'default' }}>
                      {p.image_url
                        ? <Image src={p.image_url} alt={p.name} fill sizes="(max-width:500px) 100vw,(max-width:720px) 50vw,(max-width:1100px) 33vw,25vw" style={{ objectFit:'contain', padding:'12px' }} loading="lazy" />
                        : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem',color:'var(--muted,#667a8c)' }}><i className="ti ti-tool"></i></div>}
                      {!p.price && <span className={s.productBadge}>Liên hệ giá</span>}
                      <button className={s.quickBtn} onClick={e => { e.stopPropagation(); setQuick(p); setQuickAdded(false); }}>Xem nhanh</button>
                      <button
                        className={`${s.wishBtn}${isWishlisted(p.id) ? ` ${s.wishBtnActive}` : ''}`}
                        onClick={e => { e.stopPropagation(); toggleWish({ id:p.id, name:p.name, unit:p.unit, price:p.price, image_url:p.image_url, category:p.category, source:'dung-cu' }); }}
                        aria-label={isWishlisted(p.id) ? 'Bỏ yêu thích' : 'Yêu thích'}
                      >
                        <i className={`ti ${isWishlisted(p.id) ? 'ti-hearts' : 'ti-heart'}`}></i>
                      </button>
                    </div>
                    <div className={s.productBody}>
                      <span className={s.cardCat}>{p.category}</span>
                      <h3>{p.name}</h3>
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
                  <button className={s.pageBtn} disabled={page===1} onClick={() => { setPage(p => p-1); window.scrollTo({ top:400, behavior:'smooth' }); }}>
                    <i className="ti ti-chevron-left"></i>
                  </button>
                  {Array.from({ length: totalPages }, (_,i) => i+1).map(n => (
                    <button key={n} className={`${s.pageBtn}${page===n ? ` ${s.pageBtnActive}` : ''}`} onClick={() => { setPage(n); window.scrollTo({ top:400, behavior:'smooth' }); }}>{n}</button>
                  ))}
                  <button className={s.pageBtn} disabled={page===totalPages} onClick={() => { setPage(p => p+1); window.scrollTo({ top:400, behavior:'smooth' }); }}>
                    <i className="ti ti-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}

          <div className={s.trust}>
            <div className={s.trustItem}><strong>Giá theo nguồn hiện hành</strong><span>Sản phẩm chưa có giá được ghi rõ "Liên hệ".</span></div>
            <div className={s.trustItem}><strong>Dùng chung một giỏ</strong><span>Nguyên liệu và dụng cụ được lưu chung, đặt cùng một lần.</span></div>
            <div className={s.trustItem}><strong>Đặt nhanh qua Zalo</strong><span>Liên hệ Kho NVL để xác nhận và ship toàn quốc.</span></div>
          </div>

          <div className={s.ctaContact}>
            <h3>Tư Vấn Và Đặt Dụng Cụ</h3>
            <p>Liên hệ trực tiếp với Kho NVL để được tư vấn và hỗ trợ đặt hàng — ship toàn quốc.</p>
            <div className={s.ctaActions}>
              <a href="https://zalo.me/0931433684" target="_blank" rel="noopener noreferrer" className={s.btnZalo}><i className="ti ti-brand-zalo"></i> Chat Zalo ngay</a>
              <a href="https://www.facebook.com/profile.php?id=61560410163133" target="_blank" rel="noopener noreferrer" className={s.btnFb}><i className="ti ti-brand-facebook"></i> Facebook Kho NVL</a>
              <a href="tel:0931433684" className={s.btnPhone}><i className="ti ti-phone"></i> Gọi 0931.433.684</a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK VIEW */}
      {quick && (
        <div className={s.modalBg} onClick={() => setQuick(null)}>
          <div className={s.modalCard} onClick={e => e.stopPropagation()}>
            <div className={s.modalHead}>
              <h3>Xem nhanh</h3>
              <button className={s.modalCloseBtn} onClick={() => setQuick(null)} aria-label="Đóng"><i className="ti ti-x"></i></button>
            </div>
            <div className={s.modalBody}>
              <div className={s.modalProduct}>
                {quick.image_url && <Image className={s.modalImg} src={quick.image_url} alt={quick.name} width={300} height={300} style={{ objectFit: 'contain' }} />}
                <div>
                  <h3 className={s.modalName}>{quick.name}</h3>
                  <p className={s.modalUnit}>{quick.unit} · {quick.category}</p>
                  <strong className={s.modalPrice}>{quick.price ? quick.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</strong>
                  <button className={s.modalAdd} onClick={() => { addItem({ id:quick.id, name:quick.name, price:quick.price, image_url:quick.image_url, unit:quick.unit }); setQuickAdded(true); }}>
                    {quickAdded ? <><i className="ti ti-check"></i> Đã thêm vào giỏ</> : <><i className="ti ti-shopping-cart-plus"></i> Thêm vào giỏ</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox && (
        <div className={s.lightbox} onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Phóng to" onClick={e => e.stopPropagation()} />
          <button className={s.lbClose} onClick={() => setLightbox(null)} aria-label="Đóng"><i className="ti ti-x"></i></button>
        </div>
      )}
    </main>
  );
}
