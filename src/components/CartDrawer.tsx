'use client';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, totalItems, totalPrice, removeItem, updateQty, clearCart, isOpen, closeCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    const lines = items.map(i =>
      `- ${i.name} (${i.unit}) x${i.quantity}: ${(i.price * i.quantity).toLocaleString('vi-VN')}đ`
    ).join('\n');
    const msg = `Xin chào Học Viện Cà Phê! Tôi muốn đặt nguyên liệu:\n${lines}\nTổng cộng: ${totalPrice.toLocaleString('vi-VN')}đ`;
    try { navigator.clipboard.writeText(msg); } catch {}
    window.open('https://zalo.me/0834790555', '_blank');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="cart-overlay" onClick={closeCart} />}

      {/* Drawer */}
      <div className={`cart-drawer${isOpen ? ' open' : ''}`}>
        <div className="cart-header">
          <h3><i className="ti ti-shopping-cart"></i> Giỏ hàng {totalItems > 0 && <span className="cart-count-badge">{totalItems}</span>}</h3>
          <button className="cart-close" onClick={closeCart} aria-label="Đóng"><i className="ti ti-x"></i></button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <i className="ti ti-shopping-cart-off"></i>
            <p>Giỏ hàng trống</p>
            <Link href="/nguyen-lieu" className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={closeCart}>
              Xem nguyên liệu
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} />
                      : <div className="cart-item-img-ph"><i className="ti ti-package"></i></div>}
                  </div>
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-unit">{item.unit}</p>
                    <p className="cart-item-price">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-qty">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="cart-remove" onClick={() => removeItem(item.id)} aria-label="Xóa">
                      <i className="ti ti-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Tổng cộng</span>
                <strong>{totalPrice.toLocaleString('vi-VN')}đ</strong>
              </div>
              <button className="btn btn-primary cart-checkout" onClick={handleCheckout}>
                <i className="ti ti-brand-zalo"></i> Đặt hàng qua Zalo
              </button>
              <p className="cart-note">
                <i className="ti ti-info-circle"></i> Nội dung đơn hàng sẽ được sao chép tự động, paste vào Zalo để hoàn tất.
              </p>
              <button className="cart-clear" onClick={clearCart}>
                <i className="ti ti-trash"></i> Xóa giỏ hàng
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
