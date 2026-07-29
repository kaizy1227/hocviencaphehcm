import { NextResponse } from 'next/server';
import { createClient as sbClient } from '@supabase/supabase-js';
import { fetchLarkKhachHangStats } from '@/lib/lark';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const getSb = () => sbClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Đồng bộ thủ công từ Dashboard admin (nút "Đồng bộ ngay").
// Mỗi lần bấm tốn ~20 lượt Lark — dùng vừa phải.
export async function POST() {
  try {
    const s = await fetchLarkKhachHangStats();
    const sb = getSb();
    const { error } = await sb.from('khach_hang_stats').upsert({
      id: 1,
      khoa_chot_total:    s.khoaChotTotal,
      khoa_chot_month:    s.khoaChotMonth,
      dich_vu_chot_total: s.dichVuChotTotal,
      dich_vu_chot_month: s.dichVuChotMonth,
      dich_vu_breakdown:  s.dichVuBreakdown,
      updated_at:         new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw error;

    return NextResponse.json({ success: true, ...s });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
