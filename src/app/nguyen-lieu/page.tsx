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

type Product = {
  id: string; stt: number; name: string; unit: string;
  price: number; image_url: string; category: string;
  phan_loai: 'thuong-mai' | 'thuong-hieu';
};
type SortBy = 'default' | 'price-asc' | 'price-desc' | 'name-asc';
const PER_PAGE = 24;

export default function NguyenLieuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [activePhanLoai, setActivePhanLoai] = useState('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('default');
  const [page, setPage] = useState(1);
  const { addItem } = useCart();
  const { toggle: toggleWish, has: isWishlisted } = useWishlist();
  const reviewStats = useReviewStats('products');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10000);
    createClient()
      .from('products')
      .select('*')
      .eq('active', true)
      .order('stt')
      .then(({ data }) => { clearTimeout(timer); setProducts(data ?? []); setLoading(false); }, () => { clearTimeout(timer); setLoading(false); });
    return () => clearTimeout(timer);
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category))).sort();
  const slugById = buildSlugIndex(products, p => p.name).byId;
  const q = search.trim().toLowerCase();

  useEffect(() => { setPage(1); }, [search, activeCategory, activePhanLoai, sortBy]);

  const filtered = products
    .filter(p => !activeCategory || p.category === activeCategory)
    .filter(p => !activePhanLoai || p.phan_loai === activePhanLoai)
    .filter(p => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));

  const sortedBase = sortBy === 'price-asc' ? [...filtered].sort((a, b) => a.price - b.price)
    : sortBy === 'price-desc' ? [...filtered].sort((a, b) => b.price - a.price)
    : sortBy === 'name-asc' ? [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    : filtered;

  // Sản phẩm Thương Hiệu (độc quyền) luôn ghim lên đầu
  const sorted = [...sortedBase].sort((a, b) =>
    (a.phan_loai === 'thuong-hieu' ? 0 : 1) - (b.phan_loai === 'thuong-hieu' ? 0 : 1)
  );

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAddToCart = useCallback((p: Product) => {
    addItem({ id: p.id, name: p.name, price: p.price, image_url: p.image_url, unit: p.unit });
    setAddedIds(prev => new Set([...prev, p.id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n; }), 1500);
  }, [addItem]);

  const hasFilter = !!(search || activeCategory || activePhanLoai || sortBy !== 'default');

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* HERO */}
      <section className="ct-hero">
        <div className="ct-hero-bg">
          <img src="/images/gallery/Concept-studio-with-products/33. Cà phê sữa bg.webp" alt="Nguyên Liệu Pha Chế" loading="eager" />
        </div>
        <div className="ct-hero-ov"></div>
        <div className="container">
          <div className="ct-hero-body">
            <div className="ct-hero-crumb">
              <Link href="/">Trang Chủ</Link>
              <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
              <span>Nguyên Liệu Pha Chế</span>
            </div>
            <h1>Nguyên Liệu <em>Pha Chế</em></h1>
            <p className="ct-hero-sub">Nguyên liệu chất lượng cao — cung cấp cho quán cà phê, trà sữa và học viên.</p>
            <div className="ct-hero-badges">
              <span className="ct-badge"><i className="ti ti-package"></i> {loading ? '...' : products.length} Sản Phẩm</span>
              <span className="ct-badge"><i className="ti ti-category"></i> {categories.length} Danh Mục</span>
              <span className="ct-badge"><i className="ti ti-truck-delivery"></i> Ship Toàn Quốc</span>
            </div>
          </div>
        </div>
      </section>

      {/* THƯƠNG HIỆU BANNER */}
      <div className="container" style={{ paddingTop: 28 }}>
        <button
          type="button"
          className="nl-th-banner-img"
          onClick={() => { setActivePhanLoai('thuong-hieu'); document.querySelector('.nl-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
        >
          <Image src="/images/banners/hang-thuong-hieu.png" alt="Hàng Thương Hiệu — sản phẩm độc quyền Học Viện Cà Phê HCM" width={2172} height={724} sizes="(max-width: 768px) 100vw, 900px" priority />
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="sp-toolbar">
        <div className="container">
          <div className="sp-toolbar-row">
            {/* Search */}
            <div className="sp-search-group">
              <i className="ti ti-search sp-search-icon"></i>
              <input
                type="search"
                className="sp-search-input"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="sp-search-clear" onClick={() => setSearch('')} aria-label="Xóa">
                  <i className="ti ti-x"></i>
                </button>
              )}
            </div>

            {/* Danh mục */}
            <select className="sp-select" value={activeCategory} onChange={e => setActiveCategory(e.target.value)}>
              <option value="">Tất cả danh mục</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Phân loại */}
            <select className="sp-select" value={activePhanLoai} onChange={e => setActivePhanLoai(e.target.value)}>
              <option value="">Tất cả loại</option>
              <option value="thuong-mai">Thương Mại</option>
              <option value="thuong-hieu">Thương Hiệu</option>
            </select>

            {/* Sắp xếp */}
            <select className="sp-select" value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)}>
              <option value="default">Mặc định</option>
              <option value="name-asc">Tên A → Z</option>
              <option value="price-asc">Giá thấp → cao</option>
              <option value="price-desc">Giá cao → thấp</option>
            </select>

            {hasFilter && (
              <button className="sp-reset-btn" onClick={() => { setSearch(''); setActiveCategory(''); setActivePhanLoai(''); setSortBy('default'); }}>
                <i className="ti ti-x"></i> Xóa lọc
              </button>
            )}
          </div>

          {/* Result count */}
          {!loading && (
            <p className="sp-result-info">
              {sorted.length === 0
                ? 'Không tìm thấy sản phẩm nào'
                : <><strong>{sorted.length}</strong> sản phẩm{totalPages > 1 && <> · Trang <strong>{page}/{totalPages}</strong></>}</>
              }
            </p>
          )}
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="section" style={{ background: 'var(--bg)', paddingTop: '32px' }}>
        <div className="container">
          {loading ? (
            <div className="sp-loading">
              <i className="ti ti-loader-2 spin"></i> Đang tải...
            </div>
          ) : sorted.length === 0 ? (
            <div className="sp-empty">
              <i className="ti ti-package-off"></i>
              <p>{q ? `Không tìm thấy kết quả cho "${search}"` : 'Chưa có sản phẩm nào.'}</p>
              {hasFilter && (
                <button className="btn btn-outline" style={{ marginTop: '12px' }}
                  onClick={() => { setSearch(''); setActiveCategory(''); setActivePhanLoai(''); setSortBy('default'); }}>
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="nl-grid">
                {paginated.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/nguyen-lieu/${slugById.get(p.id)}`}
                    className={`nl-card${p.phan_loai === 'thuong-hieu' ? ' nl-card-th' : ''}`}
                  >
                    <div className="nl-card-img" style={{ position: 'relative' }}>
                      {p.image_url
                        ? <Image src={p.image_url} alt={p.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px" style={{ objectFit: 'contain' }} loading="lazy" />
                        : <div className="nl-card-img-placeholder"><i className="ti ti-package"></i></div>
                      }
                      <span className="nl-card-num">#{p.stt || i + 1}</span>
                      {p.phan_loai === 'thuong-hieu' && (
                        <span className="nl-badge-th nl-badge-th-float"><i className="ti ti-shield-star"></i> Thương Hiệu</span>
                      )}
                      <button
                        type="button"
                        className={`nl-wish-btn nl-wish-btn-float${isWishlisted(p.id) ? ' wishlisted' : ''}`}
                        onClick={e => { e.preventDefault(); e.stopPropagation(); toggleWish({ id: p.id, name: p.name, unit: p.unit, price: p.price, image_url: p.image_url, category: p.category, source: 'nguyen-lieu' }); }}
                        aria-label={isWishlisted(p.id) ? 'Bỏ yêu thích' : 'Yêu thích'}
                      >
                        <i className={`ti ${isWishlisted(p.id) ? 'ti-hearts' : 'ti-heart'}`}></i>
                      </button>
                    </div>
                    <div className="nl-card-body">
                      <div className="nl-card-catrow">
                        <span className="nl-card-cat">{p.category}</span>
                        <CardRating stat={reviewStats.get(p.id)} />
                      </div>
                      <h3 className="nl-card-name">{p.name}</h3>
                      {p.unit && <p className="nl-card-unit"><i className="ti ti-ruler-2"></i> {p.unit}</p>}
                      <p className="nl-card-price">{p.price ? p.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</p>
                      <button
                        type="button"
                        className={`nl-add-btn${addedIds.has(p.id) ? ' added' : ''}`}
                        onClick={e => { e.preventDefault(); e.stopPropagation(); handleAddToCart(p); }}
                      >
                        {addedIds.has(p.id)
                          ? <><i className="ti ti-check"></i> Đã thêm vào giỏ</>
                          : <><i className="ti ti-shopping-cart-plus"></i> Thêm vào giỏ</>}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

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
    </main>
  );
}
