import { NextResponse } from 'next/server';
import { createClient as sbClient } from '@supabase/supabase-js';
import { fetchLarkClassSessions } from '@/lib/lark';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const getSb = () => sbClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function uploadToStorage(sb: ReturnType<typeof getSb>, tmpUrl: string, filename: string): Promise<string> {
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
    const path = `${filename}.${ext}`;
    const { data, error } = await sb.storage.from('lop-hoc').upload(path, body, { contentType: ct, upsert: true, cacheControl: '31536000' });
    if (error || !data) return '';
    return sb.storage.from('lop-hoc').getPublicUrl(data.path).data.publicUrl;
  } catch {
    return '';
  }
}

export async function POST() {
  try {
    const sb = getSb();
    const sessions = await fetchLarkClassSessions();
    const rows = await Promise.all(
      sessions.map(async s => {
        const photos = (await Promise.all(
          s.photos.map((url, i) => uploadToStorage(sb, url, `${s.id}-${i}`))
        )).filter(Boolean);
        return {
          lark_id: s.id,
          date: s.date,
          course: s.course,
          si_so: s.siSo,
          student_names: s.studentNames,
          giang_vien: s.giangVien,
          photos,
        };
      })
    );

    // Chỉ giữ buổi học upload được ít nhất 1 ảnh
    const validRows = rows.filter(r => r.photos.length > 0);

    const { error } = await sb.from('lop_hoc').upsert(validRows, { onConflict: 'lark_id' });
    if (error) throw error;

    // Mirror chính xác Lark: xóa buổi học không còn ảnh đẹp / không có trong danh sách fetch
    let deleted = 0;
    if (validRows.length > 0) {
      const keepIds = validRows.map(r => `"${r.lark_id}"`).join(',');
      const { count } = await sb
        .from('lop_hoc')
        .delete({ count: 'exact' })
        .not('lark_id', 'in', `(${keepIds})`);
      deleted = count ?? 0;
    }

    return NextResponse.json({ success: true, count: validRows.length, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
