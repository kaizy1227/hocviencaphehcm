import { NextRequest, NextResponse } from 'next/server';
import { createClient as sbClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

const getSb = () => sbClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const sb = getSb();
  const { data, error } = await sb.from('course_doc_links').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ links: data ?? [] });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const course = body.course?.trim();
    if (!course) return NextResponse.json({ error: 'Thiếu khóa học' }, { status: 400 });

    const token = randomBytes(12).toString('base64url'); // ~16 ký tự, khó đoán
    const sb = getSb();
    const { data, error } = await sb
      .from('course_doc_links')
      .insert({ token, course, title: body.title?.trim() ?? '', active: true })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ link: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.token) return NextResponse.json({ error: 'Thiếu token' }, { status: 400 });
    const patch: Record<string, any> = {};
    if (typeof body.active === 'boolean') patch.active = body.active;
    if (typeof body.title === 'string') patch.title = body.title.trim();
    const sb = getSb();
    const { data, error } = await sb.from('course_doc_links').update(patch).eq('token', body.token).select().single();
    if (error) throw error;
    return NextResponse.json({ link: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    if (!token) return NextResponse.json({ error: 'Thiếu token' }, { status: 400 });
    const sb = getSb();
    const { error } = await sb.from('course_doc_links').delete().eq('token', token);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
