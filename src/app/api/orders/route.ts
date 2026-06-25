import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const ADMIN_EMAIL = 'vuthanhhai126@gmail.com';
const FROM = 'Học Viện Cà Phê <onboarding@resend.dev>';

type Item = { name: string; unit: string; price: number; quantity: number; image_url: string };

function fmtMoney(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

function adminHtml(o: {
  orderId: string; customer_name: string; phone: string;
  address?: string; notes?: string; items: Item[]; total: number;
}) {
  const rows = o.items.map(i => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e8e0;">${i.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e8e0;color:#777;">${i.unit}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e8e0;text-align:center;">${i.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e8e0;text-align:right;font-weight:700;color:#B05A10;">${fmtMoney(i.price * i.quantity)}</td>
    </tr>`).join('');

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5ede1;font-family:sans-serif;">
<div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <div style="background:#1E0C04;padding:28px 32px;">
    <p style="margin:0;color:rgba(255,255,255,0.6);font-size:13px;letter-spacing:1px;text-transform:uppercase;">Học Viện Cà Phê HCM</p>
    <h1 style="margin:8px 0 0;color:#fff;font-size:22px;">🛒 Đơn hàng mới</h1>
  </div>

  <div style="padding:28px 32px;">
    <div style="background:#fff8f2;border-left:4px solid #B05A10;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:13px;color:#888;">Thông tin khách hàng</p>
      <p style="margin:0 0 4px;font-size:17px;font-weight:700;color:#1E0C04;">${o.customer_name}</p>
      <p style="margin:0;font-size:15px;color:#B05A10;font-weight:600;">📞 ${o.phone}</p>
      ${o.address ? `<p style="margin:6px 0 0;font-size:14px;color:#555;">📍 ${o.address}</p>` : ''}
      ${o.notes ? `<p style="margin:6px 0 0;font-size:14px;color:#555;">📝 ${o.notes}</p>` : ''}
    </div>

    <h3 style="margin:0 0 12px;font-size:15px;color:#1E0C04;">Sản phẩm đặt mua</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="background:#f5ede1;">
          <th style="padding:10px 12px;text-align:left;font-weight:600;color:#555;">Sản phẩm</th>
          <th style="padding:10px 12px;text-align:left;font-weight:600;color:#555;">Đơn vị</th>
          <th style="padding:10px 12px;text-align:center;font-weight:600;color:#555;">SL</th>
          <th style="padding:10px 12px;text-align:right;font-weight:600;color:#555;">Thành tiền</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div style="display:flex;justify-content:space-between;padding:16px 12px 0;border-top:2px solid #1E0C04;margin-top:4px;">
      <span style="font-size:16px;font-weight:700;color:#1E0C04;">Tổng cộng</span>
      <span style="font-size:20px;font-weight:800;color:#B05A10;">${fmtMoney(o.total)}</span>
    </div>
  </div>

  <div style="padding:20px 32px;background:#faf7f4;border-top:1px solid #f0e8e0;text-align:center;">
    <p style="margin:0;font-size:13px;color:#999;">Đơn #${o.orderId.slice(0, 8).toUpperCase()} · Học Viện Cà Phê HCM · 0834.790.555</p>
  </div>
</div></body></html>`;
}

function customerHtml(o: {
  orderId: string; customer_name: string; items: Item[]; total: number;
}) {
  const list = o.items.map(i =>
    `<li style="padding:8px 0;border-bottom:1px solid #f0e8e0;display:flex;justify-content:space-between;">
      <span>${i.name} × ${i.quantity} <span style="color:#aaa;font-size:13px;">(${i.unit})</span></span>
      <strong style="color:#B05A10;">${fmtMoney(i.price * i.quantity)}</strong>
    </li>`).join('');

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5ede1;font-family:sans-serif;">
<div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <div style="background:#1E0C04;padding:28px 32px;text-align:center;">
    <p style="margin:0 0 4px;color:rgba(255,255,255,0.5);font-size:13px;text-transform:uppercase;letter-spacing:1px;">Học Viện Cà Phê HCM</p>
    <h1 style="margin:0;color:#fff;font-size:22px;">✅ Đặt hàng thành công!</h1>
  </div>

  <div style="padding:28px 32px;">
    <p style="margin:0 0 20px;color:#444;line-height:1.6;">
      Xin chào <strong>${o.customer_name}</strong>,<br>
      Chúng tôi đã nhận được đơn hàng của bạn và sẽ liên hệ xác nhận trong thời gian sớm nhất.
    </p>

    <h3 style="margin:0 0 12px;font-size:15px;color:#1E0C04;">Đơn hàng của bạn</h3>
    <ul style="margin:0 0 16px;padding:0;list-style:none;">${list}</ul>

    <div style="display:flex;justify-content:space-between;padding:14px 0 0;border-top:2px solid #1E0C04;">
      <span style="font-size:15px;font-weight:700;color:#1E0C04;">Tổng cộng</span>
      <span style="font-size:18px;font-weight:800;color:#B05A10;">${fmtMoney(o.total)}</span>
    </div>
  </div>

  <div style="padding:20px 32px;background:#fff8f2;text-align:center;">
    <p style="margin:0 0 8px;color:#888;font-size:13px;">Thắc mắc? Liên hệ ngay:</p>
    <p style="margin:0;font-size:16px;font-weight:700;color:#B05A10;">📞 0834.790.555</p>
    <p style="margin:6px 0 0;font-size:13px;color:#aaa;">Đơn #${o.orderId.slice(0, 8).toUpperCase()}</p>
  </div>
</div></body></html>`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer_name, phone, address, notes, items, total, user_id, email } = body;

  if (!customer_name || !phone || !items?.length) {
    return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
  }

  // Dùng service role key để insert + select không bị chặn bởi RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: order, error } = await supabase
    .from('orders')
    .insert({ customer_name, phone, address: address || null, notes: notes || null, items, total, status: 'pending', user_id: user_id || null })
    .select('id')
    .single();

  if (error || !order) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: 'Không thể tạo đơn hàng' }, { status: 500 });
  }

  // Gửi email (không block nếu lỗi)
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  if (resend) try {
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `🛒 Đơn mới — ${customer_name} — ${fmtMoney(total)}`,
      html: adminHtml({ orderId: order.id, customer_name, phone, address, notes, items, total }),
    });
  } catch (e) {
    console.error('Admin email failed:', e);
  }

  if (resend && email) {
    try {
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: 'Học Viện Cà Phê — Xác nhận đơn hàng của bạn',
        html: customerHtml({ orderId: order.id, customer_name, items, total }),
      });
    } catch (e) {
      console.error('Customer email failed:', e);
    }
  }

  return NextResponse.json({ ok: true, orderId: order.id });
}
