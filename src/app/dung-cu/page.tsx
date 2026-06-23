'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';

type Tool = {
  id: string; stt: number; name: string; unit: string;
  price: number; image_url: string; category: string;
};

export default function DungCuPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    createClient()
      .from('dung_cu')
      .select('*')
      .eq('active', true)
      .order('stt')
      .then(({ data }) => { setTools(data ?? []); setLoading(false); });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxImg(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const categories = ['Tất cả', ...Array.from(new Set(tools.map(p => p.category)))];
  const filtered = activeCategory === 'Tất cả' ? tools : tools.filter(p => p.category === activeCategory);

  const handleAddToCart = useCallback((p: Tool) => {
    addItem({ id: p.id, name: p.name, price: p.price, image_url: p.image_url, unit: p.unit });
    setAddedIds(prev => new Set([...prev, p.id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n; }), 1500);
  }, [addItem]);

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* HERO */}
      <section className="nl-hero">
        <div className="container">
          <div className="nl-hero-crumb">
            <Link href="/">Trang Chủ</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
            <span>Dụng Cụ</span>
          </div>
          <h1>Bảng Giá <em>Dụng Cụ</em></h1>
          <p>Dụng cụ pha chế chuyên nghiệp — cung cấp cho quán cà phê, trà sữa và học viên.</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
            <a href="https://zalo.me/0931433684" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <i className="ti ti-brand-zalo"></i> Đặt hàng qua Zalo
            </a>
            <a href="tel:0931433684" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
              <i className="ti ti-phone"></i> 0931.433.684
            </a>
          </div>
        </div>
      </section>

      {/* FILTER */}
      {categories.length > 2 && (
        <div className="nl-filter-wrap">
          <div className="container">
            <div className="nl-filter">
              {categories.map(c => (
                <button key={c} className={`ct-btn${activeCategory === c ? ' active' : ''}`} onClick={() => setActiveCategory(c)}>{c}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <section className="section" style={{ background: 'var(--bg)', paddingTop: '40px' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>
              <i className="ti ti-loader-2 spin" style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}></i>
              Đang tải danh sách...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>
              <i className="ti ti-package-off" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px', color: 'var(--muted)' }}></i>
              <p>Chưa có sản phẩm nào. Vui lòng liên hệ để được tư vấn.</p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', marginBottom: '24px' }}>
                Hiển thị <strong>{filtered.length}</strong> sản phẩm
                {activeCategory !== 'Tất cả' && <> · Danh mục: <strong>{activeCategory}</strong></>}
              </p>
              <div className="nl-grid">
                {filtered.map((p, i) => (
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
                ))}
              </div>
            </>
          )}

          {/* CTA */}
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
