import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.LARK_LEAD_WEBHOOK_URL;
  if (!webhookUrl) return NextResponse.json({ skipped: true });

  const { name, phone, course, location, ghi_chu } = await req.json();

  const lines = [
    '📋 **Yêu cầu tư vấn mới**',
    `👤 Họ tên: ${name || '—'}`,
    `📞 SĐT: ${phone || '—'}`,
    `🎓 Khóa quan tâm: ${course || '—'}`,
    `📍 Khu vực: ${location || '—'}`,
  ];
  if (ghi_chu) lines.push(`📝 Ghi chú: ${ghi_chu}`);

  try {
    const larkRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msg_type: 'text',
        content: { text: lines.join('\n') },
      }),
    });
    const larkJson = await larkRes.json().catch(() => null);
    if (!larkRes.ok || larkJson?.code !== 0) {
      console.error('[notify-lark] Lark rejected the message', larkRes.status, larkJson);
      return NextResponse.json({ ok: false, larkStatus: larkRes.status, larkJson }, { status: 502 });
    }
  } catch (err) {
    console.error('[notify-lark] fetch to Lark failed', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
