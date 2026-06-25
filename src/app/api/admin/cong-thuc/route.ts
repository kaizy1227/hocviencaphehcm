import { NextRequest, NextResponse } from 'next/server';
import { createClient as sbClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const sb = sbClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const { data, error } = await sb.from('cong_thuc').select('*').order('sort_order').order('created_at');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ recipes: data ?? [] });
}

export async function POST(req: NextRequest) {
  try {
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
    };
    const { data, error } = await sb.from('cong_thuc').insert(payload).select().single();
    if (error) throw error;
    return NextResponse.json({ recipe: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
