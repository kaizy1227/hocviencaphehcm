'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

type Tool = {
  id: string; stt: number; name: string; unit: string;
  price: number; image_url: string; category: string;
};
type SortBy = 'default' | 'price-asc' | 'price-desc' | 'name-asc';
const PER_PAGE = 24;

export default function DungCuPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('default');
  const [page, setPage] = useState(1);
  const { addItem } = useCart();
  const { toggle: toggleWish, has: isWishlisted } = useWishlist();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10000);
    createClient()
      .from('dung_cu')
      .select('*')
      .eq('active', true)
      .order('stt')
      .then(({ data }) => { clearTimeout(timer); setTools(data ?? []); setLoading(false); }, () => { clearTimeout(timer); setLoading(false); });
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxImg(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const categories = Array.from(new Set(tools.map(p => p.category))).sort();
  const q = search.trim().toLowerCase();

  useEffect(() => { setPage(1); }, [search, activeCategory, sortBy]);

  const filtered = tools
    .filter(p => !activeCategory || p.category === activeCategory)
    .filter(p => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));

  const sorted = sortBy === 'price-asc' ? [...filtered].sort((a, b) => a.price - b.price)
    : sortBy === 'price-desc' ? [...filtered].sort((a, b) => b.price - a.price)
    : sortBy === 'name-asc' ? [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    : filtered;

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAddToCart = useCallback((p: Tool) => {
    addItem({ id: p.id, name: p.name, price: p.price, image_url: p.image_url, unit: p.unit });
    setAddedIds(prev => new Set([...prev, p.id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n; }), 1500);
  }, [addItem]);

  const hasFilter = !!(search || activeCategory || sortBy !== 'default');

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* PAGE HEADER */}
      <div className="sp-header">
        <div className="container">
          <div className="nl-hero-crumb">
            <Link href="/">Trang Chủ</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
            <span>Dụng Cụ Pha Chế</span>
          </div>
          <h1 className="sp-title">Dụng Cụ <em>Pha Chế</em></h1>
          <p className="sp-desc">Dụng cụ pha chế chuyên nghiệp — cung cấp cho quán cà phê, trà sữa và học viên.</p>
        </div>
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

            {/* Sắp xếp */}
            <select className="sp-select" value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)}>
              <option value="default">Mặc định</option>
              <option value="name-asc">Tên A → Z</option>
              <option value="price-asc">Giá thấp → cao</option>
              <option value="price-desc">Giá cao → thấp</option>
            </select>

            {hasFilter && (
              <button className="sp-reset-btn" onClick={() => { setSearch(''); setActiveCategory(''); setSortBy('default'); }}>
                <i className="ti ti-x"></i> Xóa lọc
              </button>
            )}
          </div>

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
                  onClick={() => { setSearch(''); setActiveCategory(''); setSortBy('default'); }}>
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="nl-grid">
                {paginated.map((p, i) => (
                  <div key={p.id} className="nl-card">
                    <div
                      className={`nl-card-img${p.image_url ? ' kct-lb-trigger' : ''}`}
                      onClick={() => p.image_url && setLightboxImg(p.image_url)}
                    >
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} loading="lazy" />
                        : <div className="nl-card-img-placeholder"><i className="ti ti-tool"></i></div>
                      }
                      <span className="nl-card-num">#{p.stt || i + 1}</span>
                      {p.image_url && <span className="kct-lb-hint"><i className="ti ti-zoom-in"></i> Phóng to</span>}
                    </div>
                    <div className="nl-card-body">
                      <span className="nl-card-cat">{p.category}</span>
                      <h3 className="nl-card-name">{p.name}</h3>
                      {p.unit && <p className="nl-card-unit"><i className="ti ti-ruler-2"></i> {p.unit}</p>}
                      <div className="nl-card-foot">
                        <span className="nl-card-price">{p.price ? p.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</span>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            className={`nl-wish-btn${isWishlisted(p.id) ? ' wishlisted' : ''}`}
                            onClick={() => toggleWish({ id: p.id, name: p.name, unit: p.unit, price: p.price, image_url: p.image_url, category: p.category, source: 'dung-cu' })}
                            aria-label={isWishlisted(p.id) ? 'Bỏ yêu thích' : 'Yêu thích'}
                          >
                            <i className={`ti ${isWishlisted(p.id) ? 'ti-hearts' : 'ti-heart'}`}></i>
                          </button>
                          <button
                            className={`nl-add-btn${addedIds.has(p.id) ? ' added' : ''}`}
                            onClick={() => handleAddToCart(p)}
                          >
                            {addedIds.has(p.id)
                              ? <><i className="ti ti-check"></i> Đã thêm</>
                              : <><i className="ti ti-shopping-cart-plus"></i> Thêm</>}
                          </button>
                        </div>
                      </div>
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

          <div className="nl-cta">
            <i className="ti ti-truck-delivery" style={{ fontSize: '2rem', color: 'var(--accent)', display: 'block', marginBottom: '12px' }}></i>
            <h3>Cần đặt số lượng lớn?</h3>
            <p>Liên hệ trực tiếp để được báo giá sỉ và hỗ trợ giao hàng tận nơi.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
              <a href="https://zalo.me/0931433684" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <i className="ti ti-brand-zalo"></i> Chat Zalo ngay
              </a>
              <a href="tel:0931433684" className="btn btn-outline">
                <i className="ti ti-phone"></i> Gọi 0931.433.684
              </a>
            </div>
          </div>
        </div>
      </section>

      {lightboxImg && (
        <div className="kct-lightbox" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Phóng to" onClick={e => e.stopPropagation()} />
          <button className="kct-lb-close" onClick={() => setLightboxImg(null)} aria-label="Đóng">
            <i className="ti ti-x"></i>
          </button>
        </div>
      )}
    </main>
  );
}
