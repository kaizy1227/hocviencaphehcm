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
import s from '../product.module.css';

type Product = {
  id: string; stt: number; name: string; unit: string;
  price: number; image_url: string; category: string;
  phan_loai: 'thuong-mai' | 'thuong-hieu'; description: string | null;
};

export default function NguyenLieuDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, openCart } = useCart();
  const { toggle: toggleWish, has: isWishlisted } = useWishlist();

  const [loading, setLoading]   = useState(true);
  const [product, setProduct]   = useState<Product | null | undefined>(undefined);
  const [related, setRelated]   = useState<{ slug: string; p: Product }[]>([]);
  const [qty, setQty]           = useState(1);
  const [added, setAdded]       = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!slug) return;
    createClient().from('products').select('*').eq('active', true).order('stt')
      .then(({ data }) => {
        const list: Product[] = data ?? [];
        const index = buildSlugIndex(list, p => p.name);
        const hit = index.bySlug.get(slug);
        if (hit) {
          setProduct(hit);
          setRelated(
            list.filter(p => p.id !== hit.id && p.category === hit.category)
              .slice(0, 4).map(p => ({ slug: index.byId.get(p.id)!, p }))
          );
        } else { setProduct(null); }
        setLoading(false);
      }, () => setLoading(false));
  }, [slug]);

  useEffect(() => { if (product) document.title = `${product.name} | Học Viện Cà Phê HCM`; }, [product]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(false); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, unit: product.unit });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }, [addItem, product, qty]);

  if (loading) return (
    <main className={s.page}><div className="container"><div className={s.loading} style={{ padding:'80px 0' }}><i className="ti ti-loader-2 spin"></i> Đang tải...</div></div></main>
  );
  if (product === null) return (
    <main className={s.page}><div className="container" style={{ paddingTop:'var(--nav-h)' }}>
      <div className={s.empty} style={{ padding:'80px 0' }}>
        <i className="ti ti-package-off"></i>
        <p>Không tìm thấy sản phẩm này.</p>
        <Link href="/nguyen-lieu" className="btn btn-primary" style={{ marginTop:16 }}><i className="ti ti-arrow-left"></i> Về trang Nguyên Liệu</Link>
      </div>
    </div></main>
  );

  const p = product!;

  return (
    <main className={s.page}>
      <div className={`container ${s.detail}`}>
        {/* BREADCRUMB */}
        <nav className={s.crumbs}>
          <Link href="/">Trang Chủ</Link>
          <i className="ti ti-chevron-right" style={{ fontSize:'.75rem' }}></i>
          <Link href="/nguyen-lieu">Nguyên Liệu</Link>
          <i className="ti ti-chevron-right" style={{ fontSize:'.75rem' }}></i>
          <span>{p.name}</span>
        </nav>

        {/* DETAIL GRID */}
        <div className={s.detailGrid}>
          {/* Gallery */}
          <figure className={s.gallery} onClick={() => p.image_url && setLightbox(true)}>
            {p.image_url
              ? <Image src={p.image_url} alt={p.name} fill sizes="(max-width:860px) 100vw,420px" style={{ objectFit:'contain', padding:'24px' }} priority />
              : <div style={{ width:'100%',aspectRatio:'1',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'4rem',color:'var(--muted,#667a8c)' }}><i className="ti ti-package"></i></div>}
          </figure>

          {/* Info */}
          <div className={s.detailCopy}>
            <p className={s.detailEyebrow}>{p.phan_loai === 'thuong-hieu' ? 'Hàng thương hiệu' : 'Thương mại'} · {p.category}</p>
            <h1 className={s.detailH1}>{p.name}</h1>
            <div className={s.detailBadgeRow}>
              <span className={`${s.detailBadge} ${s.detailBadgeCat}`}>{p.category}</span>
              {p.phan_loai === 'thuong-hieu' && (
                <span className={`${s.detailBadge} ${s.detailBadgeTH}`}><i className="ti ti-shield-star"></i> Thương Hiệu</span>
              )}
            </div>
            <strong className={s.detailPrice}>
              {p.price ? p.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}
            </strong>

            {p.price > 0 && (
              <div className={s.quantity}>
                <button className={s.qtyBtn} onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
                <input className={s.qtyInput} type="number" min={1} value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value)))} />
                <button className={s.qtyBtn} onClick={() => setQty(q => q+1)}>+</button>
              </div>
            )}

            <div className={s.detailActions}>
              <button className={`${s.addBtn}${added ? ` ${s.addBtnDone}` : ''}`} onClick={handleAddToCart}>
                {added ? <><i className="ti ti-check"></i> Đã thêm vào giỏ</> : <><i className="ti ti-shopping-cart-plus"></i> Thêm vào giỏ</>}
              </button>
              <button className={s.cartBtn} onClick={() => openCart()}>
                <i className="ti ti-shopping-cart"></i> Xem giỏ hàng
              </button>
              <button
                className={`${s.wishBtnDetail}${isWishlisted(p.id) ? ` ${s.wishBtnDetailActive}` : ''}`}
                onClick={() => toggleWish({ id:p.id, name:p.name, unit:p.unit, price:p.price, image_url:p.image_url, category:p.category, source:'nguyen-lieu' })}
                aria-label={isWishlisted(p.id) ? 'Bỏ yêu thích' : 'Yêu thích'}
              >
                <i className={`ti ${isWishlisted(p.id) ? 'ti-hearts' : 'ti-heart'}`}></i>
              </button>
            </div>

            {/* Specs */}
            <div className={s.specTable}>
              <div className={s.specRow}><span>Đơn vị</span><strong>{p.unit || '—'}</strong></div>
              <div className={s.specRow}><span>Danh mục</span><strong>{p.category}</strong></div>
              <div className={s.specRow}><span>Phân loại</span><strong>{p.phan_loai === 'thuong-hieu' ? 'Thương Hiệu' : 'Thương Mại'}</strong></div>
              <div className={s.specRow}><span>Mã sản phẩm</span><strong style={{ fontFamily:'monospace', fontSize:'.78rem' }}>{p.id.slice(0,8)}…</strong></div>
            </div>

            {/* Description */}
            {p.description && (
              <div className={s.detailDesc}>
                <h2><i className="ti ti-notes"></i> Mô tả &amp; Hướng dẫn sử dụng</h2>
                <p>{p.description}</p>
              </div>
            )}

            {/* Contact */}
            <div className={s.detailContact}>
              <p><i className="ti ti-truck-delivery"></i> Hỗ trợ tư vấn và đặt nguyên liệu</p>
              <p>Liên hệ trực tiếp Kho NVL để đặt hàng — ship toàn quốc.</p>
              <div className={s.contactBtns}>
                <a href="https://zalo.me/0931433684" target="_blank" rel="noopener noreferrer" className={s.btnZalo}><i className="ti ti-brand-zalo"></i> Zalo Kho</a>
                <a href="tel:0931433684" className={s.btnPhone}><i className="ti ti-phone"></i> 0931.433.684</a>
                <a href="https://www.facebook.com/hocviencaphehcm/" target="_blank" rel="noopener noreferrer" className={s.btnFb}><i className="ti ti-brand-facebook"></i> Facebook</a>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <ReviewsSection productId={p.id} productTable="products" />

        {/* RELATED */}
        {related.length > 0 && (
          <div className={s.relatedSection}>
            <h2><i className="ti ti-packages"></i> Sản phẩm cùng danh mục</h2>
            <div className={s.relatedGrid}>
              {related.map(({ slug: rSlug, p: rp }) => (
                <Link key={rp.id} href={`/nguyen-lieu/${rSlug}`} className={s.productCard} style={{ textDecoration:'none' }}>
                  <div className={s.productMedia}>
                    {rp.image_url
                      ? <Image src={rp.image_url} alt={rp.name} fill sizes="200px" style={{ objectFit:'contain', padding:'12px' }} loading="lazy" />
                      : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem',color:'var(--muted,#667a8c)' }}><i className="ti ti-package"></i></div>}
                    {rp.phan_loai === 'thuong-hieu' && <span className={`${s.productBadge} ${s.productBadgeTH}`}>Thương Hiệu</span>}
                  </div>
                  <div className={s.productBody}>
                    <span className={s.cardCat}>{rp.category}</span>
                    <h3>{rp.name}</h3>
                    <p className={s.productUnit}>{rp.unit}</p>
                    <div className={s.productFoot}>
                      <strong className={s.price}>{rp.price ? rp.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</strong>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightbox && p.image_url && (
        <div className={s.lightbox} onClick={() => setLightbox(false)}>
          <Image src={p.image_url} alt={p.name} width={600} height={600} style={{ objectFit: 'contain', maxWidth: 'min(94vw,600px)', height: 'auto' }} onClick={e => e.stopPropagation()} />
          <button className={s.lbClose} onClick={() => setLightbox(false)} aria-label="Đóng"><i className="ti ti-x"></i></button>
        </div>
      )}
    </main>
  );
}
