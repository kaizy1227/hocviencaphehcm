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
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.getElementById('order-text-ta') as HTMLTextAreaElement;
      if (ta) { ta.select(); document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2500); }
    }
  };

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={closeCart} />}

      <div className={`cart-drawer${isOpen ? ' open' : ''}`}>

        {/* ── HEADER ── */}
        <div className="cart-header">
          <div className="cart-header-left">
            <div className="cart-header-icon"><i className="ti ti-shopping-bag"></i></div>
            <div>
              <p className="cart-header-title">Giỏ hàng</p>
              <p className="cart-header-sub">{totalItems > 0 ? `${totalItems} sản phẩm` : 'Chưa có sản phẩm'}</p>
            </div>
          </div>
          <button className="cart-close" onClick={closeCart} aria-label="Đóng"><i className="ti ti-x"></i></button>
        </div>

        {items.length === 0 ? (
          /* ── EMPTY ── */
          <div className="cart-empty">
            <div className="cart-empty-icon"><i className="ti ti-shopping-cart-off"></i></div>
            <p className="cart-empty-title">Giỏ hàng trống</p>
            <p className="cart-empty-sub">Thêm nguyên liệu từ công thức hoặc bảng giá</p>
            <Link href="/nguyen-lieu" className="cart-empty-cta" onClick={closeCart}>
              <i className="ti ti-package"></i> Xem bảng giá nguyên liệu
            </Link>
          </div>
        ) : (
          <>
            {/* ── ITEMS ── */}
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
                      <button className="cart-qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                      <span className="cart-qty-num">{item.quantity}</span>
                      <button className="cart-qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="cart-remove" onClick={() => removeItem(item.id)} aria-label="Xóa">
                      <i className="ti ti-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── FOOTER ── */}
            <div className="cart-footer">
              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>{totalItems} sản phẩm</span>
                  <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="cart-summary-divider" />
                <div className="cart-summary-total">
                  <span>Tổng cộng</span>
                  <strong>{totalPrice.toLocaleString('vi-VN')}đ</strong>
                </div>
              </div>

              <button className="cart-checkout-btn" onClick={() => setShowOrderModal(true)}>
                <i className="ti ti-brand-zalo"></i>
                <span>Đặt hàng qua Zalo</span>
                <i className="ti ti-arrow-right cart-checkout-arrow"></i>
              </button>

              <button className="cart-clear" onClick={clearCart}>
                <i className="ti ti-trash"></i> Xóa giỏ hàng
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── ORDER MODAL ── */}
      {showOrderModal && (
        <div className="order-modal-bg" onClick={() => setShowOrderModal(false)}>
          <div className="order-modal" onClick={e => e.stopPropagation()}>
            <button className="order-modal-close" onClick={() => setShowOrderModal(false)}><i className="ti ti-x"></i></button>

            <div className="order-modal-head">
              <div className="order-modal-ico"><i className="ti ti-clipboard-text"></i></div>
              <h3>Xác nhận đơn hàng</h3>
              <p>Sao chép nội dung bên dưới và paste vào Zalo để hoàn tất.</p>
            </div>

            <textarea id="order-text-ta" className="order-text-area" readOnly value={orderText} rows={7} onClick={e => (e.target as HTMLTextAreaElement).select()} />

            <div className="order-modal-btns">
              <button className={`order-copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
                {copied
                  ? <><i className="ti ti-circle-check"></i> Đã sao chép!</>
                  : <><i className="ti ti-copy"></i> Sao chép nội dung</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
