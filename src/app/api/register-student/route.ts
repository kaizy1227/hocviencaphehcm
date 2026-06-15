import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const { name, phone, authUserId } = await req.json();
  if (!name || !phone || !authUserId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: existing } = await supabase
    .from('students')
    .select('id, auth_user_id')
    .eq('phone', phone)
    .maybeSingle();

  if (existing) {
    if (!existing.auth_user_id) {
      await supabase.from('students').update({ auth_user_id: authUserId }).eq('id', existing.id);
    }
  } else {
    await supabase.from('students').insert({
      name,
      phone,
      auth_user_id: authUserId,
      course: 'Tự đăng ký',
      enrolled_at: new Date().toISOString().slice(0, 10),
      course_access: [],
    });
  }

  return NextResponse.json({ ok: true });
}
