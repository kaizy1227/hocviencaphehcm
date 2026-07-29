import { NextRequest, NextResponse } from 'next/server';
import { createClient as sbClient } from '@supabase/supabase-js';
import { fetchLarkStudentsNew } from '@/lib/lark';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const getSb = () => sbClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function uploadToStorage(tmpUrl: string, larkId: string): Promise<string> {
  const sb = getSb();
  try {
    const res = await fetch(tmpUrl, { cache: 'no-store' });
    if (!res.ok) return '';
    let body: ArrayBuffer | Buffer = await res.arrayBuffer();
    let ct = res.headers.get('content-type') || 'image/jpeg';

    // HEIC/HEIF → JPEG (trình duyệt không hiển thị HEIC)
    const head = Buffer.from(body.slice(0, 32));
    const brand = head.toString('ascii', 8, 12);
    const isHeic = /heic|heif/i.test(ct) ||
      (head.toString('ascii', 4, 8) === 'ftyp' && /heic|heif|mif1|heix|hevc/i.test(brand));
    if (isHeic) {
      const convert = (await import('heic-convert')).default;
      body = await convert({ buffer: Buffer.from(body as ArrayBuffer), format: 'JPEG', quality: 0.85 });
      ct = 'image/jpeg';
    }

    const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
    const path = `${larkId}.${ext}`;
    const { data, error } = await getSb().storage
      .from('trao-bang')
      .upload(path, body, { contentType: ct, upsert: true, cacheControl: '31536000' });
    if (error || !data) return '';
    return sb.storage.from('trao-bang').getPublicUrl(data.path).data.publicUrl;
  } catch {
    return '';
  }
}

export async function GET(req: NextRequest) {
  // Bảo vệ endpoint — Vercel gửi header này tự động khi cron chạy
  const secret = req.headers.get('authorization');
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sb = getSb();

    // Lấy danh sách lark_id đã có — 0 lượt Lark API
    const { data: existing, error: dbErr } = await sb
      .from('trao_bang')
      .select('lark_id');
    if (dbErr) throw dbErr;

    const existingIds = new Set((existing ?? []).map((r: { lark_id: string }) => r.lark_id));

    // Fetch chỉ record mới từ Lark — 1 lượt records + N lượt attachment
    const newStudents = await fetchLarkStudentsNew(existingIds);

    if (newStudents.length === 0) {
      return NextResponse.json({ success: true, added: 0, message: 'Không có record mới' });
    }

    // Upload ảnh và upsert vào DB
    const rows = await Promise.all(
      newStudents.map(async s => {
        const photo_url = s.photoUrl ? await uploadToStorage(s.photoUrl, s.id) : '';
        return { lark_id: s.id, name: s.name, date: s.date, course: s.course, photo_url };
      }),
    );

    const { error: upsertErr } = await sb
      .from('trao_bang')
      .upsert(rows, { onConflict: 'lark_id' });
    if (upsertErr) throw upsertErr;

    return NextResponse.json({ success: true, added: rows.length, records: rows.map(r => r.name) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
