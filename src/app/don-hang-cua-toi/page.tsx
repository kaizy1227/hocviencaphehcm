'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type OrderItem = { id: string; name: string; unit: string; price: number; quantity: number; image_url: string; };
type Order = {
  id: string; customer_name: string; phone: string; address: string | null;
  notes: string | null; items: OrderItem[]; total: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'done' | 'cancelled';
  created_at: string;
};

const STATUS: Record<Order['status'], { label: string; cls: string; icon: string }> = {
  pending:   { label: 'Chờ xác nhận', cls: 'dh-badge-pending',   icon: 'ti-clock' },
  confirmed: { label: 'Đã xác nhận',  cls: 'dh-badge-confirmed', icon: 'ti-circle-check' },
  shipping:  { label: 'Đang giao',    cls: 'dh-badge-shipping',  icon: 'ti-truck' },
  done:      { label: 'Hoàn thành',   cls: 'dh-badge-done',      icon: 'ti-circle-check-filled' },
  cancelled: { label: 'Đã hủy',       cls: 'dh-badge-cancelled', icon: 'ti-circle-x' },
};

export default function DonHangCuaToiPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    Promise.race([
      supabase.auth.getSession(),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000)),
    ]).then(async ({ data: { session } }) => {
      if (!session) { router.replace('/login?redirect=/don-hang-cua-toi'); return; }
      const user = session.user;
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setOrders(data ?? []);
      setLoading(false);
    }).catch(() => { router.replace('/login?redirect=/don-hang-cua-toi'); });
  }, [router]);

  if (loading) {
    return (
      <main className="dh-page">
        <div className="dh-loading"><i className="ti ti-loader-2 spin"></i> Đang tải...</div>
      </main>
    );
  }

  return (
    <main className="dh-page">
      <div className="container">
        <div className="dh-header">
          <h1 className="dh-title"><i className="ti ti-clipboard-list"></i> Đơn hàng của tôi</h1>
          <Link href="/nguyen-lieu" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            <i className="ti ti-plus"></i> Đặt thêm
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="dh-empty">
            <div className="dh-empty-icon"><i className="ti ti-clipboard-off"></i></div>
            <p className="dh-empty-title">Chưa có đơn hàng nào</p>
            <Link href="/nguyen-lieu" className="btn btn-primary">
              <i className="ti ti-package"></i> Xem nguyên liệu
            </Link>
          </div>
        ) : (
          <div className="dh-list">
            {orders.map(order => {
              const st = STATUS[order.status];
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} className={`dh-card${isOpen ? ' open' : ''}`}>
                  <button className="dh-card-head" onClick={() => setExpanded(isOpen ? null : order.id)}>
                    <div className="dh-card-left">
                      <span className="dh-order-id">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className="dh-order-date">{new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    </div>
                    <div className="dh-card-right">
                      <span className={`dh-badge ${st.cls}`}><i className={`ti ${st.icon}`}></i> {st.label}</span>
                      <span className="dh-order-total">{order.total.toLocaleString('vi-VN')}đ</span>
                      <i className={`ti ti-chevron-${isOpen ? 'up' : 'down'} dh-chevron`}></i>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="dh-card-body">
                      <div className="dh-items">
                        {order.items.map((item, i) => (
                          <div key={i} className="dh-item">
                            <div className="dh-item-img">
                              {item.image_url
                                ? <img src={item.image_url} alt={item.name} />
                                : <div className="dh-item-img-ph"><i className="ti ti-package"></i></div>}
                            </div>
                            <div className="dh-item-info">
                              <span className="dh-item-name">{item.name}</span>
                              <span className="dh-item-unit">{item.unit}</span>
                            </div>
                            <span className="dh-item-qty">×{item.quantity}</span>
                            <span className="dh-item-price">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                          </div>
                        ))}
                      </div>

                      <div className="dh-card-footer">
                        {order.address && (
                          <p className="dh-card-meta"><i className="ti ti-map-pin"></i> {order.address}</p>
                        )}
                        {order.notes && (
                          <p className="dh-card-meta"><i className="ti ti-notes"></i> {order.notes}</p>
                        )}
                        <div className="dh-card-total">
                          <span>Tổng cộng</span>
                          <strong>{order.total.toLocaleString('vi-VN')}đ</strong>
                        </div>
                        {order.status === 'pending' && (
                          <p className="dh-card-hint"><i className="ti ti-info-circle"></i> Nhân viên sẽ liên hệ {order.phone} để xác nhận đơn.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
