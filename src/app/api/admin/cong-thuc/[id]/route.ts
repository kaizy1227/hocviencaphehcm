import { NextRequest, NextResponse } from 'next/server';
import { createClient as sbClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const sb = sbClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const payload = {
      name: body.name?.trim() ?? '',
      category: body.category?.trim() ?? '',
      photo_url: body.photo_url?.trim() ?? '',
      instructions: body.instructions?.trim() ?? '',
      total_cost: body.total_cost ? Number(body.total_cost) : null,
      recipe_text: body.recipe_text?.trim() ?? '',
      linked_product_ids: body.linked_product_ids ?? [],
      courses: body.courses ?? [],
      sort_order: body.sort_order ?? 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = await sb.from('cong_thuc').update(payload).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await sb.from('cong_thuc').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Upload recipe photo to Supabase Storage
export async function POST(req: NextRequest, { params: _params }: { params: Promise<{ id: string }> }) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    const buf = await file.arrayBuffer();
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${Date.now()}.${ext}`;
    const { data, error } = await sb.storage.from('cong-thuc').upload(path, buf, { contentType: file.type, upsert: true });
    if (error || !data) throw error ?? new Error('Upload failed');
    const publicUrl = sb.storage.from('cong-thuc').getPublicUrl(data.path).data.publicUrl;
    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
