import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const ADMIN_EMAIL = 'vuthanhhai126@gmail.com';
const FROM = 'Học Viện Cà Phê <onboarding@resend.dev>';

export async function POST(req: NextRequest) {
  const { name, phone, email, subject, message } = await req.json();

  if (!name?.trim() || !phone?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
  }

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5ede1;font-family:sans-serif;">
<div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <div style="background:#1E0C04;padding:24px 32px;">
    <p style="margin:0;color:rgba(255,255,255,0.6);font-size:13px;text-transform:uppercase;letter-spacing:1px;">Học Viện Cà Phê HCM</p>
    <h1 style="margin:8px 0 0;color:#fff;font-size:20px;">📩 Liên hệ mới</h1>
  </div>
  <div style="padding:28px 32px;">
    <div style="background:#fff8f2;border-left:4px solid #B05A10;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0 0 4px;font-size:17px;font-weight:700;color:#1E0C04;">${name}</p>
      <p style="margin:0 0 2px;color:#B05A10;font-weight:600;">📞 ${phone}</p>
      ${email ? `<p style="margin:0;color:#555;font-size:14px;">✉ ${email}</p>` : ''}
    </div>
    <p style="margin:0 0 8px;font-size:14px;color:#777;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Chủ đề</p>
    <p style="margin:0 0 20px;font-size:16px;font-weight:700;color:#1E0C04;">${subject}</p>
    <p style="margin:0 0 8px;font-size:14px;color:#777;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Nội dung</p>
    <p style="margin:0;font-size:15px;color:#333;line-height:1.7;white-space:pre-wrap;">${message}</p>
  </div>
  <div style="padding:16px 32px;background:#faf7f4;border-top:1px solid #f0e8e0;text-align:center;">
    <p style="margin:0;font-size:13px;color:#999;">Học Viện Cà Phê HCM · 0834.790.555</p>
  </div>
</div></body></html>`;

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  if (resend) {
    try {
      await resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `📩 Liên hệ — ${subject} — ${name} (${phone})`,
        html,
      });
    } catch (e) {
      console.error('Contact email error:', e);
    }
  }

  return NextResponse.json({ ok: true });
}
