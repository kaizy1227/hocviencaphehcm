import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const { user_id, title, body } = await req.json();
  if (!user_id || !title) return NextResponse.json({ error: 'missing params' }, { status: 400 });

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await sb.from('push_tokens').select('token').eq('user_id', user_id).single();
  if (!data?.token) return NextResponse.json({ ok: false, reason: 'no token' });

  const res = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: data.token, title, body, sound: 'default' }),
  });

  const json = await res.json();
  return NextResponse.json({ ok: true, expo: json });
}
