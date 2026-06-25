import { NextResponse } from 'next/server';
import { createClient as sbClient } from '@supabase/supabase-js';
import { fetchLarkClassSessions } from '@/lib/lark';

export const dynamic = 'force-dynamic';

const getSb = () => sbClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function uploadToStorage(sb: ReturnType<typeof getSb>, tmpUrl: string, filename: string): Promise<string> {
  try {
    const res = await fetch(tmpUrl, { cache: 'no-store' });
    if (!res.ok) return '';
    const buf = await res.arrayBuffer();
    const ct = res.headers.get('content-type') || 'image/jpeg';
    const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
    const path = `${filename}.${ext}`;
    const { data, error } = await sb.storage.from('lop-hoc').upload(path, buf, { contentType: ct, upsert: true });
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
          class_name: s.className,
          student_names: s.studentNames,
          photos,
        };
      })
    );
    const { error } = await sb.from('lop_hoc').upsert(rows, { onConflict: 'lark_id' });
    if (error) throw error;
    return NextResponse.json({ success: true, count: rows.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
