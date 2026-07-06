'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { buildSlugIndex } from '@/lib/slug';
import ReviewsSection from '@/components/ReviewsSection';

type Product = {
  id: string; stt: number; name: string; unit: string;
  price: number; image_url: string; category: string;
  phan_loai: 'thuong-mai' | 'thuong-hieu'; description: string | null;
};

export default function NguyenLieuDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, openCart } = useCart();
  const { toggle: toggleWish, has: isWishlisted } = useWishlist();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [related, setRelated] = useState<{ slug: string; p: Product }[]>([]);
  const [added, setAdded] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!slug) return;
    createClient()
      .from('products')
      .select('*')
      .eq('active', true)
      .order('stt')
      .then(({ data }) => {
        const list: Product[] = data ?? [];
        const index = buildSlugIndex(list, p => p.name);
        const hit = index.bySlug.get(slug);
        if (hit) {
          setProduct(hit);
          setRelated(
            list.filter(p => p.id !== hit.id && p.category === hit.category)
              .slice(0, 4)
              .map(p => ({ slug: index.byId.get(p.id)!, p }))
          );
        } else {
          setProduct(null);
        }
        setLoading(false);
      }, () => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (product) document.title = `${product.name} | Học Viện Cà Phê HCM`;
  }, [product]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, unit: product.unit });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }, [addItem, product]);

  if (loading) {
    return (
      <main style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="container">
          <div className="sp-loading" style={{ padding: '80px 0' }}>
            <i className="ti ti-loader-2 spin"></i> Đang tải...
          </div>
        </div>
      </main>
    );
  }

  if (product === null) {
    return (
      <main style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="container">
          <div className="sp-empty" style={{ padding: '80px 0' }}>
            <i className="ti ti-package-off"></i>
            <p>Không tìm thấy sản phẩm này.</p>
            <Link href="/nguyen-lieu" className="btn btn-primary" style={{ marginTop: '16px' }}>
              <i className="ti ti-arrow-left"></i> Về trang Nguyên Liệu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const p = product!;

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
        {/* Breadcrumb */}
        <div className="ct-hero-crumb nld-crumb">
          <Link href="/">Trang Chủ</Link>
          <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
          <Link href="/nguyen-lieu">Nguyên Liệu</Link>
          <i className="ti ti-chevron-right" style={{ fontSize: '.75rem' }}></i>
          <span>{p.name}</span>
        </div>

        <div className="nld-layout">
          {/* Image */}
          <div
            className={`nld-img${p.image_url ? ' kct-lb-trigger' : ''}`}
            onClick={() => p.image_url && setLightbox(true)}
          >
            {p.image_url
              ? <Image src={p.image_url} alt={p.name} fill sizes="(max-width: 768px) 100vw, 420px" style={{ objectFit: 'contain' }} priority />
              : <div className="nl-card-img-placeholder"><i className="ti ti-package"></i></div>
            }
            {p.image_url && <span className="kct-lb-hint"><i className="ti ti-zoom-in"></i> Phóng to</span>}
          </div>

          {/* Info */}
          <div className="nld-info">
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <span className="nl-card-cat">{p.category}</span>
              {p.phan_loai === 'thuong-hieu' && (
                <span className="nl-badge-th"><i className="ti ti-shield-star"></i> Thương Hiệu</span>
              )}
            </div>
            <h1 className="nld-name">{p.name}</h1>
            {p.unit && <p className="nld-unit"><i className="ti ti-ruler-2"></i> Quy cách: {p.unit}</p>}
            <p className="nld-price">{p.price ? p.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</p>

            <div className="nld-actions">
              <button className={`btn btn-primary${added ? ' added' : ''}`} onClick={handleAddToCart}>
                {added
                  ? <><i className="ti ti-check"></i> Đã thêm vào giỏ</>
                  : <><i className="ti ti-shopping-cart-plus"></i> Thêm vào giỏ</>}
              </button>
              <button className="btn btn-outline" onClick={() => openCart()}>
                <i className="ti ti-shopping-cart"></i> Xem giỏ hàng
              </button>
              <button
                className={`nl-wish-btn nld-wish${isWishlisted(p.id) ? ' wishlisted' : ''}`}
                onClick={() => toggleWish({ id: p.id, name: p.name, unit: p.unit, price: p.price, image_url: p.image_url, category: p.category, source: 'nguyen-lieu' })}
                aria-label={isWishlisted(p.id) ? 'Bỏ yêu thích' : 'Yêu thích'}
              >
                <i className={`ti ${isWishlisted(p.id) ? 'ti-hearts' : 'ti-heart'}`}></i>
              </button>
            </div>

            {p.description && (
              <div className="nld-desc">
                <h2><i className="ti ti-notes"></i> Mô tả & Hướng dẫn sử dụng</h2>
                <p>{p.description}</p>
              </div>
            )}

            <div className="nld-contact">
              <p><i className="ti ti-truck-delivery"></i> <strong>Hỗ trợ tư vấn và đặt nguyên liệu</strong></p>
              <p>Liên hệ trực tiếp Kho NVL để đặt hàng — ship toàn quốc.</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                <a href="https://zalo.me/0931433684" target="_blank" rel="noopener noreferrer" className="btn nld-btn-zalo">
                  <i className="ti ti-brand-zalo"></i> Zalo Kho
                </a>
                <a href="tel:0931433684" className="btn nld-btn-phone">
                  <i className="ti ti-phone"></i> 0931.433.684
                </a>
                <a href="https://www.facebook.com/hocviencaphehcm/" target="_blank" rel="noopener noreferrer" className="btn nld-btn-fb">
                  <i className="ti ti-brand-facebook"></i> Facebook Kho
                </a>
              </div>
            </div>
          </div>
        </div>

        <ReviewsSection productId={p.id} productTable="products" />

        {/* Related */}
        {related.length > 0 && (
          <div className="nld-related">
            <h2><i className="ti ti-packages"></i> Sản phẩm cùng danh mục</h2>
            <div className="nl-grid">
              {related.map(({ slug: rSlug, p: rp }) => (
                <Link key={rp.id} href={`/nguyen-lieu/${rSlug}`} className={`nl-card nld-related-card${rp.phan_loai === 'thuong-hieu' ? ' nl-card-th' : ''}`}>
                  <div className="nl-card-img" style={{ position: 'relative' }}>
                    {rp.image_url
                      ? <Image src={rp.image_url} alt={rp.name} fill sizes="(max-width: 640px) 50vw, 200px" style={{ objectFit: 'contain' }} loading="lazy" />
                      : <div className="nl-card-img-placeholder"><i className="ti ti-package"></i></div>
                    }
                  </div>
                  <div className="nl-card-body">
                    <span className="nl-card-cat">{rp.category}</span>
                    <h3 className="nl-card-name">{rp.name}</h3>
                    {rp.unit && <p className="nl-card-unit"><i className="ti ti-ruler-2"></i> {rp.unit}</p>}
                    <div className="nl-card-foot">
                      <span className="nl-card-price">{rp.price ? rp.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {lightbox && p.image_url && (
        <div className="kct-lightbox" onClick={() => setLightbox(false)}>
          <img src={p.image_url} alt={p.name} onClick={e => e.stopPropagation()} />
          <button className="kct-lb-close" onClick={() => setLightbox(false)} aria-label="Đóng">
            <i className="ti ti-x"></i>
          </button>
        </div>
      )}
    </main>
  );
}
