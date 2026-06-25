import { NextResponse } from 'next/server';
import { createClient as sbClient } from '@supabase/supabase-js';
import { fetchLarkStudents } from '@/lib/lark';

export const dynamic = 'force-dynamic';

const getSb = () => sbClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function uploadToStorage(tmpUrl: string, larkId: string): Promise<string> {
  const sb = getSb();
  try {
    const res = await fetch(tmpUrl, { cache: 'no-store' });
    if (!res.ok) return '';
    const buf = await res.arrayBuffer();
    const ct = res.headers.get('content-type') || 'image/jpeg';
    const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
    const path = `${larkId}.${ext}`;
    const { data, error } = await sb.storage.from('trao-bang').upload(path, buf, { contentType: ct, upsert: true });
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
    const { error } = await sb.from('trao_bang').upsert(rows, { onConflict: 'lark_id' });
    if (error) throw error;
    return NextResponse.json({ success: true, count: rows.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
