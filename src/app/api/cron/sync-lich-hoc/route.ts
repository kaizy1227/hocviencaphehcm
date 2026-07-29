import { NextRequest, NextResponse } from 'next/server';
import { createClient as sbClient } from '@supabase/supabase-js';
import { fetchLarkClassSchedule } from '@/lib/lark';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const getSb = () => sbClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().slice(0, 10); // "yyyy-mm-dd"
    const entries = await fetchLarkClassSchedule();

    const rows = entries
      .filter(e => e.isoDate <= today)
      .map(e => ({
        id:         e.id,
        date:       e.isoDate,
        course:     e.course,
        si_so:      e.siSo,
        giang_vien: e.giangVien,
        synced_at:  new Date().toISOString(),
      }));

    if (rows.length === 0) {
      return NextResponse.json({ success: true, upserted: 0 });
    }

    const sb = getSb();
    const { error } = await sb
      .from('class_schedule')
      .upsert(rows, { onConflict: 'id' });

    if (error) throw error;

    return NextResponse.json({ success: true, upserted: rows.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
