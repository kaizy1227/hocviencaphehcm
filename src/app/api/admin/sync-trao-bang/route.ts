import { NextResponse } from 'next/server';
import { createClient as sbClient } from '@supabase/supabase-js';
import { fetchLarkStudents } from '@/lib/lark';

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

    // HEIC/HEIF: convert sang JPEG vì trình duyệt không hiển thị được.
    // Nhận diện qua content-type HOẶC magic bytes (box 'ftyp' + brand heic/heif/mif1/heix).
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
    const { data, error } = await sb.storage.from('trao-bang').upload(path, body, { contentType: ct, upsert: true, cacheControl: '31536000' });
    if (error || !data) return '';
    return sb.storage.from('trao-bang').getPublicUrl(data.path).data.publicUrl;
  } catch {
    return '';
  }
}

export async function POST() {
  try {
    const sb = getSb();
    const students = await fetchLarkStudents();
    const rows = await Promise.all(
      students.map(async s => {
        const photo_url = s.photoUrl ? await uploadToStorage(s.photoUrl, s.id) : '';
        return { lark_id: s.id, name: s.name, date: s.date, course: s.course, photo_url };
      })
    );
    // Chỉ giữ record upload ảnh thành công
    const validRows = rows.filter(r => r.photo_url);

    const { error } = await sb.from('trao_bang').upsert(validRows, { onConflict: 'lark_id' });
    if (error) throw error;

    // Mirror chính xác Lark: xóa mọi record KHÔNG có trong danh sách vừa fetch
    // (record bảng cũ, học viên 'local_' từ SQL, ảnh trống...)
    let deleted = 0;
    if (validRows.length > 0) {
      const keepIds = validRows.map(r => `"${r.lark_id}"`).join(',');
      const { count } = await sb
        .from('trao_bang')
        .delete({ count: 'exact' })
        .not('lark_id', 'in', `(${keepIds})`);
      deleted = count ?? 0;
    }

    return NextResponse.json({ success: true, count: validRows.length, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
