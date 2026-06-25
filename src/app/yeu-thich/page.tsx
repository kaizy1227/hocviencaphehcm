'use client';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function YeuThichPage() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  function handleAdd(item: (typeof items)[0]) {
    addItem({ id: item.id, name: item.name, price: item.price, image_url: item.image_url, unit: item.unit });
    setAddedIds(prev => new Set([...prev, item.id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(item.id); return n; }), 1500);
  }

  const nlItems = items.filter(i => i.source === 'nguyen-lieu');
  const dcItems = items.filter(i => i.source === 'dung-cu');

  return (
    <main className="yt-page">
      <div className="container">
        <div className="yt-header">
          <h1 className="yt-title"><i className="ti ti-hearts"></i> Sản phẩm yêu thích</h1>
          {items.length > 0 && (
            <span className="yt-count">{items.length} sản phẩm</span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="yt-empty">
            <div className="yt-empty-icon"><i className="ti ti-heart-off"></i></div>
            <p className="yt-empty-title">Chưa có sản phẩm yêu thích</p>
            <p className="yt-empty-sub">Nhấn vào icon <i className="ti ti-heart"></i> trên sản phẩm để lưu vào đây</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
              <Link href="/nguyen-lieu" className="btn btn-primary"><i className="ti ti-package"></i> Xem Nguyên Liệu</Link>
              <Link href="/dung-cu" className="btn btn-outline"><i className="ti ti-tool"></i> Xem Dụng Cụ</Link>
            </div>
          </div>
        ) : (
          <div className="yt-content">
            {nlItems.length > 0 && (
              <section className="yt-section">
                <h2 className="yt-section-title"><i className="ti ti-bottle"></i> Nguyên Liệu</h2>
                <div className="yt-grid">
                  {nlItems.map(item => (
                    <WishCard key={item.id} item={item} added={addedIds.has(item.id)} onAdd={handleAdd} onRemove={toggle} />
                  ))}
                </div>
              </section>
            )}
            {dcItems.length > 0 && (
              <section className="yt-section">
                <h2 className="yt-section-title"><i className="ti ti-coffee"></i> Dụng Cụ</h2>
                <div className="yt-grid">
                  {dcItems.map(item => (
                    <WishCard key={item.id} item={item} added={addedIds.has(item.id)} onAdd={handleAdd} onRemove={toggle} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

type WishCardProps = {
  item: { id: string; name: string; unit: string; price: number; image_url: string; category: string; source: 'nguyen-lieu' | 'dung-cu' };
  added: boolean;
  onAdd: (item: WishCardProps['item']) => void;
  onRemove: (item: WishCardProps['item']) => void;
};
function WishCard({ item, added, onAdd, onRemove }: WishCardProps) {
  return (
    <div className="yt-card">
      <div className="yt-card-img">
        {item.image_url
          ? <img src={item.image_url} alt={item.name} loading="lazy" />
          : <div className="yt-card-img-ph"><i className="ti ti-package"></i></div>}
        <button className="yt-remove-btn" onClick={() => onRemove(item)} aria-label="Xóa khỏi yêu thích" title="Bỏ yêu thích">
          <i className="ti ti-x"></i>
        </button>
      </div>
      <div className="yt-card-body">
        <span className="yt-card-cat">{item.category}</span>
        <h3 className="yt-card-name">{item.name}</h3>
        {item.unit && <p className="yt-card-unit"><i className="ti ti-ruler-2"></i> {item.unit}</p>}
        <div className="yt-card-foot">
          <span className="yt-card-price">{item.price ? item.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</span>
          <button className={`nl-add-btn${added ? ' added' : ''}`} onClick={() => onAdd(item)}>
            {added ? <><i className="ti ti-check"></i> Đã thêm</> : <><i className="ti ti-shopping-cart-plus"></i> Thêm</>}
          </button>
        </div>
      </div>
    </div>
  );
}
