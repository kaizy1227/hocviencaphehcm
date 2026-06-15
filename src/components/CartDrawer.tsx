'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, totalItems, totalPrice, removeItem, updateQty, clearCart, isOpen, closeCart } = useCart();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const orderText = items.length > 0
    ? `Xin chào Học Viện Cà Phê!\nTôi muốn đặt nguyên liệu:\n${
        items.map(i => `- ${i.name} (${i.unit}) x${i.quantity}: ${(i.price * i.quantity).toLocaleString('vi-VN')}đ`).join('\n')
      }\nTổng cộng: ${totalPrice.toLocaleString('vi-VN')}đ`
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select textarea
      const ta = document.getElementById('order-text-ta') as HTMLTextAreaElement;
      if (ta) { ta.select(); document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    }
  };

  const handleOpenZalo = () => window.open('https://zalo.me/0834790555', '_blank');

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
              <button className="btn btn-primary cart-checkout" onClick={() => setShowOrderModal(true)}>
                <i className="ti ti-brand-zalo"></i> Đặt hàng qua Zalo
              </button>
              <button className="cart-clear" onClick={clearCart}>
                <i className="ti ti-trash"></i> Xóa giỏ hàng
              </button>
            </div>
          </>
        )}
      </div>

      {/* Order modal */}
      {showOrderModal && (
        <div className="order-modal-bg" onClick={() => setShowOrderModal(false)}>
          <div className="order-modal" onClick={e => e.stopPropagation()}>
            <button className="order-modal-close" onClick={() => setShowOrderModal(false)}><i className="ti ti-x"></i></button>
            <h3><i className="ti ti-clipboard-text"></i> Nội dung đơn hàng</h3>
            <p className="order-modal-hint">Sao chép nội dung bên dưới, rồi paste vào Zalo để hoàn tất đặt hàng.</p>
            <textarea id="order-text-ta" className="order-text-area" readOnly value={orderText} rows={8} />
            <div className="order-modal-btns">
              <button className="btn btn-outline order-copy-btn" onClick={handleCopy}>
                {copied ? <><i className="ti ti-check"></i> Đã sao chép!</> : <><i className="ti ti-copy"></i> Sao chép nội dung</>}
              </button>
              <button className="btn btn-primary order-zalo-btn" onClick={handleOpenZalo}>
                <i className="ti ti-brand-zalo"></i> Mở Zalo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
