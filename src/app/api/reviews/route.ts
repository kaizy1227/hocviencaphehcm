import { NextRequest, NextResponse } from 'next/server';
import { createClient as sbClient } from '@supabase/supabase-js';
import { createClient as createServerSbClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const getSbAdmin = () => sbClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
  const instructor = req.nextUrl.searchParams.get('instructor') ?? '';
  const sb = getSbAdmin();
  let query = sb
    .from('instructor_reviews')
    .select('id,instructor_name,rating,review_text,display_name,created_at')
    .order('created_at', { ascending: false });
  if (instructor) query = query.eq('instructor_name', instructor);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const sbUser = await createServerSbClient();
  const { data: { user } } = await sbUser.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { instructor_name, rating, review_text } = body;
  if (!instructor_name || !rating) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const sb = getSbAdmin();

  // Lookup by auth_user_id first, fallback to phone (extracted from email)
  let display_name = 'Học viên';
  const { data: student } = await sb
    .from('students')
    .select('name')
    .eq('auth_user_id', user.id)
    .maybeSingle();
  if (student?.name) {
    display_name = student.name;
  } else if (user.email?.endsWith('@hocviencaphehcm.vn')) {
    const phone = user.email.replace('@hocviencaphehcm.vn', '');
    const { data: byPhone } = await sb
      .from('students')
      .select('name')
      .eq('phone', phone)
      .maybeSingle();
    if (byPhone?.name) display_name = byPhone.name;
  }

  const { data, error } = await sb.from('instructor_reviews').upsert(
    { user_id: user.id, instructor_name, rating, review_text: review_text || null, display_name },
    { onConflict: 'user_id,instructor_name' }
  ).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
